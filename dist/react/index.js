"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  ageMinYears: () => ageMinYears,
  alpha: () => alpha,
  alphaSpaces: () => alphaSpaces,
  alphanumeric: () => alphanumeric,
  between: () => between,
  creditCard: () => creditCard,
  custom: () => custom,
  email: () => email,
  exactLength: () => exactLength,
  fail: () => fail,
  fileRequired: () => fileRequired,
  fileType: () => fileType,
  formatBytes: () => formatBytes,
  imageMaxDimensions: () => imageMaxDimensions,
  integer: () => integer,
  isDate: () => isDate,
  isEmpty: () => isEmpty,
  matchField: () => matchField,
  max: () => max,
  maxDate: () => maxDate,
  maxFileCount: () => maxFileCount,
  maxFileSize: () => maxFileSize,
  maxLength: () => maxLength,
  maxSelected: () => maxSelected,
  min: () => min,
  minDate: () => minDate,
  minFileCount: () => minFileCount,
  minFileSize: () => minFileSize,
  minLength: () => minLength,
  minSelected: () => minSelected,
  mustBeChecked: () => mustBeChecked,
  negative: () => negative,
  noWhitespace: () => noWhitespace,
  notPlaceholder: () => notPlaceholder,
  numeric: () => numeric,
  numericString: () => numericString,
  ok: () => ok,
  oneOf: () => oneOf,
  oneOfStrings: () => oneOfStrings,
  pattern: () => pattern,
  phone: () => phone,
  positive: () => positive,
  required: () => required,
  selectedBetween: () => selectedBetween,
  step: () => step,
  timeBetween: () => timeBetween,
  toFileArray: () => toFileArray,
  url: () => url,
  useValidation: () => useValidation,
  validateField: () => validateField,
  validateFieldAsync: () => validateFieldAsync,
  validateSchema: () => validateSchema,
  validateSchemaAsync: () => validateSchemaAsync,
  zipCode: () => zipCode
});
module.exports = __toCommonJS(react_exports);

// src/core/rules/helpers.ts
function isEmpty(value) {
  if (value === void 0 || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  if (typeof FileList !== "undefined" && value instanceof FileList) return value.length === 0;
  return false;
}
function toFileArray(value) {
  if (!value) return [];
  if (typeof File !== "undefined" && value instanceof File) return [value];
  if (typeof FileList !== "undefined" && value instanceof FileList) return Array.from(value);
  if (Array.isArray(value)) return value;
  return [];
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function ok() {
  return { valid: true };
}
function fail(message) {
  return { valid: false, message };
}

// src/core/rules/string.ts
var required = (message = "This field is required") => (value) => isEmpty(value) ? fail(message) : ok();
var email = (message = "Enter a valid email address") => (value) => {
  if (isEmpty(value)) return ok();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value)) ? ok() : fail(message);
};
var url = (message = "Enter a valid URL") => (value) => {
  if (isEmpty(value)) return ok();
  try {
    new URL(String(value));
    return ok();
  } catch {
    const re = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;
    return re.test(String(value)) ? ok() : fail(message);
  }
};
var pattern = (regex, message = "Invalid format") => (value) => {
  if (isEmpty(value)) return ok();
  return regex.test(String(value)) ? ok() : fail(message);
};
var minLength = (min2, message) => (value) => {
  if (isEmpty(value)) return ok();
  const len = String(value).length;
  return len >= min2 ? ok() : fail(message != null ? message : `Must be at least ${min2} characters`);
};
var maxLength = (max2, message) => (value) => {
  if (isEmpty(value)) return ok();
  const len = String(value).length;
  return len <= max2 ? ok() : fail(message != null ? message : `Must be no more than ${max2} characters`);
};
var exactLength = (len, message) => (value) => {
  if (isEmpty(value)) return ok();
  return String(value).length === len ? ok() : fail(message != null ? message : `Must be exactly ${len} characters`);
};
var alpha = (message = "Only letters are allowed") => (value) => isEmpty(value) ? ok() : /^[A-Za-z]+$/.test(String(value)) ? ok() : fail(message);
var alphaSpaces = (message = "Only letters and spaces are allowed") => (value) => isEmpty(value) ? ok() : /^[A-Za-z\s]+$/.test(String(value)) ? ok() : fail(message);
var alphanumeric = (message = "Only letters and numbers are allowed") => (value) => isEmpty(value) ? ok() : /^[A-Za-z0-9]+$/.test(String(value)) ? ok() : fail(message);
var numericString = (message = "Only numbers are allowed") => (value) => isEmpty(value) ? ok() : /^[0-9]+$/.test(String(value)) ? ok() : fail(message);
var noWhitespace = (message = "Whitespace is not allowed") => (value) => isEmpty(value) ? ok() : /^\S+$/.test(String(value)) ? ok() : fail(message);
var phone = (message = "Enter a valid phone number") => (value) => {
  if (isEmpty(value)) return ok();
  const digits = String(value).replace(/\D/g, "");
  const re = /^\+?[0-9\s\-()]{7,20}$/;
  return re.test(String(value)) && digits.length >= 7 && digits.length <= 15 ? ok() : fail(message);
};
var zipCode = (message = "Enter a valid ZIP / postal code") => (value) => {
  if (isEmpty(value)) return ok();
  const re = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/;
  return re.test(String(value)) ? ok() : fail(message);
};
var creditCard = (message = "Enter a valid card number") => (value) => {
  if (isEmpty(value)) return ok();
  const digits = String(value).replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(digits)) return fail(message);
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
var matchField = (fieldKey, message = "Fields do not match") => (value, allValues) => {
  if (!allValues) return ok();
  return value === allValues[fieldKey] ? ok() : fail(message);
};
var oneOfStrings = (allowed, message) => (value) => {
  if (isEmpty(value)) return ok();
  return allowed.includes(String(value)) ? ok() : fail(message != null ? message : `Must be one of: ${allowed.join(", ")}`);
};
var custom = (fn, message = "Invalid value") => (value, allValues) => fn(value, allValues) ? ok() : fail(message);

