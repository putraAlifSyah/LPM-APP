"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  function isiCepat(em: string) {
    setEmail(em);
    setPassword("password123");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-bold">LPM Stikes Datu Kamanre</h1>
          <p className="text-sm text-blue-100">
            Sistem Informasi Lembaga Penjaminan Mutu
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">
            Masuk ke akun
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Gunakan email dan password kampus Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@stikesdk.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-medium text-slate-400">
              Akun demo (klik untuk isi otomatis):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Admin", "admin@stikesdk.ac.id"],
                ["Auditor", "auditor@stikesdk.ac.id"],
                ["Dosen", "dosen@stikesdk.ac.id"],
                ["Pimpinan", "pimpinan@stikesdk.ac.id"],
              ].map(([label, em]) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => isiCepat(em)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-blue-100">
          © 2024 Stikes Datu Kamanre — Localhost / Internal
        </p>
      </div>
    </div>
  );
}
