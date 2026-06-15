# RemoteDesk Compile Blocker Checklist

This checklist identifies common issues that prevent the RemoteDesk monorepo from compiling successfully. Addressing these blockers is critical before any deployment or further development can proceed.

## 1. TypeScript Errors

*   [ ] **`TS2307: Cannot find module`**: Check for incorrect import paths, missing `paths` configuration in `tsconfig.json`, or uninstalled dependencies. Ensure all internal packages are correctly referenced (e.g., `@remotedesk/shared`).
*   [ ] **`TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'`**: Type mismatches. Review function signatures, interface definitions, and ensure data flowing through components/functions adheres to expected types. Use type assertions (`as Type`) sparingly and only when absolutely certain.
*   [ ] **`TS2532: Object is possibly 'undefined'`**: Occurs when accessing properties of an object that might be `undefined`. Use optional chaining (`?.`), nullish coalescing (`??`), or explicit null checks (`if (obj) { ... }`).
*   [ ] **`TS7006: Parameter 'x' implicitly has an 'any' type`**: Enable `noImplicitAny` in `tsconfig.json` and explicitly type all function parameters and variables where types cannot be inferred.
*   [ ] **`TS2741: Property 'x' is missing in type 'Y' but required in type 'Z'`**: An interface or type expects a property that is not provided. Ensure all required properties are present when creating objects or passing props.
*   [ ] **`TS1005: ')' expected.` or `TS1128: Declaration or statement expected.`**: Syntax errors. Often caused by missing commas, brackets, or incorrect TypeScript/JavaScript syntax.

## 2. Dependency Issues

*   [ ] **Missing `node_modules`**: Run `npm install` or `yarn install` at the monorepo root and within specific workspaces if necessary.
*   [ ] **Incorrect dependency versions**: Check `package.json` and `package-lock.json`/`yarn.lock` for conflicts. Ensure internal package references use `workspace:*` or `^` correctly.
*   [ ] **Missing `@types` packages**: For JavaScript libraries without built-in TypeScript definitions, install corresponding `@types/library-name` packages (e.g., `npm install --save-dev @types/node`).
*   [ ] **Hoisting issues (Yarn Workspaces)**: If certain packages fail to resolve, consider adding them to `nohoist` in your root `package.json` if using Yarn.

## 3. Configuration Errors

*   [ ] **`tsconfig.json` errors**: Invalid JSON, incorrect `include`/`exclude` paths, or misconfigured `compilerOptions` (e.g., `moduleResolution`, `jsx`).
*   [ ] **Vite/Webpack configuration errors**: Incorrect `resolve.alias` for path aliases, misconfigured plugins, or incorrect build targets in `vite.config.ts` files.
*   [ ] **ESLint/Prettier conflicts**: Ensure ESLint and Prettier configurations are compatible and not causing parsing errors.

## 4. Build Tool Errors

*   [ ] **`electron-vite` errors**: Issues with Electron-Vite specific configurations, such as incorrect entry points or externalization of modules.
*   [ ] **`next build` errors**: Next.js specific build failures, often related to server-side rendering issues, data fetching, or incorrect environment variable usage.
*   [ ] **`prisma generate` errors**: If Prisma client generation fails, check `schema.prisma` for syntax errors or database connection issues.

## 5. File System Issues

*   [ ] **Case sensitivity**: Ensure file imports match the exact case of the file system, especially on Linux/macOS environments.
*   [ ] **Missing files**: Verify all referenced files and modules actually exist at the specified paths.

## General Troubleshooting Steps

1.  **Read the error message carefully**: The error message often provides the exact file and line number of the problem.
2.  **Clean and Reinstall**: Delete `node_modules` and lock files, then reinstall dependencies (`rm -rf node_modules && rm -rf packages/*/node_modules && npm install`).
3.  **Isolate the problem**: Try building individual packages or applications to pinpoint the source of the error.
4.  **Consult documentation**: Refer to the official documentation for TypeScript, Electron, Vite, Next.js, and other tools for specific error codes.

---

**Author**: Manus AI
**Date**: June 12, 2026
