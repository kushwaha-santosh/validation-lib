export function isEmpty(value: any): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false; // false is a valid, non-empty checkbox state
  if (typeof FileList !== "undefined" && value instanceof FileList) return value.length === 0;
  return false;
}

export function toFileArray(value: any): File[] {
  if (!value) return [];
  if (typeof File !== "undefined" && value instanceof File) return [value];
  if (typeof FileList !== "undefined" && value instanceof FileList) return Array.from(value);
  if (Array.isArray(value)) return value;
  return [];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ok(): { valid: true } {
  return { valid: true };
}

export function fail(message: string): { valid: false; message: string } {
  return { valid: false, message };
}
