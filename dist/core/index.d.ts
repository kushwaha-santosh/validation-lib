type ValidationResult = {
    valid: boolean;
    message?: string;
};
/** A Rule takes the field's value and (optionally) all form values, and returns a result. */
type Rule<T = any, TForm = Record<string, any>> = (value: T, allValues?: TForm) => ValidationResult | Promise<ValidationResult>;
type Schema<T extends Record<string, any>> = {
    [K in keyof T]?: Rule<T[K], T>[];
};
type FieldErrors<T extends Record<string, any>> = Partial<Record<keyof T, string>>;
type ValidateSchemaResult<T extends Record<string, any>> = {
    isValid: boolean;
    errors: FieldErrors<T>;
};
/** Minimal shape covering input, select, textarea, radio, checkbox, file inputs */
type FieldValue = string | number | boolean | null | undefined | string[] | number[] | File | File[] | FileList;

/** Works for: input[text], textarea, select (single), radio group value */
declare const required: (message?: string) => Rule;
declare const email: (message?: string) => Rule<string>;
declare const url: (message?: string) => Rule<string>;
declare const pattern: (regex: RegExp, message?: string) => Rule<string>;
declare const minLength: (min: number, message?: string) => Rule<string>;
declare const maxLength: (max: number, message?: string) => Rule<string>;
declare const exactLength: (len: number, message?: string) => Rule<string>;
declare const alpha: (message?: string) => Rule<string>;
declare const alphaSpaces: (message?: string) => Rule<string>;
declare const alphanumeric: (message?: string) => Rule<string>;
declare const numericString: (message?: string) => Rule<string>;
declare const noWhitespace: (message?: string) => Rule<string>;
declare const phone: (message?: string) => Rule<string>;
declare const zipCode: (message?: string) => Rule<string>;
declare const creditCard: (message?: string) => Rule<string>;
/** Confirm-password / matching-field rule. Compares against another field in the same form values. */
declare const matchField: <T extends Record<string, any>>(fieldKey: keyof T, message?: string) => Rule<any, T>;
declare const oneOfStrings: (allowed: string[], message?: string) => Rule<string>;
declare const custom: <T = any>(fn: (value: T, allValues?: any) => boolean, message?: string) => Rule<T>;

/** Works for: input[type=number], input[type=range] */
declare const numeric: (message?: string) => Rule<string | number>;
declare const integer: (message?: string) => Rule<string | number>;
declare const min: (minVal: number, message?: string) => Rule<string | number>;
declare const max: (maxVal: number, message?: string) => Rule<string | number>;
declare const between: (minVal: number, maxVal: number, message?: string) => Rule<string | number>;
declare const positive: (message?: string) => Rule<string | number>;
declare const negative: (message?: string) => Rule<string | number>;
declare const step: (stepVal: number, message?: string) => Rule<string | number>;
/** Works for: input[type=date], input[type=datetime-local], input[type=month], input[type=week] */
declare const isDate: (message?: string) => Rule<string>;
declare const minDate: (minDateVal: Date | string, message?: string) => Rule<string>;
declare const maxDate: (maxDateVal: Date | string, message?: string) => Rule<string>;
declare const ageMinYears: (years: number, message?: string) => Rule<string>;
/** input[type=time] value, "HH:MM" */
declare const timeBetween: (minTime: string, maxTime: string, message?: string) => Rule<string>;

/** input[type=checkbox] single toggle, e.g. "Accept terms" */
declare const mustBeChecked: (message?: string) => Rule<boolean>;
/** select[multiple] or checkbox group bound to an array */
declare const minSelected: (minCount: number, message?: string) => Rule<any[]>;
declare const maxSelected: (maxCount: number, message?: string) => Rule<any[]>;
declare const selectedBetween: (minCount: number, maxCount: number, message?: string) => Rule<any[]>;
/** radio group or select: value must be one of the option values */
declare const oneOf: <T = any>(allowed: T[], message?: string) => Rule<T>;
/** select: reject the placeholder/disabled option, e.g. value="" or "-- choose --" */
declare const notPlaceholder: (placeholderValue: string, message?: string) => Rule<string>;

/** input[type=file] — requires at least one file selected */
declare const fileRequired: (message?: string) => Rule;
/**
 * Restrict by MIME type or extension.
 * Accepts patterns like: "image/*", "image/png", ".pdf", ".jpg,.png"
 */
declare const fileType: (accepted: string[], message?: string) => Rule;
declare const maxFileSize: (maxBytes: number, message?: string) => Rule;
declare const minFileSize: (minBytes: number, message?: string) => Rule;
declare const maxFileCount: (maxCount: number, message?: string) => Rule;
declare const minFileCount: (minCount: number, message?: string) => Rule;
/**
 * Async image dimension check (browser only — uses Image()). No-ops safely
 * in environments without a DOM Image constructor (e.g. React Native, SSR).
 */
declare const imageMaxDimensions: (maxWidth: number, maxHeight: number, message?: string) => Rule;

declare function isEmpty(value: any): boolean;
declare function toFileArray(value: any): File[];
declare function formatBytes(bytes: number): string;
declare function ok(): {
    valid: true;
};
declare function fail(message: string): {
    valid: false;
    message: string;
};

/** Validate a single field's value against an ordered list of rules. Stops at first failure. */
declare function validateField<T = any, TForm = any>(value: T, rules?: Rule<T, TForm>[], allValues?: TForm): ValidationResult;
/** Async-safe version — supports rules that return a Promise (e.g. imageMaxDimensions). */
declare function validateFieldAsync<T = any, TForm = any>(value: T, rules?: Rule<T, TForm>[], allValues?: TForm): Promise<ValidationResult>;
/** Validate an entire form object against a schema. Sync — throws if a rule is async. */
declare function validateSchema<T extends Record<string, any>>(values: T, schema: Schema<T>): ValidateSchemaResult<T>;
/** Validate an entire form object against a schema, awaiting any async rules. */
declare function validateSchemaAsync<T extends Record<string, any>>(values: T, schema: Schema<T>): Promise<ValidateSchemaResult<T>>;

export { type FieldErrors, type FieldValue, type Rule, type Schema, type ValidateSchemaResult, type ValidationResult, ageMinYears, alpha, alphaSpaces, alphanumeric, between, creditCard, custom, email, exactLength, fail, fileRequired, fileType, formatBytes, imageMaxDimensions, integer, isDate, isEmpty, matchField, max, maxDate, maxFileCount, maxFileSize, maxLength, maxSelected, min, minDate, minFileCount, minFileSize, minLength, minSelected, mustBeChecked, negative, noWhitespace, notPlaceholder, numeric, numericString, ok, oneOf, oneOfStrings, pattern, phone, positive, required, selectedBetween, step, timeBetween, toFileArray, url, validateField, validateFieldAsync, validateSchema, validateSchemaAsync, zipCode };
