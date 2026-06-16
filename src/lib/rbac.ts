import type { Role } from "./auth";

/** Definisi hak akses per aksi, sesuai tabel role pada implementation plan. */
export const CAN = {
  uploadDokumen: ["ADMIN", "AUDITOR", "DOSEN"],
  hapusDokumen: ["ADMIN"],
  inputMonev: ["ADMIN", "DOSEN"],
  buatAudit: ["ADMIN", "AUDITOR"],
  inputTemuan: ["ADMIN", "AUDITOR"],
  kelolaUser: ["ADMIN"],
  kelolaAI: ["ADMIN"],
  buatBerita: ["ADMIN"],
  lihatLaporan: ["ADMIN", "AUDITOR", "DOSEN", "PIMPINAN"],
} satisfies Record<string, Role[]>;

export function can(role: Role | undefined | null, aksi: keyof typeof CAN): boolean {
  if (!role) return false;
  return (CAN[aksi] as Role[]).includes(role);
}

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrator",
  AUDITOR: "Auditor",
  DOSEN: "Dosen / Staff",
  PIMPINAN: "Pimpinan",
};
