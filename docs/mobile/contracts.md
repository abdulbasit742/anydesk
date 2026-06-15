# Mobile Contracts

## Overview
DTO contracts for iOS/Android clients to ensure type-safe API communication.

## Authentication
- MobileAuthRequest/Response: Token-based auth
- MobileRefreshRequest: Token refresh
- QRPairingRequest/Response: QR code device pairing

## Session
- MobileSessionRequest/Response: Session initiation
- MobileTouchEvent: Normalized touch events (0-1 coordinates)
- MobileGestureEvent: Pinch, pan, longpress, doubletap

## Device
- MobileDeviceRegisterRequest: Device registration
- MobileDeviceResponse: Device info
- MobileDeviceCapabilities: Codec and resolution support

## Coordinate System
All touch coordinates are normalized 0-1 relative to remote screen.
Host maps to actual resolution.
