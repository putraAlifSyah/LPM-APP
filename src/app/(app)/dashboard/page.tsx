import Link from "next/link";
import {
  FileText,
  ClipboardCheck,
  BarChart3,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { formatTanggal, KATEGORI_DOKUMEN } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_AUDIT_TONE = {
  RENCANA: "yellow",
  BERLANGSUNG: "blue",
  SELESAI: "green",
} as const;

export default async function DashboardPage() {
  const user = await getSession();

  const [
    totalDokumen,
    dokumenPerKategori,
    dokumenTerbaru,
    auditTerakhir,
    temuanOpen,
    indikator,
    pengumuman,
  ] = await Promise.all([
    prisma.dokumen.count({ where: { deleted: false } }),
    prisma.dokumen.groupBy({
      by: ["kategori"],
      where: { deleted: false },
      _count: true,
    }),
    prisma.dokumen.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { uploadedBy: { select: { nama: true } } },
    }),
    prisma.auditSesi.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.temuan.count({ where: { statusTemuan: { not: "CLOSED" } } }),
    prisma.indikatorMonev.findMany({
      where: { periode: "2024-Ganjil" },
      include: { capaian: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.berita.findMany({
      where: { kategori: "Pengumuman" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const kategoriMap = new Map(
    dokumenPerKategori.map((d) => [d.kategori, d._count])
  );

  // Rata-rata capaian monev (% terhadap target)
  const persenList = indikator
    .filter((i) => i.capaian[0])
    .map((i) => (i.capaian[0].nilaiCapaian / i.targetNilai) * 100);
  const rataMonev =
    persenList.length > 0
      ? Math.round(persenList.reduce((a, b) => a + b, 0) / persenList.length)
      : 0;

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${user?.nama.split(" ")[0]} 👋`}
        description="Ringkasan aktivitas penjaminan mutu Stikes Datu Kamanre."
      />

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText size={20} />}
          label="Total Dokumen"
          value={totalDokumen}
          href="/dokumen"
          tone="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<ClipboardCheck size={20} />}
          label="Temuan Audit Aktif"
          value={temuanOpen}
          href="/audit"
          tone="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Rata-rata Capaian Monev"
          value={`${rataMonev}%`}
          href="/monev"
          tone="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<Newspaper size={20} />}
          label="Pengumuman"
          value={pengumuman.length}
          href="/berita"
          tone="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Dokumen per kategori */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Dokumen per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {KATEGORI_DOKUMEN.map((k) => {
              const count = kategoriMap.get(k) ?? 0;
              const pct = totalDokumen ? (count / totalDokumen) * 100 : 0;
              return (
                <div key={k}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{k}</span>
                    <span className="font-medium text-slate-900">{count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Dokumen terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dokumen Terbaru</CardTitle>
            <Link
              href="/dokumen"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              Lihat semua <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {dokumenTerbaru.map((d) => (
              <Link
                key={d.id}
                href={`/dokumen/${d.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {d.judul}
                    </p>
                    <p className="text-xs text-slate-400">
                      {d.uploadedBy.nama} · {formatTanggal(d.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge tone="gray">{d.kategori}</Badge>
              </Link>
            ))}
            {dokumenTerbaru.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-400">
                Belum ada dokumen.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Status audit terakhir */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            {auditTerakhir ? (
              <div className="space-y-2">
                <p className="font-medium text-slate-900">{auditTerakhir.nama}</p>
                <p className="text-sm text-slate-500">
                  {auditTerakhir.unitAudit}
                </p>
                <Badge tone={STATUS_AUDIT_TONE[auditTerakhir.status]}>
                  {auditTerakhir.status}
                </Badge>
                <p className="text-xs text-slate-400">
                  {formatTanggal(auditTerakhir.tanggalMulai)} —{" "}
                  {formatTanggal(auditTerakhir.tanggalSelesai)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Belum ada sesi audit.</p>
            )}
          </CardContent>
        </Card>

        {/* Pengumuman */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pengumuman Terbaru</CardTitle>
            <Link
              href="/berita"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              Lihat semua <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pengumuman.map((p) => (
              <Link
                key={p.id}
                href={`/berita/${p.id}`}
                className="block rounded-lg border border-slate-100 p-3 hover:border-slate-200 hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-slate-900">{p.judul}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                  {p.isi}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatTanggal(p.createdAt)}
                </p>
              </Link>
            ))}
            {pengumuman.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-400">
                Belum ada pengumuman.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  href: string;
  tone: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
