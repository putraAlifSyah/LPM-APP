import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { MonevLaporan, type LaporanItem } from "@/components/modules/monev-laporan";

export const dynamic = "force-dynamic";

export default async function LaporanMonevPage() {
  const indikator = await prisma.indikatorMonev.findMany({
    orderBy: { createdAt: "asc" },
    include: { capaian: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const data: LaporanItem[] = indikator.map((i) => ({
    nama: i.nama,
    standar: i.standar,
    satuan: i.satuan,
    target: i.targetNilai,
    capaian: i.capaian[0]?.nilaiCapaian ?? null,
    periode: i.periode,
  }));

  return (
    <div>
      <Link
        href="/monev"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali
      </Link>
      <PageHeader
        title="Laporan Monev"
        description="Grafik capaian vs target dan rincian per indikator."
      />
      <MonevLaporan data={data} />
    </div>
  );
}
