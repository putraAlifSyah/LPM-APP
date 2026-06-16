"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, UploadCloud } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { KATEGORI_DOKUMEN, PRODI_LIST } from "@/lib/utils";

type Dok = {
  id: string;
  judul: string;
  deskripsi: string | null;
  kategori: string;
  standar: string | null;
  tags: string | null;
  prodi: string | null;
};

export function DokumenDetailActions({
  dokumen,
  canEdit,
  canDelete,
}: {
  dokumen: Dok;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showVersi, setShowVersi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/dokumen/${dokumen.id}`, {
        method: "PATCH",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        setLoading(false);
        return;
      }
      setShowEdit(false);
      setShowVersi(false);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function hapus() {
    if (!confirm("Yakin hapus dokumen ini? (soft delete)")) return;
    const res = await fetch(`/api/dokumen/${dokumen.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dokumen");
      router.refresh();
    }
  }

  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <>
          <Button variant="outline" onClick={() => setShowEdit(true)}>
            <Pencil size={16} /> Edit
          </Button>
          <Button variant="outline" onClick={() => setShowVersi(true)}>
            <UploadCloud size={16} /> Versi Baru
          </Button>
        </>
      )}
      {canDelete && (
        <Button variant="destructive" onClick={hapus}>
          <Trash2 size={16} /> Hapus
        </Button>
      )}

      {/* Edit metadata */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Metadata Dokumen"
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Judul</Label>
            <Input name="judul" defaultValue={dokumen.judul} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select name="kategori" defaultValue={dokumen.kategori}>
                {KATEGORI_DOKUMEN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prodi</Label>
              <Select name="prodi" defaultValue={dokumen.prodi ?? ""}>
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
            <Label>Standar BAN-PT</Label>
            <Input name="standar" defaultValue={dokumen.standar ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <Input name="tags" defaultValue={dokumen.tags ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Deskripsi</Label>
            <Textarea name="deskripsi" defaultValue={dokumen.deskripsi ?? ""} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload versi baru */}
      <Modal
        open={showVersi}
        onClose={() => setShowVersi(false)}
        title="Upload Versi Baru"
      >
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-slate-500">
            File lama akan disimpan otomatis ke riwayat versi.
          </p>
          <div className="space-y-1.5">
            <Label>File Baru *</Label>
            <Input
              name="file"
              type="file"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Catatan Perubahan</Label>
            <Input name="catatan" placeholder="Contoh: Revisi sesuai temuan audit" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowVersi(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mengunggah..." : "Upload Versi"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
