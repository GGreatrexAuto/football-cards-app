import path from 'node:path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { request as httpRequest } from 'node:http';

const REPO_ROOT = path.resolve(__dirname, '../../../');

interface GlobalSetupResult {
  backendPid?: number;
  backendStarted: boolean;
}

const BACKEND_HOST = process.env.PLAYWRIGHT_BACKEND_HOST || '127.0.0.1';
const BACKEND_PORT = process.env.PLAYWRIGHT_BACKEND_PORT || '8000';
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const BACKEND_HEALTH_PATH = '/api/v1/health';
const BACKEND_COMMAND = process.env.PLAYWRIGHT_BACKEND_COMMAND || 'python';
const BACKEND_ARGS = process.env.PLAYWRIGHT_BACKEND_ARGS
  ? process.env.PLAYWRIGHT_BACKEND_ARGS.split(' ')
  : [
      '-m',
      'uvicorn',
      'app.main:app',
      '--host',
      BACKEND_HOST,
      '--port',
      BACKEND_PORT,
      '--reload',
    ];

const FRONTEND_HOST = '127.0.0.1';
const FRONTEND_PORT = 3000;

function checkFrontendHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = httpRequest(
      {
        hostname: FRONTEND_HOST,
        port: FRONTEND_PORT,
        path: '/',
        method: 'GET',
        timeout: 3000,
      },
      (res) => {
        resolve(res.statusCode !== undefined && res.statusCode < 500);
      },
    );

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function checkBackendHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = httpRequest(
      {
        hostname: BACKEND_HOST,
        port: Number(BACKEND_PORT),
        path: BACKEND_HEALTH_PATH,
        method: 'GET',
        timeout: 3000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      },
    );

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function waitForBackendReady(
  retries = 60,
  intervalMs = 2000,
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    if (await checkBackendHealth()) {
      return;
    }

    console.log(
      `Waiting for backend to become ready (attempt ${attempt}/${retries})...`,
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `Backend did not become ready at ${BACKEND_URL}${BACKEND_HEALTH_PATH}`,
  );
}

async function startBackendProcess(): Promise<ChildProcessWithoutNullStreams> {
  const backend = spawn(BACKEND_COMMAND, BACKEND_ARGS, {
    cwd: REPO_ROOT,
    env: { ...process.env },
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  backend.on('exit', (code, signal) => {
    console.log(`Backend process exited with code=${code} signal=${signal}`);
  });

  return backend;
}

/**
 * Global setup for E2E tests
 * Runs once before all test suites
 */
async function globalSetup(): Promise<GlobalSetupResult> {
  console.log('🚀 Starting E2E test suite...');

  const backendUp = await checkBackendHealth();
  const frontendUp = await checkFrontendHealth();

  if (!backendUp && !frontendUp) {
    throw new Error(
      'Neither server is running. Start both before running E2E:\n' +
        '  bash scripts/start.sh           (interactive)\n' +
        '  bash scripts/ensure-servers.sh  (background, used by pre-commit hook)',
    );
  }

  if (backendUp) {
    console.log(
      `✅ Backend already running at ${BACKEND_URL}${BACKEND_HEALTH_PATH}`,
    );
    return { backendStarted: false };
  }

  console.log('🔧 Starting backend server...');
  const backendProcess = await startBackendProcess();

  await waitForBackendReady(5, 2000);
  console.log(
    `✅ Backend is available at ${BACKEND_URL}${BACKEND_HEALTH_PATH}`,
  );

  return {
    backendPid: backendProcess.pid,
    backendStarted: true,
  };
}

export default globalSetup;
