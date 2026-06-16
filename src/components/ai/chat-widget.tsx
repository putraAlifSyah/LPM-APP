"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";
import { Markdown } from "./markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SARAN = [
  "Bagaimana cara upload dokumen?",
  "Ada berapa dokumen SPMI saat ini?",
  "Jelaskan alur audit mutu internal",
  "Indikator monev mana yang belum tercapai?",
];

const BLUE = "#2563eb";

export function ChatWidget({ namaUser }: { namaUser: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ai/config")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function kirim(teks: string) {
    const isi = teks.trim();
    if (!isi || loading) return;
    const next = [...messages, { role: "user" as const, content: isi }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const d = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.ok
            ? d.reply
            : `⚠️ ${d.error || "Maaf, terjadi kesalahan."}`,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Gagal terhubung ke server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) return null;

  // ---- Tombol mengambang (saat panel tertutup) ----
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka Asisten AI"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: "9999px",
          border: "none",
          background: BLUE,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
        }}
      >
        <Bot size={26} />
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: "9999px",
            background: "#22c55e",
            border: "2px solid #fff",
          }}
        />
      </button>
    );
  }

  // ---- Panel chat (saat terbuka) ----
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        width: "min(380px, calc(100vw - 40px))",
        height: "min(560px, calc(100vh - 40px))",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: BLUE,
          color: "#fff",
          padding: "12px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
              Asisten LPM
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#dbeafe" }}>
              Tanya apa saja soal aplikasi
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Tutup"
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: 4,
            borderRadius: 6,
            display: "flex",
          }}
        >
          <X size={22} />
        </button>
      </div>

      {/* Area pesan (scroll) */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          background: "#f8fafc",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                color: "#475569",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                <Sparkles size={15} color={BLUE} /> Halo,{" "}
                {namaUser.split(" ")[0]}! 👋
              </p>
              Saya Asisten LPM. Saya bisa bantu jelaskan cara pakai fitur, atau
              jawab pertanyaan tentang dokumen, audit, dan monev di aplikasi ini.
            </div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>
              Coba tanyakan:
            </p>
            {SARAN.map((s) => (
              <button
                key={s}
                onClick={() => kirim(s)}
                style={{
                  textAlign: "left",
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                whiteSpace: m.role === "user" ? "pre-wrap" : "normal",
                wordBreak: "break-word",
                borderRadius: 16,
                padding: "8px 14px",
                fontSize: 14,
                lineHeight: 1.5,
                ...(m.role === "user"
                  ? {
                      background: BLUE,
                      color: "#fff",
                      borderBottomRightRadius: 4,
                    }
                  : {
                      background: "#fff",
                      color: "#334155",
                      border: "1px solid #e2e8f0",
                      borderBottomLeftRadius: 4,
                    }),
              }}
            >
              {m.role === "user" ? m.content : <Markdown text={m.content} />}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                borderBottomLeftRadius: 4,
                padding: "10px 14px",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              <Loader2 size={15} className="animate-spin" /> Mengetik...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim(input);
        }}
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
          padding: 12,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan..."
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: "9999px",
            border: "1px solid #cbd5e1",
            padding: "8px 16px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Kirim"
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: "9999px",
            border: "none",
            background: BLUE,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !input.trim() ? "default" : "pointer",
            opacity: loading || !input.trim() ? 0.4 : 1,
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
