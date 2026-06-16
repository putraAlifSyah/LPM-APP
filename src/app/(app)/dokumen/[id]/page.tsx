import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, History } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTanggalWaktu, formatUkuran } from "@/lib/utils";
import { DokumenDetailActions } from "@/components/modules/dokumen-detail-actions";

export const dynamic = "force-dynamic";

export default async function DokumenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();

  const dokumen = await prisma.dokumen.findFirst({
    where: { id, deleted: false },
    include: {
      uploadedBy: { select: { nama: true, email: true } },
      riwayat: { orderBy: { versi: "desc" } },
    },
  });

  if (!dokumen) notFound();

  const tags = dokumen.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dokumen"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{dokumen.judul}</h1>
            <p className="text-sm text-slate-500">
              Versi {dokumen.versi} · diunggah oleh {dokumen.uploadedBy.nama}
            </p>
          </div>
        </div>
        <DokumenDetailActions
          dokumen={{
            id: dokumen.id,
            judul: dokumen.judul,
            deskripsi: dokumen.deskripsi,
            kategori: dokumen.kategori,
            standar: dokumen.standar,
            tags: dokumen.tags,
            prodi: dokumen.prodi,
          }}
          canEdit={can(user?.role, "uploadDokumen")}
          canDelete={can(user?.role, "hapusDokumen")}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Dokumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dokumen.deskripsi && (
              <p className="text-sm text-slate-600">{dokumen.deskripsi}</p>
            )}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Info label="Kategori">
                <Badge tone="blue">{dokumen.kategori}</Badge>
              </Info>
              <Info label="Standar BAN-PT">{dokumen.standar ?? "—"}</Info>
              <Info label="Prodi">{dokumen.prodi ?? "—"}</Info>
              <Info label="Ukuran File">{formatUkuran(dokumen.ukuranFile)}</Info>
              <Info label="Nama File">{dokumen.namaFile}</Info>
              <Info label="Tipe">{dokumen.tipeFile}</Info>
              <Info label="Diunggah">{formatTanggalWaktu(dokumen.createdAt)}</Info>
              <Info label="Diperbarui">{formatTanggalWaktu(dokumen.updatedAt)}</Info>
            </dl>

            {tags.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-400">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <Badge key={t} tone="gray">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <a href={dokumen.pathFile} download={dokumen.namaFile}>
                <Button>
                  <Download size={16} /> Download Dokumen
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History size={16} /> Riwayat Versi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="border-l-2 border-blue-500 pl-3">
                <p className="text-sm font-medium text-slate-900">
                  Versi {dokumen.versi}{" "}
                  <Badge tone="green" className="ml-1">
                    Terkini
                  </Badge>
                </p>
                <p className="text-xs text-slate-400">
                  {formatTanggalWaktu(dokumen.updatedAt)}
                </p>
              </li>
              {dokumen.riwayat.map((r) => (
                <li key={r.id} className="border-l-2 border-slate-200 pl-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      Versi {r.versi}
                    </p>
                    <a
                      href={r.pathFile}
                      download={r.namaFile}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      unduh
                    </a>
                  </div>
                  {r.catatan && (
                    <p className="text-xs text-slate-500">{r.catatan}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    {formatTanggalWaktu(r.createdAt)}
                  </p>
                </li>
              ))}
              {dokumen.riwayat.length === 0 && (
                <li className="text-xs text-slate-400">
                  Belum ada versi sebelumnya.
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-slate-700">{children}</dd>
    </div>
  );
}
