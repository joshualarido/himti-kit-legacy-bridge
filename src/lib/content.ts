export const MAJORS = [
  "Computer Science",
  "Mobile Application and Technology",
  "Game Application and Technology",
  "Data Science",
  "Cyber Security",
  "Computer Science & Mathematics",
  "Computer Science & Statistics",
  "Computer Science - Software Engineering",
  "Artificial Intelligence",
  "Digital Psychology",
] as const;

export type Major = (typeof MAJORS)[number];
export type ContentType = "course" | "software";
export type ContentRecord = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  resourceUrl: string;
  major?: string;
};

export function isMajor(value: string): value is Major {
  return MAJORS.some((major) => major === value);
}

export function isExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type ValidationResult =
  | { ok: false; error: string }
  | { ok: true; data: { title: string; description: string; imageUrl: string; resourceUrl: string; major: string } };

export function validateContent(formData: FormData, type: ContentType): ValidationResult {
  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";
  const resourceUrl = formData.get("resourceUrl")?.toString().trim() ?? "";
  const major = formData.get("major")?.toString() ?? "";

  if (!title || title.length > 120) return { ok: false, error: "Title must be between 1 and 120 characters." };
  if (!description || description.length > 1000) return { ok: false, error: "Description must be between 1 and 1000 characters." };
  if (imageUrl.length > 2048 || !isExternalUrl(imageUrl)) return { ok: false, error: "Enter a valid HTTP or HTTPS image URL." };
  if (resourceUrl.length > 2048 || !isExternalUrl(resourceUrl)) return { ok: false, error: "Enter a valid HTTP or HTTPS resource URL." };
  if (type === "course" && !isMajor(major)) return { ok: false, error: "Choose a valid major." };

  return { ok: true, data: { title, description, imageUrl, resourceUrl, major } };
}
