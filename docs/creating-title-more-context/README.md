# RemoteDesk K6 Load Tests

This directory contains K6 load testing scripts for the RemoteDesk application.

## Files

- `api-load-test.js`: Load tests for the REST API endpoints.
- `socketio-load-test.js`: Load tests for the Socket.IO signaling server.

## Prerequisites

Install K6:

```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows
choco install k6
```

## Running Tests

### API Load Tests

```bash
k6 run api-load-test.js
```

With custom parameters:

```bash
BASE_URL=https://api.example.com AUTH_TOKEN=your-token k6 run api-load-test.js
```

### Socket.IO Load Tests

```bash
k6 run socketio-load-test.js
```

With custom parameters:

```bash
BASE_URL=wss://api.example.com AUTH_TOKEN=your-token k6 run socketio-load-test.js
```

## Interpreting Results

K6 provides detailed output including:

- Request duration statistics (min, max, avg, p95, p99)
- Error rates
- Throughput (requests per second)

Look for performance thresholds defined in the scripts and adjust them based on your requirements.

## Customization

Edit the `options` object in each script to customize:

- `vus`: Number of virtual users
- `duration`: Test duration
- `thresholds`: Performance thresholds

For more information, refer to the [K6 documentation](https://k6.io/docs/).
