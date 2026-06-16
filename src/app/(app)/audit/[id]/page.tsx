import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTanggal } from "@/lib/utils";
import { AuditDetail } from "@/components/modules/audit-detail";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  RENCANA: "yellow",
  BERLANGSUNG: "blue",
  SELESAI: "green",
} as const;

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();

  const sesi = await prisma.auditSesi.findUnique({
    where: { id },
    include: {
      auditor: { select: { nama: true } },
      temuan: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!sesi) notFound();

  const totalTemuan = sesi.temuan.length;
  const closed = sesi.temuan.filter((t) => t.statusTemuan === "CLOSED").length;
  const progress = totalTemuan ? Math.round((closed / totalTemuan) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/audit"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{sesi.nama}</h1>
          <p className="text-sm text-slate-500">
            {sesi.unitAudit} · Auditor: {sesi.auditor.nama}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {formatTanggal(sesi.tanggalMulai)} —{" "}
            {formatTanggal(sesi.tanggalSelesai)}
          </p>
        </div>
        <Badge tone={STATUS_TONE[sesi.status]}>{sesi.status}</Badge>
      </div>

      {/* Progress penyelesaian temuan */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600">Penyelesaian Temuan</span>
            <span className="font-medium text-slate-900">
              {closed}/{totalTemuan} CLOSED ({progress}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <AuditDetail
        sesi={{
          id: sesi.id,
          status: sesi.status,
          temuan: sesi.temuan.map((t) => ({
            id: t.id,
            deskripsi: t.deskripsi,
            kategori: t.kategori,
            standar: t.standar,
            tindakLanjut: t.tindakLanjut,
            statusTemuan: t.statusTemuan,
            deadline: t.deadline ? t.deadline.toISOString() : null,
          })),
        }}
        canManage={can(user?.role, "inputTemuan")}
      />
    </div>
  );
}
