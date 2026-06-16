// Katalog provider + model dan fungsi chat terpadu untuk 4 provider.
// Tanpa dependency eksternal — pakai fetch langsung.

export type ProviderId = "openai" | "anthropic" | "gemini" | "custom";

export type ProviderInfo = {
  id: ProviderId;
  label: string;
  models: string[];
  needsBaseUrl?: boolean;
  keyHint: string;
};

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "openai",
    label: "OpenAI",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1", "o4-mini"],
    keyHint: "sk-...",
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    models: [
      "claude-3-5-haiku-20241022",
      "claude-3-5-sonnet-20241022",
      "claude-3-7-sonnet-20250219",
      "claude-sonnet-4-20250514",
    ],
    keyHint: "sk-ant-...",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    models: [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
    ],
    keyHint: "AIza...",
  },
  {
    id: "custom",
    label: "OpenAI-compatible (Custom)",
    models: [], // bebas diisi manual (OpenRouter, Groq, LM Studio, dll.)
    needsBaseUrl: true,
    keyHint: "API key endpoint Anda",
  },
];

export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatParams = {
  provider: ProviderId;
  model: string;
  apiKey: string;
  baseUrl?: string | null;
  system: string;
  messages: ChatMessage[];
};

export type ChatResult = { ok: true; text: string } | { ok: false; error: string };

const TIMEOUT_MS = 60_000;

async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

/** Panggil provider AI dan kembalikan teks balasan. */
export async function chat(params: ChatParams): Promise<ChatResult> {
  const { provider, model, apiKey, baseUrl, system, messages } = params;
  if (!apiKey) return { ok: false, error: "API key belum dikonfigurasi" };

  try {
    if (provider === "anthropic") {
      const res = await postJson(
        "https://api.anthropic.com/v1/messages",
        {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        {
          model,
          max_tokens: 1024,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error?.message || `HTTP ${res.status}` };
      }
      const text = data?.content?.[0]?.text ?? "";
      return { ok: true, text };
    }

    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const res = await postJson(
        url,
        {},
        {
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 1024 },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error?.message || `HTTP ${res.status}` };
      }
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text || "")
          .join("") ?? "";
      return { ok: true, text };
    }

    // openai & custom (OpenAI-compatible chat completions)
    const base =
      provider === "custom"
        ? (baseUrl || "").replace(/\/$/, "")
        : "https://api.openai.com/v1";
    if (provider === "custom" && !base) {
      return { ok: false, error: "Base URL wajib diisi untuk provider custom" };
    }
    const res = await postJson(
      `${base}/chat/completions`,
      { Authorization: `Bearer ${apiKey}` },
      {
        model,
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: 1024,
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data?.error?.message || `HTTP ${res.status}` };
    }
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { ok: true, text };
  } catch (e) {
    const msg =
      e instanceof Error && e.name === "AbortError"
        ? "Permintaan timeout"
        : e instanceof Error
          ? e.message
          : "Kesalahan tak terduga";
    return { ok: false, error: msg };
  }
}
