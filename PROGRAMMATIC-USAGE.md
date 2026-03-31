# Programmatic Usage

This file explains how to use `playwright-order-manager` without the `pw-order` CLI.

Instead of running:

```bash
npx pw-order --project=chromium
```

you can call the package directly from your own Node script.

## Why use programmatic mode

This is useful when you want to:

- trigger ordered execution from your own build or test script
- compute options dynamically in code
- choose different report folders for different scenarios
- integrate ordered execution into a larger automation workflow
- handle the exit code yourself

## Example in This Project

This project includes:

```text
scripts/programmatic-order.js
```

That script does this:

```js
const { TestOrderManager } = require('playwright-order-manager');

const exitCode = await TestOrderManager.run({
  orderMode: 'priority',
  failurePolicy: 'continue',
  project: 'chromium',
  reportRoot: './programmatic-results',
});

process.exit(exitCode);
```

## How to run it

From the project root:

```bash
npm run order:programmatic
```

To open the generated report:

```bash
npm run report:programmatic
```

## What happens internally

When `TestOrderManager.run(...)` is called, the package does the same high-level flow as the CLI:

1. Discover tests
2. Read tags and priorities
3. Build ordered buckets
4. Execute each bucket in order
5. Generate JSON and HTML reports
6. Return an exit code

The main difference is that your script is the caller, not the `pw-order` binary.

## Meaning of each option

### `orderMode`

```js
orderMode: 'priority'
```

This tells the package to group tests by priority tags like `@P1`, `@P2`, and `@P3`.

### `failurePolicy`

```js
failurePolicy: 'continue'
```

This tells the package to keep running later buckets even if an earlier bucket fails.

Other possible values:

- `critical`
- `immediate`

### `project`

```js
project: 'chromium'
```

This tells Playwright which configured project to run.

### `reportRoot`

```js
reportRoot: './programmatic-results'
```

This changes where the ordered summary, discovery JSON, and HTML report are written.

In this demo, it keeps the programmatic run separate from the normal CLI run.

## Practical understanding

Think of it this way:

- `pw-order` is a ready-made command-line wrapper around `TestOrderManager.run(...)`
- programmatic usage lets you call the same engine yourself

So these two are conceptually similar:

```bash
npx pw-order --project=chromium
```

and

```js
await TestOrderManager.run({
  project: 'chromium',
});
```

The CLI is convenient for normal use.
The programmatic API is better when you want to embed ordered execution inside your own code.

## Suggested learning flow

1. Run the normal CLI mode:

```bash
npm run order
```

2. Run the programmatic version:

```bash
npm run order:programmatic
```

3. Compare the outputs:

- `ordered-results/`
- `programmatic-results/`

4. Open both reports and compare the bucket order.

## Undoing These Local Learning Changes

If you do not want to keep these learning files later, remove:

- `scripts/programmatic-order.js`
- `PROGRAMMATIC-USAGE.md`

And remove these scripts from `package.json`:

- `order:programmatic`
- `report:programmatic`
