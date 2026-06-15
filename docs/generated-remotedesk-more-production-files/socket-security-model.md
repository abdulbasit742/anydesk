# Socket Security Model

Socket authorization must bind each connection to a user, team, and optional device. Joining team rooms or session rooms must verify the principal's team ID against the room's team ID.

Never trust a client-provided session ID without server-side team/session ownership validation.
