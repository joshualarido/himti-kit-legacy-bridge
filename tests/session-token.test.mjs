import assert from "node:assert/strict";
import test from "node:test";
import { decodeSession, encodeSession } from "../src/lib/session-token.ts";

const secret = "test-session-secret-at-least-32-characters";

test("accepts a valid signed session", () => {
  const session = { role: "admin", expires: Date.now() + 60_000 };
  assert.deepEqual(decodeSession(encodeSession(session, secret), secret), session);
});

test("rejects tampered and expired sessions", () => {
  const token = encodeSession({ role: "admin", expires: Date.now() + 60_000 }, secret);
  assert.equal(decodeSession(`${token}x`, secret), null);
  assert.equal(decodeSession(encodeSession({ role: "admin", expires: Date.now() - 1 }, secret), secret), null);
});