// src/core/rules/number-date.ts
var numeric = (message = "Must be a number") => (value) => isEmpty(value) ? ok() : isNaN(Number(value)) ? fail(message) : ok();
var integer = (message = "Must be a whole number") => (value) => {
  if (isEmpty(value)) return ok();
  const n = Number(value);
  return Number.isInteger(n) ? ok() : fail(message);
};
var min = (minVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const n = Number(value);
  if (isNaN(n)) return fail(message != null ? message : `Must be at least ${minVal}`);
  return n >= minVal ? ok() : fail(message != null ? message : `Must be at least ${minVal}`);
};
var max = (maxVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const n = Number(value);
  if (isNaN(n)) return fail(message != null ? message : `Must be no more than ${maxVal}`);
  return n <= maxVal ? ok() : fail(message != null ? message : `Must be no more than ${maxVal}`);
};
var between = (minVal, maxVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const n = Number(value);
  if (isNaN(n)) return fail(message != null ? message : `Must be between ${minVal} and ${maxVal}`);
  return n >= minVal && n <= maxVal ? ok() : fail(message != null ? message : `Must be between ${minVal} and ${maxVal}`);
};
var positive = (message = "Must be a positive number") => (value) => isEmpty(value) ? ok() : Number(value) > 0 ? ok() : fail(message);
var negative = (message = "Must be a negative number") => (value) => isEmpty(value) ? ok() : Number(value) < 0 ? ok() : fail(message);
var step = (stepVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const n = Number(value);
  const remainder = Math.abs(Math.round(n / stepVal) * stepVal - n);
  return remainder < 1e-9 ? ok() : fail(message != null ? message : `Must be a multiple of ${stepVal}`);
};
var isDate = (message = "Enter a valid date") => (value) => isEmpty(value) ? ok() : isNaN(Date.parse(String(value))) ? fail(message) : ok();
var minDate = (minDateVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const v = new Date(String(value));
  const m = new Date(minDateVal);
  if (isNaN(v.getTime())) return fail("Enter a valid date");
  return v >= m ? ok() : fail(message != null ? message : `Date must be on or after ${m.toDateString()}`);
};
var maxDate = (maxDateVal, message) => (value) => {
  if (isEmpty(value)) return ok();
  const v = new Date(String(value));
  const m = new Date(maxDateVal);
  if (isNaN(v.getTime())) return fail("Enter a valid date");
  return v <= m ? ok() : fail(message != null ? message : `Date must be on or before ${m.toDateString()}`);
};
var ageMinYears = (years, message) => (value) => {
  if (isEmpty(value)) return ok();
  const dob = new Date(String(value));
  if (isNaN(dob.getTime())) return fail("Enter a valid date");
  const cutoff = /* @__PURE__ */ new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return dob <= cutoff ? ok() : fail(message != null ? message : `Must be at least ${years} years old`);
};
var timeBetween = (minTime, maxTime, message) => (value) => {
  if (isEmpty(value)) return ok();
  return value >= minTime && value <= maxTime ? ok() : fail(message != null ? message : `Time must be between ${minTime} and ${maxTime}`);
};

