import { Rule } from "../types";
import { isEmpty, ok, fail } from "./helpers";

/** Works for: input[type=number], input[type=range] */
export const numeric = (message = "Must be a number"): Rule<string | number> =>
  (value) => (isEmpty(value) ? ok() : isNaN(Number(value)) ? fail(message) : ok());

export const integer = (message = "Must be a whole number"): Rule<string | number> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const n = Number(value);
    return Number.isInteger(n) ? ok() : fail(message);
  };

export const min = (minVal: number, message?: string): Rule<string | number> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const n = Number(value);
    if (isNaN(n)) return fail(message ?? `Must be at least ${minVal}`);
    return n >= minVal ? ok() : fail(message ?? `Must be at least ${minVal}`);
  };

export const max = (maxVal: number, message?: string): Rule<string | number> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const n = Number(value);
    if (isNaN(n)) return fail(message ?? `Must be no more than ${maxVal}`);
    return n <= maxVal ? ok() : fail(message ?? `Must be no more than ${maxVal}`);
  };

export const between = (minVal: number, maxVal: number, message?: string): Rule<string | number> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const n = Number(value);
    if (isNaN(n)) return fail(message ?? `Must be between ${minVal} and ${maxVal}`);
    return n >= minVal && n <= maxVal
      ? ok()
      : fail(message ?? `Must be between ${minVal} and ${maxVal}`);
  };

export const positive = (message = "Must be a positive number"): Rule<string | number> =>
  (value) => (isEmpty(value) ? ok() : Number(value) > 0 ? ok() : fail(message));

export const negative = (message = "Must be a negative number"): Rule<string | number> =>
  (value) => (isEmpty(value) ? ok() : Number(value) < 0 ? ok() : fail(message));

export const step = (stepVal: number, message?: string): Rule<string | number> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const n = Number(value);
    // guard against floating point drift
    const remainder = Math.abs(Math.round(n / stepVal) * stepVal - n);
    return remainder < 1e-9 ? ok() : fail(message ?? `Must be a multiple of ${stepVal}`);
  };

/** Works for: input[type=date], input[type=datetime-local], input[type=month], input[type=week] */
export const isDate = (message = "Enter a valid date"): Rule<string> =>
  (value) => (isEmpty(value) ? ok() : isNaN(Date.parse(String(value))) ? fail(message) : ok());

export const minDate = (minDateVal: Date | string, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const v = new Date(String(value));
    const m = new Date(minDateVal);
    if (isNaN(v.getTime())) return fail("Enter a valid date");
    return v >= m ? ok() : fail(message ?? `Date must be on or after ${m.toDateString()}`);
  };

export const maxDate = (maxDateVal: Date | string, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const v = new Date(String(value));
    const m = new Date(maxDateVal);
    if (isNaN(v.getTime())) return fail("Enter a valid date");
    return v <= m ? ok() : fail(message ?? `Date must be on or before ${m.toDateString()}`);
  };

export const ageMinYears = (years: number, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    const dob = new Date(String(value));
    if (isNaN(dob.getTime())) return fail("Enter a valid date");
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - years);
    return dob <= cutoff ? ok() : fail(message ?? `Must be at least ${years} years old`);
  };

/** input[type=time] value, "HH:MM" */
export const timeBetween = (minTime: string, maxTime: string, message?: string): Rule<string> =>
  (value) => {
    if (isEmpty(value)) return ok();
    return value >= minTime && value <= maxTime
      ? ok()
      : fail(message ?? `Time must be between ${minTime} and ${maxTime}`);
  };
