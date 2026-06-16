"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/rbac";

export function Navbar({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const inisial = user.nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="md:hidden">
        <span className="font-bold text-blue-700">LPM Stikes</span>
      </div>
      <div className="hidden md:block" />

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {inisial}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-slate-900">
              {user.nama}
            </p>
            <p className="text-xs text-slate-400">{ROLE_LABEL[user.role]}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-2">
                <p className="text-sm font-medium text-slate-900">
                  {user.nama}
                </p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
              <Link
                href="/profil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <UserIcon size={16} /> Profil Saya
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