// src/core/rules/choice.ts
var mustBeChecked = (message = "You must check this box") => (value) => value === true ? ok() : fail(message);
var minSelected = (minCount, message) => (value) => {
  const arr = Array.isArray(value) ? value : [];
  return arr.length >= minCount ? ok() : fail(message != null ? message : `Select at least ${minCount}`);
};
var maxSelected = (maxCount, message) => (value) => {
  const arr = Array.isArray(value) ? value : [];
  return arr.length <= maxCount ? ok() : fail(message != null ? message : `Select no more than ${maxCount}`);
};
var selectedBetween = (minCount, maxCount, message) => (value) => {
  const arr = Array.isArray(value) ? value : [];
  return arr.length >= minCount && arr.length <= maxCount ? ok() : fail(message != null ? message : `Select between ${minCount} and ${maxCount}`);
};
var oneOf = (allowed, message) => (value) => {
  if (isEmpty(value)) return ok();
  return allowed.includes(value) ? ok() : fail(message != null ? message : "Please choose a valid option");
};
var notPlaceholder = (placeholderValue, message = "Please make a selection") => (value) => value === placeholderValue ? fail(message) : ok();

// src/core/rules/file.ts
var fileRequired = (message = "Please select a file") => (value) => toFileArray(value).length > 0 ? ok() : fail(message);
var fileType = (accepted, message) => (value) => {
  const files = toFileArray(value);
  if (files.length === 0) return ok();
  const isAccepted = (file) => {
    const name = (file.name || "").toLowerCase();
    const type = (file.type || "").toLowerCase();
    return accepted.some((pattern2) => {
      const p = pattern2.trim().toLowerCase();
      if (p.startsWith(".")) return name.endsWith(p);
      if (p.endsWith("/*")) return type.startsWith(p.replace("/*", "/"));
      return type === p;
    });
  };
  const allOk = files.every(isAccepted);
  return allOk ? ok() : fail(message != null ? message : `Allowed file types: ${accepted.join(", ")}`);
};
var maxFileSize = (maxBytes, message) => (value) => {
  const files = toFileArray(value);
  const oversized = files.find((f) => f.size > maxBytes);
  return oversized ? fail(message != null ? message : `File must be smaller than ${formatBytes(maxBytes)}`) : ok();
};
var minFileSize = (minBytes, message) => (value) => {
  const files = toFileArray(value);
  const undersized = files.find((f) => f.size < minBytes);
  return undersized ? fail(message != null ? message : `File must be at least ${formatBytes(minBytes)}`) : ok();
};
var maxFileCount = (maxCount, message) => (value) => {
  const files = toFileArray(value);
  return files.length <= maxCount ? ok() : fail(message != null ? message : `Select no more than ${maxCount} file(s)`);
};
var minFileCount = (minCount, message) => (value) => {
  const files = toFileArray(value);
  return files.length >= minCount ? ok() : fail(message != null ? message : `Select at least ${minCount} file(s)`);
};
var imageMaxDimensions = (maxWidth, maxHeight, message) => async (value) => {
  const files = toFileArray(value);
  if (files.length === 0) return ok();
  if (typeof Image === "undefined" || typeof URL === "undefined") return ok();
  const checks = files.map(
    (file) => new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img.width <= maxWidth && img.height <= maxHeight);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(true);
      };
      img.src = objectUrl;
    })
  );
  const results = await Promise.all(checks);
  const allOk = results.every(Boolean);
  return allOk ? ok() : fail(message != null ? message : `Image must be at most ${maxWidth}x${maxHeight}px`);
};

