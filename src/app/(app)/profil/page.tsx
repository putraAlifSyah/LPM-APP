import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProfilForm } from "@/components/modules/profil-form";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Profil Saya"
        description="Perbarui data diri dan kata sandi Anda."
      />
      <ProfilForm
        user={{
          nama: user.nama,
          email: user.email,
          prodi: user.prodi,
          role: user.role,
        }}
      />
    </div>
  );
}
