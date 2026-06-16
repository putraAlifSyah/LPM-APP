"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2, CheckCircle2, XCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PROVIDERS, getProvider } from "@/lib/ai";

type ConfigState = {
  enabled: boolean;
  provider: string;
  model: string;
  baseUrl: string;
  systemPromptExtra: string;
  apiKeyMasked: string;
  hasApiKey: boolean;
};

export function PengaturanAiForm() {
  const [cfg, setCfg] = useState<ConfigState | null>(null);
  const [apiKey, setApiKey] = useState(""); // input baru; kosong = pertahankan lama
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/ai/config")
      .then((r) => r.json())
      .then((d) =>
        setCfg({
          enabled: d.enabled ?? false,
          provider: d.provider ?? "openai",
          model: d.model ?? "gpt-4o-mini",
          baseUrl: d.baseUrl ?? "",
          systemPromptExtra: d.systemPromptExtra ?? "",
          apiKeyMasked: d.apiKeyMasked ?? "",
          hasApiKey: d.hasApiKey ?? false,
        })
      );
  }, []);

  if (!cfg) {
    return (
      <div className="flex justify-center py-12 text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const providerInfo = getProvider(cfg.provider);
  const isCustom = cfg.provider === "custom";

  function update(patch: Partial<ConfigState>) {
    setCfg((c) => (c ? { ...c, ...patch } : c));
    setMsg(null);
  }

  function gantiProvider(pid: string) {
    const info = getProvider(pid);
    update({
      provider: pid,
      model: info?.models[0] ?? "",
    });
  }

  function payload() {
    return {
      enabled: cfg!.enabled,
      provider: cfg!.provider,
      model: cfg!.model,
      baseUrl: cfg!.baseUrl,
      systemPromptExtra: cfg!.systemPromptExtra,
      ...(apiKey ? { apiKey } : {}),
    };
  }

  async function simpan() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ai/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const d = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: d.error || "Gagal menyimpan" });
      } else {
        setMsg({ type: "ok", text: "Konfigurasi tersimpan." });
        setApiKey("");
        // refresh status masked
        const r = await fetch("/api/ai/config").then((x) => x.json());
        update({ apiKeyMasked: r.apiKeyMasked ?? "", hasApiKey: r.hasApiKey });
      }
    } catch {
      setMsg({ type: "err", text: "Kesalahan jaringan" });
    } finally {
      setSaving(false);
    }
  }

  async function tesKoneksi() {
    setTesting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: cfg!.provider,
          model: cfg!.model,
          baseUrl: cfg!.baseUrl,
          ...(apiKey ? { apiKey } : {}),
        }),
      });
      const d = await res.json();
      if (d.ok) {
        setMsg({ type: "ok", text: `Koneksi berhasil! Respons: "${d.sample}"` });
      } else {
        setMsg({ type: "err", text: d.error || "Koneksi gagal" });
      }
    } catch {
      setMsg({ type: "err", text: "Kesalahan jaringan" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-5">
      {msg && (
        <p
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
            msg.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {msg.type === "ok" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {msg.text}
        </p>
      )}

      {/* Status & toggle */}
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Bot size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Status Asisten AI</p>
              <p className="text-sm text-slate-500">
                {cfg.enabled
                  ? "Aktif — chatbot tampil untuk semua pengguna."
                  : "Nonaktif — chatbot tersembunyi."}
              </p>
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={cfg.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
            />
            <div className="relative h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-5" />
          </label>
        </CardContent>
      </Card>

      {/* Konfigurasi provider */}
      <Card>
        <CardHeader>
          <CardTitle>Penyedia & Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select
                value={cfg.provider}
                onChange={(e) => gantiProvider(e.target.value)}
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Model</Label>
              <Input
                value={cfg.model}
                onChange={(e) => update({ model: e.target.value })}
                placeholder="ketik nama model, mis. gpt-4o-mini"
                list="model-suggestions"
                autoComplete="off"
              />
              <datalist id="model-suggestions">
                {(providerInfo?.models ?? []).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <p className="text-xs text-slate-400">
                Ketik bebas, atau pilih dari saran yang muncul.
              </p>
            </div>
          </div>

          {isCustom && (
            <div className="space-y-1.5">
              <Label>Base URL (OpenAI-compatible)</Label>
              <Input
                value={cfg.baseUrl}
                onChange={(e) => update({ baseUrl: e.target.value })}
                placeholder="https://openrouter.ai/api/v1"
              />
              <p className="text-xs text-slate-400">
                Contoh: OpenRouter, Groq, atau LM Studio lokal. Tanpa
                /chat/completions.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>API Key</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                cfg.hasApiKey
                  ? `Tersimpan (${cfg.apiKeyMasked}). Kosongkan untuk pertahankan.`
                  : providerInfo?.keyHint || "API key"
              }
            />
            <p className="text-xs text-slate-400">
              API key disimpan terenkripsi & tidak pernah ditampilkan kembali.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Instruksi Tambahan (opsional)</Label>
            <Textarea
              value={cfg.systemPromptExtra}
              onChange={(e) => update({ systemPromptExtra: e.target.value })}
              placeholder="Contoh: Selalu jawab dengan nada formal dan sebutkan nama LPM di akhir."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={simpan} disabled={saving}>
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan
            </Button>
            <Button variant="outline" onClick={tesKoneksi} disabled={testing}>
              {testing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Bot size={16} />
              )}
              Tes Koneksi
            </Button>
            {cfg.hasApiKey && (
              <Badge tone="green" className="ml-auto">
                API key tersimpan
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
