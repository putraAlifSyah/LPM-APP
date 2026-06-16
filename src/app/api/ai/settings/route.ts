import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

// GET /api/ai/settings — ambil konfigurasi AI (admin only)
export async function GET() {
  const auth = await requirePermission("kelolaAi");
  if ("error" in auth) return auth.error;

  let config = await prisma.aiConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.aiConfig.create({ data: { id: "default" } });
  }

  return NextResponse.json({
    data: {
      provider: config.provider,
      model: config.model,
      hasKey: config.apiKey.length > 0,
    },
  });
}

// PUT /api/ai/settings — update konfigurasi AI (admin only)
export async function PUT(req: Request) {
  const auth = await requirePermission("kelolaAi");
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const { provider, model, apiKey } = body;

    if (!provider || !model) {
      return NextResponse.json(
        { error: "Provider dan model wajib diisi" },
        { status: 400 }
      );
    }

    const data: Record<string, string> = { provider, model };
    // Hanya update apiKey jika dikirim (tidak kosong)
    if (typeof apiKey === "string" && apiKey.length > 0) {
      data.apiKey = apiKey;
    }

    const config = await prisma.aiConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...data },
      update: data,
    });

    return NextResponse.json({
      data: {
        provider: config.provider,
        model: config.model,
        hasKey: config.apiKey.length > 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}
