import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";
import { decryptSecret, encryptSecret, maskSecret } from "@/lib/crypto";
import { getProvider } from "@/lib/ai";

// GET: semua user login dapat tahu apakah AI aktif.
// Admin mendapat detail config (tanpa API key mentah, hanya masked).
export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const cfg = await prisma.aiConfig.findUnique({ where: { id: "default" } });

  if (auth.user.role !== "ADMIN") {
    return NextResponse.json({ enabled: !!cfg?.enabled });
  }

  return NextResponse.json({
    enabled: cfg?.enabled ?? false,
    provider: cfg?.provider ?? "openai",
    model: cfg?.model ?? "gpt-4o-mini",
    baseUrl: cfg?.baseUrl ?? "",
    systemPromptExtra: cfg?.systemPromptExtra ?? "",
    apiKeyMasked: cfg?.apiKey ? maskSecret(decryptSecret(cfg.apiKey)) : "",
    hasApiKey: !!cfg?.apiKey,
  });
}

// PUT: admin menyimpan konfigurasi.
export async function PUT(req: Request) {
  const auth = await requirePermission("kelolaAI");
  if ("error" in auth) return auth.error;

  const b = await req.json();
  const provider = b.provider as string;
  if (!getProvider(provider)) {
    return NextResponse.json({ error: "Provider tidak valid" }, { status: 400 });
  }
  if (!b.model?.trim()) {
    return NextResponse.json({ error: "Model wajib diisi" }, { status: 400 });
  }
  if (provider === "custom" && !b.baseUrl?.trim()) {
    return NextResponse.json(
      { error: "Base URL wajib untuk provider custom" },
      { status: 400 }
    );
  }

  const existing = await prisma.aiConfig.findUnique({ where: { id: "default" } });

  // API key hanya ditimpa jika dikirim (kosong = pertahankan yang lama)
  const apiKeyEnc =
    typeof b.apiKey === "string" && b.apiKey.length > 0
      ? encryptSecret(b.apiKey.trim())
      : (existing?.apiKey ?? "");

  const data = {
    provider,
    model: b.model.trim(),
    baseUrl: b.baseUrl?.trim() || null,
    enabled: !!b.enabled,
    systemPromptExtra: b.systemPromptExtra?.trim() || null,
    apiKey: apiKeyEnc,
  };

  await prisma.aiConfig.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });

  return NextResponse.json({ ok: true });
}
