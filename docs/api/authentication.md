# Authentication Guide

## Flow
1. POST `/auth/register` - Create account
2. POST `/auth/login` - Get access + refresh tokens
3. Use `Authorization: Bearer <token>` header
4. POST `/auth/refresh` before expiry
5. POST `/auth/logout` to invalidate

## Token Lifetimes
- Access token: 1 hour
- Refresh token: 7 days
- Session cookie: 7 days

## 2FA Flow
1. Complete login (email + password)
2. If 2FA enabled, receive `2FA_REQUIRED` error
3. POST `/auth/2fa` with TOTP code
4. Receive final tokens
