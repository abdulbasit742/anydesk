# RemoteDesk Testing Strategy and Unit Test Setup Guide

This document outlines the overall testing strategy for the RemoteDesk monorepo and provides a guide for setting up unit tests across different packages and applications. A robust testing strategy is essential for maintaining code quality, preventing regressions, and ensuring the reliability of the application.

## 1. Overall Testing Strategy

RemoteDesk employs a multi-layered testing approach:

*   **Unit Tests**: Focus on individual functions, components, or modules in isolation. They are fast to execute and provide immediate feedback on code changes.
*   **Integration Tests**: Verify the interaction between different modules or services (e.g., API endpoints interacting with the database, Electron renderer communicating with the main process).
*   **End-to-End (E2E) Tests**: Simulate real user scenarios across the entire application stack (e.g., user logs in, starts a remote session, transfers a file). These are slower but provide high confidence in the overall system.
*   **Smoke Tests**: Quick, high-level tests to ensure the most critical functionalities are working after a deployment or major change.
*   **Performance Tests**: Evaluate the system's responsiveness, stability, and resource usage under various loads.
*   **Security Tests**: Identify vulnerabilities and ensure adherence to security best practices.

## 2. Unit Test Setup: Vitest/Jest Recommendation

For JavaScript/TypeScript projects, **Vitest** and **Jest** are popular and powerful testing frameworks. Both offer similar functionalities, including assertion libraries, mocking capabilities, and test runners.

### 2.1 Recommendation: Vitest

**Vitest** is recommended for its speed and seamless integration with Vite-based projects (like `apps/desktop` and potentially `apps/web` if it uses Vite for bundling). It offers a Jest-compatible API, making migration from Jest straightforward if needed.

**Key Advantages of Vitest:**

*   **Fast**: Leverages Vite's instant HMR and on-demand compilation.
*   **Jest-compatible API**: Familiar syntax for developers experienced with Jest.
*   **First-class TypeScript support**: Works out-of-the-box with TypeScript.
*   **Watch mode**: Efficiently re-runs tests on file changes.

### 2.2 Installation (Example for a Workspace)

To install Vitest in a specific workspace (e.g., `packages/shared`):

```bash
cd packages/shared
npm install --save-dev vitest # or yarn add --dev vitest
```

### 2.3 Configuration (Example `vitest.config.ts`)

Create a `vitest.config.ts` file in the root of each workspace that needs unit tests:

```typescript
// packages/shared/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for browser-like environments
    setupFiles: [], // e.g., './tests/setup.ts'
  },
});
```

### 2.4 Running Tests

Add a `test` script to your `package.json`:

```json
// packages/shared/package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Then run:

```bash
cd packages/shared
npm test # or yarn test
```

## 3. Shared Package Pure Helper Tests

`packages/shared` should contain pure functions and utility helpers that are easily testable in isolation. These tests should focus on input-output correctness and edge cases.

### Example: `packages/shared/src/utils/math.ts`

```typescript
// packages/shared/src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}
```

### Example: `packages/shared/tests/utils/math.test.ts`

```typescript
// packages/shared/tests/utils/math.test.ts
import { describe, it, expect } from 'vitest';
import { add, subtract } from '../../src/utils/math';

describe('math helpers', () => {
  it('should correctly add two numbers', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  it('should correctly subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(3, 5)).toBe(-2);
    expect(subtract(0, 0)).toBe(0);
  });
});
```

## 4. API Route Test Skeleton

API route tests should verify that endpoints respond correctly, handle various inputs, and interact with services (e.g., database) as expected. These are often integration tests rather than pure unit tests.

### Example: `apps/api/tests/auth.test.ts`

```typescript
// apps/api/tests/auth.test.ts
import request from 'supertest'; // For making HTTP requests
import { app } from '../src/app'; // Your Express app instance
import { prisma } from '../src/db/prisma'; // Your Prisma client

