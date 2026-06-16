import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/layout/page-header";
import { PenggunaList, type UserRow } from "@/components/modules/pengguna-list";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const user = await getSession();
  if (!can(user?.role, "kelolaUser")) redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      prodi: true,
      createdAt: true,
    },
  });

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    role: u.role,
    prodi: u.prodi,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola akun dosen, staff, auditor, dan pimpinan."
      />
      <PenggunaList data={rows} currentUserId={user!.id} />
    </div>
  );
}
