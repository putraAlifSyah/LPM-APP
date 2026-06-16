import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api";
import { chat, type ChatMessage } from "@/lib/ai";
import { getAiConfig } from "@/lib/ai-config";
import { buildSystemPrompt } from "@/lib/ai-context";

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const cfg = await getAiConfig();
  if (!cfg || !cfg.enabled) {
    return NextResponse.json(
      { error: "Asisten AI belum diaktifkan oleh Administrator." },
      { status: 503 }
    );
  }
  if (!cfg.apiKey) {
    return NextResponse.json(
      { error: "Konfigurasi AI belum lengkap (API key kosong)." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const incoming = Array.isArray(body.messages) ? body.messages : [];

  // Sanitasi & batasi riwayat (ambil 12 pesan terakhir)
  const messages: ChatMessage[] = incoming
    .filter(
      (m: unknown): m is ChatMessage =>
        !!m &&
        typeof (m as ChatMessage).content === "string" &&
        ((m as ChatMessage).role === "user" ||
          (m as ChatMessage).role === "assistant")
    )
    .slice(-12)
    .map((m: ChatMessage) => ({
      role: m.role,
      content: m.content.slice(0, 4000),
    }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
  }

  const system = await buildSystemPrompt(auth.user, cfg.systemPromptExtra);

  const result = await chat({
    provider: cfg.provider,
    model: cfg.model,
    apiKey: cfg.apiKey,
    baseUrl: cfg.baseUrl,
    system,
    messages,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: `Gagal menghubungi AI: ${result.error}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ reply: result.text });
}
