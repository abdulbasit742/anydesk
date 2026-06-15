# Shared Contracts


Everything crossing the wire is typed in `@remotedesk/shared` and validated with Zod at the boundary.


- **Enums:** ConnectionStatus, SessionState, ConsentDecision, InputType
- **DTOs:** device, session, signaling (offer/answer/ice), input (mouse/keyboard/envelope)
- **Socket events:** namespaced `domain:action` constants
- **Errors:** central ErrorCodes + AppError; routes serialize via `toJSON()`


Rule: no inline shapes for wire data. Import the DTO, validate with the schema.