// src/core/validate.ts
function validateField(value, rules = [], allValues) {
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
async function validateFieldAsync(value, rules = [], allValues) {
  for (const rule of rules) {
    const result = await rule(value, allValues);
    if (!result.valid) return result;
  }
  return { valid: true };
}
function validateSchema(values, schema) {
  var _a;
  const errors = {};
  let isValid = true;
  for (const key in schema) {
    const rules = (_a = schema[key]) != null ? _a : [];
    const result = validateField(values[key], rules, values);
    if (!result.valid) {
      isValid = false;
      errors[key] = result.message;
    }
  }
  return { isValid, errors };
}
async function validateSchemaAsync(values, schema) {
  const errors = {};
  let isValid = true;
  const keys = Object.keys(schema);
  await Promise.all(
    keys.map(async (key) => {
      var _a;
      const rules = (_a = schema[key]) != null ? _a : [];
      const result = await validateFieldAsync(values[key], rules, values);
      if (!result.valid) {
        isValid = false;
        errors[key] = result.message;
      }
    })
  );
  return { isValid, errors };
}

// src/react/useValidation.ts
var import_react = require("react");
function useValidation(initialValues, schema, options = {}) {
  const { validateOnChange = false, async = false } = options;
  const [values, setValues] = (0, import_react.useState)(initialValues);
  const [errors, setErrors] = (0, import_react.useState)({});
  const [touched, setTouched] = (0, import_react.useState)({});
  const validateOne = (0, import_react.useCallback)(
    (key) => {
      var _a;
      const rules = (_a = schema[key]) != null ? _a : [];
      if (async) {
        return validateFieldAsync(values[key], rules, values).then((result2) => {
          setErrors((prev) => ({ ...prev, [key]: result2.valid ? void 0 : result2.message }));
          return result2.valid;
        });
      }
      const result = validateField(values[key], rules, values);
      setErrors((prev) => ({ ...prev, [key]: result.valid ? void 0 : result.message }));
      return result.valid;
    },
    [values, schema, async]
  );
  const validate = (0, import_react.useCallback)(() => {
    if (async) {
      return validateSchemaAsync(values, schema).then((result2) => {
        setErrors(result2.errors);
        return result2.isValid;
      });
    }
    const result = validateSchema(values, schema);
    setErrors(result.errors);
    return result.isValid;
  }, [values, schema, async]);
  const setField = (0, import_react.useCallback)(
    (key, value) => {
      var _a;
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        return next;
      });
      if (validateOnChange) {
        const rules = (_a = schema[key]) != null ? _a : [];
        const nextValues = { ...values, [key]: value };
        if (async) {
          validateFieldAsync(value, rules, nextValues).then((result) => {
            setErrors((prev) => ({ ...prev, [key]: result.valid ? void 0 : result.message }));
          });
        } else {
          const result = validateField(value, rules, nextValues);
          setErrors((prev) => ({ ...prev, [key]: result.valid ? void 0 : result.message }));
        }
      }
    },
    [schema, validateOnChange, values, async]
  );
  const setFieldTouched = (0, import_react.useCallback)((key, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [key]: isTouched }));
  }, []);
  const reset = (0, import_react.useCallback)(
    (newValues) => {
      setValues(newValues != null ? newValues : initialValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );
  const isValid = (0, import_react.useMemo)(() => Object.values(errors).every((e) => !e), [errors]);
  return { values, errors, touched, setField, setFieldTouched, validateOne, validate, reset, isValid };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ageMinYears,
  alpha,
  alphaSpaces,
  alphanumeric,
  between,
  creditCard,
  custom,
  email,
  exactLength,
  fail,
  fileRequired,
  fileType,
  formatBytes,
  imageMaxDimensions,
  integer,
  isDate,
  isEmpty,
  matchField,
  max,
  maxDate,
  maxFileCount,
  maxFileSize,
  maxLength,
  maxSelected,
  min,
  minDate,
  minFileCount,
  minFileSize,
  minLength,
  minSelected,
  mustBeChecked,
  negative,
  noWhitespace,
  notPlaceholder,
  numeric,
  numericString,
  ok,
  oneOf,
  oneOfStrings,
  pattern,
  phone,
  positive,
  required,
  selectedBetween,
  step,
  timeBetween,
  toFileArray,
  url,
  useValidation,
  validateField,
  validateFieldAsync,
  validateSchema,
  validateSchemaAsync,
  zipCode
});
