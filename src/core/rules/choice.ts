import { Rule } from "../types";
import { isEmpty, ok, fail } from "./helpers";

/** input[type=checkbox] single toggle, e.g. "Accept terms" */
export const mustBeChecked = (message = "You must check this box"): Rule<boolean> =>
  (value) => (value === true ? ok() : fail(message));

/** select[multiple] or checkbox group bound to an array */
export const minSelected = (minCount: number, message?: string): Rule<any[]> =>
  (value) => {
    const arr = Array.isArray(value) ? value : [];
    return arr.length >= minCount ? ok() : fail(message ?? `Select at least ${minCount}`);
  };

export const maxSelected = (maxCount: number, message?: string): Rule<any[]> =>
  (value) => {
    const arr = Array.isArray(value) ? value : [];
    return arr.length <= maxCount ? ok() : fail(message ?? `Select no more than ${maxCount}`);
  };

export const selectedBetween = (minCount: number, maxCount: number, message?: string): Rule<any[]> =>
  (value) => {
    const arr = Array.isArray(value) ? value : [];
    return arr.length >= minCount && arr.length <= maxCount
      ? ok()
      : fail(message ?? `Select between ${minCount} and ${maxCount}`);
  };

/** radio group or select: value must be one of the option values */
export const oneOf = <T = any>(allowed: T[], message?: string): Rule<T> =>
  (value) => {
    if (isEmpty(value as any)) return ok();
    return allowed.includes(value) ? ok() : fail(message ?? "Please choose a valid option");
  };

/** select: reject the placeholder/disabled option, e.g. value="" or "-- choose --" */
export const notPlaceholder = (placeholderValue: string, message = "Please make a selection"): Rule<string> =>
  (value) => (value === placeholderValue ? fail(message) : ok());
