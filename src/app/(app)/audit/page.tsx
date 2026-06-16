import Link from "next/link";
import { Plus, ClipboardCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { formatTanggal } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  RENCANA: "yellow",
  BERLANGSUNG: "blue",
  SELESAI: "green",
} as const;

export default async function AuditPage() {
  const user = await getSession();
  const sesi = await prisma.auditSesi.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      auditor: { select: { nama: true } },
      _count: { select: { temuan: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Audit Mutu Internal"
        description="Pengelolaan sesi audit dan temuan."
        action={
          can(user?.role, "buatAudit") && (
            <Link href="/audit/buat">
              <Button>
                <Plus size={16} /> Buat Sesi Audit
              </Button>
            </Link>
          )
        }
      />

      {sesi.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <ClipboardCheck size={32} className="mx-auto mb-2 opacity-50" />
            Belum ada sesi audit.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sesi.map((s) => (
            <Link key={s.id} href={`/audit/${s.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{s.nama}</h3>
                    <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{s.unitAudit}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {formatTanggal(s.tanggalMulai)} —{" "}
                      {formatTanggal(s.tanggalSelesai)}
                    </span>
                    <span>{s._count.temuan} temuan</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Auditor: {s.auditor.nama}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
