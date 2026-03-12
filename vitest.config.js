import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/foundry-mocks.js"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: [
        "scripts/sr2-rules.js",
        "scripts/pools.js",
        "scripts/hotbar.js",
        "scripts/utils/logger.js",
        "scripts/hooks/*.js",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
