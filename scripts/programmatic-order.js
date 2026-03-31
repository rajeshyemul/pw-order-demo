'use strict';

const { TestOrderManager } = require('playwright-order-manager');

async function main() {
  const config = {
    orderMode: 'priority',
    failurePolicy: 'continue',
    project: 'chromium',
    reportRoot: './programmatic-results',
  };

  console.log('[programmatic-order] Starting ordered run with config:');
  console.log(JSON.stringify(config, null, 2));

  const exitCode = await TestOrderManager.run(config);

  console.log(`[programmatic-order] Finished with exit code: ${exitCode}`);
  console.log('[programmatic-order] Report: ./programmatic-results/ordered-report.html');

  process.exit(exitCode);
}

main().catch((error) => {
  console.error('[programmatic-order] Unexpected error:', error);
  process.exit(1);
});
