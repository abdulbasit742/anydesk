# Multi-stage build for minimal agent size
FROM golang:1.21-alpine AS builder

WORKDIR /build

# Install build dependencies
RUN apk add --no-cache git ca-certificates

# Copy source
COPY . .

# Build for multiple architectures
# Build for ARM (Raspberry Pi)
RUN GOOS=linux GOARCH=arm GOARM=7 CGO_ENABLED=0 go build -ldflags="-s -w" -o remotedesk-agent-armv7 .

# Build for ARM64
RUN GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -o remotedesk-agent-arm64 .

# Build for x86_64
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w" -o remotedesk-agent-amd64 .

# Runtime image - minimal
FROM alpine:3.18

WORKDIR /app

# Copy built binaries
COPY --from=builder /build/remotedesk-agent-* .

# Install runtime dependencies
RUN apk add --no-cache ca-certificates bash

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ps aux | grep remotedesk-agent | grep -v grep || exit 1

# Default command
CMD ["/app/remotedesk-agent-amd64"]
