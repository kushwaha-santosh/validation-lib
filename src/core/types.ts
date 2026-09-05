export type ValidationResult = {
  valid: boolean;
  message?: string;
};

/** A Rule takes the field's value and (optionally) all form values, and returns a result. */
export type Rule<T = any, TForm = Record<string, any>> = (
  value: T,
  allValues?: TForm
) => ValidationResult | Promise<ValidationResult>;

export type Schema<T extends Record<string, any>> = {
  [K in keyof T]?: Rule<T[K], T>[];
};

export type FieldErrors<T extends Record<string, any>> = Partial<Record<keyof T, string>>;

export type ValidateSchemaResult<T extends Record<string, any>> = {
  isValid: boolean;
  errors: FieldErrors<T>;
};

/** Minimal shape covering input, select, textarea, radio, checkbox, file inputs */
export type FieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | File
  | File[]
  | FileList;
