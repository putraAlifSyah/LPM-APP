"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, PencilLine } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import {
  hitungPersen,
  statusCapaian,
  STATUS_LABEL,
  STATUS_TONE,
} from "@/lib/monev";

export type IndikatorRow = {
  id: string;
  nama: string;
  standar: string;
  satuan: string;
  targetNilai: number;
  periode: string;
  capaianTerbaru: number | null;
  unit: string | null;
};

export function MonevTable({
  data,
  canInput,
}: {
  data: IndikatorRow[];
  canInput: boolean;
}) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [showIndikator, setShowIndikator] = useState(false);
  const [target, setTarget] = useState<IndikatorRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function bukaInput(ind: IndikatorRow) {
    setTarget(ind);
    setError("");
    setShowInput(true);
  }

  async function submitCapaian(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!target) return;
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/monev/capaian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indikatorId: target.id,
          nilaiCapaian: fd.get("nilaiCapaian"),
          unit: fd.get("unit"),
          keterangan: fd.get("keterangan"),
          periode: target.periode,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        setLoading(false);
        return;
      }
      setShowInput(false);
      router.refresh();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function submitIndikator(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/monev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: fd.get("nama"),
          standar: fd.get("standar"),
          satuan: fd.get("satuan"),
          targetNilai: fd.get("targetNilai"),
          periode: fd.get("periode"),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        setLoading(false);
        return;
      }
      setShowIndikator(false);
      router.refresh();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {canInput && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowIndikator(true)}>
            <Plus size={16} /> Indikator Baru
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Indikator</TH>
              <TH>Standar</TH>
              <TH>Target</TH>
              <TH>Capaian</TH>
              <TH>%</TH>
              <TH>Status</TH>
              {canInput && <TH className="text-right">Aksi</TH>}
            </TR>
          </THead>
          <TBody>
            {data.length === 0 ? (
              <TR>
                <TD colSpan={canInput ? 7 : 6} className="py-10 text-center text-slate-400">
                  Belum ada indikator monev.
                </TD>
              </TR>
            ) : (
              data.map((ind) => {
                const persen =
                  ind.capaianTerbaru != null
                    ? hitungPersen(ind.capaianTerbaru, ind.targetNilai)
                    : null;
                const status = persen != null ? statusCapaian(persen) : null;
                return (
                  <TR key={ind.id}>
                    <TD>
                      <p className="font-medium text-slate-900">{ind.nama}</p>
                      <p className="text-xs text-slate-400">{ind.periode}</p>
                    </TD>
                    <TD className="text-xs">{ind.standar}</TD>
                    <TD>
                      {ind.targetNilai} {ind.satuan}
                    </TD>
                    <TD>
                      {ind.capaianTerbaru != null
                        ? `${ind.capaianTerbaru} ${ind.satuan}`
                        : "—"}
                    </TD>
                    <TD className="font-medium">
                      {persen != null ? `${persen}%` : "—"}
                    </TD>
                    <TD>
                      {status ? (
                        <Badge tone={STATUS_TONE[status]}>
                          {STATUS_LABEL[status]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada data</span>
                      )}
                    </TD>
                    {canInput && (
                      <TD className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => bukaInput(ind)}
                        >
                          <PencilLine size={14} /> Input
                        </Button>
                      </TD>
                    )}
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
      </div>

      {/* Modal input capaian */}
      <Modal
        open={showInput}
        onClose={() => setShowInput(false)}
        title={`Input Capaian — ${target?.nama ?? ""}`}
      >
        <form onSubmit={submitCapaian} className="space-y-4">
          <p className="text-sm text-slate-500">
            Target: <strong>{target?.targetNilai} {target?.satuan}</strong> ·
            Periode {target?.periode}
          </p>
          <div className="space-y-1.5">
            <Label>Nilai Capaian ({target?.satuan}) *</Label>
            <Input name="nilaiCapaian" type="number" step="any" required />
          </div>
          <div className="space-y-1.5">
            <Label>Unit / Prodi</Label>
            <Input name="unit" placeholder="Contoh: S1 Keperawatan" />
          </div>
          <div className="space-y-1.5">
            <Label>Keterangan</Label>
            <Textarea name="keterangan" placeholder="Catatan capaian..." />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowInput(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Capaian"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal indikator baru */}
      <Modal
        open={showIndikator}
        onClose={() => setShowIndikator(false)}
        title="Tambah Indikator Monev"
      >
        <form onSubmit={submitIndikator} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Indikator *</Label>
            <Input name="nama" required placeholder="Contoh: Rata-rata IPK Lulusan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Standar BAN-PT *</Label>
              <Input name="standar" required placeholder="C.6.1" />
            </div>
            <div className="space-y-1.5">
              <Label>Satuan *</Label>
              <Input name="satuan" required placeholder="%, skala, judul" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Target Nilai *</Label>
              <Input name="targetNilai" type="number" step="any" required />
            </div>
            <div className="space-y-1.5">
              <Label>Periode *</Label>
              <Select name="periode" defaultValue="2024-Ganjil">
                <option value="2024-Ganjil">2024-Ganjil</option>
                <option value="2024-Genap">2024-Genap</option>
                <option value="2025-Ganjil">2025-Ganjil</option>
                <option value="2025-Genap">2025-Genap</option>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowIndikator(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Indikator"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
