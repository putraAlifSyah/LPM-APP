import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { MonevTable, type IndikatorRow } from "@/components/modules/monev-table";

export const dynamic = "force-dynamic";

export default async function MonevPage() {
  const user = await getSession();
  const indikator = await prisma.indikatorMonev.findMany({
    orderBy: { createdAt: "asc" },
    include: { capaian: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const rows: IndikatorRow[] = indikator.map((i) => ({
    id: i.id,
    nama: i.nama,
    standar: i.standar,
    satuan: i.satuan,
    targetNilai: i.targetNilai,
    periode: i.periode,
    capaianTerbaru: i.capaian[0]?.nilaiCapaian ?? null,
    unit: i.capaian[0]?.unit ?? null,
  }));

  return (
    <div>
      <PageHeader
        title="Monitoring & Evaluasi"
        description="Pemantauan capaian indikator mutu terhadap target."
        action={
          <Link href="/monev/laporan">
            <Button variant="outline">
              <BarChart3 size={16} /> Lihat Laporan
            </Button>
          </Link>
        }
      />
      <MonevTable data={rows} canInput={can(user?.role, "inputMonev")} />
    </div>
  );
}
