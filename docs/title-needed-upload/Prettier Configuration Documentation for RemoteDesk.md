# Prettier Configuration Documentation for RemoteDesk

This document outlines the Prettier configuration for the RemoteDesk project. Prettier is an opinionated code formatter that enforces a consistent style across the entire codebase, eliminating debates over style and improving readability.

## Overview

Prettier is integrated into our development workflow to automatically format code on save and during pre-commit hooks. It works in conjunction with ESLint, where ESLint handles code quality and potential errors, and Prettier focuses solely on code formatting.

Our configuration aims for a balance between readability and common best practices, ensuring consistency across TypeScript, JavaScript, JSX, and other supported file types.

## Base Configuration (`.prettierrc.js` in project root)

The root `.prettierrc.js` file defines the global Prettier settings for the monorepo. These settings are applied to all files unless overridden by more specific configurations.

```javascript
// remotedesk/.prettierrc.js
module.exports = {
  printWidth: 100, // Specify the line length that the printer will wrap on
  tabWidth: 2, // Specify the number of spaces per indentation-level
  useTabs: false, // Indent lines with tabs instead of spaces
  semi: true, // Print semicolons at the ends of statements
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: 'all', // Print trailing commas wherever possible when multi-line
  bracketSpacing: true, // Print spaces between brackets in object literals
  jsxBracketSameLine: false, // Put the > of a multi-line JSX element at the end of the last line instead of alone on the next line
  arrowParens: 'always', // Include parentheses around a sole arrow function parameter
  endOfLine: 'lf', // Enforce consistent end of line (Linux-style)
  htmlWhitespaceSensitivity: 'css', // How to handle whitespace in HTML
  vueIndentScriptAndStyle: false, // Do not indent script and style tags in Vue files
};
```

## Integration with ESLint

To ensure Prettier and ESLint work harmoniously, we use `eslint-config-prettier` and `eslint-plugin-prettier`.

*   `eslint-config-prettier`: Turns off all ESLint rules that are unnecessary or might conflict with Prettier.
*   `eslint-plugin-prettier`: Runs Prettier as an ESLint rule, allowing formatting issues to be reported as ESLint errors.

This integration is reflected in our `.eslintrc.js` by extending `prettier` and `prettier/@typescript-eslint`.

## Integration with VS Code (Recommended)

For an optimal developer experience, it is highly recommended to configure VS Code to format files automatically on save using Prettier.

1.  **Install Prettier Extension:** Install the official Prettier - Code formatter extension from the VS Code Marketplace.
2.  **Configure `settings.json`:** Add the following settings to your VS Code `settings.json`:

    ```json
    {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
      },
      "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
    ```

## Running Prettier

Prettier can be run from the command line to format files or check for formatting issues:

```bash
# Format all files in the project
prettier --write .

# Check for formatting issues without writing to files
prettier --check .

# Format specific files
prettier --write "apps/web/**/*.ts"
```

It is also integrated into our pre-commit hooks (e.g., using `lint-staged` and `husky`) to ensure that only properly formatted code is committed to the repository.
