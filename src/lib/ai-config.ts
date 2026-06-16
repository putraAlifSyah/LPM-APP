import { prisma } from "./db";
import { decryptSecret } from "./crypto";
import type { ProviderId } from "./ai";

export type ResolvedAiConfig = {
  provider: ProviderId;
  model: string;
  apiKey: string; // sudah didekripsi
  baseUrl: string | null;
  enabled: boolean;
  systemPromptExtra: string | null;
};

/** Ambil konfigurasi AI (singleton id="default"), API key sudah didekripsi. */
export async function getAiConfig(): Promise<ResolvedAiConfig | null> {
  const cfg = await prisma.aiConfig.findUnique({ where: { id: "default" } });
  if (!cfg) return null;
  return {
    provider: cfg.provider as ProviderId,
    model: cfg.model,
    apiKey: decryptSecret(cfg.apiKey),
    baseUrl: cfg.baseUrl,
    enabled: cfg.enabled,
    systemPromptExtra: cfg.systemPromptExtra,
  };
}