describe('Auth API', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toEqual('test@example.com');
  });

  it('should not register a user with existing email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(409); // Conflict
    expect(res.body).toHaveProperty('message', 'User with this email already exists');
  });

  // Add more tests for login, logout, etc.
});
```

## 5. Desktop Component Test Skeleton

Desktop (React) component tests should verify that components render correctly, respond to user interactions, and display data as expected. Use `@testing-library/react` for user-centric testing.

### Example: `apps/desktop/tests/components/Button.test.tsx`

```typescript
// apps/desktop/tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../../src/components/Button'; // Assuming a Button component

describe('Button component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vitest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    screen.getByText('Click Me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });
});
```

## 6. Mock WebRTC Helper

Mocking WebRTC APIs is essential for unit testing components that interact with `RTCPeerConnection`, `RTCRtpSender`, `RTCDataChannel`, etc., without requiring a real browser environment or network.

### Example: `packages/shared/tests/mocks/webrtc.ts`

```typescript
// packages/shared/tests/mocks/webrtc.ts
import { vitest } from 'vitest';

export const mockRTCPeerConnection = () => {
  const mockPc = {
    createOffer: vitest.fn(() => Promise.resolve({ sdp: 'mock-offer-sdp' })),
    createAnswer: vitest.fn(() => Promise.resolve({ sdp: 'mock-answer-sdp' })),
    setLocalDescription: vitest.fn(() => Promise.resolve()),
    setRemoteDescription: vitest.fn(() => Promise.resolve()),
    addIceCandidate: vitest.fn(() => Promise.resolve()),
    addTrack: vitest.fn(),
    removeTrack: vitest.fn(),
    getSenders: vitest.fn(() => []),
    getReceivers: vitest.fn(() => []),
    getTransceivers: vitest.fn(() => []),
    close: vitest.fn(),
    // Event handlers
    onicecandidate: vitest.fn(),
    oniceconnectionstatechange: vitest.fn(),
    onconnectionstatechange: vitest.fn(),
    onsignalingstatechange: vitest.fn(),
    ondatachannel: vitest.fn(),
    // Properties
    localDescription: null,
    remoteDescription: null,
    iceConnectionState: 'new',
    connectionState: 'new',
    signalingState: 'stable',
    // Data Channel related
    createDataChannel: vitest.fn((label: string) => {
      const mockDc = {
        label,
        readyState: 'open',
        send: vitest.fn(),
        close: vitest.fn(),
        onopen: vitest.fn(),
        onmessage: vitest.fn(),
        onclose: vitest.fn(),
        onerror: vitest.fn(),
      };
      return mockDc;
    }),
  };
  return mockPc;
};

// Global mock setup (e.g., in vitest setupFiles)
// global.RTCPeerConnection = vitest.fn(() => mockRTCPeerConnection());
// global.RTCDataChannel = vitest.fn(() => ({ /* mock data channel */ }));
```

## 7. Mock Socket.IO Helper

Mocking Socket.IO allows you to test components or services that interact with the Socket.IO client without actually connecting to a server.

### Example: `packages/shared/tests/mocks/socketio.ts`

```typescript
// packages/shared/tests/mocks/socketio.ts
import { vitest } from 'vitest';

export const mockSocketIOClient = () => {
  const listeners: { [event: string]: Function[] } = {};

  const mockSocket = {
    connected: true,
    disconnected: false,
    connect: vitest.fn(),
    disconnect: vitest.fn(),
    emit: vitest.fn((event: string, ...args: any[]) => {
      // Simulate server-side reception or internal logic if needed
      console.log(`Socket.IO client emitted: ${event}`, ...args);
    }),
    on: vitest.fn((event: string, callback: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
      return mockSocket; // For chaining
    }),
    off: vitest.fn((event: string, callback?: Function) => {
      if (listeners[event]) {
        if (callback) {
          listeners[event] = listeners[event].filter(cb => cb !== callback);
        } else {
          delete listeners[event];
        }
      }
      return mockSocket; // For chaining
    }),
    // Helper to simulate incoming events from the server
    _simulateEvent: (event: string, ...args: any[]) => {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(...args));
      }
    },
  };
  return mockSocket;
};

// Global mock setup (e.g., in vitest setupFiles)
// vitest.mock('socket.io-client', () => ({
//   io: vitest.fn(() => mockSocketIOClient()),
// }));
```

---

**Author**: Manus AI
**Date**: June 12, 2026
