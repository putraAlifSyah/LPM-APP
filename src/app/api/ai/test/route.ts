import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/api";
import { chat, type ProviderId } from "@/lib/ai";
import { getAiConfig } from "@/lib/ai-config";

// POST: admin menguji koneksi ke provider.
// Jika body berisi apiKey baru, pakai itu; jika tidak, pakai config tersimpan.
export async function POST(req: Request) {
  const auth = await requirePermission("kelolaAI");
  if ("error" in auth) return auth.error;

  const b = await req.json().catch(() => ({}));
  const saved = await getAiConfig();

  const provider = (b.provider || saved?.provider) as ProviderId;
  const model = b.model || saved?.model;
  const baseUrl = b.baseUrl ?? saved?.baseUrl;
  const apiKey =
    typeof b.apiKey === "string" && b.apiKey.length > 0
      ? b.apiKey.trim()
      : saved?.apiKey || "";

  if (!provider || !model) {
    return NextResponse.json(
      { ok: false, error: "Provider dan model belum lengkap" },
      { status: 400 }
    );
  }
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "API key belum diisi" },
      { status: 400 }
    );
  }

  const result = await chat({
    provider,
    model,
    apiKey,
    baseUrl,
    system: "Anda asisten uji koneksi. Jawab singkat.",
    messages: [{ role: "user", content: "Balas dengan satu kata: OK" }],
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 });
  }
  return NextResponse.json({ ok: true, sample: result.text.slice(0, 200) });
}
