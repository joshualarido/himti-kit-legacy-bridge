import { createHmac, timingSafeEqual } from "node:crypto";

export type Session =
  | { role: "admin"; expires: number }
  | { role: "student"; studentId: string; cohortId: string; name: string; nim: string; expires: number };

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeSession(session: Session, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function decodeSession(value: string | undefined, secret: string): Session | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!session.expires || session.expires < Date.now() || !["admin", "student"].includes(session.role)) return null;
    return session;
  } catch {
    return null;
  }
}
