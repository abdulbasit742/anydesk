# RemoteDesk Codex Merge Runbook

This runbook provides a step-by-step guide for integrating generated code and documentation from the Codex (AI agent) into the RemoteDesk monorepo. It emphasizes careful review, testing, and validation to ensure stability and maintainability.

## 1. Understand the Generated Output

Before starting the merge, thoroughly review the generated files. The Codex typically provides:

*   **Manifest (`generated-*-manifest.json`)**: Lists all generated files, their paths, and a `mark` indicating their recommended integration strategy (`SAFE_DIRECT_COPY`, `REVIEW_REQUIRED`, `IDEA_ONLY`).
*   **Merge Guide (`generated-*-merge-guide.md`)**: Provides high-level instructions and a recommended integration strategy.
*   **Risk Register (`generated-*-risk-register.md`)**: Identifies potential risks and mitigation strategies.
*   **QA Checklist (`generated-*-qa-checklist.md`)**: Comprehensive testing steps.
*   **Review Required Files (`generated-*-review-required.md`)**: A list of files needing extra scrutiny.

**Action**: Read all these documents carefully to understand the scope, impact, and risks associated with the generated code.

## 2. Prepare Your Environment

1.  **Create a New Branch**: Always work on a dedicated feature branch for the integration.
    ```bash
    git checkout -b feature/codex-integration-YYYYMMDD
    ```
2.  **Ensure Clean State**: Make sure your local repository is clean and up-to-date with the target branch (e.g., `main` or `develop`).
    ```bash
    git pull origin main
    ```
3.  **Install Dependencies**: If the generated code introduces new dependencies, install them.
    ```bash
    npm install # or yarn install
    ```

## 3. Integrate `SAFE_DIRECT_COPY` Files

These files are generally utilities, types, or documentation that are unlikely to cause immediate build or runtime issues. They can be copied directly.

1.  **Copy Files**: Copy files marked `SAFE_DIRECT_COPY` from the generated output to their respective paths in your monorepo.
    *   **Tip**: Use a script or carefully crafted `cp` commands to avoid manual errors.
2.  **Review**: Even for `SAFE_DIRECT_COPY`, a quick review of the content and its placement is recommended.

## 4. Integrate `REVIEW_REQUIRED` Files (Iterative Process)

These files often involve core logic, IPC, UI components, or security-sensitive areas. They require careful review and adaptation.

1.  **Start with Shared Packages**: Begin by integrating shared types, constants, and utility functions that are `REVIEW_REQUIRED` in `packages/shared`.
    *   **Action**: Copy the files, then review their content. Ensure they align with existing code style, naming conventions, and architectural patterns. Make necessary adjustments.
    *   **Compile Check**: After each significant change or addition, attempt to compile the relevant packages (`npm run build --workspace=@remotedesk/shared`).
2.  **Integrate Electron Main/Preload IPC**: Proceed with the Electron main and preload process files.
    *   **Action**: Copy the files. Carefully integrate the `initializeClipboardHandlers` and `initializeFileTransferHandlers` into your `apps/desktop/src/main/index.ts` and ensure preload scripts are imported in `apps/desktop/src/preload/index.ts`.
    *   **Compile Check**: Build the desktop application (`npm run build --workspace=@remotedesk/desktop`).
3.  **Integrate Desktop Renderer UI Components**: Add the React components for clipboard and file transfer.
    *   **Action**: Copy the components. Integrate them into your existing React component hierarchy. This will likely involve connecting them to the exposed Electron Preload APIs and your state management solution.
    *   **Compile Check**: Build the desktop application.
4.  **Integrate API Changes (if any)**: If the generated output includes API-related files (e.g., new routes, database schema changes), integrate them carefully.
    *   **Action**: Copy files. Apply Prisma migrations if schema changes are present. Review API logic.
    *   **Compile Check**: Build the API (`npm run build --workspace=@remotedesk/api`).
5.  **Integrate Web Changes (if any)**: Similarly, integrate any web dashboard components or logic.
    *   **Action**: Copy files. Integrate into Next.js application.
    *   **Compile Check**: Build the web app (`npm run build --workspace=@remotedesk/web`).

## 5. Integrate `IDEA_ONLY` Files

These files are conceptual or provide suggestions. They are not meant for direct copy-pasting but serve as inspiration.

1.  **Review and Adapt**: Read these files for ideas. Implement them manually if they align with your project needs and architecture.

## 6. Testing and Validation

This is the most critical phase after integration.

1.  **Run All Tests**: Execute all unit, integration, and E2E tests.
    ```bash
    npm test # or yarn test
    ```
2.  **Execute QA Checklists**: Follow the provided `generated-*-qa-checklist.md` and other specific QA documents (e.g., `desktop-startup-checklist.md`, `two-client-local-test.md`).
    *   **Focus on**: Functionality, security, performance, and edge cases.
3.  **Perform Manual Testing**: Launch all applications (API, Web, Desktop Host, Desktop Viewer) and perform manual end-to-end testing, especially for the newly integrated features.
    *   **Use the Two-Client Local Test Harness**: Follow the `docs/qa/two-client-local-test.md` guide to thoroughly test the host-viewer interaction.
4.  **Monitor Logs**: During testing, continuously monitor logs from all services (API, Desktop main/renderer) for errors, warnings, or unexpected behavior.
    *   **Use Debugging Guides**: Refer to `docs/observability/` for detailed debugging instructions.

## 7. Documentation and Final Review

1.  **Update Project Documentation**: Ensure your project's `README.md`, architectural diagrams, and other relevant documentation are updated to reflect the new features.
2.  **Review Risk Register**: Re-evaluate the `generated-*-risk-register.md` in the context of your specific implementation and environment. Add any new risks or update mitigation strategies.
3.  **Final Code Review**: Conduct a final code review of the integrated changes with your team, paying close attention to the `REVIEW_REQUIRED` files and any modifications made.
4.  **Build Readiness Check**: Go through the `build-readiness-checklist.md` to ensure everything is in order for a production build.

## 8. Merge to Main

Once all tests pass, documentation is updated, and reviews are complete, merge your feature branch into the main development branch.

```bash
git checkout main
git pull origin main
git merge feature/codex-integration-YYYYMMDD
git push origin main
```

---

**Author**: Manus AI
**Date**: June 12, 2026
