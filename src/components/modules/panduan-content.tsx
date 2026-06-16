"use client";

import { useState } from "react";
import {
  BookOpen,
  LogIn,
  LayoutDashboard,
  FileText,
  Upload,
  Pencil,
  Trash2,
  Search,
  ClipboardCheck,
  Play,
  Plus,
  CheckCircle2,
  BarChart3,
  PencilLine,
  Download,
  Newspaper,
  Users,
  UserCircle,
  Lock,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/auth";

/* =================================================================
   TIPE & DEFINISI KONTEN
   ================================================================= */

type Section = {
  id: string;
  icon: React.ReactNode;
  title: string;
  /** Jika undefined = semua role bisa lihat */
  roles?: Role[];
  content: React.ReactNode;
};

/* helper badge tone */
const ROLE_BADGE: Record<Role, { tone: "purple" | "blue" | "gray" | "green"; label: string }> = {
  ADMIN: { tone: "purple", label: "Admin" },
  AUDITOR: { tone: "blue", label: "Auditor" },
  DOSEN: { tone: "gray", label: "Dosen" },
  PIMPINAN: { tone: "green", label: "Pimpinan" },
};

/* ============ tiny helpers ============ */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-500">
        {n}
      </span>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <CircleCheck size={18} className="mt-0.5 shrink-0 text-green-600" />
      <div>{children}</div>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <CircleAlert size={18} className="mt-0.5 shrink-0 text-amber-600" />
      <div>{children}</div>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
      <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
      <div>{children}</div>
    </div>
  );
}

function FieldRow({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="whitespace-nowrap border border-slate-200 px-3 py-2 font-medium text-slate-900">
        {name}
      </td>
      <td className="border border-slate-200 px-3 py-2 text-sm text-slate-600">{children}</td>
    </tr>
  );
}

function SmallTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Flow({ items }: { items: { label: string; tone: string }[] }) {
  return (
    <div className="my-3 flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-300">→</span>}
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              item.tone === "yellow"
                ? "bg-amber-100 text-amber-800"
                : item.tone === "blue"
                ? "bg-blue-100 text-blue-800"
                : item.tone === "green"
                ? "bg-green-100 text-green-800"
                : item.tone === "red"
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}

/* =================================================================
   DEFINISI SEMUA SECTION
   ================================================================= */

