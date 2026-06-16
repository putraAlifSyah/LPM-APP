import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PanduanContent } from "@/components/modules/panduan-content";

export const dynamic = "force-dynamic";

export default async function PanduanPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div>
      <PageHeader
        title="Panduan Penggunaan"
        description={`Panduan lengkap fitur-fitur yang tersedia untuk Anda sebagai ${
          user.role === "ADMIN"
            ? "Administrator"
            : user.role === "AUDITOR"
            ? "Auditor"
            : user.role === "DOSEN"
            ? "Dosen / Staff"
            : "Pimpinan"
        }.`}
      />
      <PanduanContent role={user.role} nama={user.nama} />
    </div>
  );
}
