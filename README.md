# @kushwaha-santosh/validation-lib

Framework-agnostic form validation rules for **React**, **Next.js**, **React Native**, and **Angular**.

One shared rule engine, four thin adapters. Covers every common HTML form control — text input, email, url, number, date, textarea, select (single/multi), radio, checkbox, and file inputs.

## Install

```bash
npm install @kushwaha-santosh/validation-lib
```

Peer dependencies are optional and only required for the adapter you use:

- `react` → for `@kushwaha-santosh/validation-lib/react` and `@kushwaha-santosh/validation-lib/native`
- `react-native` → for `@kushwaha-santosh/validation-lib/native`
- `@angular/core` + `@angular/forms` → for `@kushwaha-santosh/validation-lib/angular`

## Package layout

| Import path                                | Use in                                             |
| ------------------------------------------ | -------------------------------------------------- |
| `@kushwaha-santosh/validation-lib`         | Anywhere (framework-agnostic core: rules + engine) |
| `@kushwaha-santosh/validation-lib/react`   | React (web), Next.js client components             |
| `@kushwaha-santosh/validation-lib/native`  | React Native / Expo                                |
| `@kushwaha-santosh/validation-lib/angular` | Angular (reactive forms)                           |

---

## 1. Core concepts

A **rule** is a function `(value, allValues?) => { valid: boolean; message?: string }`.
A **schema** maps field names to an array of rules, checked in order (stops at first failure).

```ts
import {
  validateSchema,
  required,
  email,
  minLength,
} from "@kushwaha-santosh/validation-lib";

const schema = {
  name: [required(), minLength(2)],
  email: [required(), email()],
};

const { isValid, errors } = validateSchema(
  { name: "S", email: "not-an-email" },
  schema,
);
// isValid: false
// errors: { name: "Must be at least 2 characters", email: "Enter a valid email address" }
```

## 2. Full rule reference

### Presence / text (input, textarea, select)

| Rule                                | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| `required(message?)`                | Value must not be empty                           |
| `email(message?)`                   | Valid email format                                |
| `url(message?)`                     | Valid URL                                         |
| `pattern(regex, message?)`          | Must match a custom regex                         |
| `minLength(min, message?)`          | Minimum string length                             |
| `maxLength(max, message?)`          | Maximum string length                             |
| `exactLength(len, message?)`        | Exact string length                               |
| `alpha(message?)`                   | Letters only                                      |
| `alphaSpaces(message?)`             | Letters and spaces only                           |
| `alphanumeric(message?)`            | Letters and numbers only                          |
| `numericString(message?)`           | Digits only (string field)                        |
| `noWhitespace(message?)`            | No whitespace allowed                             |
| `phone(message?)`                   | Valid phone number (lenient, international)       |
| `zipCode(message?)`                 | Valid ZIP / postal code                           |
| `creditCard(message?)`              | Valid card number (Luhn check)                    |
| `matchField(otherKey, message?)`    | Must equal another field (confirm password/email) |
| `oneOfStrings(allowed[], message?)` | Must be one of a fixed string list                |
| `custom(fn, message?)`              | Your own predicate                                |

### Numbers (input[type=number], input[type=range])

| Rule                          | Description               |
| ----------------------------- | ------------------------- |
| `numeric(message?)`           | Must be a number          |
| `integer(message?)`           | Must be a whole number    |
| `min(n, message?)`            | Minimum value             |
| `max(n, message?)`            | Maximum value             |
| `between(min, max, message?)` | Value within a range      |
| `positive(message?)`          | Must be > 0               |
| `negative(message?)`          | Must be < 0               |
| `step(n, message?)`           | Must be a multiple of `n` |

### Dates & time (input[type=date/datetime-local/month/week/time])

| Rule                                      | Description                         |
| ----------------------------------------- | ----------------------------------- |
| `isDate(message?)`                        | Valid date string                   |
| `minDate(date, message?)`                 | On or after a date                  |
| `maxDate(date, message?)`                 | On or before a date                 |
| `ageMinYears(years, message?)`            | Date of birth implies a minimum age |
| `timeBetween(minTime, maxTime, message?)` | "HH:MM" within a range              |

### Checkbox / radio / select

| Rule                                         | Description                                        |
| -------------------------------------------- | -------------------------------------------------- |
| `mustBeChecked(message?)`                    | Single checkbox must be `true` (e.g. accept terms) |
| `oneOf(allowed[], message?)`                 | Radio/select value must be in the allowed list     |
| `notPlaceholder(placeholderValue, message?)` | Reject an unselected placeholder option            |
| `minSelected(n, message?)`                   | Multi-select/checkbox group: at least `n` chosen   |
| `maxSelected(n, message?)`                   | Multi-select/checkbox group: at most `n` chosen    |
| `selectedBetween(min, max, message?)`        | Multi-select/checkbox group: choose within a range |

### File input

| Rule                                           | Description                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `fileRequired(message?)`                       | At least one file selected                                         |
| `fileType(['image/*', '.pdf', ...], message?)` | Restrict by MIME type or extension                                 |
| `maxFileSize(bytes, message?)`                 | Per-file max size                                                  |
| `minFileSize(bytes, message?)`                 | Per-file min size                                                  |
| `maxFileCount(n, message?)`                    | Max number of files                                                |
| `minFileCount(n, message?)`                    | Min number of files                                                |
| `imageMaxDimensions(w, h, message?)`           | **Async** — max image width/height (browser only, no-op elsewhere) |

> Any rule that can be async (currently `imageMaxDimensions`) requires `validateFieldAsync` / `validateSchemaAsync`, or `{ async: true }` in the React hook options.

