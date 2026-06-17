<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/AI_Assistant-Multi_Provider-8A2BE2?style=for-the-badge&logo=openai" alt="AI Chatbot" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

# LPM-APP

**Quality Assurance Management System — Stikes Datu Kamanre**

A full-stack web application designed to manage the entire Internal Quality Assurance System (SPMI) process for a health sciences higher education institution. Built with a modern architecture using Next.js 16 App Router, Prisma ORM, SQLite, and equipped with a **Multi-provider AI Assistant Chatbot** to guide users through the application.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Demo Accounts](#demo-accounts)
- [Database Structure](#database-structure)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [API Reference](#api-reference)
- [Folder Structure](#folder-structure)
- [UI Components](#ui-components)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**LPM-APP** is a Quality Assurance Management Information System specifically designed for **Stikes Datu Kamanre**. This application supports the PPEPP cycle (Establishment, Implementation, Evaluation, Control, Improvement) in accordance with **BAN-PT** and **SPMI** standards.

### Background

The Quality Assurance Agency (LPM) plays a crucial role in maintaining and improving the quality of higher education. This application aims to:

- **Digitize** the previously manual quality document management process.
- **Centralize** audit, monitoring, and evaluation data in a single platform.
- **Provide transparency** regarding quality performance achievements to all stakeholders.
- **Improve efficiency** in reporting and tracking audit finding follow-ups.

---

## Key Features

### Dashboard
- Statistical summary of documents, audits, and Monev (Monitoring & Evaluation) achievements.
- Document distribution by category with visual progress bars.
- List of recent documents and active announcements.
- Latest audit status along with its timeline.

### Document Management
- Upload, download, and manage quality documents (PDF, DOCX, etc.).
- Document categorization: SPMI, Curriculum, VMTS, Strategic Plan, Reports, Forms.
- Document mapping to BAN-PT standards (e.g., C.1.1, C.6.2, etc.).
- Tagging system and full-text search.
- Document versioning with change history.
- Soft delete for data security.
- Filtering by category, study program, and standard.

### Internal Quality Audit (AMI)
- Planning and scheduling of audit sessions.
- Recording of audit findings (Observation, Minor Non-conformity, Major Non-conformity).
- Tracking of finding status: Open → In Progress → Closed.
- Mapping of findings to BAN-PT standards.
- Setting deadlines and follow-up actions.
- Audit history per unit/study program.

### Monitoring & Evaluation (Monev)
- Input of performance indicators with measurable targets.
- Recording of achievements per semester period.
- Automatic calculation of achievement vs. target percentage.
- Monev reports with chart visualizations (Recharts).
- Filtering by period and unit.

### News & Announcements
- Publication of LPM news and announcements.
- Categorization: News / Announcements.
- Timeline display with Indonesian date formats.

### User Management
- CRUD operations for users with Role-Based Access Control.
- 4 roles: Admin, Auditor, Lecturer, Leadership.
- Password hashing using bcrypt.
- User profiles with self-edit capabilities.

### AI Assistant (Chatbot)
- **Floating chatbot** in the bottom right corner for all logged-in users.
- **Multi-provider support**: OpenAI, Anthropic (Claude), Google Gemini, and OpenAI-compatible endpoints (OpenRouter, Groq, LM Studio, etc.).
- **Freely typable models** — choose from suggestions or type your own model name.
- **Application context-aware** — the AI understands feature guides **and** reads live data (document counts/lists, audit sessions, Monev achievements) based on the user's access rights.
- **Admin-exclusive configuration** on the `AI Settings` page — select provider, model, and API key.
- **Encrypted API keys** (AES-256-GCM) when stored, never displayed back to the browser.
- **Connection testing** to the provider before activation.
- AI responses are rendered as Markdown (bold, bullet points, code) directly within the chat.

### Authentication & Security
- JWT-based authentication (jose library).
- HTTP-only secure cookies (7-day validity).
- Automatic route protection middleware.
- Role-based permissions for every action.
- Password hashing with bcrypt (salt rounds: 10).
- AI API key encryption using AES-256-GCM (Node crypto).

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|-------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.2.9 |
| **UI Library** | [React](https://react.dev/) | 19.2.4 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **ORM** | [Prisma](https://www.prisma.io/) | 6.19.3 |
| **Database** | [SQLite](https://www.sqlite.org/) | - |
| **Auth** | [jose](https://github.com/panva/jose) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 6.x / 3.x |
| **Icons** | [Lucide React](https://lucide.dev/) | 1.18.0 |
| **Charts** | [Recharts](https://recharts.org/) | 3.8.1 |
| **AI Chatbot** | Multi-provider (OpenAI / Anthropic / Gemini / OpenAI-compatible) via REST | - |
| **Encryption** | Node.js `crypto` (AES-256-GCM) for AI API keys | - |
| **Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | - |

---

## Project Architecture

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
│  │  │Dashboard│ │Document │ │Audit│ │  Monev   │     │   │
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

## Prerequisites

Ensure your system has the following installed:

| Software | Minimum Version | Check Version |
|----------|--------------|-----------|
| **Node.js** | 18.17+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Git** | 2.x | `git -v` |

> Tip: It is highly recommended to use Node.js **v20 LTS** or newer for optimal performance.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/putraAlifSyah/LPM-APP.git
cd LPM-APP
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (SQLite - default for development)
DATABASE_URL="file:./dev.db"

# Secret key for JWT (CHANGE in production!)
AUTH_SECRET="change-this-to-a-secure-and-long-secret-key"
```

> **Important:** Ensure `AUTH_SECRET` is changed to a secure and unique string in production environments. Use a minimum of 32 random characters.

### 4. Database Setup

```bash
# Run database migrations
npx prisma migrate dev

# Populate initial data (seed)
npm run seed
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will run on: **http://localhost:3000**

### Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Prisma Studio will run on: **http://localhost:5555**

---

## Demo Accounts

After running the seed script, 4 demo accounts will be available:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@stikesdk.ac.id` | `password123` |
| **Auditor** | `auditor@stikesdk.ac.id` | `password123` |
| **Dosen** | `dosen@stikesdk.ac.id` | `password123` |
| **Pimpinan** | `pimpinan@stikesdk.ac.id` | `password123` |

> The login page provides quick-fill buttons to simplify testing.

---

## Activating the AI Assistant

The AI Chatbot is **disabled by default**. To activate it:

1. Log in as an **Admin**.
2. Open the **AI Settings** menu in the sidebar.
3. Select a **Provider** (OpenAI / Anthropic / Gemini / Custom OpenAI-compatible).
4. Fill in the **Model** (choose a suggestion or type your own, e.g., `gpt-4o-mini`, `gemini-2.5-flash`, `claude-3-5-haiku`).
5. For a **Custom** provider, also provide the **Base URL** (e.g., `https://openrouter.ai/api/v1`).
6. Paste the **API key** from the selected provider.
7. Click **Test Connection** to ensure the configuration is correct.
8. Enable the **toggle** and click **Save**.

Once active, the chatbot will appear in the bottom right corner for **all logged-in users**. The AI can answer questions about how to use features or inquire about application data (documents, audits, Monev) according to the respective user's access rights.

> **Security:** API keys are stored encrypted (AES-256-GCM) in the database and are never sent back to the browser in their original form.

---

## Database Structure

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

### Detailed Models

#### `User` — System users
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Full name |
| `email` | String | Unique email |
| `password` | String | bcrypt hash |
| `role` | Enum | ADMIN, AUDITOR, DOSEN, PIMPINAN |
| `prodi` | String? | Study program (optional) |
| `createdAt` | DateTime | Creation time |

#### `Dokumen` — Quality documents
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `judul` | String | Document title |
| `deskripsi` | String? | Optional description |
| `kategori` | String | SPMI, Curriculum, VMTS, Strategic Plan, Report, Form |
| `standar` | String? | BAN-PT standard mapping |
| `tags` | String? | Tags (comma-separated) |
| `namaFile` | String | Original file name |
| `pathFile` | String | Storage path |
| `ukuranFile` | Int | Size in bytes |
| `tipeFile` | String | MIME type |
| `versi` | Int | Version number (default: 1) |
| `prodi` | String? | Associated study program |
| `deleted` | Boolean | Soft delete flag |
| `userId` | String | FK to User |

#### `RiwayatDokumen` — Document version history
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `dokumenId` | String | FK to Dokumen |
| `versi` | Int | Version number |
| `pathFile` | String | File path for this version |
| `namaFile` | String | File name for this version |
| `catatan` | String? | Change notes |

#### `Berita` — News & Announcements
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `judul` | String | News title |
| `isi` | String | News content |
| `kategori` | String | "Berita" (News) or "Pengumuman" (Announcement) |
| `userId` | String | FK to User (author) |

#### `IndikatorMonev` — Monitoring & Evaluation Indicators
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Indicator name |
| `standar` | String | BAN-PT standard |
| `satuan` | String | Measurement unit |
| `targetNilai` | Float | Target value |
| `periode` | String | Period (e.g., "2024-Odd") |

#### `CapaianMonev` — Achievements per indicator
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `indikatorId` | String | FK to IndikatorMonev |
| `nilaiCapaian` | Float | Actual achievement value |
| `keterangan` | String? | Additional notes |
| `periode` | String | Achievement period |
| `unit` | String? | Reporting unit |

#### `AuditSesi` — Internal Quality Audit Sessions
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `nama` | String | Audit session name |
| `tanggalMulai` | DateTime | Start date |
| `tanggalSelesai` | DateTime | End date |
| `auditorId` | String | FK to User (auditor) |
| `unitAudit` | String | Unit being audited |
| `status` | Enum | PLANNED, ONGOING, COMPLETED |

#### `Temuan` — Audit findings
| Field | Type | Description |
|-------|------|------------|
| `id` | String (CUID) | Primary key |
| `sesiId` | String | FK to AuditSesi |
| `deskripsi` | String | Finding description |
| `kategori` | String | Observation, Minor Non-conformity, Major |
| `standar` | String? | Related BAN-PT standard |
| `tindakLanjut` | String? | Follow-up plan |
| `statusTemuan` | Enum | OPEN, IN_PROGRESS, CLOSED |
| `deadline` | DateTime? | Deadline |

---

## Role-Based Access Control (RBAC)

The system utilizes **Role-Based Access Control** with 4 roles:

| Action | Admin | Auditor | Lecturer | Leadership |
|------|:-----:|:-------:|:-----:|:--------:|
| Upload Document | Yes | Yes | Yes | No |
| Delete Document | Yes | No | No | No |
| Input Monev | Yes | No | Yes | No |
| Create Audit | Yes | Yes | No | No |
| Input Finding | Yes | Yes | No | No |
| Manage Users | Yes | No | No | No |
| Create News | Yes | No | No | No |
| View Reports | Yes | Yes | Yes | Yes |
| Configure AI | Yes | No | No | No |
| Use AI Chatbot | Yes | Yes | Yes | Yes |

### Role Explanations

- **Admin** — Full access to all system features, including user management.
- **Auditor** — Focuses on audit activities: creating audit sessions, recording findings.
- **Lecturer / Staff** — Upload quality documents and input Monev data.
- **Leadership** — Read-only access to view reports and dashboards.

---

## API Reference

### Authentication

#### `POST /api/auth/login`
Logs in and obtains a session cookie.

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
  "error": "Incorrect email or password"
}
```

#### `POST /api/auth/logout`
Logs out and removes the session cookie.

---

### Documents

#### `GET /api/dokumen`
Retrieves a list of documents (with optional filters).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|------------|
| `kategori` | string | Filter by category |
| `prodi` | string | Filter by study program |
| `search` | string | Search by title/tags |

#### `POST /api/dokumen`
Uploads a new document (multipart/form-data).

#### `GET /api/dokumen/[id]`
Document details along with version history.

#### `DELETE /api/dokumen/[id]`
Soft deletes a document (Admin only).

---

### Audit

#### `GET /api/audit`
List of audit sessions.

#### `POST /api/audit`
Creates a new audit session.

#### `GET /api/audit/[id]`
Audit session details and findings.

---

### Findings

#### `POST /api/temuan`
Adds a finding to an audit session.

#### `PATCH /api/temuan/[id]`
Updates the status or details of a finding.

---

### Monitoring & Evaluation

#### `GET /api/monev`
List of Monev indicators and achievements.

#### `POST /api/monev`
Adds a new Monev indicator.

#### `POST /api/monev/capaian`
Inputs achievement data for an indicator.

---

### News

#### `GET /api/berita`
List of news and announcements.

#### `POST /api/berita`
Creates new news/announcement.

#### `GET /api/berita/[id]`
News details.

---

### Users

#### `GET /api/pengguna`
List of users (Admin only).

#### `POST /api/pengguna`
Adds a new user (Admin only).

#### `PATCH /api/pengguna/[id]`
Updates user data.

#### `DELETE /api/pengguna/[id]`
Deletes a user.

---

### Profile

#### `GET /api/profil`
Retrieves the logged-in user's profile.

#### `PATCH /api/profil`
Updates profile (name, email, password).

---

### AI Assistant

#### `GET /api/ai/config`
Retrieves AI configuration. Regular users only receive the `enabled` status; Admins receive the configuration details (masked API key).

#### `PUT /api/ai/config`
Saves AI configuration — provider, model, base URL, API key (encrypted), and active toggle. **Admin only.**

#### `POST /api/ai/test`
Tests the connection to the AI provider using the provided or saved configuration. **Admin only.**

#### `POST /api/ai/chat`
Sends a message to the AI Assistant. The server constructs the system prompt (guide + live data + user rights) and forwards it to the provider. Available to all logged-in users (if AI is enabled).

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I upload a document?" }
  ]
}
```

---

## Folder Structure

```
lpm/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Initial data (seed)
│   ├── migrations/            # Database migrations
│   └── dev.db                 # SQLite database (gitignored)
│
├── public/
│   └── uploads/               # Uploaded document files
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, metadata)
│   │   ├── page.tsx           # Redirects to dashboard
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── not-found.tsx      # 404 page
│   │   ├── global-error.tsx   # Global error boundary
│   │   │
│   │   ├── (app)/             # Route group (authenticated)
│   │   │   ├── layout.tsx     # Layout with Sidebar + Navbar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   # Main dashboard
│   │   │   ├── dokumen/
│   │   │   │   ├── page.tsx   # Document list
│   │   │   │   └── [id]/      # Document details
│   │   │   ├── audit/
│   │   │   │   ├── page.tsx   # Audit list
│   │   │   │   ├── buat/      # Create audit form
│   │   │   │   └── [id]/      # Audit details + findings
│   │   │   ├── monev/
│   │   │   │   ├── page.tsx   # Monev indicator table
│   │   │   │   └── laporan/   # Monev report (charts)
│   │   │   ├── berita/
│   │   │   │   ├── page.tsx   # News list
│   │   │   │   ├── buat/      # Create news form
│   │   │   │   └── [id]/      # News details
│   │   │   ├── pengguna/
│   │   │   │   └── page.tsx   # User management
│   │   │   └── profil/
│   │   │       └── page.tsx   # User profile
│   │   │
│   │   └── api/               # API Route Handlers
│   │       ├── auth/
│   │       │   ├── login/     # POST login
│   │       │   └── logout/    # POST logout
│   │       ├── dokumen/       # CRUD documents
│   │       ├── audit/         # CRUD audits
│   │       ├── temuan/        # CRUD findings
│   │       ├── monev/         # CRUD monev
│   │       ├── berita/        # CRUD news
│   │       ├── pengguna/      # CRUD users
│   │       └── profil/        # Profile endpoints
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx    # Sidebar navigation
│   │   │   ├── navbar.tsx     # Top navbar
│   │   │   └── page-header.tsx # Page header
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

## UI Components

The application uses consistent custom UI components:

### `<Button>`
Button with variations: `primary` (default), `secondary`, `danger`, `ghost`. Supports `size`, `disabled`, and `loading` props.

### `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardTitle>`
Card container for displaying structured content.

### `<Badge>`
Colored label with `tone`: `blue`, `green`, `yellow`, `red`, `gray`, `purple`.

### `<Input>`, `<Label>`
Styled form inputs and labels.

### `<Modal>`
Overlay dialog for confirmations and inline forms.

### `<Table>`, `<Thead>`, `<Tbody>`, `<Tr>`, `<Th>`, `<Td>`
Responsive table component.

### Layout Components
- **`<Sidebar>`** — Side navigation with dynamic menus based on role.
- **`<Navbar>`** — Top bar with user info and logout button.
- **`<PageHeader>`** — Page header with title and description.

---

## Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Set environment variables:
   ```
   DATABASE_URL=file:./dev.db
   AUTH_SECRET=your-production-secret-key
   ```
4. Deploy automatically!

> For production, consider migrating from SQLite to **PostgreSQL** or **MySQL** to support concurrent access.

### Option 2: Self-Hosted (VPS)

```bash
# Clone and install
git clone https://github.com/putraAlifSyah/LPM-APP.git
cd LPM-APP
npm install

# Setup environment
cp .env.example .env
# Edit .env as needed

# Setup database
npx prisma migrate deploy
npm run seed

# Build and start
npm run build
npm start
```

### Option 3: Docker (Coming Soon)

```dockerfile
# Dockerfile (basic example)
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

## Available Scripts

| Script | Command | Description |
|--------|----------|------------|
| `dev` | `npm run dev` | Starts the development server |
| `build` | `npm run build` | Production build |
| `start` | `npm start` | Starts the production server |
| `lint` | `npm run lint` | Runs ESLint |
| `seed` | `npm run seed` | Populates the database with initial data |

---

## Contributing

Contributions are highly welcome! Please follow these steps:

1. **Fork** this repository.
2. Create a new feature **branch**:
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a **Pull Request**.

### Commit Conventions

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

| Prefix | Description |
|--------|------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Styling changes (no logic changes) |
| `refactor:` | Code refactoring |
| `test:` | Adding/fixing tests |
| `chore:` | Build/tooling changes |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Contact

- **Institution:** Stikes Datu Kamanre
- **Developer:** [@putraAlifSyah](https://github.com/putraAlifSyah)
- **Repository:** [github.com/putraAlifSyah/LPM-APP](https://github.com/putraAlifSyah/LPM-APP)

---

<p align="center">
  Built for Stikes Datu Kamanre
</p>