function buildSections(): Section[] {
  return [
    /* ---------- 1. LOGIN ---------- */
    {
      id: "login",
      icon: <LogIn size={18} />,
      title: "Cara Login",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Buka alamat aplikasi di browser, lalu ikuti langkah berikut:
          </p>
          <Step n={1}>
            <strong>Masukkan Email</strong> — Gunakan email kampus Anda yang telah
            didaftarkan oleh Admin. Contoh: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">nama@stikesdk.ac.id</code>
          </Step>
          <Step n={2}>
            <strong>Masukkan Password</strong> — Ketik password Anda. Perhatikan huruf
            besar/kecil (case-sensitive).
          </Step>
          <Step n={3}>
            <strong>Klik &quot;Masuk&quot;</strong> — Jika berhasil, Anda akan diarahkan ke
            Dashboard.
          </Step>
          <Warning>
            <strong>Gagal login?</strong> Pastikan email & password benar. Jika lupa
            password, hubungi Administrator untuk mereset akun Anda.
          </Warning>
          <InfoBox>
            <strong>Sesi login</strong> berlaku selama 7 hari. Selalu logout jika
            menggunakan komputer bersama.
          </InfoBox>
        </>
      ),
    },

    /* ---------- 2. NAVIGASI ---------- */
    {
      id: "navigasi",
      icon: <LayoutDashboard size={18} />,
      title: "Navigasi Aplikasi",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Aplikasi memiliki <strong>Sidebar</strong> (menu samping kiri) dan{" "}
            <strong>Navbar</strong> (bar atas).
          </p>
          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Sidebar</h4>
          <p className="mb-2 text-sm text-slate-600">
            Menu yang tampil disesuaikan dengan role Anda. Menu aktif ditandai dengan
            warna <strong className="text-blue-700">biru</strong>.
          </p>
          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Navbar</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>
              <strong>Nama & Role Anda</strong> — Ditampilkan di navbar. Klik nama untuk
              membuka profil.
            </li>
            <li>
              <strong>Tombol &quot;Keluar&quot;</strong> — Untuk logout dari sistem.
            </li>
          </ul>
        </>
      ),
    },

    /* ---------- 3. DASHBOARD ---------- */
    {
      id: "dashboard",
      icon: <LayoutDashboard size={18} />,
      title: "Dashboard",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Halaman utama yang menampilkan ringkasan data penjaminan mutu secara real-time.
          </p>
          <SmallTable headers={["Kartu", "Informasi", "Klik untuk"]}>
            <FieldRow name="📄 Total Dokumen">Jumlah seluruh dokumen mutu yang tersimpan → buka Dokumen</FieldRow>
            <FieldRow name="✅ Temuan Aktif">Temuan audit yang belum selesai (OPEN / PROSES) → buka Audit</FieldRow>
            <FieldRow name="📈 Rata-rata Monev">Persentase rata-rata capaian semua indikator → buka Monev</FieldRow>
            <FieldRow name="📰 Pengumuman">Jumlah pengumuman aktif → buka Berita</FieldRow>
          </SmallTable>
          <p className="text-sm text-slate-600">
            Di bawah kartu terdapat widget: <strong>Distribusi Dokumen per Kategori</strong>,{" "}
            <strong>Dokumen Terbaru</strong> (5 terakhir), <strong>Audit Terakhir</strong>,
            dan <strong>Pengumuman Terbaru</strong>.
          </p>
          <Tip>
            Klik item apa pun di dashboard untuk langsung menuju halaman terkait.
          </Tip>
        </>
      ),
    },

    /* ---------- 4. DOKUMEN - MELIHAT ---------- */
    {
      id: "dokumen-lihat",
      icon: <FileText size={18} />,
      title: "Melihat & Mencari Dokumen",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Buka menu <strong>Dokumen</strong> di sidebar untuk melihat seluruh dokumen mutu.
          </p>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Tabel Dokumen</h4>
          <p className="mb-2 text-sm text-slate-600">
            Menampilkan kolom: Judul (+ versi & pengunggah), Kategori, Standar BAN-PT, Prodi,
            Ukuran file, Tanggal upload, dan tombol Aksi.
          </p>
          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">
            <Search size={14} className="mb-0.5 mr-1 inline" />
            Filter & Pencarian
          </h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li><strong>Kolom pencarian</strong> — Cari berdasarkan judul, tag, atau standar</li>
            <li><strong>Filter Kategori</strong> — SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir</li>
            <li><strong>Filter Standar</strong> — Berdasarkan kode standar BAN-PT</li>
            <li><strong>Filter Prodi</strong> — S1 Keperawatan, D3 Kebidanan, S1 Farmasi, dll.</li>
          </ul>
          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Aksi pada Dokumen</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>👁️ <strong>Detail</strong> — Lihat informasi lengkap + riwayat versi</li>
            <li>⬇️ <strong>Download</strong> — Unduh file dokumen ke komputer Anda</li>
          </ul>
        </>
      ),
    },

    /* ---------- 5. DOKUMEN - UPLOAD ---------- */
    {
      id: "dokumen-upload",
      icon: <Upload size={18} />,
      title: "Upload Dokumen Baru",
      roles: ["ADMIN", "AUDITOR", "DOSEN"],
      content: (
        <>
          <Step n={1}>
            Klik tombol <strong>&quot;Upload&quot;</strong> di pojok kanan atas halaman Dokumen.
          </Step>
          <Step n={2}>
            Isi formulir upload:
          </Step>
          <SmallTable headers={["Field", "Wajib", "Keterangan"]}>
            <FieldRow name="Judul Dokumen">
              <span className="font-semibold text-red-500">Ya</span> — Nama dokumen, contoh: &quot;Kebijakan SPMI 2024&quot;
            </FieldRow>
            <FieldRow name="Kategori">
              <span className="font-semibold text-red-500">Ya</span> — SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir, Lainnya
            </FieldRow>
            <FieldRow name="Prodi">
              Opsional — Pilih prodi jika dokumen spesifik ke prodi tertentu
            </FieldRow>
            <FieldRow name="Standar BAN-PT">
              Opsional — Kode standar, contoh: C.1.1
            </FieldRow>
            <FieldRow name="Tags">
              Opsional — Kata kunci pencarian, pisahkan dengan koma
            </FieldRow>
            <FieldRow name="Deskripsi">
              Opsional — Keterangan singkat tentang isi dokumen
            </FieldRow>
            <FieldRow name="File Dokumen">
              <span className="font-semibold text-red-500">Ya</span> — Format: PDF, DOCX, XLSX, PPTX. Maks ~10MB
            </FieldRow>
          </SmallTable>
          <Step n={3}>
            Klik <strong>&quot;Upload&quot;</strong>. Setelah berhasil, dokumen langsung muncul di daftar.
          </Step>
        </>
      ),
    },

    /* ---------- 6. DOKUMEN - EDIT & VERSI ---------- */
    {
      id: "dokumen-edit",
      icon: <Pencil size={18} />,
      title: "Edit & Upload Versi Baru Dokumen",
      roles: ["ADMIN", "AUDITOR", "DOSEN"],
      content: (
        <>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Edit Metadata</h4>
          <Step n={1}>Buka halaman <strong>Detail Dokumen</strong> (klik ikon mata).</Step>
          <Step n={2}>Klik tombol <strong>&quot;Edit&quot;</strong>.</Step>
          <Step n={3}>Ubah judul, kategori, prodi, standar, tags, atau deskripsi.</Step>
          <Step n={4}>Klik <strong>&quot;Simpan&quot;</strong>.</Step>

          <h4 className="mb-2 mt-5 text-sm font-bold text-slate-900">Upload Versi Baru</h4>
          <p className="mb-2 text-sm text-slate-600">
            Untuk memperbarui file tanpa kehilangan versi lama:
          </p>
          <Step n={1}>Di halaman detail, klik <strong>&quot;Versi Baru&quot;</strong>.</Step>
          <Step n={2}>Pilih <strong>file baru</strong> dari komputer.</Step>
          <Step n={3}>Isi <strong>Catatan Perubahan</strong> (opsional).</Step>
          <Step n={4}>Klik <strong>&quot;Upload Versi&quot;</strong>.</Step>
          <Tip>
            File lama otomatis disimpan ke riwayat versi. Nomor versi naik otomatis
            (v1 → v2 → v3).
          </Tip>
        </>
      ),
    },

    /* ---------- 7. DOKUMEN - HAPUS ---------- */
    {
      id: "dokumen-hapus",
      icon: <Trash2 size={18} />,
      title: "Hapus Dokumen",
      roles: ["ADMIN"],
      content: (
        <>
          <Warning>
            Hanya <Badge tone="purple">Admin</Badge> yang dapat menghapus dokumen.
          </Warning>
          <Step n={1}>Buka halaman <strong>Detail Dokumen</strong>.</Step>
          <Step n={2}>Klik tombol merah <strong>&quot;Hapus&quot;</strong>.</Step>
          <Step n={3}>Konfirmasi pada dialog yang muncul.</Step>
          <InfoBox>
            Penghapusan bersifat <strong>soft delete</strong> — dokumen ditandai
            &quot;dihapus&quot; dan tidak muncul di daftar, tapi datanya tetap tersimpan
            di database.
          </InfoBox>
        </>
      ),
    },

    /* ---------- 8. AUDIT - MELIHAT ---------- */
    {
      id: "audit-lihat",
      icon: <ClipboardCheck size={18} />,
      title: "Melihat Daftar Audit",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Buka menu <strong>Audit Internal</strong> di sidebar. Setiap sesi audit
            ditampilkan sebagai kartu dengan informasi:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li><strong>Nama Sesi</strong> — contoh: &quot;AMI Prodi S1 Keperawatan 2024&quot;</li>
            <li><strong>Unit Audit</strong> — Prodi / unit yang diaudit</li>
            <li><strong>Auditor</strong> — Nama auditor yang ditugaskan</li>
            <li><strong>Periode</strong> — Tanggal mulai–selesai</li>
            <li>
              <strong>Status</strong> —{" "}
              <Badge tone="yellow">RENCANA</Badge>{" "}
              <Badge tone="blue">BERLANGSUNG</Badge>{" "}
              <Badge tone="green">SELESAI</Badge>
            </li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            Klik kartu untuk melihat detail sesi beserta daftar temuan.
          </p>
        </>
      ),
    },

    /* ---------- 9. AUDIT - BUAT & KELOLA ---------- */
    {
      id: "audit-kelola",
      icon: <Play size={18} />,
      title: "Membuat & Mengelola Sesi Audit",
      roles: ["ADMIN", "AUDITOR"],
      content: (
        <>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Buat Sesi Audit Baru</h4>
          <Step n={1}>Klik <strong>&quot;Buat Sesi Audit&quot;</strong> di halaman Audit.</Step>
          <Step n={2}>
            Isi formulir:
          </Step>
          <SmallTable headers={["Field", "Keterangan"]}>
            <FieldRow name="Nama Sesi Audit">Contoh: &quot;AMI Prodi S1 Keperawatan 2024&quot;</FieldRow>
            <FieldRow name="Unit yang Diaudit">Pilih prodi/unit: S1 Keperawatan, D3 Kebidanan, Institusi, LPPM, dll.</FieldRow>
            <FieldRow name="Tanggal Mulai / Selesai">Rentang periode pelaksanaan audit</FieldRow>
            <FieldRow name="Auditor">Pilih dari daftar auditor/admin yang terdaftar</FieldRow>
          </SmallTable>
          <Step n={3}>Klik <strong>&quot;Buat Sesi&quot;</strong>. Status awal: <Badge tone="yellow">RENCANA</Badge>.</Step>

          <h4 className="mb-2 mt-5 text-sm font-bold text-slate-900">Alur Status Audit</h4>
          <Flow
            items={[
              { label: "📋 RENCANA", tone: "yellow" },
              { label: "🔄 BERLANGSUNG", tone: "blue" },
              { label: "✅ SELESAI", tone: "green" },
            ]}
          />
          <SmallTable headers={["Status", "Aksi yang Tersedia"]}>
            <FieldRow name="RENCANA">Klik &quot;Mulai Audit&quot; untuk mengubah ke BERLANGSUNG</FieldRow>
            <FieldRow name="BERLANGSUNG">&quot;Tambah Temuan&quot; dan &quot;Selesaikan Sesi&quot; (aktif jika semua temuan CLOSED)</FieldRow>
            <FieldRow name="SELESAI">Read-only — tidak bisa menambah/mengubah temuan</FieldRow>
          </SmallTable>
        </>
      ),
    },

    /* ---------- 10. AUDIT - TEMUAN ---------- */
    {
      id: "audit-temuan",
      icon: <Plus size={18} />,
      title: "Mencatat Temuan Audit",
      roles: ["ADMIN", "AUDITOR"],
      content: (
        <>
          <p className="mb-2 text-sm text-slate-600">
            Pada sesi yang berstatus <Badge tone="blue">BERLANGSUNG</Badge>:
          </p>
          <Step n={1}>Klik <strong>&quot;Tambah Temuan&quot;</strong>.</Step>
          <Step n={2}>
            Isi formulir:
          </Step>
          <SmallTable headers={["Field", "Wajib", "Keterangan"]}>
            <FieldRow name="Deskripsi Temuan">
              <span className="font-semibold text-red-500">Ya</span> — Uraian detail temuan yang ditemukan
            </FieldRow>
            <FieldRow name="Kategori">
              <span className="font-semibold text-red-500">Ya</span> — Observasi, Ketidaksesuaian Minor, atau Major
            </FieldRow>
            <FieldRow name="Standar BAN-PT">Opsional — Kode standar terkait</FieldRow>
            <FieldRow name="Deadline">Opsional — Tenggat waktu tindak lanjut</FieldRow>
          </SmallTable>
          <Step n={3}>Klik <strong>&quot;Tambah&quot;</strong>. Status temuan awal: <Badge tone="red">OPEN</Badge>.</Step>
        </>
      ),
    },

    /* ---------- 11. AUDIT - TINDAK LANJUT ---------- */
    {
      id: "audit-tindaklanjut",
      icon: <CheckCircle2 size={18} />,
      title: "Tindak Lanjut & Verifikasi Temuan",
      roles: ["ADMIN", "AUDITOR"],
      content: (
        <>
          <p className="mb-2 text-sm text-slate-600">Alur penyelesaian temuan:</p>
          <Flow
            items={[
              { label: "🔴 OPEN", tone: "red" },
              { label: "🟡 PROSES", tone: "yellow" },
              { label: "🟢 CLOSED", tone: "green" },
            ]}
          />
          <Step n={1}>
            Di kartu temuan, klik <strong>&quot;Tindak Lanjut & Verifikasi&quot;</strong>.
          </Step>
          <Step n={2}>
            Isi kolom <strong>Tindak Lanjut</strong> dengan rencana/hasil perbaikan.
          </Step>
          <Step n={3}>
            Ubah <strong>Status Verifikasi</strong>: OPEN → PROSES → CLOSED.
          </Step>
          <Step n={4}>Klik <strong>&quot;Simpan&quot;</strong>.</Step>
          <Tip>
            Sesi audit hanya bisa diselesaikan jika <strong>semua temuan</strong> sudah
            berstatus <Badge tone="green">CLOSED</Badge>.
          </Tip>
        </>
      ),
    },

    /* ---------- 12. MONEV - MELIHAT ---------- */
    {
      id: "monev-lihat",
      icon: <BarChart3 size={18} />,
      title: "Melihat Data Monitoring & Evaluasi",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Buka menu <strong>Monitoring & Evaluasi</strong>. Tabel menampilkan:
          </p>
          <SmallTable headers={["Kolom", "Keterangan"]}>
            <FieldRow name="Indikator">Nama indikator kinerja + periode</FieldRow>
            <FieldRow name="Standar">Kode standar BAN-PT</FieldRow>
            <FieldRow name="Target">Nilai target yang ditetapkan + satuan</FieldRow>
            <FieldRow name="Capaian">Nilai capaian aktual terbaru</FieldRow>
            <FieldRow name="%">Persentase capaian terhadap target</FieldRow>
            <FieldRow name="Status">
              <Badge tone="green">Tercapai</Badge> (≥100%){" "}
              <Badge tone="yellow">Mendekati</Badge> (75–99%){" "}
              <Badge tone="red">Belum Tercapai</Badge> (&lt;75%)
            </FieldRow>
          </SmallTable>
        </>
      ),
    },

    /* ---------- 13. MONEV - INPUT ---------- */
    {
      id: "monev-input",
      icon: <PencilLine size={18} />,
      title: "Input Indikator & Capaian Monev",
      roles: ["ADMIN", "DOSEN"],
      content: (
        <>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Tambah Indikator Baru</h4>
          <Step n={1}>Klik <strong>&quot;Indikator Baru&quot;</strong>.</Step>
          <Step n={2}>Isi: Nama Indikator, Standar BAN-PT, Satuan (%, skala, judul), Target Nilai, dan Periode.</Step>
          <Step n={3}>Klik <strong>&quot;Simpan Indikator&quot;</strong>.</Step>

          <h4 className="mb-2 mt-5 text-sm font-bold text-slate-900">Input Capaian</h4>
          <Step n={1}>Pada baris indikator, klik tombol <strong>&quot;Input&quot;</strong>.</Step>
          <Step n={2}>
            Isi: <strong>Nilai Capaian</strong> (wajib), Unit/Prodi (opsional), Keterangan (opsional).
          </Step>
          <Step n={3}>Klik <strong>&quot;Simpan Capaian&quot;</strong>. Persentase & status otomatis dihitung.</Step>
        </>
      ),
    },

    /* ---------- 14. MONEV - LAPORAN ---------- */
    {
      id: "monev-laporan",
      icon: <Download size={18} />,
      title: "Laporan Monev & Export CSV",
      content: (
        <>
          <Step n={1}>
            Di halaman Monev, klik link <strong>&quot;Lihat Laporan&quot;</strong> atau buka
            menu <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/monev/laporan</code>.
          </Step>
          <Step n={2}>
            Halaman laporan menampilkan:
            <ul className="ml-4 mt-1 list-inside list-disc">
              <li><strong>Filter Periode</strong> — pilih dari dropdown</li>
              <li><strong>Grafik Batang</strong> — Target vs Capaian per indikator (warna: hijau/kuning/merah)</li>
              <li><strong>Tabel Rincian</strong> — Detail lengkap semua indikator</li>
            </ul>
          </Step>
          <Step n={3}>
            Klik <strong>&quot;Export CSV&quot;</strong> untuk mengunduh data. File bisa
            dibuka di Excel / Google Sheets.
          </Step>
        </>
      ),
    },

    /* ---------- 15. BERITA - LIHAT ---------- */
    {
      id: "berita-lihat",
      icon: <Newspaper size={18} />,
      title: "Melihat Berita & Pengumuman",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Buka menu <strong>Berita & Pengumuman</strong>. Setiap berita menampilkan:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li><strong>Judul</strong> — Judul berita/pengumuman</li>
            <li><strong>Kategori</strong> — <Badge tone="blue">Berita</Badge> atau <Badge tone="yellow">Pengumuman</Badge></li>
            <li><strong>Cuplikan</strong> — Ringkasan singkat isi</li>
            <li><strong>Penulis & Tanggal</strong> — Info publikasi</li>
          </ul>
          <p className="mt-2 text-sm text-slate-600">
            Klik kartu untuk membaca isi lengkap.
          </p>
        </>
      ),
    },

    /* ---------- 16. BERITA - BUAT ---------- */
    {
      id: "berita-buat",
      icon: <Plus size={18} />,
      title: "Membuat Berita / Pengumuman",
      roles: ["ADMIN"],
      content: (
        <>
          <Step n={1}>Klik <strong>&quot;Buat Baru&quot;</strong> di halaman Berita.</Step>
          <Step n={2}>
            Isi formulir:
            <ul className="ml-4 mt-1 list-inside list-disc">
              <li><strong>Judul</strong> (wajib)</li>
              <li><strong>Kategori</strong> — Berita atau Pengumuman (wajib)</li>
              <li><strong>Isi</strong> — Konten lengkap (wajib)</li>
            </ul>
          </Step>
          <Step n={3}>Klik <strong>&quot;Publikasi&quot;</strong>. Berita langsung tampil di daftar dan dashboard.</Step>
        </>
      ),
    },

    /* ---------- 17. PENGGUNA ---------- */
    {
      id: "pengguna",
      icon: <Users size={18} />,
      title: "Manajemen Pengguna",
      roles: ["ADMIN"],
      content: (
        <>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Daftar Pengguna</h4>
          <p className="mb-2 text-sm text-slate-600">
            Buka menu <strong>Manajemen Pengguna</strong>. Tabel menampilkan: Nama, Email,
            Role, Prodi, Tanggal bergabung, dan tombol Hapus.
          </p>

          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Tambah Pengguna</h4>
          <Step n={1}>Klik <strong>&quot;Tambah Pengguna&quot;</strong>.</Step>
          <Step n={2}>
            Isi:
            <ul className="ml-4 mt-1 list-inside list-disc">
              <li><strong>Nama Lengkap</strong> (wajib) — beserta gelar</li>
              <li><strong>Email</strong> (wajib) — harus unik</li>
              <li><strong>Password Awal</strong> (wajib) — minimal 6 karakter</li>
              <li><strong>Role</strong> (wajib) — Administrator, Auditor, Dosen/Staff, Pimpinan</li>
              <li><strong>Prodi</strong> (opsional)</li>
            </ul>
          </Step>
          <Step n={3}>Klik <strong>&quot;Tambah&quot;</strong>. Akun langsung aktif.</Step>
          <Tip>
            Segera informasikan email & password awal ke pengguna baru.
            Sarankan mereka mengganti password segera.
          </Tip>

          <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Hapus Pengguna</h4>
          <p className="text-sm text-slate-600">
            Klik ikon hapus (🗑️) di baris pengguna, lalu konfirmasi.
          </p>
          <Warning>
            Penghapusan bersifat <strong>permanen</strong>. Anda tidak bisa menghapus
            akun Anda sendiri.
          </Warning>
        </>
      ),
    },

    /* ---------- 18. PROFIL ---------- */
    {
      id: "profil",
      icon: <UserCircle size={18} />,
      title: "Edit Profil",
      content: (
        <>
          <p className="mb-3 text-sm text-slate-600">
            Klik nama Anda di navbar atas untuk membuka halaman Profil.
          </p>
          <h4 className="mb-2 text-sm font-bold text-slate-900">Data Diri</h4>
          <SmallTable headers={["Field", "Bisa Diedit?"]}>
            <FieldRow name="Nama">✅ Ya — ubah nama Anda</FieldRow>
            <FieldRow name="Email">❌ Tidak — hubungi Admin untuk mengubah</FieldRow>
            <FieldRow name="Role">❌ Tidak — ditentukan oleh Admin</FieldRow>
            <FieldRow name="Prodi">✅ Ya — pilih dari daftar</FieldRow>
          </SmallTable>
          <p className="text-sm text-slate-600">
            Ubah data lalu klik <strong>&quot;Simpan Profil&quot;</strong>.
          </p>
        </>
      ),
    },

    /* ---------- 19. GANTI PASSWORD ---------- */
    {
      id: "ganti-password",
      icon: <Lock size={18} />,
      title: "Ganti Kata Sandi",
      content: (
        <>
          <Step n={1}>Di halaman Profil, cari bagian <strong>&quot;Ganti Kata Sandi&quot;</strong>.</Step>
          <Step n={2}>Masukkan <strong>Password Lama</strong>.</Step>
          <Step n={3}>Masukkan <strong>Password Baru</strong> (minimal 6 karakter).</Step>
          <Step n={4}>Klik <strong>&quot;Ubah Password&quot;</strong>.</Step>
          <Warning>
            <strong>Tips keamanan:</strong> Gunakan kombinasi huruf besar, kecil, angka,
            dan simbol. Ganti password secara berkala dan jangan bagikan ke orang lain.
          </Warning>
        </>
      ),
    },
  ];
}

