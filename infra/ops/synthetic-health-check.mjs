const baseUrl = process.env.REMOTEDESK_API_URL;
if (!baseUrl) throw new Error("REMOTEDESK_API_URL is required");
const response = await fetch(`${baseUrl}/health/live`);
if (!response.ok) {
  console.error(`Health check failed: ${response.status}`);
  process.exit(1);
}
console.log("RemoteDesk health check passed");
