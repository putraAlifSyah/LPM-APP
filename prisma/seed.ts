import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Bersihkan data lama (urutan penting karena relasi)
  await prisma.temuan.deleteMany();
  await prisma.auditSesi.deleteMany();
  await prisma.capaianMonev.deleteMany();
  await prisma.indikatorMonev.deleteMany();
  await prisma.riwayatDokumen.deleteMany();
  await prisma.dokumen.deleteMany();
  await prisma.berita.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("password123", 10);

  // === Users ===
  const admin = await prisma.user.create({
    data: {
      nama: "Administrator LPM",
      email: "admin@stikesdk.ac.id",
      password: pw,
      role: "ADMIN",
      prodi: null,
    },
  });

  const auditor = await prisma.user.create({
    data: {
      nama: "Dr. Hasanuddin, M.Kes",
      email: "auditor@stikesdk.ac.id",
      password: pw,
      role: "AUDITOR",
      prodi: null,
    },
  });

  const dosen = await prisma.user.create({
    data: {
      nama: "Ns. Andi Maryam, S.Kep",
      email: "dosen@stikesdk.ac.id",
      password: pw,
      role: "DOSEN",
      prodi: "S1 Keperawatan",
    },
  });

  const pimpinan = await prisma.user.create({
    data: {
      nama: "Dr. Muh. Yusuf, M.M",
      email: "pimpinan@stikesdk.ac.id",
      password: pw,
      role: "PIMPINAN",
      prodi: null,
    },
  });

  console.log("✓ 4 users dibuat");

  // === Dokumen ===
  const dokumenData = [
    {
      judul: "Kebijakan SPMI 2024",
      deskripsi: "Dokumen kebijakan Sistem Penjaminan Mutu Internal",
      kategori: "SPMI",
      standar: "BAN-PT C.1.1",
      tags: "spmi,kebijakan,mutu,2024",
      prodi: null,
    },
    {
      judul: "Kurikulum S1 Keperawatan OBE",
      deskripsi: "Kurikulum berbasis Outcome Based Education",
      kategori: "Kurikulum",
      standar: "BAN-PT C.6.2",
      tags: "kurikulum,obe,keperawatan",
      prodi: "S1 Keperawatan",
    },
    {
      judul: "Visi Misi Tujuan Sasaran Stikes",
      deskripsi: "Dokumen VMTS institusi periode 2024-2029",
      kategori: "VMTS",
      standar: "BAN-PT C.1.2",
      tags: "vmts,visi,misi",
      prodi: null,
    },
    {
      judul: "Rencana Strategis 2024-2029",
      deskripsi: "Renstra pengembangan institusi",
      kategori: "Renstra",
      standar: "BAN-PT C.2.1",
      tags: "renstra,strategi",
      prodi: null,
    },
    {
      judul: "Laporan Kinerja Prodi Kebidanan 2023",
      deskripsi: "Laporan capaian kinerja tahunan",
      kategori: "Laporan",
      standar: "BAN-PT C.3.4",
      tags: "laporan,kinerja,kebidanan",
      prodi: "D3 Kebidanan",
    },
    {
      judul: "Formulir Monitoring Pembelajaran",
      deskripsi: "Template form monitoring perkuliahan",
      kategori: "Formulir",
      standar: null,
      tags: "formulir,monitoring,pembelajaran",
      prodi: null,
    },
  ];

  for (const d of dokumenData) {
    await prisma.dokumen.create({
      data: {
        ...d,
        namaFile: `${d.judul.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        pathFile: "/uploads/contoh.pdf",
        ukuranFile: Math.floor(Math.random() * 2_000_000) + 100_000,
        tipeFile: "application/pdf",
        userId: dosen.id,
      },
    });
  }
  console.log("✓ 6 dokumen dibuat");

  // === Berita ===
  await prisma.berita.createMany({
    data: [
      {
        judul: "Pelaksanaan Audit Mutu Internal Semester Ganjil 2024",
        isi: "Lembaga Penjaminan Mutu akan melaksanakan Audit Mutu Internal (AMI) pada seluruh program studi mulai tanggal 1 Oktober 2024. Seluruh unit diharapkan menyiapkan dokumen pendukung.",
        kategori: "Pengumuman",
        userId: admin.id,
      },
      {
        judul: "Workshop Penyusunan Dokumen Akreditasi",
        isi: "LPM mengadakan workshop penyusunan dokumen akreditasi BAN-PT bagi seluruh dosen dan staff. Kegiatan akan dilaksanakan selama 3 hari di aula kampus.",
        kategori: "Berita",
        userId: admin.id,
      },
      {
        judul: "Hasil Survey Kepuasan Mahasiswa 2024",
        isi: "Survey kepuasan mahasiswa terhadap layanan akademik tahun 2024 menunjukkan tingkat kepuasan 87%, meningkat dari tahun sebelumnya.",
        kategori: "Berita",
        userId: admin.id,
      },
    ],
  });
  console.log("✓ 3 berita dibuat");

  // === Indikator Monev + Capaian ===
  const indikatorData = [
    { nama: "Rata-rata IPK Lulusan", standar: "C.6.1", satuan: "skala", targetNilai: 3.25 },
    { nama: "Masa Studi Tepat Waktu", standar: "C.3.2", satuan: "%", targetNilai: 80 },
    { nama: "Kepuasan Mahasiswa", standar: "C.5.3", satuan: "%", targetNilai: 85 },
    { nama: "Dosen Bersertifikat", standar: "C.4.1", satuan: "%", targetNilai: 75 },
    { nama: "Publikasi Penelitian Dosen", standar: "C.7.2", satuan: "judul", targetNilai: 20 },
  ];

  const capaianGanjil = [3.31, 78, 87, 68, 24];
  for (let i = 0; i < indikatorData.length; i++) {
    const ind = await prisma.indikatorMonev.create({
      data: { ...indikatorData[i], periode: "2024-Ganjil" },
    });
    await prisma.capaianMonev.create({
      data: {
        indikatorId: ind.id,
        nilaiCapaian: capaianGanjil[i],
        periode: "2024-Ganjil",
        keterangan: "Data capaian semester ganjil",
        unit: "Institusi",
      },
    });
  }
  console.log("✓ 5 indikator + capaian monev dibuat");

  // === Audit Sesi + Temuan ===
  const sesi1 = await prisma.auditSesi.create({
    data: {
      nama: "AMI Prodi S1 Keperawatan 2024",
      tanggalMulai: new Date("2024-10-01"),
      tanggalSelesai: new Date("2024-10-05"),
      auditorId: auditor.id,
      unitAudit: "Prodi S1 Keperawatan",
      status: "BERLANGSUNG",
    },
  });

  await prisma.temuan.createMany({
    data: [
      {
        sesiId: sesi1.id,
        deskripsi: "Dokumen RPS belum lengkap untuk 3 mata kuliah semester genap",
        kategori: "Ketidaksesuaian Minor",
        standar: "C.6.4",
        tindakLanjut: "Prodi akan melengkapi RPS sebelum akhir Oktober",
        statusTemuan: "PROSES",
        deadline: new Date("2024-10-31"),
      },
      {
        sesiId: sesi1.id,
        deskripsi: "Rasio dosen-mahasiswa belum memenuhi standar ideal",
        kategori: "Major",
        standar: "C.4.2",
        statusTemuan: "OPEN",
        deadline: new Date("2024-12-31"),
      },
      {
        sesiId: sesi1.id,
        deskripsi: "Ruang baca perpustakaan perlu penataan ulang",
        kategori: "Observasi",
        standar: null,
        statusTemuan: "CLOSED",
      },
    ],
  });

  const sesi2 = await prisma.auditSesi.create({
    data: {
      nama: "AMI Prodi D3 Kebidanan 2024",
      tanggalMulai: new Date("2024-11-01"),
      tanggalSelesai: new Date("2024-11-05"),
      auditorId: auditor.id,
      unitAudit: "Prodi D3 Kebidanan",
      status: "RENCANA",
    },
  });
  void sesi2;

  console.log("✓ 2 sesi audit + 3 temuan dibuat");
  console.log("\n✅ Seed selesai!");
  console.log("\n=== Akun Login (password semua: password123) ===");
  console.log("Admin    : admin@stikesdk.ac.id");
  console.log("Auditor  : auditor@stikesdk.ac.id");
  console.log("Dosen    : dosen@stikesdk.ac.id");
  console.log("Pimpinan : pimpinan@stikesdk.ac.id");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
