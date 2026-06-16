import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABEL } from "@/lib/rbac";

export default async function PanduanPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";
  const isAuditor = user.role === "AUDITOR";
  const isDosen = user.role === "DOSEN";
  const isPimpinan = user.role === "PIMPINAN";

  const canUpload = ["ADMIN", "AUDITOR", "DOSEN"].includes(user.role);
  const canCreateAudit = ["ADMIN", "AUDITOR"].includes(user.role);
  const canInputMonev = ["ADMIN", "DOSEN"].includes(user.role);
  const canDeleteDokumen = isAdmin;
  const canManageUser = isAdmin;
  const canCreateBerita = isAdmin;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panduan Penggunaan"
        description={`Panduan penggunaan sistem khusus untuk akses ${ROLE_LABEL[user.role]}.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>1. Dashboard & Navigasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Halaman <strong>Dashboard</strong> memberikan ringkasan seluruh aktivitas penjaminan mutu di Stikes Datu Kamanre. Anda dapat melihat statistik dokumen, temuan audit yang masih aktif, rata-rata capaian monev, serta pengumuman terbaru.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Gunakan menu di sebelah kiri (Sidebar) untuk berpindah antar halaman.</li>
            <li>Klik nama Anda di sudut kanan atas untuk mengakses profil atau keluar (logout) dari sistem.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Manajemen Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Menu <strong>Dokumen</strong> digunakan untuk mengelola seluruh dokumen mutu seperti SPMI, Kurikulum, VMTS, dan lainnya.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Melihat & Mengunduh:</strong> Anda dapat melihat daftar dokumen, mencari dokumen, memfilter berdasarkan kategori/standar, dan mengunduh file dokumen tersebut.</li>
            {canUpload && (
              <li><strong>Upload Dokumen Baru:</strong> Klik tombol "Upload" untuk menambah dokumen baru. Anda perlu mengisi judul, kategori, standar BAN-PT, dan memilih file yang akan diunggah.</li>
            )}
            {canUpload && (
              <li><strong>Memperbarui Versi:</strong> Buka detail dokumen dan klik "Versi Baru" untuk memperbarui file tanpa menghapus versi lama (otomatis masuk riwayat).</li>
            )}
            {canDeleteDokumen && (
              <li><strong>Menghapus Dokumen:</strong> Buka detail dokumen dan klik "Hapus". Dokumen akan di-soft delete.</li>
            )}
            {isPimpinan && (
              <li><em>Sebagai Pimpinan, Anda memiliki akses penuh untuk membaca dan mengunduh seluruh dokumen yang ada di sistem, namun tidak dapat menambah atau mengubah dokumen.</em></li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Audit Mutu Internal (AMI)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Menu <strong>Audit Internal</strong> digunakan untuk memantau pelaksanaan audit mutu di berbagai program studi dan unit.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Melihat Sesi Audit:</strong> Anda dapat melihat daftar sesi audit, status (RENCANA, BERLANGSUNG, SELESAI), dan rincian temuan pada tiap sesi.</li>
            {canCreateAudit && (
              <li><strong>Membuat Sesi Audit:</strong> Klik "Buat Sesi Audit" untuk menjadwalkan audit baru, tentukan unit yang diaudit, tanggal pelaksanaan, dan auditor yang bertugas.</li>
            )}
            {canCreateAudit && (
              <li><strong>Mencatat Temuan:</strong> Saat sesi berstatus BERLANGSUNG, klik "Tambah Temuan" untuk mencatat observasi, ketidaksesuaian minor, atau major.</li>
            )}
            {canCreateAudit && (
              <li><strong>Verifikasi & Tutup Temuan:</strong> Anda dapat mereview tindak lanjut dari prodi/unit dan mengubah status temuan dari OPEN ke PROSES atau CLOSED. Sesi audit hanya bisa diselesaikan jika semua temuan telah CLOSED.</li>
            )}
            {!canCreateAudit && (
              <li><strong>Tindak Lanjut Temuan:</strong> Buka sesi audit yang ditujukan untuk unit Anda, klik "Isi Tindak Lanjut" pada temuan terkait, dan laporkan progres perbaikan agar dapat diverifikasi oleh auditor.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Monitoring & Evaluasi (Monev)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Menu <strong>Monitoring & Evaluasi</strong> berfungsi untuk memantau pencapaian indikator kinerja mutu.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Laporan & Grafik:</strong> Anda dapat melihat Laporan Monev yang menyajikan grafik persentase capaian terhadap target. Tersedia juga fitur "Export CSV" untuk mengunduh data.</li>
            {canInputMonev && (
              <li><strong>Tambah Indikator:</strong> Klik "Indikator Baru" untuk mendefinisikan indikator kinerja, standar terkait, serta target nilai per periode.</li>
            )}
            {canInputMonev && (
              <li><strong>Input Capaian:</strong> Klik "Input" pada baris indikator untuk memasukkan nilai capaian aktual dari program studi atau institusi Anda.</li>
            )}
            {isPimpinan && (
              <li><em>Sebagai Pimpinan, Anda dapat memantau capaian kinerja melalui fitur Laporan Monev secara real-time untuk mendukung pengambilan keputusan.</em></li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Berita & Pengumuman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Menu <strong>Berita & Pengumuman</strong> menjadi pusat informasi resmi dari Lembaga Penjaminan Mutu.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Membaca Berita:</strong> Anda dapat melihat seluruh pengumuman penting atau berita terkait kegiatan mutu di halaman ini.</li>
            {canCreateBerita && (
              <li><strong>Membuat Publikasi:</strong> Klik "Buat Baru" untuk mempublikasikan pengumuman atau berita ke seluruh civitas akademika.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {canManageUser && (
        <Card>
          <CardHeader>
            <CardTitle>6. Manajemen Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              Sebagai Administrator, Anda memiliki akses khusus ke menu <strong>Manajemen Pengguna</strong>.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Tambah Pengguna:</strong> Klik "Tambah Pengguna" untuk membuat akun baru. Tentukan peran (Admin, Auditor, Dosen, Pimpinan) dan unit kerja (Prodi) mereka.</li>
              <li><strong>Hapus Pengguna:</strong> Anda dapat menghapus akun pengguna yang sudah tidak aktif (kecuali akun Anda sendiri).</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{canManageUser ? "7. Profil Pengguna" : "6. Profil Pengguna"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Menu <strong>Profil</strong> digunakan untuk mengelola data akun pribadi Anda.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Edit Profil:</strong> Anda dapat memperbarui nama lengkap atau program studi asal.</li>
            <li><strong>Ubah Kata Sandi:</strong> Untuk keamanan, Anda disarankan mengganti kata sandi secara berkala dengan mengisi kolom kata sandi lama dan baru.</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
