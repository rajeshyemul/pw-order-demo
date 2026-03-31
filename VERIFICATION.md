# Verification Guide

This project is a consumer-side validation repo for `playwright-order-manager`.

Use this checklist when you want to verify that the published package works in a real Playwright project.

## Prerequisites

Make sure the local tooling is available:

```bash
node -v
npx playwright --version
npx pw-order --help
```

Expected result:

- `node` is available in your shell
- Playwright is installed
- `pw-order` prints package help successfully

## 1. Verify TypeScript Resolution

Run:

```bash
npx tsc --noEmit
```

Expected result:

- no TypeScript errors
- imports from `playwright-order-manager/fixtures` resolve correctly

This confirms that the package typings and subpath exports work in a consumer project.

## 2. Verify Plain Playwright Discovery

Run:

```bash
npx playwright test --list
```

Expected result:

- all test files are discovered
- all 15 tests are listed

Current demo suite should include tests from:

- `tests/setup.spec.ts`
- `tests/critical.spec.ts`
- `tests/important.spec.ts`
- `tests/mixed.spec.ts`
- `tests/nice-to-have.spec.ts`
- `tests/cleanup.spec.ts`

## 3. Verify Ordered Execution

Run:

```bash
npm run order
```

Expected result:

- ordered execution completes successfully
- all 15 tests pass
- `ordered-results/` is created
- output files are generated:

```text
ordered-results/ordered-summary.json
ordered-results/ordered-discovery.json
ordered-results/ordered-report.html
```

## 4. Verify Bucket Order

Open the report:

```bash
npm run report:ordered
```

Expected order:

```text
Run First -> Priority P1 -> Priority P2 -> Priority P3 -> Run Last
```

For this demo project, that means:

- `tests/setup.spec.ts` runs first
- `tests/critical.spec.ts` runs in `Priority P1`
- `tests/important.spec.ts` runs in `Priority P2`
- `tests/nice-to-have.spec.ts` runs in `Priority P3`
- `tests/cleanup.spec.ts` runs last

## 5. Verify Mixed Priorities in One File

Check `tests/mixed.spec.ts` in `ordered-summary.json` or the HTML report.

Expected result:

- `P1 — todo input is focusable` is grouped into `Priority P1`
- `P2 — all filter shows all todos` is grouped into `Priority P2`
- `P3 — empty state shows no footer` is grouped into `Priority P3`

This confirms that bucketing is per test case, not per file.

## 6. Verify Discovery Output

Open:

```text
ordered-results/ordered-discovery.json
```

Expected result:

- all discovered tests are present
- tags are normalized and stored in `@tag` form such as `@P1`, `@runFirst`, and `@runLast`

## 7. Verify Critical Failure Behavior

Temporarily force one `@P1` test to fail, then run:

```bash
npx pw-order --project=chromium --failure-policy=critical
```

Expected result:

- execution stops after the critical phase fails
- later middle buckets do not continue
- `@runLast` cleanup still runs

Suggested place to test this:

- `tests/critical.spec.ts`

Example temporary failure:

```ts
await expect(page).toHaveTitle(/This will fail/);
```

After verifying, revert the temporary failure.

## 8. Verify Continue Mode

With one test still intentionally failing, run:

```bash
npx pw-order --project=chromium --failure-policy=continue
```

Expected result:

- all buckets continue running
- the report shows the failure and the later executed tests

## 9. Verify Cleanup Guarantee

Temporarily force an early test to fail and rerun ordered execution:

```bash
npm run order
```

Expected result:

- `tests/cleanup.spec.ts` still runs at the end

Suggested place to create the early failure:

- `tests/setup.spec.ts`

This confirms that `@runLast` behaves as a cleanup boundary.

## 10. Verify Stale Bucket Cleanup

Run the ordered suite more than once:

```bash
npm run order
npm run order
```

Expected result:

- `ordered-results/` contains only the current run's `bucket-*.json` files
- old bucket JSON files from previous runs do not remain behind

## 11. Restore Green State

Remove any temporary failure you added and rerun:

```bash
npm run order
```

Expected result:

- the full ordered suite passes
- final report shows a successful run

## Release Confidence Checklist

You can consider the package validated when all of the following are true:

- TypeScript resolves `playwright-order-manager/fixtures`
- Playwright discovers all tests
- `pw-order` runs successfully
- buckets execute in the correct order
- mixed-priority tests in one file are split correctly across buckets
- discovery output is written correctly
- failure policies behave as expected
- `@runLast` always executes
- stale bucket JSON files are cleaned between runs
- report files are generated and readable
