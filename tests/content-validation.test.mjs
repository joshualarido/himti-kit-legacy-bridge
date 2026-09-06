import assert from "node:assert/strict";
import test from "node:test";
import { isExternalUrl, isMajor, validateContent } from "../src/lib/content.ts";

function validForm() {
  const form = new FormData();
  form.set("title", "Algorithms");
  form.set("description", "A useful summary.");
  form.set("imageUrl", "https://example.com/image.png");
  form.set("resourceUrl", "https://example.com/summary.pdf");
  form.set("major", "Computer Science");
  return form;
}

test("accepts supported majors and safe external URLs", () => {
  assert.equal(isMajor("Computer Science"), true);
  assert.equal(isMajor("Unknown"), false);
  assert.equal(isExternalUrl("https://example.com/file"), true);
  assert.equal(isExternalUrl("javascript:alert(1)"), false);
  assert.equal(validateContent(validForm(), "course").ok, true);
});

test("rejects invalid content at the boundary", () => {
  const form = validForm();
  form.set("resourceUrl", "file:///etc/passwd");
  assert.deepEqual(validateContent(form, "course"), { ok: false, error: "Enter a valid HTTP or HTTPS resource URL." });
  form.set("resourceUrl", "https://example.com/summary.pdf");
  form.set("major", "Unknown");
  assert.deepEqual(validateContent(form, "course"), { ok: false, error: "Choose a valid major." });
});
