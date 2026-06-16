"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { PRODI_LIST } from "@/lib/utils";

export function BuatAuditForm({
  auditors,
}: {
  auditors: { id: string; nama: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: fd.get("nama"),
          unitAudit: fd.get("unitAudit"),
          tanggalMulai: fd.get("tanggalMulai"),
          tanggalSelesai: fd.get("tanggalSelesai"),
          auditorId: fd.get("auditorId"),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal menyimpan");
        setLoading(false);
        return;
      }
      router.push(`/audit/${d.data.id}`);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Sesi Audit *</Label>
            <Input
              name="nama"
              required
              placeholder="Contoh: AMI Prodi S1 Keperawatan 2024"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Unit / Prodi yang Diaudit *</Label>
            <Select name="unitAudit" required defaultValue="">
              <option value="" disabled>
                Pilih unit
              </option>
              {PRODI_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="Institusi">Institusi</option>
              <option value="LPPM">LPPM</option>
              <option value="Perpustakaan">Perpustakaan</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tanggal Mulai *</Label>
              <Input name="tanggalMulai" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label>Tanggal Selesai *</Label>
              <Input name="tanggalSelesai" type="date" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Auditor *</Label>
            <Select name="auditorId" required defaultValue="">
              <option value="" disabled>
                Pilih auditor
              </option>
              {auditors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nama}
                </option>
              ))}
            </Select>
          </div>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Link href="/audit">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Buat Sesi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
