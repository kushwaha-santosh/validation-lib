# Publishing Guide: GitHub + npmjs.org

This guide walks through taking the `validation-lib` folder from your machine to:
1. A public GitHub repository
2. A published package on [npmjs.org](https://www.npmjs.com)

---

## Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v18+) and npm installed
- A [GitHub](https://github.com) account
- An [npmjs.com](https://www.npmjs.com/signup) account

Check versions:
```bash
git --version
node --version
npm --version
```

---

## Part 1 — Push the project to GitHub

### 1. Unzip and enter the project
```bash
unzip validation-lib.zip
cd validation-lib
```

### 2. Initialize git
```bash
git init
git add .
git commit -m "Initial commit: validation-lib v1.0.0"
```

`node_modules` and `*.tgz` are already excluded via `.gitignore`. If you don't want to commit the built `dist/` folder to GitHub (optional — some teams keep it out of source control since it's a build artifact), add it:
```bash
echo "dist" >> .gitignore
git rm -r --cached dist
git add .gitignore
git commit -m "Ignore dist folder"
```
> If you exclude `dist/`, GitHub Actions (Part 3) will rebuild it automatically before publishing, so this is safe either way.

### 3. Create the GitHub repository

**Option A — GitHub website**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `validation-lib`
3. Keep it **Public** (required for a free npm package to link back to it)
4. Do **not** initialize with a README, .gitignore, or license (you already have them)
5. Click **Create repository**

**Option B — GitHub CLI**
```bash
gh repo create validation-lib --public --source=. --remote=origin
```

### 4. Connect and push (if you used Option A)
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/validation-lib.git
git push -u origin main
```

Replace `<your-username>` with your actual GitHub username. Your code is now live at:
`https://github.com/<your-username>/validation-lib`

### 5. Link the repo in `package.json`
Add these fields so npm shows a "Repository" link on your package page:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/<your-username>/validation-lib.git"
  },
  "bugs": {
    "url": "https://github.com/<your-username>/validation-lib/issues"
  },
  "homepage": "https://github.com/<your-username>/validation-lib#readme"
}
```

Commit that change:
```bash
git add package.json
git commit -m "Add repository links"
git push
```

---

## Part 2 — Publish to npmjs.org

### 1. Create an npm account (if you haven't)
Sign up at [npmjs.com/signup](https://www.npmjs.com/signup), or from the terminal:
```bash
npm adduser
```

### 2. Log in from the terminal
```bash
npm login
```
This opens a browser (or prompts for username/password + one-time code) to authenticate your terminal session. Confirm it worked:
```bash
npm whoami
```

### 3. Check the package name is available
```bash
npm view validation-lib
```
- If it prints `404 Not Found` → the name is free, you can publish as `validation-lib`.
- If it prints existing package info, or npm rejects the name as "too similar to an existing package" → pick a new name, or publish under your own **scope** (see below).

**Using a scope** (recommended if the plain name is taken/too similar, or if you want it namespaced to you):
```json
{
  "name": "@kushwaha-santosh/validation-lib"
}
```
This project is published as `@kushwaha-santosh/validation-lib`. Scoped packages are private by default, so you must publish with `--access=public` (shown below).

### 4. Build the package
```bash
npm install
npm run build
```
This regenerates `dist/` from `src/` (core, react, native, angular entry points). The `prepublishOnly` script in `package.json` also runs this automatically before every publish, as a safety net.

### 5. Do a dry run (see exactly what will be published)
```bash
npm publish --dry-run
```
Check the file list — it should include `dist/`, `package.json`, `README.md`, `LICENSE`, and nothing extra like `src/` or `node_modules/` (controlled by the `"files"` field in `package.json`).

### 6. Publish

Unscoped name:
```bash
npm publish
```

Scoped name (`@kushwaha-santosh/validation-lib`) — required here:
```bash
npm publish --access=public
```

You should see output like:
```
+ @kushwaha-santosh/validation-lib@1.0.0
```

Your package is now live at:
`https://www.npmjs.com/package/@kushwaha-santosh/validation-lib`

### 7. Install it anywhere to confirm
```bash
mkdir /tmp/test-install && cd /tmp/test-install
npm init -y
npm install @kushwaha-santosh/validation-lib
node -e "console.log(require('@kushwaha-santosh/validation-lib').required()(''))"
# → { valid: false, message: 'This field is required' }
```

---

## Part 3 — Releasing updates

Every time you change the code, bump the version before publishing again — npm rejects re-publishing the same version number.

```bash
# for a bug fix (1.0.0 → 1.0.1)
npm version patch

# for a new backwards-compatible feature (1.0.0 → 1.1.0)
npm version minor

# for a breaking change (1.0.0 → 2.0.0)
npm version major
```

`npm version` automatically updates `package.json`, creates a git commit, and tags it (e.g. `v1.0.1`). Then:
```bash
git push && git push --tags
npm publish
```

### Optional: auto-publish with GitHub Actions

Create `.github/workflows/publish.yml` so pushing a version tag publishes to npm automatically:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
      - run: npm install
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

To make this work:
1. Generate an npm token: [npmjs.com](https://www.npmjs.com) → your avatar → **Access Tokens** → **Generate New Token** → **Automation**
2. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `NPM_TOKEN`
   - Value: (paste the token)
3. From then on, `npm version patch && git push && git push --tags` triggers an automatic publish.

---

## Quick reference — full flow end to end

```bash
# One-time setup
cd validation-lib
git init && git add . && git commit -m "Initial commit"
gh repo create validation-lib --public --source=. --remote=origin
git push -u origin main
npm login

# Build + publish
npm install
npm run build
npm publish --access=public          # required for the @kushwaha-santosh scope

# Later, shipping an update
npm version patch
git push && git push --tags
npm publish
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `403 Forbidden` on publish | Name is taken, or you're not logged in as the owner — try a scoped name (`@you/validation-lib`) |
| `You must sign up for private packages` | You used a scoped name without `--access public` |
| `npm ERR! need auth` | Run `npm login` again — your token may have expired |
| GitHub push rejected (non-fast-forward) | Someone/something changed the remote — run `git pull --rebase` then push again |
| Published package missing files | Check the `"files"` array in `package.json` and re-run `npm publish --dry-run` to preview |
