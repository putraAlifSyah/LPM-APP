-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'DOSEN',
    "prodi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Dokumen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" TEXT NOT NULL,
    "standar" TEXT,
    "tags" TEXT,
    "namaFile" TEXT NOT NULL,
    "pathFile" TEXT NOT NULL,
    "ukuranFile" INTEGER NOT NULL,
    "tipeFile" TEXT NOT NULL,
    "versi" INTEGER NOT NULL DEFAULT 1,
    "prodi" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dokumen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiwayatDokumen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dokumenId" TEXT NOT NULL,
    "versi" INTEGER NOT NULL,
    "pathFile" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiwayatDokumen_dokumenId_fkey" FOREIGN KEY ("dokumenId") REFERENCES "Dokumen" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Berita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IndikatorMonev" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "standar" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "targetNilai" REAL NOT NULL,
    "periode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CapaianMonev" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "indikatorId" TEXT NOT NULL,
    "nilaiCapaian" REAL NOT NULL,
    "keterangan" TEXT,
    "periode" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CapaianMonev_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorMonev" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditSesi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "tanggalMulai" DATETIME NOT NULL,
    "tanggalSelesai" DATETIME NOT NULL,
    "auditorId" TEXT NOT NULL,
    "unitAudit" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RENCANA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditSesi_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Temuan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sesiId" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "standar" TEXT,
    "tindakLanjut" TEXT,
    "statusTemuan" TEXT NOT NULL DEFAULT 'OPEN',
    "deadline" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Temuan_sesiId_fkey" FOREIGN KEY ("sesiId") REFERENCES "AuditSesi" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
