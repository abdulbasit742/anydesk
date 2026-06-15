# RemoteDesk Monorepo Build Fix Guide

This guide addresses common build issues and provides solutions for ensuring a clean and successful compilation of the RemoteDesk monorepo. It covers shared contract cleanup, TypeScript strictness, path aliases, Electron-Vite configuration, package script fixes, workspace dependencies, and minimal patches for compile errors.

## 1. Shared Contract Cleanup Suggestions

To maintain a robust and type-safe monorepo, it is crucial to keep shared contracts (`packages/shared`) clean and well-defined. This section outlines suggestions for improving the shared contracts.

### 1.1 Type Consistency

Ensure consistent naming conventions and type definitions across all shared interfaces and types. Avoid `any` where possible and use specific types to enhance type safety.

### 1.2 Centralized Definitions

Centralize common types and interfaces that are used across `apps/api`, `apps/web`, and `apps/desktop` within `packages/shared`. This reduces duplication and ensures a single source of truth.

### 1.3 Versioning

For critical shared contracts, consider a versioning strategy if breaking changes are anticipated. This can be achieved through separate directories (e.g., `packages/shared/v1`, `packages/shared/v2`) or by clearly marking breaking changes in documentation.

## 2. TypeScript Strict Fixes

Enabling and addressing TypeScript strict mode (`strict: true` in `tsconfig.json`) is vital for catching potential errors early in the development cycle. This section provides guidance on fixing common strict mode issues.

### 2.1 `noImplicitAny`

This error occurs when TypeScript cannot infer a type and defaults to `any`. To fix this:

*   **Explicitly type parameters**: `function foo(arg: string) { ... }`
*   **Type variables**: `let myVar: string = 'hello';`
*   **Use `unknown`**: When the type is truly unknown, use `unknown` and narrow it down with type guards.

### 2.2 `strictNullChecks`

This error prevents `null` or `undefined` from being assigned to types that don't explicitly allow them. To fix:

*   **Use union types**: `let myVar: string | null = null;`
*   **Non-null assertion operator (`!`)**: Use `myVar!.property` when you are certain a value is not null or undefined (use sparingly).
*   **Optional chaining (`?.`)**: `myVar?.property` for safely accessing properties that might be null or undefined.

### 2.3 `noImplicitReturns`

Ensures all code paths in a function return a value if the function is declared to return one. Fix by adding `return` statements or explicitly typing the function to return `void` if no return is intended.

## 3. Path Alias Notes

Path aliases simplify imports and improve code readability, especially in monorepos. Ensure consistent configuration across all `tsconfig.json` files.

### 3.1 `tsconfig.json` Configuration

Example `tsconfig.json` for `packages/shared`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/*"]
    }
  }
}
```

Example `tsconfig.json` for `apps/desktop`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

### 3.2 Vite/Webpack Configuration

Ensure your build tools (Vite for `apps/desktop`, Next.js for `apps/web`) are configured to resolve these path aliases correctly. For Vite, this typically involves the `resolve.alias` option in `vite.config.ts`.

## 4. Electron-Vite Config Review

The `apps/desktop` project uses Electron with Vite. Proper configuration is essential for development and production builds.

### 4.1 `vite.main.config.ts` and `vite.preload.config.ts`

Review these files to ensure:

*   **Externalization**: Electron modules and Node.js built-in modules are correctly externalized to prevent bundling issues.
*   **Target**: The build target is `electron-main` or `node` as appropriate.
*   **Plugins**: Necessary Vite plugins (e.g., for React) are configured.

### 4.2 `vite.renderer.config.ts`

*   **Base URL**: Ensure `base` is correctly set for production builds if serving from a subdirectory.
*   **Plugins**: React plugin is correctly configured.
*   **CSS/PostCSS**: TailwindCSS and PostCSS are properly integrated.

## 5. Package Script Fixes

Consistent and reliable package scripts are crucial for developer workflow. Review and fix scripts in `package.json` files.

### 5.1 Root `package.json` Scripts

Ensure the root `package.json` contains scripts for:

*   `install`: `npm install` or `yarn install`
*   `build`: `turbo run build` (if using Turborepo) or similar for building all workspaces.
*   `dev`: `turbo run dev` or similar for running all development servers.

### 5.2 Workspace `package.json` Scripts

Each workspace (`apps/api`, `apps/web`, `apps/desktop`, `packages/shared`) should have its own `build`, `dev`, `test` scripts tailored to its specific needs.

## 6. Workspace Dependency Notes

Managing dependencies in a monorepo requires careful attention to avoid hoisting issues and ensure correct resolution.

### 6.1 `package.json` `dependencies` and `devDependencies`

*   **Internal Packages**: Refer to internal packages using `workspace:*` or `^` for versioning (e.g., `@remotedesk/shared: workspace:^`).
*   **External Packages**: Use consistent versions for external dependencies across all workspaces to prevent dependency hell.

### 6.2 `nohoist` (Yarn Workspaces)

If using Yarn workspaces, consider `nohoist` for packages that have issues when hoisted to the root `node_modules` (e.g., Electron-related dependencies).

## 7. Minimal Patches for Compile Errors

This section provides examples of minimal patches to resolve common compile errors. These are illustrative and should be adapted to specific error messages.

### 7.1 Missing Type Declarations

If a library is missing type declarations, install `@types/library-name` (e.g., `npm install --save-dev @types/node`). If types are unavailable, you might need to create a `declarations.d.ts` file:

```typescript
// declarations.d.ts
declare module 'missing-library';
```

### 7.2 Module Resolution Errors

Ensure `moduleResolution` in `tsconfig.json` is set appropriately (e.g., `node` or `bundler`). Check `paths` configuration as well.

### 7.3 ESLint/Prettier Conflicts

Configure ESLint and Prettier to work together without conflicts. Use `eslint-config-prettier` and `eslint-plugin-prettier`.

## 8. Build Troubleshooting Docs

This section outlines a general approach to troubleshooting build failures.

### 8.1 Check Error Messages

Read the error messages carefully. They often point directly to the file and line number causing the issue.

### 8.2 Clean and Rebuild

Sometimes, cached build artifacts can cause issues. Try cleaning your build and rebuilding:

```bash
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules
rm -rf apps/*/dist
rm -rf packages/*/dist
npm install
npm run build
```

### 8.3 Isolate the Problem

If the entire monorepo fails to build, try building individual packages or apps to isolate the source of the error (e.g., `npm run build --workspace=apps/desktop`).

### 8.4 Check Environment Variables

Ensure all necessary environment variables are set correctly, especially for API keys or database connections.

### 8.5 Consult Documentation

Refer to the documentation of specific tools (TypeScript, Vite, Electron, Next.js) for common issues and solutions.

---

**Author**: Manus AI
**Date**: June 12, 2026
