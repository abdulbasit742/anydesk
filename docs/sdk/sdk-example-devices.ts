/**
 * SDK Example: Device Management
 */

import { RemoteDeskClient } from "@remotedesk/sdk";

const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io/v1",
  socketUrl: "wss://api.remotedesk.io/signaling",
});

// List devices
async function listDevices() {
  const res = await fetch(`${client.apiUrl}/devices`, {
    headers: { Authorization: `Bearer ${client.token}` },
  });
  const { devices } = await res.json();
  return devices;
}

// Trust a device
async function trustDevice(deviceId: string) {
  const res = await fetch(`${client.apiUrl}/devices/${deviceId}/trust`, {
    method: "POST",
    headers: { Authorization: `Bearer ${client.token}` },
  });
  return res.ok;
}

// Remove a device
async function removeDevice(deviceId: string) {
  const res = await fetch(`${client.apiUrl}/devices/${deviceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${client.token}` },
  });
  return res.ok;
}
