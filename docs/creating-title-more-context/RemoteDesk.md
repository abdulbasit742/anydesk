# RemoteDesk

RemoteDesk is an AnyDesk-style full-stack SaaS remote desktop application, enabling secure and efficient remote access and control of devices.

## Project Structure

This project is a monorepo structured with the following main directories:

-   `apps/api`: The backend API services, including authentication, user management, session handling, and data persistence.
-   `apps/web`: The Next.js web application for the user dashboard, device management, and session history.
-   `apps/desktop`: The Electron-based desktop application for host and viewer functionalities, including screen sharing, remote input, and local capture.
-   `packages/shared`: A collection of shared utilities, types, and constants used across the web, desktop, and API applications.
-   `docs`: Comprehensive documentation covering various aspects of the project, including development guides, deployment instructions, and API references.

## Key Features

-   **Secure Authentication:** Robust user authentication and session management.
-   **Real-time Communication:** Powered by Socket.IO for signaling and WebRTC for low-latency, peer-to-peer connections.
-   **Remote Desktop Control:** Seamless screen sharing and remote input capabilities.
-   **Device Management:** Centralized management of registered devices.
-   **Session History & Audit:** Detailed logging and auditing of remote sessions.
-   **Cross-Platform Desktop App:** Native desktop experience for Windows, macOS, and Linux.
-   **Web Dashboard:** Intuitive web interface for managing devices, viewing session history, and configuring settings.

## Getting Started

To set up the project locally, please refer to the [Local Setup Guide](docs/development/local-setup.md).

## Development

For detailed development guidelines, including how to run tests, contribute code, and understand the architecture, please see the [Developer Onboarding Guide](docs/development/developer-onboarding.md).

## Deployment

Instructions for deploying the web, desktop, and API components to production environments can be found in the [Release Documentation](docs/release/production-config.md).

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md - *TODO: Create this file*) for details on how to submit pull requests, report bugs, and suggest features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE - *TODO: Create this file*) file for details.
