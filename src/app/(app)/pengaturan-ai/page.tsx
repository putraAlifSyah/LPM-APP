import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/layout/page-header";
import { AiSettingsForm } from "@/components/modules/ai-settings-form";

export const dynamic = "force-dynamic";

export default async function PengaturanAiPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!can(user.role, "kelolaAi")) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="Pengaturan AI"
        description="Konfigurasi provider, model, dan API key untuk chatbot AI."
      />
      <AiSettingsForm />
    </div>
  );
}
