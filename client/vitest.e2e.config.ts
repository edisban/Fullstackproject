import { defineConfig, defineWorkspace } from 'vitest/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file for test credentials BEFORE vitest starts
const loadEnvFile = () => {
  try {
    const envPath = resolve(__dirname, '../.env');
    const envFile = readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
        // Also set for child processes
      }
    });
    console.log('Loaded .env file for tests');
  } catch (e) {
    console.log('No .env file found');
  }
};

// Load env before vitest initializes
loadEnvFile();

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/e2e/*.test.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    globals: true,
  },
});
