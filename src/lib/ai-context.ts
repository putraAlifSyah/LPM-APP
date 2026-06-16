import { prisma } from "./db";
import { type SessionUser } from "./auth";
import { ROLE_LABEL, CAN, can } from "./rbac";
import { hitungPersen, statusCapaian, STATUS_LABEL } from "./monev";

// Panduan fitur ringkas (versi teks dari halaman /panduan) agar AI paham cara pakai aplikasi.
const PANDUAN = `
PANDUAN FITUR APLIKASI LPM (Lembaga Penjaminan Mutu Stikes Datu Kamanre):

1. DASHBOARD (/dashboard) — ringkasan: total dokumen, temuan audit aktif, rata-rata capaian monev, pengumuman, dokumen terbaru.

2. DOKUMEN (/dokumen) — pusat dokumen mutu.
   - Cari dengan search bar (judul/tag/standar BAN-PT) dan filter (kategori, standar, prodi).
   - Upload: klik tombol "Upload" (hak akses: Admin, Auditor, Dosen). Isi judul, kategori (SPMI/Kurikulum/VMTS/Renstra/Laporan/Formulir/Lainnya), standar BAN-PT, tags, lalu pilih file (PDF/DOCX/XLSX/PPTX).
   - Detail dokumen: ada tombol Download, Edit metadata, Upload Versi Baru (file lama tersimpan di riwayat versi), dan Hapus (Admin saja, soft-delete).

3. AUDIT MUTU INTERNAL (/audit) — alur status: RENCANA → BERLANGSUNG → SELESAI.
   - Buat sesi audit (Admin/Auditor): isi nama, unit/prodi, tanggal, auditor.
   - Saat BERLANGSUNG: tambah Temuan (kategori: Observasi/Ketidaksesuaian Minor/Major, standar, deadline).
   - Tindak lanjut temuan: status OPEN → PROSES → CLOSED. Sesi hanya bisa SELESAI jika semua temuan CLOSED.

4. MONITORING & EVALUASI / MONEV (/monev) — indikator kinerja vs target.
   - Tambah indikator & input capaian (Admin/Dosen). Status: Tercapai (≥100%), Mendekati (75-99%), Belum Tercapai (<75%).
   - Laporan (/monev/laporan): grafik batang capaian vs target, filter periode, export CSV.

5. BERITA & PENGUMUMAN (/berita) — baca berita; buat berita hanya Admin.

6. PENGGUNA (/pengguna) — Admin saja: tambah/hapus user, atur role.

7. PROFIL (/profil) — edit nama, prodi, ganti password. Email & role hanya bisa diubah Admin.

8. PENGATURAN AI (/pengaturan-ai) — Admin saja: atur provider, model, dan API key chatbot ini.
`.trim();

/** Daftar aksi yang BOLEH dilakukan user saat ini, dalam bahasa manusia. */
function ringkasanHakAkses(user: SessionUser): string {
  const aksiLabel: Record<keyof typeof CAN, string> = {
    uploadDokumen: "mengunggah dokumen",
    hapusDokumen: "menghapus dokumen",
    inputMonev: "menambah indikator & input capaian monev",
    buatAudit: "membuat sesi audit",
    inputTemuan: "menambah & memverifikasi temuan audit",
    kelolaUser: "mengelola pengguna",
    kelolaAI: "mengatur konfigurasi AI",
    buatBerita: "membuat berita/pengumuman",
    lihatLaporan: "melihat laporan",
  };
  const boleh = (Object.keys(CAN) as (keyof typeof CAN)[])
    .filter((a) => can(user.role, a))
    .map((a) => aksiLabel[a]);
  return boleh.length ? boleh.join(", ") : "hanya melihat data";
}

/** Bangun system prompt: identitas + panduan + hak akses + data live (sesuai role). */
export async function buildSystemPrompt(
  user: SessionUser,
  extra?: string | null
): Promise<string> {
  const [
    totalDokumen,
    perKategori,
    dokumenTerbaru,
    sesiAudit,
    temuanAktif,
    indikator,
  ] = await Promise.all([
    prisma.dokumen.count({ where: { deleted: false } }),
    prisma.dokumen.groupBy({
      by: ["kategori"],
      where: { deleted: false },
      _count: true,
    }),
    prisma.dokumen.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: { judul: true, kategori: true, standar: true, prodi: true },
    }),
    prisma.auditSesi.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { temuan: true } } },
    }),
    prisma.temuan.count({ where: { statusTemuan: { not: "CLOSED" } } }),
    prisma.indikatorMonev.findMany({
      orderBy: { createdAt: "asc" },
      include: { capaian: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
  ]);

  const kategoriStr = perKategori
    .map((k) => `${k.kategori}: ${k._count}`)
    .join(", ");

  const dokumenStr = dokumenTerbaru
    .map(
      (d) =>
        `- "${d.judul}" [${d.kategori}${d.standar ? `, ${d.standar}` : ""}${
          d.prodi ? `, ${d.prodi}` : ""
        }]`
    )
    .join("\n");

  const auditStr = sesiAudit
    .map(
      (s) =>
        `- "${s.nama}" (${s.unitAudit}) status ${s.status}, ${s._count.temuan} temuan`
    )
    .join("\n");

  const monevStr = indikator
    .map((i) => {
      const cap = i.capaian[0]?.nilaiCapaian;
      if (cap == null)
        return `- ${i.nama} (target ${i.targetNilai} ${i.satuan}): belum ada capaian`;
      const persen = hitungPersen(cap, i.targetNilai);
      return `- ${i.nama}: capaian ${cap}/${i.targetNilai} ${i.satuan} (${persen}%, ${STATUS_LABEL[statusCapaian(persen)]}) [${i.periode}]`;
    })
    .join("\n");

  return `Anda adalah "Asisten LPM", chatbot AI di dalam aplikasi Sistem Informasi Lembaga Penjaminan Mutu (LPM) Stikes Datu Kamanre.

TUGAS ANDA:
- Membantu pengguna memahami cara menggunakan fitur aplikasi (cara upload dokumen, alur audit, input monev, dll).
- Menjawab pertanyaan tentang data yang ada di aplikasi (dokumen, audit, monev) berdasarkan DATA SAAT INI di bawah.
- Menjawab dalam Bahasa Indonesia yang ramah, ringkas, dan jelas. Gunakan poin-poin bila perlu.

ATURAN:
- Jawab HANYA seputar aplikasi LPM ini dan penjaminan mutu. Jika ditanya hal di luar konteks, arahkan kembali dengan sopan.
- Jangan mengarang data. Jika informasi tidak ada di konteks, katakan tidak tahu dan sarankan membuka halaman terkait.
- Jangan pernah membuka/membocorkan API key atau kredensial.

PENGGUNA SAAT INI:
- Nama: ${user.nama}
- Role: ${ROLE_LABEL[user.role]}
- Yang BOLEH dilakukan user ini: ${ringkasanHakAkses(user)}.
${user.prodi ? `- Prodi: ${user.prodi}` : ""}

${PANDUAN}

=== DATA SAAT INI (real-time) ===
DOKUMEN: total ${totalDokumen}. Per kategori: ${kategoriStr || "-"}.
Dokumen terbaru:
${dokumenStr || "(belum ada dokumen)"}

AUDIT: ${temuanAktif} temuan masih aktif (belum CLOSED). Sesi audit:
${auditStr || "(belum ada sesi audit)"}

MONEV (indikator & capaian):
${monevStr || "(belum ada indikator)"}
=== AKHIR DATA ===
${extra ? `\nINSTRUKSI TAMBAHAN DARI ADMIN:\n${extra}` : ""}`;
}
