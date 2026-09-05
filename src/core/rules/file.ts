import { Rule } from "../types";
import { toFileArray, formatBytes, ok, fail } from "./helpers";

/** input[type=file] — requires at least one file selected */
export const fileRequired = (message = "Please select a file"): Rule =>
  (value) => (toFileArray(value).length > 0 ? ok() : fail(message));

/**
 * Restrict by MIME type or extension.
 * Accepts patterns like: "image/*", "image/png", ".pdf", ".jpg,.png"
 */
export const fileType = (accepted: string[], message?: string): Rule =>
  (value) => {
    const files = toFileArray(value);
    if (files.length === 0) return ok();
    const isAccepted = (file: File) => {
      const name = (file.name || "").toLowerCase();
      const type = (file.type || "").toLowerCase();
      return accepted.some((pattern) => {
        const p = pattern.trim().toLowerCase();
        if (p.startsWith(".")) return name.endsWith(p);
        if (p.endsWith("/*")) return type.startsWith(p.replace("/*", "/"));
        return type === p;
      });
    };
    const allOk = files.every(isAccepted);
    return allOk ? ok() : fail(message ?? `Allowed file types: ${accepted.join(", ")}`);
  };

export const maxFileSize = (maxBytes: number, message?: string): Rule =>
  (value) => {
    const files = toFileArray(value);
    const oversized = files.find((f) => f.size > maxBytes);
    return oversized
      ? fail(message ?? `File must be smaller than ${formatBytes(maxBytes)}`)
      : ok();
  };

export const minFileSize = (minBytes: number, message?: string): Rule =>
  (value) => {
    const files = toFileArray(value);
    const undersized = files.find((f) => f.size < minBytes);
    return undersized
      ? fail(message ?? `File must be at least ${formatBytes(minBytes)}`)
      : ok();
  };

export const maxFileCount = (maxCount: number, message?: string): Rule =>
  (value) => {
    const files = toFileArray(value);
    return files.length <= maxCount ? ok() : fail(message ?? `Select no more than ${maxCount} file(s)`);
  };

export const minFileCount = (minCount: number, message?: string): Rule =>
  (value) => {
    const files = toFileArray(value);
    return files.length >= minCount ? ok() : fail(message ?? `Select at least ${minCount} file(s)`);
  };

/**
 * Async image dimension check (browser only — uses Image()). No-ops safely
 * in environments without a DOM Image constructor (e.g. React Native, SSR).
 */
export const imageMaxDimensions = (
  maxWidth: number,
  maxHeight: number,
  message?: string
): Rule =>
  async (value) => {
    const files = toFileArray(value);
    if (files.length === 0) return ok();
    if (typeof Image === "undefined" || typeof URL === "undefined") return ok();

    const checks = files.map(
      (file) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(img.width <= maxWidth && img.height <= maxHeight);
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(true); // don't block submission on a decode failure
          };
          img.src = objectUrl;
        })
    );

    const results = await Promise.all(checks);
    const allOk = results.every(Boolean);
    return allOk
      ? ok()
      : fail(message ?? `Image must be at most ${maxWidth}x${maxHeight}px`);
  };
