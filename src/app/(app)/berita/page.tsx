import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { formatTanggal } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const user = await getSession();
  const berita = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
    include: { penulis: { select: { nama: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Berita & Pengumuman"
        description="Informasi terkini seputar penjaminan mutu kampus."
        action={
          can(user?.role, "buatBerita") && (
            <Link href="/berita/buat">
              <Button>
                <Plus size={16} /> Buat Berita
              </Button>
            </Link>
          )
        }
      />

      {berita.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <Newspaper size={32} className="mx-auto mb-2 opacity-50" />
            Belum ada berita atau pengumuman.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {berita.map((b) => (
            <Link key={b.id} href={`/berita/${b.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <Badge tone={b.kategori === "Pengumuman" ? "yellow" : "blue"}>
                    {b.kategori}
                  </Badge>
                  <h3 className="mt-2 font-semibold text-slate-900">
                    {b.judul}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {b.isi}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    {b.penulis.nama} · {formatTanggal(b.createdAt)}
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
