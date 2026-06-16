export type StatusCapaian = "tercapai" | "hampir" | "kurang";

export function hitungPersen(capaian: number, target: number): number {
  if (!target) return 0;
  return Math.round((capaian / target) * 100);
}

export function statusCapaian(persen: number): StatusCapaian {
  if (persen >= 100) return "tercapai";
  if (persen >= 75) return "hampir";
  return "kurang";
}

export const STATUS_LABEL: Record<StatusCapaian, string> = {
  tercapai: "Tercapai",
  hampir: "Mendekati",
  kurang: "Belum Tercapai",
};

export const STATUS_TONE: Record<StatusCapaian, "green" | "yellow" | "red"> = {
  tercapai: "green",
  hampir: "yellow",
  kurang: "red",
};

export const STATUS_COLOR: Record<StatusCapaian, string> = {
  tercapai: "#16a34a",
  hampir: "#d97706",
  kurang: "#dc2626",
};
