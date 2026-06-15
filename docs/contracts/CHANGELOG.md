# Contract Changelog

## 2026-06-11
- Initial contract finalization
- Added Zod schemas for all DTOs
- Added validation tests
- Added tRPC router structure

## API DTOs
- Auth: LoginRequest, TokenResponse
- User: UserResponse, UpdateUserRequest
- Device: DeviceResponse, RegisterDeviceRequest
- Session: SessionResponse
- Connection: ConnectionRequest, ConnectionResponse

## Socket DTOs
- Signal: Offer, Answer, IceCandidate
- Connection: Request, Response
- Input: MouseEvent, KeyboardEvent
- File Transfer: Start, Chunk
- Clipboard: Sync
- Chat: Message

## Web DTOs
- Dashboard: Stats
- Org: CreateOrg, MemberUpdate, InviteMember
- Billing: UpdateSubscription, PaymentMethod
- Support: CreateTicket, TicketComment
- Settings: UserSettings

## Desktop DTOs
- Capture: Source, Options, Frame
- Input: RemoteInputPermission
- Settings: DesktopSettings
- IPC: Channel definitions
