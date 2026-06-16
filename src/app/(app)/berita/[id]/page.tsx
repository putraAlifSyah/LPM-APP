import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTanggalWaktu } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const berita = await prisma.berita.findUnique({
    where: { id },
    include: { penulis: { select: { nama: true } } },
  });

  if (!berita) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/berita"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </Link>
      <Card>
        <CardContent className="p-7">
          <Badge tone={berita.kategori === "Pengumuman" ? "yellow" : "blue"}>
            {berita.kategori}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {berita.judul}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Oleh {berita.penulis.nama} · {formatTanggalWaktu(berita.createdAt)}
          </p>
          <div className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
            {berita.isi}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
