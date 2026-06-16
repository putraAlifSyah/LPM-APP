import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/layout/page-header";
import { BuatAuditForm } from "@/components/modules/buat-audit-form";

export const dynamic = "force-dynamic";

export default async function BuatAuditPage() {
  const user = await getSession();
  if (!can(user?.role, "buatAudit")) redirect("/audit");

  const auditors = await prisma.user.findMany({
    where: { role: { in: ["AUDITOR", "ADMIN"] } },
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/audit"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali
      </Link>
      <PageHeader title="Buat Sesi Audit" />
      <BuatAuditForm auditors={auditors} />
    </div>
  );
}
