"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTanggal } from "@/lib/utils";

type Temuan = {
  id: string;
  deskripsi: string;
  kategori: string;
  standar: string | null;
  tindakLanjut: string | null;
  statusTemuan: "OPEN" | "PROSES" | "CLOSED";
  deadline: string | null;
};

type Sesi = {
  id: string;
  status: "RENCANA" | "BERLANGSUNG" | "SELESAI";
  temuan: Temuan[];
};

const TEMUAN_TONE = {
  OPEN: "red",
  PROSES: "yellow",
  CLOSED: "green",
} as const;

const KATEGORI_TONE: Record<string, "gray" | "yellow" | "red"> = {
  Observasi: "gray",
  "Ketidaksesuaian Minor": "yellow",
  Major: "red",
};

export function AuditDetail({
  sesi,
  canManage,
}: {
  sesi: Sesi;
  canManage: boolean;
}) {
  const router = useRouter();
  const [showTemuan, setShowTemuan] = useState(false);
  const [editTemuan, setEditTemuan] = useState<Temuan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ubahStatusSesi(status: string) {
    setError("");
    const res = await fetch(`/api/audit/${sesi.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await res.json();
    if (!res.ok) {
      alert(d.error || "Gagal mengubah status");
      return;
    }
    router.refresh();
  }

  async function tambahTemuan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/audit/${sesi.id}/temuan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deskripsi: fd.get("deskripsi"),
          kategori: fd.get("kategori"),
          standar: fd.get("standar"),
          deadline: fd.get("deadline") || null,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        setLoading(false);
        return;
      }
      setShowTemuan(false);
      router.refresh();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function simpanTindakLanjut(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTemuan) return;
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/temuan/${editTemuan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tindakLanjut: fd.get("tindakLanjut"),
          ...(canManage ? { statusTemuan: fd.get("statusTemuan") } : {}),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        setLoading(false);
        return;
      }
      setEditTemuan(null);
      router.refresh();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  const semuaClosed =
    sesi.temuan.length > 0 &&
    sesi.temuan.every((t) => t.statusTemuan === "CLOSED");

  return (
    <div className="space-y-5">
      {/* Aksi status sesi */}
      {canManage && (
        <div className="flex flex-wrap gap-2">
          {sesi.status === "RENCANA" && (
            <Button onClick={() => ubahStatusSesi("BERLANGSUNG")}>
              <Play size={16} /> Mulai Audit
            </Button>
          )}
          {sesi.status === "BERLANGSUNG" && (
            <>
              <Button onClick={() => setShowTemuan(true)}>
                <Plus size={16} /> Tambah Temuan
              </Button>
              <Button
                variant="outline"
                onClick={() => ubahStatusSesi("SELESAI")}
                disabled={!semuaClosed}
                title={
                  semuaClosed
                    ? "Selesaikan sesi"
                    : "Semua temuan harus CLOSED dulu"
                }
              >
                <CheckCircle2 size={16} /> Selesaikan Sesi
              </Button>
            </>
          )}
        </div>
      )}

      {/* Daftar temuan */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Daftar Temuan ({sesi.temuan.length})
        </h2>
        {sesi.temuan.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-slate-400">
              Belum ada temuan pada sesi ini.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sesi.temuan.map((t, i) => (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-xs font-semibold text-slate-400">
                        #{i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">
                          {t.deskripsi}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <Badge tone={KATEGORI_TONE[t.kategori] ?? "gray"}>
                            {t.kategori}
                          </Badge>
                          {t.standar && (
                            <Badge tone="blue">{t.standar}</Badge>
                          )}
                          {t.deadline && (
                            <span className="text-xs text-slate-400">
                              Deadline: {formatTanggal(t.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge tone={TEMUAN_TONE[t.statusTemuan]}>
                      {t.statusTemuan}
                    </Badge>
                  </div>

                  {t.tindakLanjut && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="text-xs font-medium text-slate-400">
                        Tindak Lanjut
                      </p>
                      <p className="text-slate-700">{t.tindakLanjut}</p>
                    </div>
                  )}

                  {sesi.status !== "SELESAI" && (
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditTemuan(t);
                          setError("");
                        }}
                      >
                        {canManage ? "Tindak Lanjut & Verifikasi" : "Isi Tindak Lanjut"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal tambah temuan */}
      <Modal
        open={showTemuan}
        onClose={() => setShowTemuan(false)}
        title="Tambah Temuan"
      >
        <form onSubmit={tambahTemuan} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Deskripsi Temuan *</Label>
            <Textarea name="deskripsi" required placeholder="Uraian temuan audit..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori *</Label>
              <Select name="kategori" defaultValue="Observasi">
                <option value="Observasi">Observasi</option>
                <option value="Ketidaksesuaian Minor">
                  Ketidaksesuaian Minor
                </option>
                <option value="Major">Major</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Standar BAN-PT</Label>
              <Input name="standar" placeholder="C.4.2" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Deadline Tindak Lanjut</Label>
            <Input name="deadline" type="date" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowTemuan(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal tindak lanjut / verifikasi */}
      <Modal
        open={!!editTemuan}
        onClose={() => setEditTemuan(null)}
        title="Tindak Lanjut Temuan"
      >
        {editTemuan && (
          <form onSubmit={simpanTindakLanjut} className="space-y-4">
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {editTemuan.deskripsi}
            </p>
            <div className="space-y-1.5">
              <Label>Tindak Lanjut</Label>
              <Textarea
                name="tindakLanjut"
                defaultValue={editTemuan.tindakLanjut ?? ""}
                placeholder="Rencana / hasil tindak lanjut unit terkait..."
              />
            </div>
            {canManage && (
              <div className="space-y-1.5">
                <Label>Status Verifikasi (auditor)</Label>
                <Select name="statusTemuan" defaultValue={editTemuan.statusTemuan}>
                  <option value="OPEN">OPEN</option>
                  <option value="PROSES">PROSES</option>
                  <option value="CLOSED">CLOSED</option>
                </Select>
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditTemuan(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
