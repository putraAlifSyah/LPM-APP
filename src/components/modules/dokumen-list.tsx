"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, Eye, Upload, FileText } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatTanggal, formatUkuran, KATEGORI_DOKUMEN, PRODI_LIST } from "@/lib/utils";
import { UploadDokumenModal } from "./upload-dokumen-modal";

export type DokumenRow = {
  id: string;
  judul: string;
  kategori: string;
  standar: string | null;
  tags: string | null;
  prodi: string | null;
  namaFile: string;
  ukuranFile: number;
  versi: number;
  pathFile: string;
  createdAt: string;
  uploadedBy: { nama: string };
};

const KATEGORI_TONE: Record<string, "blue" | "green" | "purple" | "yellow" | "gray"> = {
  SPMI: "blue",
  Kurikulum: "green",
  VMTS: "purple",
  Renstra: "yellow",
};

export function DokumenList({
  data,
  canUpload,
}: {
  data: DokumenRow[];
  canUpload: boolean;
}) {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [prodi, setProdi] = useState("");
  const [standar, setStandar] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const standarOptions = useMemo(
    () =>
      Array.from(
        new Set(data.map((d) => d.standar).filter(Boolean) as string[])
      ).sort(),
    [data]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((d) => {
      const cocokSearch =
        !q ||
        d.judul.toLowerCase().includes(q) ||
        d.kategori.toLowerCase().includes(q) ||
        (d.tags?.toLowerCase().includes(q) ?? false) ||
        (d.standar?.toLowerCase().includes(q) ?? false);
      const cocokKategori = !kategori || d.kategori === kategori;
      const cocokProdi = !prodi || d.prodi === prodi;
      const cocokStandar = !standar || d.standar === standar;
      return cocokSearch && cocokKategori && cocokProdi && cocokStandar;
    });
  }, [data, search, kategori, prodi, standar]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari judul, tag, atau standar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-auto min-w-[150px]"
        >
          <option value="">Semua Kategori</option>
          {KATEGORI_DOKUMEN.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
        <Select
          value={standar}
          onChange={(e) => setStandar(e.target.value)}
          className="w-auto min-w-[150px]"
        >
          <option value="">Semua Standar</option>
          {standarOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select
          value={prodi}
          onChange={(e) => setProdi(e.target.value)}
          className="w-auto min-w-[150px]"
        >
          <option value="">Semua Prodi</option>
          {PRODI_LIST.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        {canUpload && (
          <Button onClick={() => setShowUpload(true)}>
            <Upload size={16} /> Upload
          </Button>
        )}
      </div>

      {/* Tabel */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Dokumen</TH>
              <TH>Kategori</TH>
              <TH>Standar</TH>
              <TH>Prodi</TH>
              <TH>Ukuran</TH>
              <TH>Tanggal</TH>
              <TH className="text-right">Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.length === 0 ? (
              <TR>
                <TD colSpan={7} className="py-10 text-center text-slate-400">
                  Tidak ada dokumen yang cocok.
                </TD>
              </TR>
            ) : (
              filtered.map((d) => (
                <TR key={d.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{d.judul}</p>
                        <p className="text-xs text-slate-400">
                          v{d.versi} · {d.uploadedBy.nama}
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <Badge tone={KATEGORI_TONE[d.kategori] ?? "gray"}>
                      {d.kategori}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{d.standar ?? "—"}</TD>
                  <TD className="text-xs">{d.prodi ?? "—"}</TD>
                  <TD className="text-xs">{formatUkuran(d.ukuranFile)}</TD>
                  <TD className="whitespace-nowrap text-xs">
                    {formatTanggal(d.createdAt)}
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Link href={`/dokumen/${d.id}`}>
                        <Button variant="ghost" size="icon" title="Detail">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <a href={d.pathFile} download={d.namaFile}>
                        <Button variant="ghost" size="icon" title="Download">
                          <Download size={16} />
                        </Button>
                      </a>
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>

      <p className="text-xs text-slate-400">
        Menampilkan {filtered.length} dari {data.length} dokumen
      </p>

      {canUpload && (
        <UploadDokumenModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}
