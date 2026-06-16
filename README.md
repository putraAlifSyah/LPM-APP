<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/AI_Assistant-Multi_Provider-8A2BE2?style=for-the-badge&logo=openai" alt="AI Chatbot" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

# 🛡️ LPM-APP

**Sistem Informasi Lembaga Penjaminan Mutu — Stikes Datu Kamanre**

Aplikasi web full-stack untuk mengelola seluruh proses penjaminan mutu internal (SPMI) institusi pendidikan tinggi kesehatan. Dibangun dengan arsitektur modern menggunakan Next.js 16 App Router, Prisma ORM, SQLite, serta dilengkapi dengan **Asisten AI Chatbot cerdas multi-provider** untuk membantu penggunaan aplikasi.

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Proyek](#-arsitektur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Akun Demo](#-akun-demo)
- [Struktur Database](#-struktur-database)
- [Hak Akses (RBAC)](#-hak-akses-rbac)
- [API Reference](#-api-reference)
- [Struktur Folder](#-struktur-folder)
- [Komponen UI](#-komponen-ui)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

**LPM-APP** adalah Sistem Informasi Lembaga Penjaminan Mutu yang dirancang khusus untuk **Stikes Datu Kamanre**. Aplikasi ini mendukung siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) sesuai standar **BAN-PT** dan **SPMI**.

### Latar Belakang

Lembaga Penjaminan Mutu (LPM) memiliki peran krusial dalam menjaga dan meningkatkan mutu pendidikan tinggi. Aplikasi ini hadir untuk:

- **Digitalisasi** proses manajemen dokumen mutu yang sebelumnya manual
- **Sentralisasi** data audit, monitoring, dan evaluasi dalam satu platform
- **Transparansi** capaian kinerja mutu kepada seluruh stakeholder
- **Efisiensi** pelaporan dan tracking tindak lanjut temuan audit

---

## ✨ Fitur Utama

### 📊 Dashboard
- Ringkasan statistik dokumen, audit, dan capaian Monev
- Distribusi dokumen per kategori dengan progress bar visual
- Daftar dokumen terbaru dan pengumuman aktif
- Status audit terakhir beserta timeline

### 📄 Manajemen Dokumen
- Upload, unduh, dan kelola dokumen mutu (PDF, DOCX, dll.)
- Kategorisasi dokumen: SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir
- Mapping dokumen ke standar BAN-PT (C.1.1, C.6.2, dst.)
- Sistem tag dan pencarian full-text
- Versioning dokumen dengan riwayat perubahan
- Soft delete untuk keamanan data
- Filter berdasarkan kategori, prodi, dan standar

### 🔍 Audit Mutu Internal (AMI)
- Perencanaan dan penjadwalan sesi audit
- Pencatatan temuan audit (Observasi, Ketidaksesuaian Minor, Major)
- Tracking status temuan: Open → Proses → Closed
- Mapping temuan ke standar BAN-PT
- Penetapan deadline dan tindak lanjut
- Riwayat audit per unit/prodi

### 📈 Monitoring & Evaluasi (Monev)
- Input indikator kinerja dengan target terukur
- Pencatatan capaian per periode semester
- Perhitungan persentase capaian vs target otomatis
- Laporan Monev dengan visualisasi chart (Recharts)
- Filter berdasarkan periode dan unit

### 📰 Berita & Pengumuman
- Publikasi berita dan pengumuman LPM
- Kategorisasi: Berita / Pengumuman
- Tampilan timeline dengan format tanggal Indonesia

### 👥 Manajemen Pengguna
- CRUD pengguna dengan Role-Based Access Control
- 4 role: Admin, Auditor, Dosen, Pimpinan
- Hashing password dengan bcrypt
- Profil pengguna dengan kemampuan edit mandiri

### 🤖 Asisten AI (Chatbot)
- **Chatbot mengambang** di pojok kanan bawah untuk semua pengguna yang login
- **Multi-provider**: OpenAI, Anthropic (Claude), Google Gemini, dan endpoint OpenAI-compatible (OpenRouter, Groq, LM Studio, dll.)
- **Model bebas diketik** — pilih dari saran atau tulis nama model sendiri
- **Sadar konteks aplikasi** — AI memahami panduan fitur **dan** membaca data live (jumlah & daftar dokumen, sesi audit, capaian Monev) sesuai hak akses pengguna
- **Konfigurasi khusus Admin** di halaman `Pengaturan AI` — pilih provider, model, dan API key
- **API key dienkripsi** (AES-256-GCM) saat disimpan, tidak pernah ditampilkan kembali ke browser
- **Tes koneksi** ke provider sebelum mengaktifkan
- Balasan AI dirender sebagai Markdown (tebal, bullet, kode) langsung di dalam chat

### 🔐 Autentikasi & Keamanan
- JWT-based authentication (jose library)
- HTTP-only secure cookies (7 hari masa aktif)
- Middleware proteksi route otomatis
- Role-based permission pada setiap aksi
- Password hashing dengan bcrypt (salt rounds: 10)
- Enkripsi API key AI dengan AES-256-GCM (Node crypto)

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.2.9 |
| **UI Library** | [React](https://react.dev/) | 19.2.4 |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **ORM** | [Prisma](https://www.prisma.io/) | 6.19.3 |
| **Database** | [SQLite](https://www.sqlite.org/) | - |
| **Auth** | [jose](https://github.com/panva/jose) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 6.x / 3.x |
| **Icons** | [Lucide React](https://lucide.dev/) | 1.18.0 |
| **Charts** | [Recharts](https://recharts.org/) | 3.8.1 |
| **AI Chatbot** | Multi-provider (OpenAI / Anthropic / Gemini / OpenAI-compatible) via REST | - |
| **Enkripsi** | Node.js `crypto` (AES-256-GCM) untuk API key AI | - |
| **Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | - |

---

## 🏗️ Arsitektur Proyek

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Client                     │
│                   (React 19 + Next.js)                  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / Fetch
┌─────────────────────▼───────────────────────────────────┐
│              Next.js 16 App Router                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware (JWT Verification + Route Protection)│   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │              Server Components (RSC)             │   │
│  │  ┌────────┐ ┌────────┐ ┌─────┐ ┌──────────┐     │   │
│  │  │Dashboard│ │Dokumen │ │Audit│ │  Monev   │     │   │
│  │  └────────┘ └────────┘ └─────┘ └──────────┘     │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │              API Routes (Route Handlers)         │   │
│  │  /api/auth  /api/dokumen  /api/audit  /api/monev │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │           Prisma ORM (Data Access Layer)         │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  SQLite Database                        │
│                 (prisma/dev.db)                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Prasyarat

Pastikan sistem Anda telah terinstal:

| Software | Versi Minimum | Cek Versi |
|----------|--------------|-----------|
| **Node.js** | 18.17+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Git** | 2.x | `git -v` |

> **💡 Tip:** Disarankan menggunakan Node.js **v20 LTS** atau lebih baru untuk performa terbaik.

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/putraAlifSyah/LPM-APP.git
cd LPM-APP
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root proyek:

```env
# Database (SQLite - default untuk development)
DATABASE_URL="file:./dev.db"

# Secret key untuk JWT (GANTI di produksi!)
AUTH_SECRET="ganti-dengan-secret-key-yang-aman-dan-panjang"
```

> ⚠️ **Penting:** Pastikan `AUTH_SECRET` diganti dengan string yang aman dan unik di lingkungan produksi. Gunakan minimal 32 karakter random.

### 4. Setup Database

```bash
# Jalankan migrasi database
npx prisma migrate dev

# Isi data awal (seed)
npm run seed
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## ▶️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi berjalan di: **http://localhost:3000**

### Production Build

```bash
# Build
npm run build

# Start server produksi
npm start
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Prisma Studio berjalan di: **http://localhost:5555**

---

## 🔑 Akun Demo

Setelah menjalankan seed, tersedia 4 akun demo:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@stikesdk.ac.id` | `password123` |
| **Auditor** | `auditor@stikesdk.ac.id` | `password123` |
| **Dosen** | `dosen@stikesdk.ac.id` | `password123` |
| **Pimpinan** | `pimpinan@stikesdk.ac.id` | `password123` |

> ℹ️ Halaman login menyediakan tombol quick-fill untuk memudahkan testing.

---

## 🤖 Mengaktifkan Asisten AI

Chatbot AI **nonaktif secara default**. Untuk mengaktifkannya:

1. Login sebagai **Admin**
2. Buka menu **Pengaturan AI** di sidebar
3. Pilih **Provider** (OpenAI / Anthropic / Gemini / Custom OpenAI-compatible)
4. Isi **Model** (pilih saran atau ketik sendiri, mis. `gpt-4o-mini`, `gemini-2.5-flash`, `claude-3-5-haiku`)
5. Untuk provider **Custom**, isi juga **Base URL** (mis. `https://openrouter.ai/api/v1`)
6. Tempel **API key** dari provider yang dipilih
7. Klik **Tes Koneksi** untuk memastikan konfigurasi benar
8. Aktifkan **toggle** dan klik **Simpan**

Setelah aktif, chatbot muncul di pojok kanan bawah untuk **semua pengguna** yang login. AI dapat menjawab pertanyaan seputar cara penggunaan fitur maupun data yang ada di aplikasi (dokumen, audit, Monev) sesuai hak akses masing-masing pengguna.

> 🔒 **Keamanan:** API key disimpan terenkripsi (AES-256-GCM) di database dan tidak pernah dikirim kembali ke browser dalam bentuk asli.

---

## 🗄️ Struktur Database

### Entity Relationship Diagram

```
┌──────────┐     ┌────────────┐     ┌────────────────┐
│   User   │────<│  Dokumen   │────<│ RiwayatDokumen │
│          │     └────────────┘     └────────────────┘
│  id      │
│  nama    │     ┌────────────┐
│  email   │────<│   Berita   │
│  password│     └────────────┘
│  role    │
│  prodi   │     ┌────────────┐     ┌────────────┐
│          │────<│ AuditSesi  │────<│  Temuan    │
└──────────┘     └────────────┘     └────────────┘

┌────────────────┐     ┌──────────────┐
│ IndikatorMonev │────<│ CapaianMonev │
└────────────────┘     └──────────────┘
```

### Model Detail

#### `User` — Pengguna sistem
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Nama lengkap |
| `email` | String | Email unik |
| `password` | String | Hash bcrypt |
| `role` | Enum | ADMIN, AUDITOR, DOSEN, PIMPINAN |
| `prodi` | String? | Program studi (opsional) |
| `createdAt` | DateTime | Waktu pembuatan |

#### `Dokumen` — Dokumen mutu
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `judul` | String | Judul dokumen |
| `deskripsi` | String? | Deskripsi opsional |
| `kategori` | String | SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir |
| `standar` | String? | Mapping standar BAN-PT |
| `tags` | String? | Tag (comma-separated) |
| `namaFile` | String | Nama file asli |
| `pathFile` | String | Path penyimpanan |
| `ukuranFile` | Int | Ukuran dalam bytes |
| `tipeFile` | String | MIME type |
| `versi` | Int | Nomor versi (default: 1) |
| `prodi` | String? | Prodi terkait |
| `deleted` | Boolean | Soft delete flag |
| `userId` | String | FK ke User |

#### `RiwayatDokumen` — Riwayat versi dokumen
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `dokumenId` | String | FK ke Dokumen |
| `versi` | Int | Nomor versi |
| `pathFile` | String | Path file versi ini |
| `namaFile` | String | Nama file versi ini |
| `catatan` | String? | Catatan perubahan |

#### `Berita` — Berita & Pengumuman
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `judul` | String | Judul berita |
| `isi` | String | Konten berita |
| `kategori` | String | "Berita" atau "Pengumuman" |
| `userId` | String | FK ke User (penulis) |

#### `IndikatorMonev` — Indikator Monitoring & Evaluasi
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Nama indikator |
| `standar` | String | Standar BAN-PT |
| `satuan` | String | Satuan pengukuran |
| `targetNilai` | Float | Nilai target |
| `periode` | String | Periode (e.g. "2024-Ganjil") |

#### `CapaianMonev` — Capaian per indikator
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `indikatorId` | String | FK ke IndikatorMonev |
| `nilaiCapaian` | Float | Nilai capaian aktual |
| `keterangan` | String? | Keterangan tambahan |
| `periode` | String | Periode capaian |
| `unit` | String? | Unit yang dilaporkan |

#### `AuditSesi` — Sesi Audit Mutu Internal
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Nama sesi audit |
| `tanggalMulai` | DateTime | Tanggal mulai |
| `tanggalSelesai` | DateTime | Tanggal selesai |
| `auditorId` | String | FK ke User (auditor) |
| `unitAudit` | String | Unit yang diaudit |
| `status` | Enum | RENCANA, BERLANGSUNG, SELESAI |

#### `Temuan` — Temuan audit
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `sesiId` | String | FK ke AuditSesi |
| `deskripsi` | String | Deskripsi temuan |
| `kategori` | String | Observasi, Ketidaksesuaian Minor, Major |
| `standar` | String? | Standar BAN-PT terkait |
| `tindakLanjut` | String? | Rencana tindak lanjut |
| `statusTemuan` | Enum | OPEN, PROSES, CLOSED |
| `deadline` | DateTime? | Tenggat waktu |

---

## 🔐 Hak Akses (RBAC)

Sistem menggunakan **Role-Based Access Control** dengan 4 role:

| Aksi | Admin | Auditor | Dosen | Pimpinan |
|------|:-----:|:-------:|:-----:|:--------:|
| Upload Dokumen | ✅ | ✅ | ✅ | ❌ |
| Hapus Dokumen | ✅ | ❌ | ❌ | ❌ |
| Input Monev | ✅ | ❌ | ✅ | ❌ |
| Buat Audit | ✅ | ✅ | ❌ | ❌ |
| Input Temuan | ✅ | ✅ | ❌ | ❌ |
| Kelola User | ✅ | ❌ | ❌ | ❌ |
| Buat Berita | ✅ | ❌ | ❌ | ❌ |
| Lihat Laporan | ✅ | ✅ | ✅ | ✅ |
| Konfigurasi AI | ✅ | ❌ | ❌ | ❌ |
| Gunakan Chatbot AI | ✅ | ✅ | ✅ | ✅ |

### Penjelasan Role

- **Admin** — Akses penuh ke seluruh fitur sistem, termasuk manajemen pengguna
- **Auditor** — Fokus pada kegiatan audit: membuat sesi audit, mencatat temuan
- **Dosen / Staff** — Upload dokumen mutu dan input data Monev
- **Pimpinan** — Akses read-only untuk melihat laporan dan dashboard

---

## 📡 API Reference

### Authentication

#### `POST /api/auth/login`
Login dan mendapatkan session cookie.

**Request Body:**
```json
{
  "email": "admin@stikesdk.ac.id",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "clxxx...",
    "nama": "Administrator LPM",
    "email": "admin@stikesdk.ac.id",
    "role": "ADMIN",
    "prodi": null
  }
}
```

**Response (401):**
```json
{
  "error": "Email atau password salah"
}
```

#### `POST /api/auth/logout`
Logout dan menghapus session cookie.

---

### Dokumen

#### `GET /api/dokumen`
Mengambil daftar dokumen (dengan filter opsional).

**Query Parameters:**
| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `kategori` | string | Filter berdasarkan kategori |
| `prodi` | string | Filter berdasarkan program studi |
| `search` | string | Pencarian berdasarkan judul/tags |

#### `POST /api/dokumen`
Upload dokumen baru (multipart/form-data).

#### `GET /api/dokumen/[id]`
Detail dokumen beserta riwayat versi.

#### `DELETE /api/dokumen/[id]`
Soft delete dokumen (khusus Admin).

---

### Audit

#### `GET /api/audit`
Daftar sesi audit.

#### `POST /api/audit`
Buat sesi audit baru.

#### `GET /api/audit/[id]`
Detail sesi audit beserta temuan.

---

### Temuan

#### `POST /api/temuan`
Tambah temuan ke sesi audit.

#### `PATCH /api/temuan/[id]`
Update status atau detail temuan.

---

### Monitoring & Evaluasi

#### `GET /api/monev`
Daftar indikator Monev beserta capaian.

#### `POST /api/monev`
Tambah indikator Monev baru.

#### `POST /api/monev/capaian`
Input capaian untuk indikator.

---

### Berita

#### `GET /api/berita`
Daftar berita dan pengumuman.

#### `POST /api/berita`
Buat berita/pengumuman baru.

#### `GET /api/berita/[id]`
Detail berita.

---

### Pengguna

#### `GET /api/pengguna`
Daftar pengguna (khusus Admin).

#### `POST /api/pengguna`
Tambah pengguna baru (khusus Admin).

#### `PATCH /api/pengguna/[id]`
Update data pengguna.

#### `DELETE /api/pengguna/[id]`
Hapus pengguna.

---

### Profil

#### `GET /api/profil`
Ambil profil pengguna yang login.

#### `PATCH /api/profil`
Update profil (nama, email, password).

---

### Asisten AI

#### `GET /api/ai/config`
Ambil konfigurasi AI. Pengguna biasa hanya menerima status `enabled`; Admin menerima detail konfigurasi (API key dalam bentuk masked).

#### `PUT /api/ai/config`
Simpan konfigurasi AI — provider, model, base URL, API key (terenkripsi), dan toggle aktif. **Khusus Admin.**

#### `POST /api/ai/test`
Uji koneksi ke provider AI dengan konfigurasi yang dikirim atau yang tersimpan. **Khusus Admin.**

#### `POST /api/ai/chat`
Kirim pesan ke Asisten AI. Server menyusun system prompt (panduan + data live + hak akses pengguna) lalu meneruskan ke provider. Tersedia untuk semua pengguna login (jika AI aktif).

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Bagaimana cara upload dokumen?" }
  ]
}
```

---

## 📁 Struktur Folder

```
lpm/
├── prisma/
│   ├── schema.prisma          # Schema database
│   ├── seed.ts                # Data awal (seed)
│   ├── migrations/            # Migrasi database
│   └── dev.db                 # SQLite database (gitignored)
│
├── public/
│   └── uploads/               # File dokumen yang diupload
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (font, metadata)
│   │   ├── page.tsx           # Redirect ke dashboard
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── login/
│   │   │   └── page.tsx       # Halaman login
│   │   ├── not-found.tsx      # Halaman 404
│   │   ├── global-error.tsx   # Error boundary global
│   │   │
│   │   ├── (app)/             # Route group (authenticated)
│   │   │   ├── layout.tsx     # Layout dengan Sidebar + Navbar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   # Dashboard utama
│   │   │   ├── dokumen/
│   │   │   │   ├── page.tsx   # Daftar dokumen
│   │   │   │   └── [id]/      # Detail dokumen
│   │   │   ├── audit/
│   │   │   │   ├── page.tsx   # Daftar audit
│   │   │   │   ├── buat/      # Form buat audit
│   │   │   │   └── [id]/      # Detail audit + temuan
│   │   │   ├── monev/
│   │   │   │   ├── page.tsx   # Tabel indikator Monev
│   │   │   │   └── laporan/   # Laporan Monev (chart)
│   │   │   ├── berita/
│   │   │   │   ├── page.tsx   # Daftar berita
│   │   │   │   ├── buat/      # Form buat berita
│   │   │   │   └── [id]/      # Detail berita
│   │   │   ├── pengguna/
│   │   │   │   └── page.tsx   # Manajemen pengguna
│   │   │   └── profil/
│   │   │       └── page.tsx   # Profil pengguna
│   │   │
│   │   └── api/               # API Route Handlers
│   │       ├── auth/
│   │       │   ├── login/     # POST login
│   │       │   └── logout/    # POST logout
│   │       ├── dokumen/       # CRUD dokumen
│   │       ├── audit/         # CRUD audit
│   │       ├── temuan/        # CRUD temuan
│   │       ├── monev/         # CRUD monev
│   │       ├── berita/        # CRUD berita
│   │       ├── pengguna/      # CRUD pengguna
│   │       └── profil/        # Profile endpoints
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx    # Sidebar navigasi
│   │   │   ├── navbar.tsx     # Top navbar
│   │   │   └── page-header.tsx # Header halaman
│   │   ├── modules/
│   │   │   ├── audit-detail.tsx
│   │   │   ├── buat-audit-form.tsx
│   │   │   ├── dokumen-detail-actions.tsx
│   │   │   ├── dokumen-list.tsx
│   │   │   ├── monev-laporan.tsx
│   │   │   ├── monev-table.tsx
│   │   │   ├── pengguna-list.tsx
│   │   │   ├── profil-form.tsx
│   │   │   └── upload-dokumen-modal.tsx
│   │   └── ui/
│   │       ├── badge.tsx      # Badge component
│   │       ├── button.tsx     # Button component
│   │       ├── card.tsx       # Card component
│   │       ├── input.tsx      # Input + Label
│   │       ├── modal.tsx      # Modal dialog
│   │       └── table.tsx      # Table component
│   │
│   ├── lib/
│   │   ├── api.ts             # Fetch helper utilities
│   │   ├── auth.ts            # JWT + session management
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── monev.ts           # Monev helper functions
│   │   ├── rbac.ts            # Role-based access control
│   │   └── utils.ts           # Utility functions
│   │
│   └── middleware.ts          # Route protection middleware
│
├── .env                       # Environment variables (gitignored)
├── .gitignore                 # Git ignore rules
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript config
├── postcss.config.mjs         # PostCSS + Tailwind
├── eslint.config.mjs          # ESLint config
└── package.json               # Dependencies & scripts
```

---

## 🧩 Komponen UI

Aplikasi menggunakan komponen UI custom yang konsisten:

### `<Button>`
Tombol dengan variasi: `primary` (default), `secondary`, `danger`, `ghost`. Mendukung prop `size`, `disabled`, dan `loading`.

### `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardTitle>`
Container card untuk menampilkan konten terstruktur.

### `<Badge>`
Label berwarna dengan `tone`: `blue`, `green`, `yellow`, `red`, `gray`, `purple`.

### `<Input>`, `<Label>`
Form input dan label yang sudah distilasi.

### `<Modal>`
Dialog overlay untuk konfirmasi dan form inline.

### `<Table>`, `<Thead>`, `<Tbody>`, `<Tr>`, `<Th>`, `<Td>`
Komponen tabel yang responsif.

### Layout Components
- **`<Sidebar>`** — Navigasi samping dengan menu dinamis berdasarkan role
- **`<Navbar>`** — Top bar dengan info user dan tombol logout
- **`<PageHeader>`** — Header halaman dengan title dan description

---

## 🚢 Deployment

### Opsi 1: Vercel (Rekomendasi)

1. Push kode ke GitHub
2. Import proyek di [vercel.com](https://vercel.com)
3. Set environment variables:
   ```
   DATABASE_URL=file:./dev.db
   AUTH_SECRET=your-production-secret-key
   ```
4. Deploy otomatis!

> ⚠️ Untuk produksi, pertimbangkan migrasi dari SQLite ke **PostgreSQL** atau **MySQL** agar mendukung concurrent access.

### Opsi 2: Self-Hosted (VPS)

```bash
# Clone dan install
git clone https://github.com/putraAlifSyah/LPM-APP.git
cd LPM-APP
npm install

# Setup environment
cp .env.example .env
# Edit .env sesuai kebutuhan

# Setup database
npx prisma migrate deploy
npm run seed

# Build dan jalankan
npm run build
npm start
```

### Opsi 3: Docker (Coming Soon)

```dockerfile
# Dockerfile (contoh dasar)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 Script yang Tersedia

| Script | Perintah | Keterangan |
|--------|----------|------------|
| `dev` | `npm run dev` | Jalankan development server |
| `build` | `npm run build` | Build produksi |
| `start` | `npm start` | Jalankan production server |
| `lint` | `npm run lint` | Jalankan ESLint |
| `seed` | `npm run seed` | Isi database dengan data awal |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **branch** fitur baru:
   ```bash
   git checkout -b fitur/fitur-baru
   ```
3. **Commit** perubahan:
   ```bash
   git commit -m "feat: tambah fitur baru"
   ```
4. **Push** ke branch:
   ```bash
   git push origin fitur/fitur-baru
   ```
5. Buat **Pull Request**

### Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Keterangan |
|--------|------------|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `style:` | Perubahan styling (tanpa perubahan logika) |
| `refactor:` | Refactoring kode |
| `test:` | Penambahan/perbaikan test |
| `chore:` | Perubahan build/tooling |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail.

---

## 📞 Kontak

- **Institusi:** Stikes Datu Kamanre
- **Developer:** [@putraAlifSyah](https://github.com/putraAlifSyah)
- **Repository:** [github.com/putraAlifSyah/LPM-APP](https://github.com/putraAlifSyah/LPM-APP)

---

<p align="center">
  Dibuat dengan ❤️ untuk Stikes Datu Kamanre
</p>
