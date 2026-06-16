import crypto from "crypto";

// Enkripsi API key at-rest dengan AES-256-GCM.
// Kunci diturunkan dari AUTH_SECRET (sama seperti session).
const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const KEY = crypto.createHash("sha256").update(SECRET).digest(); // 32 byte
const PREFIX = "enc:v1:";

export function encryptSecret(plain: string): string {
  if (!plain) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // format: enc:v1:<iv>.<tag>.<ciphertext> (base64)
  return (
    PREFIX +
    [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(
      "."
    )
  );
}

export function decryptSecret(stored: string): string {
  if (!stored) return "";
  if (!stored.startsWith(PREFIX)) return stored; // kompat: nilai lama tak terenkripsi
  try {
    const [ivB64, tagB64, dataB64] = stored.slice(PREFIX.length).split(".");
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const data = Buffer.from(dataB64, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString("utf8");
  } catch {
    return "";
  }
}

/** Tampilkan API key tersamar untuk UI (mis. "sk-...AB12"). */
export function maskSecret(plain: string): string {
  if (!plain) return "";
  if (plain.length <= 8) return "••••";
  return `${plain.slice(0, 3)}••••${plain.slice(-4)}`;
}
