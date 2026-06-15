const statusUrl = process.env.REMOTEDESK_STATUS_URL;
if (!statusUrl) throw new Error("REMOTEDESK_STATUS_URL is required");
const response = await fetch(statusUrl);
if (!response.ok) {
  console.error(`Status page failed: ${response.status}`);
  process.exit(1);
}
console.log("RemoteDesk status page reachable");
