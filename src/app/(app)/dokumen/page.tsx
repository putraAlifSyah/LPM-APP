import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/layout/page-header";
import { DokumenList, type DokumenRow } from "@/components/modules/dokumen-list";

export const dynamic = "force-dynamic";

export default async function DokumenPage() {
  const user = await getSession();
  const dokumen = await prisma.dokumen.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { nama: true } } },
  });

  const rows: DokumenRow[] = dokumen.map((d) => ({
    id: d.id,
    judul: d.judul,
    kategori: d.kategori,
    standar: d.standar,
    tags: d.tags,
    prodi: d.prodi,
    namaFile: d.namaFile,
    ukuranFile: d.ukuranFile,
    versi: d.versi,
    pathFile: d.pathFile,
    createdAt: d.createdAt.toISOString(),
    uploadedBy: { nama: d.uploadedBy.nama },
  }));

  return (
    <div>
      <PageHeader
        title="Manajemen Dokumen"
        description="Pusat penyimpanan dokumen mutu, akreditasi, dan dokumen institusi."
      />
      <DokumenList data={rows} canUpload={can(user?.role, "uploadDokumen")} />
    </div>
  );
}
