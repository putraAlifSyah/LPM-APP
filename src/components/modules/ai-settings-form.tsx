"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google Gemini" },
  { value: "anthropic", label: "Anthropic Claude" },
] as const;

const MODELS: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
    { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
  ],
  google: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  ],
  anthropic: [
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
  ],
};

export function AiSettingsForm() {
  const router = useRouter();
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "fail" | null>(null);

  // Load current config
  useEffect(() => {
    fetch("/api/ai/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setProvider(d.data.provider);
          setModel(d.data.model);
          setHasKey(d.data.hasKey);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInit(false));
  }, []);

  // Saat provider berubah, set model default
  function handleProviderChange(p: string) {
    setProvider(p);
    setModel(MODELS[p]?.[0]?.value ?? "");
    setTestResult(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");
    try {
      const body: Record<string, string> = { provider, model };
      if (apiKey) body.apiKey = apiKey;
      const res = await fetch("/api/ai/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal menyimpan");
      } else {
        setMsg("Pengaturan berhasil disimpan!");
        setHasKey(d.data.hasKey);
        setApiKey("");
        router.refresh();
      }
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hai, tes koneksi. Jawab singkat: OK." }),
      });
      if (res.ok) {
        setTestResult("ok");
      } else {
        setTestResult("fail");
      }
    } catch {
      setTestResult("fail");
    } finally {
      setTesting(false);
    }
  }

  if (loadingInit) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-slate-400">
          Memuat pengaturan...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {(msg || error) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || msg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Provider AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Model</Label>
              <Select value={model} onChange={(e) => setModel(e.target.value)}>
                {(MODELS[provider] ?? []).map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                API Key{" "}
                {hasKey && (
                  <Badge tone="green" className="ml-1">
                    Tersimpan
                  </Badge>
                )}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      hasKey
                        ? "Kosongkan jika tidak ingin mengubah"
                        : "Masukkan API key..."
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {provider === "openai"
                  ? "Dapatkan API key di platform.openai.com"
                  : provider === "google"
                  ? "Dapatkan API key di aistudio.google.com"
                  : "Dapatkan API key di console.anthropic.com"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                <Save size={16} />
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Test koneksi */}
      <Card>
        <CardHeader>
          <CardTitle>Tes Koneksi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-slate-500">
            Kirim pesan tes ke AI untuk memastikan provider dan API key sudah benar.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || !hasKey}
            >
              {testing ? "Menguji..." : "Tes Koneksi AI"}
            </Button>
            {testResult === "ok" && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle2 size={16} /> Koneksi berhasil!
              </span>
            )}
            {testResult === "fail" && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                <XCircle size={16} /> Koneksi gagal. Periksa API key dan provider.
              </span>
            )}
            {!hasKey && (
              <span className="text-xs text-slate-400">
                Simpan API key terlebih dahulu
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
