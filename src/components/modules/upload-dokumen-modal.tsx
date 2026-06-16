"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { KATEGORI_DOKUMEN, PRODI_LIST } from "@/lib/utils";

export function UploadDokumenModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/dokumen", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal upload");
        setLoading(false);
        return;
      }
      onClose();
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload Dokumen Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="judul">Judul Dokumen *</Label>
          <Input id="judul" name="judul" required placeholder="Contoh: Kebijakan SPMI 2024" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="kategori">Kategori *</Label>
            <Select id="kategori" name="kategori" required defaultValue="">
              <option value="" disabled>
                Pilih kategori
              </option>
              {KATEGORI_DOKUMEN.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prodi">Prodi</Label>
            <Select id="prodi" name="prodi" defaultValue="">
              <option value="">— Tidak spesifik —</option>
              {PRODI_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="standar">Standar BAN-PT</Label>
          <Input id="standar" name="standar" placeholder="Contoh: C.1.1" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
          <Input id="tags" name="tags" placeholder="spmi, kebijakan, mutu" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea id="deskripsi" name="deskripsi" placeholder="Keterangan singkat..." />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="file">File Dokumen *</Label>
          <Input
            id="file"
            name="file"
            type="file"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm"
          />
          <p className="text-xs text-slate-400">
            Format: PDF, DOCX, XLSX, PPTX. Maks ~10MB.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Mengunggah..." : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
