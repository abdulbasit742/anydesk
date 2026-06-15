# Web Architecture

## Next.js 14 App Router
```
app/
├── layout.tsx        # Root layout
├── page.tsx          # Landing page
├── login/page.tsx    # Login
├── register/page.tsx # Registration
├── dashboard/page.tsx # Main dashboard
└── connect/[id]/page.tsx # Remote session viewer
```

## State Management
- **Zustand**: Global state (auth, settings)
- **React Query**: Server state (devices, sessions)
- **Local state**: Component-level UI state

## API Integration
```typescript
const res = await fetch(`${API_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Socket.IO Integration
```typescript
const socket = io(API_URL, { auth: { token } });
socket.emit("session:request", { to: "123456789", from: "987654321" });
```

## WebRTC Integration
```typescript
const pc = new RTCPeerConnection({ iceServers: [...] });
pc.ontrack = (e) => { videoRef.current!.srcObject = e.streams[0]; };
```

## Styling
Tailwind CSS with custom brand colors.
See `apps/web/tailwind.config.js`

## Key Components
- **Dashboard**: Device list, connect form
- **Connect**: Video element, toolbar, chat
- **Settings**: Plan, security, preferences
