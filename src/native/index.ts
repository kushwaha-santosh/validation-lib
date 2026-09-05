// React Native uses the exact same hook as React (no DOM APIs involved).
// Kept as its own entry point/subpath so consumers can `import ... from "validation-lib/native"`
// and so native-only rules can be added here later without touching the web bundle.
export * from "../core";
export * from "../react/useValidation";
