import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Root-relative assets so deep links like /study/react still load /assets/* (not /study/assets/*).
  base: '/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
