import { MAX_FILENAME_LENGTH, WINDOWS_RESERVED_FILENAMES } from "./constants.js";

export function sanitizeFilename(input: string): string {
  const normalized = input.replace(/\\/g, "/").split("/").filter(Boolean).at(-1) ?? "";
  let safe = normalized
    .replace(/\.\.+/g, ".")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, " ")
    .trim();

  safe = safe.replace(/^[. ]+|[. ]+$/g, "");

  if (!safe) safe = "untitled";

  const { stem, extension } = splitFilename(safe);
  const reservedSafeStem = WINDOWS_RESERVED_FILENAMES.has(stem.toUpperCase()) ? `_${stem}` : stem;
  const maxStemLength = Math.max(1, MAX_FILENAME_LENGTH - extension.length);
  return `${reservedSafeStem.slice(0, maxStemLength)}${extension}`;
}

export function splitFilename(filename: string) {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return { stem: filename, extension: "" };
  return {
    stem: filename.slice(0, lastDot),
    extension: filename.slice(lastDot)
  };
}
