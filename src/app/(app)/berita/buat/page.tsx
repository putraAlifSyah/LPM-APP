"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";

export default function BuatBeritaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      judul: fd.get("judul"),
      kategori: fd.get("kategori"),
      isi: fd.get("isi"),
    };
    try {
      const res = await fetch("/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        setLoading(false);
        return;
      }
      router.push("/berita");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/berita"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali
      </Link>
      <PageHeader title="Buat Berita / Pengumuman" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul *</Label>
              <Input name="judul" required placeholder="Judul berita" />
            </div>
            <div className="space-y-1.5">
              <Label>Kategori *</Label>
              <Select name="kategori" defaultValue="Berita">
                <option value="Berita">Berita</option>
                <option value="Pengumuman">Pengumuman</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Isi *</Label>
              <Textarea
                name="isi"
                required
                className="min-h-[200px]"
                placeholder="Tulis isi berita atau pengumuman di sini..."
              />
            </div>
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Link href="/berita">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Publikasikan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
