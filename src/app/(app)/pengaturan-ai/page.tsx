import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/layout/page-header";
import { PengaturanAiForm } from "@/components/modules/pengaturan-ai-form";

export const dynamic = "force-dynamic";

export default async function PengaturanAiPage() {
  const user = await getSession();
  if (!can(user?.role, "kelolaAI")) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Pengaturan AI Assistant"
        description="Konfigurasi penyedia, model, dan API key untuk chatbot AI aplikasi."
      />
      <PengaturanAiForm />
    </div>
  );
}
