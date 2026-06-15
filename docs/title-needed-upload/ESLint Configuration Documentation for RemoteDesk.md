# ESLint Configuration Documentation for RemoteDesk

This document outlines the ESLint configuration for the RemoteDesk project, ensuring consistent code style, identifying potential errors, and enforcing best practices across the monorepo. ESLint helps maintain code quality and reduces cognitive load during code reviews.

## Overview

Our ESLint setup is designed to be comprehensive, covering TypeScript, React (for web), and Node.js (for API and desktop main process). We use a layered configuration approach, extending from a base configuration and then applying specific overrides for different project areas (`apps/api`, `apps/web`, `apps/desktop`, `packages/shared`).

## Base Configuration (`.eslintrc.js` in project root)

The root `.eslintrc.js` defines the common rules and plugins applicable to the entire monorepo. It typically includes:

*   **Parsers:** `@typescript-eslint/parser` for TypeScript.
*   **Plugins:** `@typescript-eslint`, `import`, `prettier`.
*   **Extends:**
    *   `eslint:recommended` (ESLint's base recommended rules)
    *   `plugin:@typescript-eslint/recommended` (TypeScript-specific recommended rules)
    *   `plugin:import/recommended` (Import-related rules)
    *   `plugin:import/typescript` (TypeScript-specific import rules)
    *   `prettier` (Disables ESLint rules that conflict with Prettier)
    *   `prettier/@typescript-eslint` (Disables TypeScript ESLint rules that conflict with Prettier)
*   **Rules:** Custom rules or overrides for specific project needs.

```javascript
// remotedesk/.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // Adjust as needed for specific apps
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    // Custom rules or overrides
    'no-console': 'warn',
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
      },
    ],
    // Example: Enforce explicit return types for functions
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        'allowExpressions': true,
        'allowTypedFunctionExpressions': true,
      },
    ],
    // Example: No unused vars, but allow leading underscore for ignored params
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }
    ],
    // Module boundary rules (as defined in module-boundary-tests.md)
    'import/no-restricted-paths': [
      'error',
      {
        'zones': [
          // Example: API should not import from web
          { 'target': './apps/api/**', 'from': './apps/web/**', 'message': 'API should not import from web application.' },
          // Add more as per dependency-direction.md
        ]
      }
    ],
  },
  settings: {
    'import/resolver': {
      'typescript': {
        'project': './tsconfig.json',
      },
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.js' // Ignore compiled JS files
  ]
};
```

## Application-Specific Overrides

Each application (`apps/api`, `apps/web`, `apps/desktop`) and `packages/shared` will have its own `.eslintrc.js` file that extends the root configuration and adds specific rules relevant to its environment.

### `apps/api/.eslintrc.js`

```javascript
// remotedesk/apps/api/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js'], // Extend from root config
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  rules: {
    // API-specific rules
    // Example: Enforce specific naming for API routes
    // 'api-routes/filename-convention': 'error',
  },
};
```

### `apps/web/.eslintrc.js`

```javascript
// remotedesk/apps/web/.eslintrc.js
module.exports = {
  extends: [
    '../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Web/React-specific rules
    'react/react-in-jsx-scope': 'off', // Next.js doesn't require React to be in scope
    'react/prop-types': 'off', // Use TypeScript for prop types
    // Example: Enforce specific component naming conventions
    // 'react/function-component-definition': ['error', { 'namedComponents': 'arrow-function' }],
  },
};
```

### `apps/desktop/.eslintrc.js`

```javascript
// remotedesk/apps/desktop/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true, // For main process
    browser: true, // For renderer process
  },
  rules: {
    // Desktop-specific rules
    // Example: No Electron remote module in renderer process
    // 'electron/no-remote': 'error',
  },
};
```

### `packages/shared/.eslintrc.js`

```javascript
// remotedesk/packages/shared/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    // Shared package specific rules
    // Example: Ensure all exports are named exports
    // 'import/prefer-default-export': 'off',
  },
};
```

## Running ESLint

ESLint can be run from the command line:

```bash
# Check all files in the monorepo
eslint .

# Fix automatically fixable issues
eslint . --fix

# Check a specific project (e.g., web app)
eslint apps/web
```

It is also integrated into our CI/CD pipeline to ensure all code committed adheres to these standards.
