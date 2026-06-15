# RemoteDesk Common Failure Matrix

This matrix provides a quick reference for common issues encountered in RemoteDesk, their potential causes, and recommended troubleshooting steps.

| Symptom / Error Message | Potential Causes | Troubleshooting Steps |
| :--- | :--- | :--- |
| **Desktop App Fails to Start** | Missing dependencies, incorrect Node.js version, build errors. | 1. Check terminal output for build errors. 2. Verify Node.js version matches requirements. 3. Run `npm install` or `yarn install` again. 4. Check Electron main process logs. |
| **"Cannot connect to API"** | API service not running, incorrect `VITE_API_BASE_URL`, network issue. | 1. Ensure API service is running (`npm run dev` in `apps/api`). 2. Verify `VITE_API_BASE_URL` in `apps/desktop/.env`. 3. Check network connectivity to the API host. |
| **Login/Signup Fails** | Database not running, incorrect database credentials, API error. | 1. Verify database is running (e.g., Docker container). 2. Check `DATABASE_URL` in `apps/api/.env`. 3. Check API logs for specific errors (e.g., Prisma errors). |
| **"Signaling Server Disconnected"** | Socket.IO server down, incorrect `VITE_SIGNALING_SERVER_URL`, network issue. | 1. Ensure API service (which hosts Socket.IO) is running. 2. Verify `VITE_SIGNALING_SERVER_URL` in `apps/desktop/.env`. 3. Check browser DevTools Network tab for WebSocket connection errors. |
| **Connection Request Times Out** | Viewer entered wrong ID, Host app closed, signaling issue. | 1. Verify the RemoteDesk ID is correct. 2. Ensure Host app is running and connected to signaling server. 3. Check Socket.IO debug logs on server. |
| **Connection Accepted but No Video** | WebRTC ICE failure, strict NAT/firewall, missing TURN server. | 1. Check `chrome://webrtc-internals` on both clients. 2. Look for failed ICE candidate pairs. 3. Ensure TURN server is configured correctly in `.env` files if needed. |
| **Video is Choppy or Freezes** | Network congestion, high CPU usage, insufficient bandwidth. | 1. Check `chrome://webrtc-internals` for high packet loss or low bandwidth estimation. 2. Monitor CPU usage on Host machine. 3. Test on a different network. |
| **Clipboard Sync Not Working** | Feature disabled, permission denied, data too large. | 1. Ensure both Host and Viewer have enabled clipboard sync. 2. Check if copied text exceeds size limits. 3. Check DevTools console for IPC errors. |
| **File Transfer Fails** | Receiver rejected, file too large, invalid filename, permission error. | 1. Verify receiver accepted the transfer. 2. Check file size against limits. 3. Check DevTools console for specific error messages. 4. Ensure receiver has write permissions to the selected save location. |
| **Remote Input Not Working** | Host disabled input, viewer not sending input, IPC issue. | 1. Verify Host has enabled remote input permissions. 2. Check DevTools console for errors related to input events. |
| **Web Dashboard Shows No Data** | API connection issue, database empty, incorrect API URL. | 1. Verify `NEXT_PUBLIC_API_BASE_URL` in `apps/web/.env`. 2. Check browser DevTools Network tab for failed API requests. 3. Ensure database has data (run seed script if necessary). |

---

**Author**: Manus AI
**Date**: June 12, 2026
