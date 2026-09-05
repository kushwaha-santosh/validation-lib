import { Rule, Schema, FieldErrors, ValidateSchemaResult, ValidationResult } from "./types";

/** Validate a single field's value against an ordered list of rules. Stops at first failure. */
export function validateField<T = any, TForm = any>(
  value: T,
  rules: Rule<T, TForm>[] = [],
  allValues?: TForm
): ValidationResult {
  for (const rule of rules) {
    const result = rule(value, allValues);
    if (result instanceof Promise) {
      throw new Error(
        "validateField: one of the rules is async. Use validateFieldAsync instead."
      );
    }
    if (!result.valid) return result;
  }
  return { valid: true };
}

/** Async-safe version — supports rules that return a Promise (e.g. imageMaxDimensions). */
export async function validateFieldAsync<T = any, TForm = any>(
  value: T,
  rules: Rule<T, TForm>[] = [],
  allValues?: TForm
): Promise<ValidationResult> {
  for (const rule of rules) {
    const result = await rule(value, allValues);
    if (!result.valid) return result;
  }
  return { valid: true };
}

/** Validate an entire form object against a schema. Sync — throws if a rule is async. */
export function validateSchema<T extends Record<string, any>>(
  values: T,
  schema: Schema<T>
): ValidateSchemaResult<T> {
  const errors: FieldErrors<T> = {};
  let isValid = true;

  for (const key in schema) {
    const rules = schema[key] ?? [];
    const result = validateField(values[key], rules, values);
    if (!result.valid) {
      isValid = false;
      errors[key] = result.message;
    }
  }
  return { isValid, errors };
}

/** Validate an entire form object against a schema, awaiting any async rules. */
export async function validateSchemaAsync<T extends Record<string, any>>(
  values: T,
  schema: Schema<T>
): Promise<ValidateSchemaResult<T>> {
  const errors: FieldErrors<T> = {};
  let isValid = true;

  const keys = Object.keys(schema) as (keyof T)[];
  await Promise.all(
    keys.map(async (key) => {
      const rules = schema[key] ?? [];
      const result = await validateFieldAsync(values[key], rules, values);
      if (!result.valid) {
        isValid = false;
        errors[key] = result.message;
      }
    })
  );

  return { isValid, errors };
}
