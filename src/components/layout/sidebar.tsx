"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ClipboardCheck,
  Newspaper,
  Users,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  roles?: Role[]; // jika kosong = semua role
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dokumen", label: "Dokumen", icon: FileText },
  { href: "/monev", label: "Monitoring & Evaluasi", icon: BarChart3 },
  { href: "/audit", label: "Audit Internal", icon: ClipboardCheck },
  { href: "/berita", label: "Berita & Pengumuman", icon: Newspaper },
  { href: "/pengguna", label: "Manajemen Pengguna", icon: Users, roles: ["ADMIN"] },
  { href: "/panduan", label: "Panduan Penggunaan", icon: BookOpen },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-900">
            LPM Stikes
          </p>
          <p className="text-xs text-slate-400">Datu Kamanre</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.filter((item) => !item.roles || item.roles.includes(role)).map(
          (item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          }
        )}
      </nav>

      <div className="border-t border-slate-200 p-4 text-xs text-slate-400">
        © 2024 Stikes Datu Kamanre
      </div>
    </aside>
  );
}
