# QR Pairing Flow

## Setup
1. Desktop app displays QR code containing pairing URL
2. Mobile app scans QR code
3. Mobile sends QRPairingRequest with extracted code
4. Server validates and links device
5. Mobile receives auth token for subsequent requests

## Security
- Pairing codes expire after 5 minutes
- Single-use codes
- Device fingerprint recorded
