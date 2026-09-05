import { useCallback, useMemo, useState } from "react";
import {
  Schema,
  FieldErrors,
  validateField,
  validateFieldAsync,
  validateSchema,
  validateSchemaAsync,
} from "../core";

export interface UseValidationOptions {
  /** Re-validate a field automatically whenever it changes. Default: false. */
  validateOnChange?: boolean;
  /** Await async rules (e.g. image dimension checks). Default: false. */
  async?: boolean;
}

export interface UseValidationReturn<T extends Record<string, any>> {
  values: T;
  errors: FieldErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  setField: (key: keyof T, value: T[keyof T]) => void;
  setFieldTouched: (key: keyof T, isTouched?: boolean) => void;
  validateOne: (key: keyof T) => Promise<boolean> | boolean;
  validate: () => Promise<boolean> | boolean;
  reset: (newValues?: T) => void;
  isValid: boolean;
}

/**
 * Framework-agnostic form-state + validation hook.
 * Works unchanged in React (web), Next.js (client components), and React Native
 * since it only touches React state — no DOM or native APIs.
 */
export function useValidation<T extends Record<string, any>>(
  initialValues: T,
  schema: Schema<T>,
  options: UseValidationOptions = {}
): UseValidationReturn<T> {
  const { validateOnChange = false, async = false } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateOne = useCallback(
    (key: keyof T) => {
      const rules = schema[key] ?? [];
      if (async) {
        return validateFieldAsync(values[key], rules, values).then((result) => {
          setErrors((prev) => ({ ...prev, [key]: result.valid ? undefined : result.message }));
          return result.valid;
        });
      }
      const result = validateField(values[key], rules, values);
      setErrors((prev) => ({ ...prev, [key]: result.valid ? undefined : result.message }));
      return result.valid;
    },
    [values, schema, async]
  );

  const validate = useCallback(() => {
    if (async) {
      return validateSchemaAsync(values, schema).then((result) => {
        setErrors(result.errors);
        return result.isValid;
      });
    }
    const result = validateSchema(values, schema);
    setErrors(result.errors);
    return result.isValid;
  }, [values, schema, async]);

  const setField = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        return next;
      });
      if (validateOnChange) {
        // validate against the *next* value on the following tick-safe read
        const rules = schema[key] ?? [];
        const nextValues = { ...values, [key]: value };
        if (async) {
          validateFieldAsync(value, rules, nextValues).then((result) => {
            setErrors((prev) => ({ ...prev, [key]: result.valid ? undefined : result.message }));
          });
        } else {
          const result = validateField(value, rules, nextValues);
          setErrors((prev) => ({ ...prev, [key]: result.valid ? undefined : result.message }));
        }
      }
    },
    [schema, validateOnChange, values, async]
  );

  const setFieldTouched = useCallback((key: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [key]: isTouched }));
  }, []);

  const reset = useCallback(
    (newValues?: T) => {
      setValues(newValues ?? initialValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  return { values, errors, touched, setField, setFieldTouched, validateOne, validate, reset, isValid };
}