/* =================================================================
   KOMPONEN UTAMA
   ================================================================= */

export function PanduanContent({ role, nama }: { role: Role; nama: string }) {
  const allSections = buildSections();
  const visibleSections = allSections.filter(
    (s) => !s.roles || s.roles.includes(role)
  );

  const [openId, setOpenId] = useState<string | null>(visibleSections[0]?.id ?? null);

  const { tone, label } = ROLE_BADGE[role];

  return (
    <div className="space-y-6">
      {/* Ringkasan role */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Halo, {nama.split(" ")[0]}! 👋
              </p>
              <p className="text-sm text-slate-500">
                Anda login sebagai{" "}
                <Badge tone={tone}>{label}</Badge>.
                Panduan di bawah disesuaikan dengan fitur yang bisa Anda akses.
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            {visibleSections.length} dari {allSections.length} panduan ditampilkan
          </div>
        </CardContent>
      </Card>

      {/* Akses cepat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📑 Daftar Panduan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setOpenId(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                openId === s.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-slate-400">
                {i + 1}
              </span>
              <span className="flex items-center gap-1.5">
                {s.icon}
                {s.title}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Accordion sections */}
      <div className="space-y-3">
        {visibleSections.map((s, i) => (
          <div key={s.id} id={`section-${s.id}`} className="scroll-mt-6">
            <Card
              className={`transition-shadow ${
                openId === s.id ? "ring-2 ring-blue-200 shadow-sm" : ""
              }`}
            >
              <button
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-sm font-bold text-slate-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-1 items-center gap-2">
                  <span className="text-slate-500">{s.icon}</span>
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  {s.roles && (
                    <span className="ml-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                      {s.roles.map((r) => ROLE_BADGE[r].label).join(", ")}
                    </span>
                  )}
                </span>
                {openId === s.id ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>
              {openId === s.id && (
                <CardContent className="border-t border-slate-100 px-5 pb-5 pt-4">
                  {s.content}
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
