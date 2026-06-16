import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ROLE_LABEL } from "@/lib/rbac";
import Link from "next/link";
import {
  BookOpen,
  LogIn,
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  BarChart3,
  Newspaper,
  Users,
  UserCircle,
  HelpCircle,
  Download,
  Upload,
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Play,
  CheckCircle2,
  ShieldCheck,
  Lock,
  FileDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

/* ---------- Mapping role -> badge tone ---------- */
const ROLE_TONE = {
  ADMIN: "purple",
  AUDITOR: "blue",
  DOSEN: "gray",
  PIMPINAN: "green",
} as const;

/* ---------- Reusable step component ---------- */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <div className="flex h-8 w-8 flex-none min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {n}
      </div>
      <div className="flex-1 pt-1 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}

/* ---------- Info box ---------- */
function InfoBox({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning" | "danger" | "success";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
  };
  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    danger: "⛔",
    success: "✅",
  };
  return (
    <div className={`my-4 rounded-lg border p-4 text-sm ${styles[variant]}`}>
      <p className="mb-1 font-semibold">
        {icons[variant]} {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

/* ---------- Section wrapper ---------- */
function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
        <div className="flex h-10 w-10 flex-none min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-blue-600 text-white">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ---------- Field table row ---------- */
function FieldRow({
  name,
  required,
  desc,
}: {
  name: string;
  required?: boolean;
  desc: string;
}) {
  return (
    <tr>
      <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
        {name}
      </td>
      <td className="border-b border-slate-100 px-3 py-2 text-center text-sm">
        {required ? (
          <span className="font-bold text-red-500">Ya</span>
        ) : (
          <span className="text-slate-400">Tidak</span>
        )}
      </td>
      <td className="border-b border-slate-100 px-3 py-2 text-sm text-slate-600">
        {desc}
      </td>
    </tr>
  );
}

/* ---------- MAIN PAGE ---------- */
export default async function PanduanPage() {
  const user = await getSession();

  const role = user?.role ?? "DOSEN";

  const allTocItems = [
    { id: "login", label: "Login ke Sistem", icon: LogIn },
    { id: "navigasi", label: "Navigasi Aplikasi", icon: LayoutDashboard },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "dokumen", label: "Manajemen Dokumen", icon: FileText },
    { id: "audit", label: "Audit Mutu Internal", icon: ClipboardCheck },
    { id: "monev", label: "Monitoring & Evaluasi", icon: BarChart3 },
    { id: "berita", label: "Berita & Pengumuman", icon: Newspaper },
    { id: "pengguna", label: "Manajemen Pengguna", icon: Users, roles: ["ADMIN"] },
    { id: "profil", label: "Profil Pengguna", icon: UserCircle },
    { id: "faq", label: "FAQ & Troubleshooting", icon: HelpCircle },
  ];

  const tocItems = allTocItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Panduan Penggunaan"
        description="Dokumentasi lengkap cara menggunakan seluruh fitur Sistem Informasi LPM."
      />

      {/* User info card */}
      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              Anda login sebagai:
            </p>
            <p className="font-semibold text-slate-900">{user?.nama}</p>
          </div>
          <Badge tone={ROLE_TONE[user?.role ?? "DOSEN"]}>
            {ROLE_LABEL[user?.role ?? "DOSEN"]}
          </Badge>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={18} /> Daftar Isi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {tocItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex h-7 w-7 flex-none min-h-[28px] min-w-[28px] items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 transition-colors group-hover:bg-blue-200 group-hover:text-blue-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon size={16} className="flex-none text-slate-400 group-hover:text-blue-600" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </CardContent>
      </Card>

      {/* Download PDF version */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <FileDown size={20} className="shrink-0 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            Butuh versi cetak (PDF)?
          </p>
          <p className="text-xs text-blue-600">
            Buka file panduan versi HTML lalu gunakan tombol &quot;Cetak / Save as PDF&quot; di browser.
          </p>
        </div>
      </div>

      {/* ==================== SECTIONS ==================== */}
      <div className="space-y-12">
        {/* ===== 1. LOGIN ===== */}
        <Section id="login" icon={LogIn} title="Login ke Sistem">
          <p className="text-sm text-slate-600">
            Untuk mengakses sistem, buka alamat aplikasi di browser. Anda akan diarahkan ke halaman login.
          </p>
          <Card>
            <CardContent className="divide-y divide-slate-100 p-0">
              <Step n={1}>
                <strong>Buka halaman login</strong> — Ketik alamat aplikasi di browser. Jika belum login, Anda akan otomatis diarahkan ke halaman login.
              </Step>
              <Step n={2}>
                <strong>Masukkan Email</strong> — Isi dengan email kampus yang didaftarkan oleh Administrator.
                <br />
                <code className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs">
                  contoh: nama@stikesdk.ac.id
                </code>
              </Step>
              <Step n={3}>
                <strong>Masukkan Password</strong> — Isi kata sandi Anda. Password bersifat <em>case-sensitive</em> (huruf besar/kecil dibedakan).
              </Step>
              <Step n={4}>
                <strong>Klik tombol &quot;Masuk&quot;</strong> — Jika berhasil, Anda akan diarahkan ke Dashboard. Jika gagal, pesan error akan muncul.
              </Step>
            </CardContent>
          </Card>
          <InfoBox variant="info" title="Keamanan Session">
            Sesi login berlaku selama <strong>7 hari</strong>. Setelah itu, Anda perlu login kembali. Selalu <strong>logout</strong> jika menggunakan komputer bersama.
          </InfoBox>
          <InfoBox variant="warning" title="Lupa Password?">
            Hubungi <strong>Administrator</strong> untuk mereset password akun Anda.
          </InfoBox>
        </Section>

        {/* ===== 2. NAVIGASI ===== */}
        <Section id="navigasi" icon={LayoutDashboard} title="Navigasi Aplikasi">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Sidebar (Menu Samping)</h3>
          <p className="text-sm text-slate-600">
            Sidebar terletak di sisi kiri layar. Menu yang ditampilkan disesuaikan dengan role Anda:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Menu</th>
                  <th className="px-4 py-3">Tersedia untuk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["📊 Dashboard", "Semua role"],
                  ["📄 Dokumen", "Semua role"],
                  ["📈 Monitoring & Evaluasi", "Semua role"],
                  ["✅ Audit Internal", "Semua role"],
                  ["📰 Berita & Pengumuman", "Semua role"],
                  ["👥 Manajemen Pengguna", "Admin saja"],
                  ["📖 Panduan Penggunaan", "Semua role"],
                ].map(([menu, role]) => (
                  <tr key={menu} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{menu}</td>
                    <td className="px-4 py-2.5 text-slate-500">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">Navbar (Bar Atas)</h3>
          <p className="text-sm text-slate-600">
            Navbar menampilkan <strong>nama &amp; role</strong> Anda, link ke <strong>Profil</strong>, dan tombol <strong>Keluar</strong> untuk logout.
          </p>
        </Section>

        {/* ===== 3. DASHBOARD ===== */}
        <Section id="dashboard" icon={BarChart3} title="Dashboard">
          <p className="text-sm text-slate-600">
            Halaman utama yang menampilkan ringkasan seluruh aktivitas penjaminan mutu secara real-time.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["📄 Total Dokumen", "Jumlah seluruh dokumen yang tersimpan", "Buka halaman Dokumen"],
              ["✅ Temuan Audit Aktif", "Temuan berstatus OPEN atau PROSES", "Buka halaman Audit"],
              ["📈 Rata-rata Capaian Monev", "Persentase capaian terhadap target", "Buka halaman Monev"],
              ["📰 Pengumuman", "Jumlah pengumuman aktif dari LPM", "Buka halaman Berita"],
            ].map(([title, desc, action]) => (
              <Card key={title}>
                <CardContent className="p-4">
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{desc}</p>
                  <p className="mt-2 text-xs text-blue-600">Klik → {action}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Dashboard juga menampilkan: <strong>Distribusi dokumen per kategori</strong> (progress bar), <strong>5 dokumen terbaru</strong>, <strong>status audit terakhir</strong>, dan <strong>3 pengumuman terbaru</strong>.
          </p>
        </Section>

        {/* ===== 4. DOKUMEN ===== */}
        <Section id="dokumen" icon={FileText} title="Manajemen Dokumen">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Melihat &amp; Mencari Dokumen</h3>
          <p className="text-sm text-slate-600">
            Halaman Dokumen menampilkan tabel seluruh dokumen mutu. Gunakan toolbar di atas tabel untuk:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [<Search key="s" size={16} />, "Pencarian", "Cari berdasarkan judul, tag, atau standar BAN-PT"],
              [<Eye key="e" size={16} />, "Filter Kategori", "SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir"],
              [<Eye key="st" size={16} />, "Filter Standar", "Berdasarkan kode standar BAN-PT"],
              [<Eye key="p" size={16} />, "Filter Prodi", "S1 Keperawatan, D3 Kebidanan, S1 Farmasi, dll."],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                <div className="mt-0.5 text-slate-400">{icon}</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {["ADMIN", "AUDITOR", "DOSEN"].includes(role) && (
            <>
              <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
                <Upload size={16} className="mr-1 inline" /> Upload Dokumen Baru
              </h3>
              <InfoBox variant="warning" title="Hak Akses">
                Tombol Upload hanya muncul untuk: <strong>Admin</strong>, <strong>Auditor</strong>, <strong>Dosen</strong>. Pimpinan hanya bisa melihat.
              </InfoBox>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2">Field</th>
                      <th className="px-3 py-2 text-center">Wajib</th>
                      <th className="px-3 py-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <FieldRow name="Judul Dokumen" required desc='Nama dokumen. Contoh: "Kebijakan SPMI 2024"' />
                    <FieldRow name="Kategori" required desc="Pilih: SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir, Lainnya" />
                    <FieldRow name="Prodi" desc='Pilih prodi jika spesifik, atau "Tidak spesifik"' />
                    <FieldRow name="Standar BAN-PT" desc="Kode standar, contoh: C.1.1, C.6.2" />
                    <FieldRow name="Tags" desc="Kata kunci, pisahkan koma. Contoh: spmi, kebijakan, mutu" />
                    <FieldRow name="Deskripsi" desc="Keterangan singkat tentang isi dokumen" />
                    <FieldRow name="File Dokumen" required desc="Format: PDF, DOCX, XLSX, PPTX. Maks ~10MB" />
                  </tbody>
                </table>
              </div>

              <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
                <Pencil size={16} className="mr-1 inline" /> Edit &amp; Versi Baru
              </h3>
              <p className="text-sm text-slate-600">
                Di halaman detail dokumen, tersedia tombol:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-sm text-slate-600">
                <li><strong>Edit</strong> — Ubah metadata (judul, kategori, standar, tags, deskripsi)</li>
                <li><strong>Versi Baru</strong> — Upload file baru, file lama otomatis disimpan ke riwayat versi</li>
                {role === "ADMIN" && (
                  <li><strong>Hapus</strong> (Admin saja) — Soft delete, dokumen tidak muncul di daftar tapi masih tersimpan</li>
                )}
              </ul>
            </>
          )}
        </Section>

        {/* ===== 5. AUDIT ===== */}
        <Section id="audit" icon={ClipboardCheck} title="Audit Mutu Internal (AMI)">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Alur Status Audit</h3>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4">
            <Badge tone="yellow">📋 RENCANA</Badge>
            <span className="text-slate-300">→</span>
            <Badge tone="blue">🔄 BERLANGSUNG</Badge>
            <span className="text-slate-300">→</span>
            <Badge tone="green">✅ SELESAI</Badge>
          </div>

          {["ADMIN", "AUDITOR"].includes(role) && (
            <>
              <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
                <Plus size={16} className="mr-1 inline" /> Buat Sesi Audit Baru
              </h3>
              <InfoBox variant="warning" title="Hak Akses">
                Hanya <strong>Admin</strong> dan <strong>Auditor</strong> yang dapat membuat sesi audit.
              </InfoBox>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2">Field</th>
                      <th className="px-3 py-2 text-center">Wajib</th>
                      <th className="px-3 py-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <FieldRow name="Nama Sesi Audit" required desc='Contoh: "AMI Prodi S1 Keperawatan 2024"' />
                    <FieldRow name="Unit / Prodi yang Diaudit" required desc="Pilih unit: Prodi, Institusi, LPPM, Perpustakaan" />
                    <FieldRow name="Tanggal Mulai" required desc="Tanggal rencana audit dimulai" />
                    <FieldRow name="Tanggal Selesai" required desc="Tanggal rencana audit selesai" />
                    <FieldRow name="Auditor" required desc="Pilih auditor dari daftar" />
                  </tbody>
                </table>
              </div>

              <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">Mencatat Temuan</h3>
              <p className="text-sm text-slate-600">
                Saat sesi berstatus <strong>BERLANGSUNG</strong>, klik <strong>&quot;Tambah Temuan&quot;</strong> untuk mencatat:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-sm text-slate-600">
                <li><strong>Deskripsi Temuan</strong> — Uraian detail temuan</li>
                <li><strong>Kategori</strong> — Observasi, Ketidaksesuaian Minor, atau Major</li>
                <li><strong>Standar BAN-PT</strong> — Kode standar terkait (opsional)</li>
                <li><strong>Deadline</strong> — Tenggat waktu tindak lanjut (opsional)</li>
              </ul>
            </>
          )}

          <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">Tindak Lanjut &amp; Verifikasi</h3>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4">
            <Badge tone="red">🔴 OPEN</Badge>
            <span className="text-slate-300">→</span>
            <Badge tone="yellow">🟡 PROSES</Badge>
            <span className="text-slate-300">→</span>
            <Badge tone="green">🟢 CLOSED</Badge>
          </div>
          <ul className="ml-4 mt-3 list-disc space-y-1 text-sm text-slate-600">
            <li>Klik <strong>&quot;Tindak Lanjut &amp; Verifikasi&quot;</strong> pada kartu temuan</li>
            <li>Isi rencana/hasil tindak lanjut</li>
            {["ADMIN", "AUDITOR"].includes(role) && (
              <li>Admin/Auditor dapat mengubah status: OPEN → PROSES → CLOSED</li>
            )}
          </ul>
          {["ADMIN", "AUDITOR"].includes(role) && (
            <InfoBox variant="success" title="Menyelesaikan Sesi">
              Sesi audit hanya bisa diselesaikan jika <strong>semua temuan</strong> sudah berstatus CLOSED.
            </InfoBox>
          )}
        </Section>

        {/* ===== 6. MONEV ===== */}
        <Section id="monev" icon={BarChart3} title="Monitoring & Evaluasi (Monev)">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Tabel Indikator</h3>
          <p className="text-sm text-slate-600">
            Halaman Monev menampilkan tabel indikator kinerja dengan kolom: Indikator, Standar, Target, Capaian, Persentase, dan Status.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">Tercapai (≥100%)</Badge>
            <Badge tone="yellow">Mendekati (75–99%)</Badge>
            <Badge tone="red">Belum Tercapai (&lt;75%)</Badge>
          </div>

          {["ADMIN", "DOSEN"].includes(role) && (
            <>
              <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
                <Plus size={16} className="mr-1 inline" /> Tambah Indikator &amp; Input Capaian
              </h3>
              <InfoBox variant="warning" title="Hak Akses">
                Hanya <strong>Admin</strong> dan <strong>Dosen</strong> yang dapat menambah indikator dan input capaian.
              </InfoBox>
              <p className="text-sm text-slate-600">
                <strong>Tambah Indikator:</strong> Klik &quot;Indikator Baru&quot;, isi nama, standar BAN-PT, satuan, target nilai, dan periode.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Input Capaian:</strong> Klik tombol &quot;Input&quot; pada baris indikator, masukkan nilai capaian, unit/prodi, dan keterangan.
              </p>
            </>
          )}

          <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
            <BarChart3 size={16} className="mr-1 inline" /> Laporan &amp; Grafik
          </h3>
          <p className="text-sm text-slate-600">
            Buka <Link href="/monev/laporan" className="font-medium text-blue-600 underline">halaman Laporan Monev</Link> untuk melihat:
          </p>
          <ul className="ml-4 list-disc space-y-1 text-sm text-slate-600">
            <li><strong>Grafik Batang</strong> — Perbandingan visual Target vs Capaian per indikator</li>
            <li><strong>Tabel Rincian</strong> — Detail lengkap semua indikator</li>
            <li><strong>Filter Periode</strong> — Pilih periode dari dropdown</li>
            <li><strong>Export CSV</strong> — Download data ke file CSV (bisa dibuka di Excel)</li>
          </ul>
        </Section>

        {/* ===== 7. BERITA ===== */}
        <Section id="berita" icon={Newspaper} title="Berita & Pengumuman">
          <p className="text-sm text-slate-600">
            Halaman ini menampilkan daftar berita dan pengumuman dari LPM. Klik kartu berita untuk membaca isi lengkap.
          </p>
          {role === "ADMIN" && (
            <>
              <InfoBox variant="warning" title="Hak Akses">
                Hanya <strong>Admin</strong> yang dapat membuat berita atau pengumuman baru.
              </InfoBox>
              <p className="text-sm text-slate-600">
                <strong>Membuat Berita:</strong> Klik &quot;Buat Baru&quot;, isi judul, pilih kategori (Berita / Pengumuman), tulis isi konten, lalu klik &quot;Publikasi&quot;.
              </p>
            </>
          )}
        </Section>

        {/* ===== 8. PENGGUNA ===== */}
        {role === "ADMIN" && (
          <Section id="pengguna" icon={Users} title="Manajemen Pengguna">
            <InfoBox variant="danger" title="Khusus Admin">
              Seluruh fitur pada halaman ini hanya tersedia untuk role <strong>Admin</strong>. Menu ini tidak muncul di sidebar untuk role lain.
            </InfoBox>

            <h3 className="mb-2 text-base font-semibold text-slate-800">
              <Plus size={16} className="mr-1 inline" /> Tambah Pengguna Baru
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2 text-center">Wajib</th>
                    <th className="px-3 py-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <FieldRow name="Nama Lengkap" required desc='Nama beserta gelar. Contoh: "Dr. Ahmad, M.Kes"' />
                  <FieldRow name="Email" required desc="Email unik, contoh: nama@stikesdk.ac.id" />
                  <FieldRow name="Password Awal" required desc="Minimal 6 karakter. Informasikan ke pengguna baru." />
                  <FieldRow name="Role" required desc="Administrator, Auditor, Dosen/Staff, atau Pimpinan" />
                  <FieldRow name="Prodi" desc='Pilih prodi jika relevan, atau "Tidak ada"' />
                </tbody>
              </table>
            </div>

            <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
              <Trash2 size={16} className="mr-1 inline text-red-500" /> Hapus Pengguna
            </h3>
            <ul className="ml-4 list-disc space-y-1 text-sm text-slate-600">
              <li>Klik ikon hapus (🗑️) pada baris pengguna</li>
              <li>Penghapusan bersifat <strong>permanen</strong></li>
              <li>Anda <strong>tidak bisa</strong> menghapus akun Anda sendiri</li>
            </ul>
          </Section>
        )}

        {/* ===== 9. PROFIL ===== */}
        <Section id="profil" icon={UserCircle} title="Profil Pengguna">
          <p className="text-sm text-slate-600">
            Akses halaman profil melalui klik nama Anda di navbar atas, atau navigasi ke <Link href="/profil" className="font-medium text-blue-600 underline">halaman Profil</Link>.
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-slate-800">Edit Data Diri</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Field</th>
                  <th className="px-3 py-2 text-center">Bisa Diedit?</th>
                  <th className="px-3 py-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border-b border-slate-100 px-3 py-2 font-medium">Nama</td><td className="border-b border-slate-100 px-3 py-2 text-center text-green-600">✅ Ya</td><td className="border-b border-slate-100 px-3 py-2 text-slate-600">Nama lengkap Anda</td></tr>
                <tr><td className="border-b border-slate-100 px-3 py-2 font-medium">Email</td><td className="border-b border-slate-100 px-3 py-2 text-center text-red-500">❌ Tidak</td><td className="border-b border-slate-100 px-3 py-2 text-slate-600">Hubungi Admin untuk mengubah</td></tr>
                <tr><td className="border-b border-slate-100 px-3 py-2 font-medium">Role</td><td className="border-b border-slate-100 px-3 py-2 text-center text-red-500">❌ Tidak</td><td className="border-b border-slate-100 px-3 py-2 text-slate-600">Ditentukan oleh Admin</td></tr>
                <tr><td className="border-b border-slate-100 px-3 py-2 font-medium">Prodi</td><td className="border-b border-slate-100 px-3 py-2 text-center text-green-600">✅ Ya</td><td className="border-b border-slate-100 px-3 py-2 text-slate-600">Pilih dari daftar program studi</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="mb-2 mt-6 text-base font-semibold text-slate-800">
            <Lock size={16} className="mr-1 inline" /> Ganti Password
          </h3>
          <Card>
            <CardContent className="divide-y divide-slate-100 p-0">
              <Step n={1}>Masukkan <strong>Password Lama</strong> (password saat ini)</Step>
              <Step n={2}>Masukkan <strong>Password Baru</strong> (minimal 6 karakter)</Step>
              <Step n={3}>Klik <strong>&quot;Ubah Password&quot;</strong></Step>
            </CardContent>
          </Card>
          <InfoBox variant="warning" title="Tips Keamanan Password">
            Gunakan kombinasi huruf besar, kecil, angka, dan simbol. Ganti password secara berkala. Jangan bagikan password Anda.
          </InfoBox>
        </Section>

        {/* ===== 10. FAQ ===== */}
        <Section id="faq" icon={HelpCircle} title="FAQ & Troubleshooting">
          <div className="space-y-3">
            {[
              {
                q: 'Saya tidak bisa login, muncul "Email atau password salah"',
                a: "Pastikan email dan password diketik dengan benar (perhatikan huruf besar/kecil). Jika tetap gagal, hubungi Administrator untuk mereset password.",
              },
              {
                q: "Saya tidak melihat tombol Upload di halaman Dokumen",
                a: "Tombol Upload hanya tersedia untuk Admin, Auditor, dan Dosen. Jika Anda login sebagai Pimpinan, Anda hanya memiliki akses baca.",
              },
              {
                q: 'Menu "Manajemen Pengguna" tidak muncul di sidebar',
                a: "Menu ini hanya tampil untuk pengguna dengan role Admin. Ini adalah batasan hak akses yang disengaja.",
              },
              {
                q: 'Tombol "Selesaikan Sesi" tidak bisa diklik',
                a: "Sesi audit hanya dapat diselesaikan jika seluruh temuan sudah berstatus CLOSED. Pastikan semua temuan telah diverifikasi.",
              },
              {
                q: "Bagaimana cara melihat laporan Monev dalam bentuk grafik?",
                a: 'Buka halaman Monitoring & Evaluasi, lalu klik "Lihat Laporan". Anda bisa melihat grafik batang dan export data ke CSV.',
              },
              {
                q: "Format file apa saja yang bisa diupload?",
                a: "PDF, DOC/DOCX (Word), XLS/XLSX (Excel), dan PPT/PPTX (PowerPoint). Ukuran maksimal sekitar 10MB per file.",
              },
              {
                q: "Apa yang terjadi jika dokumen dihapus?",
                a: 'Penghapusan bersifat soft delete — dokumen ditandai sebagai "dihapus" dan tidak muncul di daftar, tapi masih tersimpan di database.',
              },
              {
                q: "Saya ingin mengubah email akun saya",
                a: "Email tidak bisa diubah secara mandiri. Hubungi Administrator untuk membuat akun baru dengan email yang diinginkan.",
              },
            ].map(({ q, a }) => (
              <Card key={q}>
                <CardContent className="p-4">
                  <p className="mb-1.5 text-sm font-semibold text-slate-900">
                    ❓ {q}
                  </p>
                  <p className="text-sm text-slate-600">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">📞 Kontak Bantuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                      <th className="pb-2 pr-4">Jenis Bantuan</th>
                      <th className="pb-2">Hubungi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">Reset password / kelola akun</td>
                      <td className="py-2 text-slate-500">Administrator Sistem</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">Masalah teknis / bug</td>
                      <td className="py-2 text-slate-500">Tim Pengembang SI-LPM</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-slate-700">Pertanyaan terkait mutu</td>
                      <td className="py-2 text-slate-500">Lembaga Penjaminan Mutu (LPM)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <p className="font-medium">Panduan Penggunaan SI-LPM — Versi 1.0</p>
        <p className="mt-1">© 2026 Lembaga Penjaminan Mutu — Stikes Datu Kamanre</p>
      </div>
    </div>
  );
}
