"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatTanggal, PRODI_LIST } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@/lib/auth";

export type UserRow = {
  id: string;
  nama: string;
  email: string;
  role: Role;
  prodi: string | null;
  createdAt: string;
};

const ROLE_TONE: Record<Role, "purple" | "blue" | "gray" | "green"> = {
  ADMIN: "purple",
  AUDITOR: "blue",
  DOSEN: "gray",
  PIMPINAN: "green",
};

export function PenggunaList({
  data,
  currentUserId,
}: {
  data: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function tambah(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: fd.get("nama"),
          email: fd.get("email"),
          password: fd.get("password"),
          role: fd.get("role"),
          prodi: fd.get("prodi"),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Gagal");
        setLoading(false);
        return;
      }
      setShowAdd(false);
      router.refresh();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function hapus(id: string) {
    if (!confirm("Yakin hapus pengguna ini?")) return;
    const res = await fetch(`/api/pengguna/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) {
      alert(d.error || "Gagal menghapus");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Tambah Pengguna
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Nama</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Prodi</TH>
              <TH>Bergabung</TH>
              <TH className="text-right">Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {data.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium text-slate-900">{u.nama}</TD>
                <TD className="text-xs">{u.email}</TD>
                <TD>
                  <Badge tone={ROLE_TONE[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                </TD>
                <TD className="text-xs">{u.prodi ?? "—"}</TD>
                <TD className="text-xs">{formatTanggal(u.createdAt)}</TD>
                <TD className="text-right">
                  {u.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => hapus(u.id)}
                      title="Hapus"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Tambah Pengguna Baru">
        <form onSubmit={tambah} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Lengkap *</Label>
            <Input name="nama" required placeholder="Nama beserta gelar" />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input name="email" type="email" required placeholder="nama@stikesdk.ac.id" />
          </div>
          <div className="space-y-1.5">
            <Label>Password Awal *</Label>
            <Input name="password" type="text" required placeholder="Minimal 6 karakter" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Select name="role" defaultValue="DOSEN">
                <option value="ADMIN">Administrator</option>
                <option value="AUDITOR">Auditor</option>
                <option value="DOSEN">Dosen / Staff</option>
                <option value="PIMPINAN">Pimpinan</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prodi</Label>
              <Select name="prodi" defaultValue="">
                <option value="">— Tidak ada —</option>
                {PRODI_LIST.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
