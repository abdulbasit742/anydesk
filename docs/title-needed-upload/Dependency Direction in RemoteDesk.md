# Dependency Direction in RemoteDesk

This document outlines the fundamental principles governing the direction of dependencies within the RemoteDesk architecture. Maintaining a clear and consistent dependency direction is critical for preventing circular dependencies, ensuring modularity, and facilitating easier testing and maintenance.

## Core Principle: Downward Dependency Flow

The primary rule for dependency direction in RemoteDesk is that dependencies must flow downwards from higher-level, application-specific modules to lower-level, shared, and foundational modules.

This means that an application (like the Web Dashboard or Desktop Client) can depend on shared packages, but a shared package must never depend on an application.

## Architectural Layers

To visualize this flow, we can categorize the RemoteDesk modules into distinct architectural layers:

| Layer | Description | Examples | Allowed Dependencies |
| :--- | :--- | :--- | :--- |
| **Application Layer** | The top-level applications that provide the user interface and specific functionalities. | `apps/web`, `apps/desktop`, `apps/api` | Shared Layer, Foundation Layer |
| **Shared Layer** | Modules that provide common business logic, data structures, and utilities used across multiple applications. | `packages/shared` | Foundation Layer |
| **Foundation Layer** | The lowest-level modules providing fundamental building blocks, such as generic utilities, type definitions, and external library wrappers. | (Currently integrated within `packages/shared`, but conceptually distinct) | None (within the monorepo) |

## Dependency Rules

Based on the architectural layers, the following rules apply:

1.  **Applications Depend on Shared Packages:** The `apps/api`, `apps/web`, and `apps/desktop` modules are permitted to import and utilize code from `packages/shared`. This is the standard mechanism for sharing code across the platform.
2.  **Shared Packages Do Not Depend on Applications:** Modules within `packages/shared` must never import code from `apps/api`, `apps/web`, or `apps/desktop`. Doing so would create a circular dependency and tightly couple the shared code to a specific application context.
3.  **Applications Do Not Depend on Each Other:** The `apps/api`, `apps/web`, and `apps/desktop` modules must remain independent. They should communicate via defined interfaces (e.g., REST APIs, WebSockets) rather than direct code imports. For example, `apps/web` should not import code directly from `apps/api`.
4.  **Internal Shared Package Dependencies:** Within `packages/shared`, dependencies should also follow a logical flow, typically from more complex, domain-specific utilities down to simpler, generic helpers. Circular dependencies within the shared package must be strictly avoided.

## Enforcing Dependency Direction

To ensure these rules are followed, we employ several strategies:

*   **Static Analysis:** We utilize tools like ESLint with specific plugins (e.g., `eslint-plugin-import`) to statically analyze import statements and flag violations of the dependency rules during development and CI/CD pipelines.
*   **Code Reviews:** All pull requests are subject to peer review, where developers actively check for inappropriate dependencies and ensure adherence to the architectural guidelines.
*   **Dependency Graph Visualization:** We periodically generate and review dependency graphs to visually identify any unintended coupling or circular dependencies that may have slipped through other checks.

By strictly adhering to these dependency direction principles, we maintain a robust, scalable, and maintainable architecture for RemoteDesk.
