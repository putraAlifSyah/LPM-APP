"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { PRODI_LIST } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@/lib/auth";

export function ProfilForm({
  user,
}: {
  user: { nama: string; email: string; prodi: string | null; role: Role };
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function kirim(payload: Record<string, unknown>, sukses: string) {
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        return false;
      }
      setMsg(sukses);
      router.refresh();
      return true;
    } catch {
      setError("Kesalahan jaringan");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function simpanProfil(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await kirim(
      { nama: fd.get("nama"), prodi: fd.get("prodi") },
      "Profil berhasil diperbarui."
    );
  }

  async function gantiPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const ok = await kirim(
      {
        passwordLama: fd.get("passwordLama"),
        passwordBaru: fd.get("passwordBaru"),
      },
      "Kata sandi berhasil diubah."
    );
    if (ok) form.reset();
  }

  return (
    <div className="space-y-5">
      {(msg || error) && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
          }`}
        >
          {error || msg}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Data Diri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={simpanProfil} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama</Label>
              <Input name="nama" defaultValue={user.nama} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={user.email} disabled className="bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={ROLE_LABEL[user.role]}
                  disabled
                  className="bg-slate-50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Prodi</Label>
              <Select name="prodi" defaultValue={user.prodi ?? ""}>
                <option value="">— Tidak ada —</option>
                {PRODI_LIST.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                Simpan Profil
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ganti Kata Sandi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={gantiPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Password Lama</Label>
              <Input name="passwordLama" type="password" required />
            </div>
            <div className="space-y-1.5">
              <Label>Password Baru</Label>
              <Input
                name="passwordBaru"
                type="password"
                required
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={loading}>
                Ubah Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
