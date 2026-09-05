import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Rule, validateField, validateFieldAsync } from "../core";

/** Wrap a single sync core Rule as an Angular reactive-forms ValidatorFn. */
export function toValidator(rule: Rule): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = validateField(control.value, [rule]);
    return result.valid ? null : { validation: result.message };
  };
}

/** Wrap several sync core Rules as one Angular ValidatorFn (stops at first failure). */
export function toValidators(rules: Rule[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = validateField(control.value, rules);
    return result.valid ? null : { validation: result.message };
  };
}

/** Wrap a rule (sync or async, e.g. imageMaxDimensions) as an Angular AsyncValidatorFn. */
export function toAsyncValidator(rule: Rule): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const result = await validateFieldAsync(control.value, [rule]);
    return result.valid ? null : { validation: result.message };
  };
}

/**
 * Cross-field validator for a FormGroup, e.g. confirm-password.
 * Usage: this.fb.group({ password: [...], confirm: [...] }, { validators: matchControls("password", "confirm") })
 */
export function matchControls(fieldA: string, fieldB: string, message = "Fields do not match"): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(fieldA)?.value;
    const b = group.get(fieldB)?.value;
    return a === b ? null : { mismatch: message };
  };
}

/** Convenience: extract the first error message from an Angular control, if any. */
export function getErrorMessage(control: AbstractControl | null): string | undefined {
  if (!control || !control.errors) return undefined;
  const errors = control.errors;
  return errors["validation"] || errors["mismatch"] || Object.values(errors)[0];
}
