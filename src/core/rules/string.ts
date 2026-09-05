import { Rule } from "../types";
import { isEmpty, ok, fail } from "./helpers";

/** Works for: input[text], textarea, select (single), radio group value */
export const required = (message = "This field is required"): Rule =>
  (value) => (isEmpty(value) ? fail(message) : ok());

export const email = (message = "Enter a valid email address"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok(); // pair with required() to force presence
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(value)) ? ok() : fail(message);
  };

export const url = (message = "Enter a valid URL"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    try {
      new URL(String(value));
      return ok();
    } catch {
      // fallback regex for environments without a spec-compliant URL global (older RN/Hermes)
      const re = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;
      return re.test(String(value)) ? ok() : fail(message);
    }
  };

export const pattern = (regex: RegExp, message = "Invalid format"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    return regex.test(String(value)) ? ok() : fail(message);
  };

export const minLength = (min: number, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const len = String(value).length;
    return len >= min ? ok() : fail(message ?? `Must be at least ${min} characters`);
  };

export const maxLength = (max: number, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const len = String(value).length;
    return len <= max ? ok() : fail(message ?? `Must be no more than ${max} characters`);
  };

export const exactLength = (len: number, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    return String(value).length === len ? ok() : fail(message ?? `Must be exactly ${len} characters`);
  };

export const alpha = (message = "Only letters are allowed"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : /^[A-Za-z]+$/.test(String(value)) ? ok() : fail(message));

export const alphaSpaces = (message = "Only letters and spaces are allowed"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : /^[A-Za-z\s]+$/.test(String(value)) ? ok() : fail(message));

export const alphanumeric = (message = "Only letters and numbers are allowed"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : /^[A-Za-z0-9]+$/.test(String(value)) ? ok() : fail(message));

export const numericString = (message = "Only numbers are allowed"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : /^[0-9]+$/.test(String(value)) ? ok() : fail(message));

export const noWhitespace = (message = "Whitespace is not allowed"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : /^\S+$/.test(String(value)) ? ok() : fail(message));

export const phone = (message = "Enter a valid phone number"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    // Accepts +, digits, spaces, dashes, parens; 7-15 digits total (E.164-ish, lenient)
    const digits = String(value).replace(/\D/g, "");
    const re = /^\+?[0-9\s\-()]{7,20}$/;
    return re.test(String(value)) && digits.length >= 7 && digits.length <= 15
      ? ok()
      : fail(message);
  };

export const zipCode = (message = "Enter a valid ZIP / postal code"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const re = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/;
    return re.test(String(value)) ? ok() : fail(message);
  };

export const creditCard = (message = "Enter a valid card number"): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const digits = String(value).replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(digits)) return fail(message);
    // Luhn check
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
      if (shouldDouble) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 ? ok() : fail(message);
  };

/** Confirm-password / matching-field rule. Compares against another field in the same form values. */
export const matchField = <T extends Record<string, any>>(
  fieldKey: keyof T,
  message = "Fields do not match"
): Rule<any, T> =>
  (value, allValues) => {
    if (!allValues) return ok();
    return value === allValues[fieldKey] ? ok() : fail(message);
  };

export const oneOfStrings = (allowed: string[], message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    return allowed.includes(String(value))
      ? ok()
      : fail(message ?? `Must be one of: ${allowed.join(", ")}`);
  };

export const custom = <T = any>(
  fn: (value: T, allValues?: any) => boolean,
  message = "Invalid value"
): Rule<T> =>
  (value, allValues) => (fn(value, allValues) ? ok() : fail(message));