---

## 3. React (web)

```tsx
import { useValidation } from "@kushwaha-santosh/validation-lib/react";
import {
  required,
  email,
  minLength,
  mustBeChecked,
} from "@kushwaha-santosh/validation-lib";

function SignupForm() {
  const { values, errors, setField, validate } = useValidation(
    { name: "", email: "", terms: false },
    {
      name: [required(), minLength(2)],
      email: [required(), email()],
      terms: [mustBeChecked("You must accept the terms")],
    },
    { validateOnChange: true },
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      // submit values
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}

      <input
        value={values.email}
        onChange={(e) => setField("email", e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="checkbox"
        checked={values.terms}
        onChange={(e) => setField("terms", e.target.checked)}
      />
      {errors.terms && <span>{errors.terms}</span>}

      <button type="submit">Sign up</button>
    </form>
  );
}
```

### File input example

```tsx
import {
  fileRequired,
  fileType,
  maxFileSize,
} from "@kushwaha-santosh/validation-lib";

const schema = {
  avatar: [
    fileRequired(),
    fileType(["image/*"]),
    maxFileSize(2 * 1024 * 1024, "Max 2MB"),
  ],
};
// <input type="file" onChange={(e) => setField("avatar", e.target.files)} />
```

---

## 4. Next.js

Works the same as React in **client components**. Mark the component `"use client"` since form state/hooks need the client runtime:

```tsx
"use client";
import { useValidation } from "@kushwaha-santosh/validation-lib/react";
import { required, email } from "@kushwaha-santosh/validation-lib";

export default function ContactForm() {
  const { values, errors, setField, validate } = useValidation(
    { email: "" },
    { email: [required(), email()] },
  );
  // ...same as the React example above
}
```

For **server actions** or API routes, use the framework-agnostic core directly (no React needed, safe during SSR):

```ts
import {
  validateSchema,
  required,
  email,
} from "@kushwaha-santosh/validation-lib";

export async function submitAction(formData: FormData) {
  const values = { email: formData.get("email") as string };
  const { isValid, errors } = validateSchema(values, {
    email: [required(), email()],
  });
  if (!isValid) return { errors };
  // ...persist
}
```

---

## 5. React Native / Expo

Identical hook API — no DOM APIs are used, so it works unchanged:

```tsx
import { View, TextInput, Text, Button } from "react-native";
import { useValidation } from "@kushwaha-santosh/validation-lib/native";
import { required, email } from "@kushwaha-santosh/validation-lib";

export default function LoginScreen() {
  const { values, errors, setField, validate } = useValidation(
    { email: "", password: "" },
    { email: [required(), email()], password: [required()] },
  );

  return (
    <View>
      <TextInput
        value={values.email}
        onChangeText={(t) => setField("email", t)}
      />
      {errors.email && <Text>{errors.email}</Text>}

      <TextInput
        value={values.password}
        onChangeText={(t) => setField("password", t)}
        secureTextEntry
      />
      {errors.password && <Text>{errors.password}</Text>}

      <Button
        title="Login"
        onPress={() => validate() && console.log("submit", values)}
      />
    </View>
  );
}
```

---

## 6. Angular (Reactive Forms)

```ts
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  toValidator,
  matchControls,
  getErrorMessage,
} from "@kushwaha-santosh/validation-lib/angular";
import { required, email, minLength } from "@kushwaha-santosh/validation-lib";

@Component({
  selector: "app-signup",
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" />
      <span *ngIf="form.get('email')?.touched">{{ error("email") }}</span>

      <input formControlName="password" type="password" />
      <input formControlName="confirm" type="password" />
      <span *ngIf="form.errors?.['mismatch']">{{
        form.errors?.["mismatch"]
      }}</span>

      <button type="submit" [disabled]="form.invalid">Sign up</button>
    </form>
  `,
})
export class SignupComponent {
  form = this.fb.group(
    {
      email: ["", [toValidator(required()), toValidator(email())]],
      password: ["", [toValidator(required()), toValidator(minLength(8))]],
      confirm: ["", [toValidator(required())]],
    },
    {
      validators: matchControls("password", "confirm", "Passwords must match"),
    },
  );

  constructor(private fb: FormBuilder) {}

  error(field: string) {
    return getErrorMessage(this.form.get(field));
  }

  submit() {
    if (this.form.valid) {
      // this.form.value
    }
  }
}
```

### Async rule (e.g. image dimension check) in Angular

```ts
import { toAsyncValidator } from "@kushwaha-santosh/validation-lib/angular";
import { imageMaxDimensions } from "@kushwaha-santosh/validation-lib";

avatar: ["", [], [toAsyncValidator(imageMaxDimensions(1024, 1024))]],
```

---

## 7. Async validation (any framework)

Use `validateFieldAsync` / `validateSchemaAsync` from the core, or pass `{ async: true }` to the React hook, whenever your schema includes an async rule like `imageMaxDimensions`.

```ts
import {
  validateSchemaAsync,
  fileRequired,
  imageMaxDimensions,
} from "@kushwaha-santosh/validation-lib";

const result = await validateSchemaAsync(
  { avatar: fileList },
  { avatar: [fileRequired(), imageMaxDimensions(2000, 2000)] },
);
```

---

## 8. Writing your own rule

A rule is just a function — combine it with the built-ins freely:

```ts
import { Rule } from "@kushwaha-santosh/validation-lib";

const isEven: Rule<number> = (value) =>
  value % 2 === 0
    ? { valid: true }
    : { valid: false, message: "Must be an even number" };
```

---

## License

MIT
