# pw-order-demo

Reference consumer project for validating and learning [`playwright-order-manager`](https://www.npmjs.com/package/playwright-order-manager).

This repo is intentionally small. Its job is to behave like a real Playwright project that installs the published package and proves that ordered execution, discovery, reporting, and tag-based bucketing all work as expected.

If you are learning the package, this repo is meant to be the practical companion to the main package docs.

## Related Links

- npm package: [`playwright-order-manager`](https://www.npmjs.com/package/playwright-order-manager)
- source repository: [`rajeshyemul/playwright-order-manager`](https://github.com/rajeshyemul/playwright-order-manager)
- programmatic usage guide: [PROGRAMMATIC-USAGE.md](./PROGRAMMATIC-USAGE.md)
- verification checklist: [VERIFICATION.md](./VERIFICATION.md)

## What This Project Verifies

This demo validates that the published package works correctly in a downstream project:

- TypeScript resolves `playwright-order-manager/fixtures`
- tests can import the package's custom `test` fixture
- `pw-order` discovers tests correctly
- tests are grouped into the correct ordered buckets
- mixed priorities in a single file are split per test instead of per file
- ordered reports are created successfully
- cleanup tests still run last

You can also use this repo as a reference implementation for adopting the package in your own Playwright project.

## Test Structure

The suite is organized to exercise all of the important package behaviors:

- `tests/setup.spec.ts`
  Uses `@runFirst` and should always execute first
- `tests/critical.spec.ts`
  Uses `@P1` for the highest-priority normal bucket
- `tests/important.spec.ts`
  Uses `@P2`
- `tests/nice-to-have.spec.ts`
  Uses `@P3`
- `tests/mixed.spec.ts`
  Contains `@P1`, `@P2`, and `@P3` tests in the same file to verify per-test bucketing
- `tests/cleanup.spec.ts`
  Uses `@runLast` and should always execute last

## How It Uses `playwright-order-manager`

Each test file imports:

```ts
import { test, expect } from 'playwright-order-manager/fixtures';
```

That fixture import is the key integration point. It allows the package to collect discovery metadata and behave as a drop-in replacement for Playwright's normal `test` object.

The project then runs ordered execution through:

```bash
npx pw-order --project=chromium
```

If you want to understand the package source itself, use the main repository:

- [`rajeshyemul/playwright-order-manager`](https://github.com/rajeshyemul/playwright-order-manager)

If you want to understand how a consumer project integrates with it, use this demo repo.

## Scripts

Available npm scripts:

```bash
npm test
npm run test:headed
npm run order
npm run report:ordered
```

What they do:

- `npm test`
  Runs the suite with plain Playwright
- `npm run test:headed`
  Runs Playwright in headed mode
- `npm run order`
  Runs the suite through `playwright-order-manager`
- `npm run report:ordered`
  Opens the generated ordered HTML report at `ordered-results/ordered-report.html`

## Ordered Execution Expectations

For this demo, the expected bucket order is:

```text
Run First -> Priority P1 -> Priority P2 -> Priority P3 -> Run Last
```

Expected mapping:

- `Run First`
  Tests from `tests/setup.spec.ts`
- `Priority P1`
  Tests from `tests/critical.spec.ts` plus the `@P1` test in `tests/mixed.spec.ts`
- `Priority P2`
  Tests from `tests/important.spec.ts` plus the `@P2` test in `tests/mixed.spec.ts`
- `Priority P3`
  Tests from `tests/nice-to-have.spec.ts` plus the `@P3` test in `tests/mixed.spec.ts`
- `Run Last`
  Test from `tests/cleanup.spec.ts`

## Report Output

After running:

```bash
npm run order
```

the package should generate:

```text
ordered-results/ordered-summary.json
ordered-results/ordered-discovery.json
ordered-results/ordered-report.html
```

These files are useful for validating:

- discovery correctness
- bucket planning
- final execution order
- per-test result reporting

## Playwright Configuration Notes

This project points Playwright at the TodoMVC demo app in [playwright.config.ts](/Users/rajesh.yemul/Projects/pw-order-demo/playwright.config.ts).

The tests navigate using `/todomvc`, which avoids the GitHub Pages root-path issue you can hit if you navigate to `/` with a `baseURL` that already contains a path segment.

## Verification Workflow

For the full validation checklist, see [VERIFICATION.md](./VERIFICATION.md).

The usual flow is:

```bash
npx tsc --noEmit
npx playwright test --list
npm run order
npm run report:ordered
```

## Why This Repo Exists

This is not meant to be a full product test suite. It is a release-validation repo for the published package.

It is also intended to be a reader-friendly example project that shows how to use the package in practice.

It helps answer:

- Does the published package install cleanly in a separate project?
- Do the exported fixtures resolve correctly in TypeScript?
- Does ordered execution work end to end?
- Are reports generated correctly for a real consumer?
- Do mixed-priority tests behave correctly after publication?

If you are evaluating `playwright-order-manager`, start with the package README for features and installation, then use this repo to see a complete working example.
