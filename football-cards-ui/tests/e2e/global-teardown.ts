/**
 * Global teardown for E2E tests
 * Runs once after all test suites
 */
async function globalTeardown(globalSetupResult: {
  backendPid?: number;
  backendStarted?: boolean;
}) {
  console.log('🛑 E2E test suite completed');

  if (globalSetupResult?.backendStarted && globalSetupResult.backendPid) {
    try {
      console.log(
        `🔌 Stopping backend process pid=${globalSetupResult.backendPid}`,
      );
      process.kill(globalSetupResult.backendPid, 'SIGTERM');
      console.log('✅ Backend process stopped');
    } catch (error) {
      console.warn(
        '⚠️  Failed to stop backend process automatically. You may need to stop it manually.',
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
