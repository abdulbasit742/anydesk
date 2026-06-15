# Test Coverage Documentation

This document outlines the test coverage strategy and reports for the RemoteDesk project.

## Overview

Test coverage is a metric that measures the amount of code executed by tests. High test coverage helps ensure the quality and reliability of the codebase.

## Tools

We use `jest` for testing and `nyc` (or `jest --coverage`) for generating coverage reports.

## Configuration

Test coverage is configured in `jest.config.js` (or `package.json` under `jest` configuration).

```javascript
// Example jest.config.js snippet
module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "<rootDir>/apps/**/*.{ts,tsx}",
    "<rootDir>/packages/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Generating Reports

To generate a test coverage report, run the following command from the project root:

```bash
yarn test --coverage
# or npm test -- --coverage
```

This will generate a `coverage/` directory with HTML reports and other formats.

## Viewing Reports

Open `coverage/lcov-report/index.html` in your web browser to view an interactive coverage report.

## Coverage Thresholds

We aim for a minimum of 80% test coverage across lines, statements, functions, and branches. Pull requests that fall below these thresholds may be blocked by CI/CD.

## Improving Coverage

-   Write unit tests for individual functions and components.
-   Write integration tests for interactions between modules.
-   Write end-to-end tests for critical user flows.
-   Focus on testing complex logic and edge cases.

## CI/CD Integration

Test coverage checks are integrated into our CI/CD pipeline (`.github/workflows/ci.yml`) to ensure that code merged into `main` or `develop` branches meets the required coverage thresholds.
