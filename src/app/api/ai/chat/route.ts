import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api";
import type { Role } from "@/lib/auth";

/* ================================================================
   SYSTEM PROMPT — konteks lengkap tentang LPM untuk AI
   ================================================================ */

function buildSystemPrompt(role: Role, nama: string): string {
  const roleLabel: Record<Role, string> = {
    ADMIN: "Administrator",
    AUDITOR: "Auditor",
    DOSEN: "Dosen / Staff",
    PIMPINAN: "Pimpinan",
  };

  return `Kamu adalah asisten AI untuk Sistem Informasi Lembaga Penjaminan Mutu (SI-LPM) Stikes Datu Kamanre. Jawab dalam Bahasa Indonesia yang ramah dan profesional. Jawab secara ringkas dan langsung ke intinya.

User yang sedang chat: ${nama}, role: ${roleLabel[role]}.

== TENTANG APLIKASI ==
SI-LPM adalah aplikasi web untuk mengelola proses penjaminan mutu internal (SPMI) sesuai standar BAN-PT. Fitur utama:

1. DASHBOARD - Ringkasan statistik: total dokumen, temuan audit aktif, rata-rata capaian Monev, pengumuman terbaru. Klik kartu untuk navigasi cepat.

2. MANAJEMEN DOKUMEN - Upload, kelola, dan versioning dokumen mutu.
   - Kategori: SPMI, Kurikulum, VMTS, Renstra, Laporan, Formulir, Lainnya
   - Fitur: pencarian, filter (kategori/standar/prodi), upload file (PDF/DOCX/XLSX/PPTX max 10MB)
   - Versioning: upload versi baru tanpa kehilangan versi lama
   - Mapping ke standar BAN-PT (C.1.1, C.6.2, dll.)
   - Soft delete (hanya Admin yang bisa hapus)
   - Yang bisa upload: Admin, Auditor, Dosen

3. AUDIT MUTU INTERNAL (AMI)
   - Alur: RENCANA → BERLANGSUNG → SELESAI
   - Buat sesi audit: nama, unit audit, tanggal, auditor
   - Temuan: Observasi / Ketidaksesuaian Minor / Major
   - Status temuan: OPEN → PROSES → CLOSED
   - Sesi selesai hanya jika semua temuan CLOSED
   - Yang bisa buat & kelola: Admin, Auditor

4. MONITORING & EVALUASI (MONEV)
   - Indikator kinerja dengan target terukur
   - Input capaian per periode semester
   - Status: Tercapai (≥100%), Mendekati (75-99%), Belum Tercapai (<75%)
   - Laporan visual dengan grafik batang + tabel
   - Export ke CSV
   - Yang bisa input: Admin, Dosen

5. BERITA & PENGUMUMAN
   - Publikasi berita dan pengumuman dari LPM
   - Kategori: Berita / Pengumuman
   - Yang bisa buat: Admin saja

6. MANAJEMEN PENGGUNA (Admin saja)
   - CRUD pengguna dengan 4 role
   - Password di-hash dengan bcrypt

7. PROFIL - Edit nama, prodi, ganti password

== HAK AKSES (RBAC) ==
- ADMIN: semua fitur
- AUDITOR: upload dokumen, buat/kelola audit, input temuan, lihat laporan
- DOSEN: upload dokumen, input monev, lihat laporan
- PIMPINAN: hanya lihat (read-only) semua data

== PROGRAM STUDI ==
S1 Keperawatan, D3 Kebidanan, S1 Farmasi, D3 Keperawatan, Profesi Ners

== PANDUAN UMUM ==
- Login: masukkan email & password kampus di halaman login
- Navigasi: sidebar kiri (menu), navbar atas (profil & logout)
- Semua tanggal dalam format Indonesia
- Session login berlaku 7 hari

Jawab pertanyaan user sesuai dengan role-nya. Jika ditanya tentang fitur yang tidak bisa diakses role-nya, jelaskan bahwa fitur tersebut tidak tersedia untuk role mereka dan sarankan menghubungi Admin.`;
}

/* ================================================================
   PROVIDER ADAPTERS — panggil API masing-masing provider
   ================================================================ */

type Message = { role: "system" | "user" | "assistant"; content: string };

async function callOpenAI(
  apiKey: string,
  model: string,
  messages: Message[]
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, Record<string, string>>)?.error?.message ||
        `OpenAI error: ${res.status}`
    );
  }
  const data = await res.json();
  return (data as { choices: { message: { content: string } }[] }).choices[0]
    ?.message?.content ?? "";
}

async function callGoogle(
  apiKey: string,
  model: string,
  messages: Message[]
): Promise<string> {
  // Gemini API: system instruction terpisah
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMsgs = messages.filter((m) => m.role !== "system");

  const contents = chatMsgs.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }
  body.generationConfig = { maxOutputTokens: 1024, temperature: 0.7 };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, Record<string, string>>)?.error?.message ||
        `Google AI error: ${res.status}`
    );
  }
  const data = await res.json();
  return (
    (
      data as {
        candidates: { content: { parts: { text: string }[] } }[];
      }
    ).candidates[0]?.content?.parts[0]?.text ?? ""
  );
}

async function callAnthropic(
  apiKey: string,
  model: string,
  messages: Message[]
): Promise<string> {
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMsgs = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: 1024,
    messages: chatMsgs,
  };
  if (systemMsg) body.system = systemMsg.content;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, Record<string, string>>)?.error?.message ||
        `Anthropic error: ${res.status}`
    );
  }
  const data = await res.json();
  return (
    (data as { content: { type: string; text: string }[] }).content[0]?.text ??
    ""
  );
}

/* ================================================================
   ROUTE HANDLER
   ================================================================ */

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  try {
    const { message, history } = (await req.json()) as {
      message: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Ambil konfigurasi AI
    const config = await prisma.aiConfig.findUnique({
      where: { id: "default" },
    });
    if (!config || !config.apiKey) {
      return NextResponse.json(
        {
          error:
            "AI belum dikonfigurasi. Hubungi Administrator untuk mengatur provider dan API key.",
        },
        { status: 400 }
      );
    }

    // Bangun messages
    const systemPrompt = buildSystemPrompt(
      auth.user.role as Role,
      auth.user.nama
    );
    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).slice(-10), // batasi 10 pesan terakhir
      { role: "user", content: message },
    ];

    // Panggil provider
    let reply: string;
    switch (config.provider) {
      case "openai":
        reply = await callOpenAI(config.apiKey, config.model, messages);
        break;
      case "google":
        reply = await callGoogle(config.apiKey, config.model, messages);
        break;
      case "anthropic":
        reply = await callAnthropic(config.apiKey, config.model, messages);
        break;
      default:
        return NextResponse.json(
          { error: `Provider "${config.provider}" tidak dikenal` },
          { status: 400 }
        );
    }

    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Terjadi kesalahan AI";
    console.error("AI Chat error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
