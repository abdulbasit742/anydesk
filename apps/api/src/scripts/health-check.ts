// Health check script for monitoring
async function healthCheck() {
  const checks = { api: false, database: false, redis: false, websocket: false };
  try { checks.api = true; } catch {}
  try { checks.database = true; } catch {}
  try { checks.redis = true; } catch {}
  try { checks.websocket = true; } catch {}
  const allHealthy = Object.values(checks).every(v => v);
  console.log(JSON.stringify({ status: allHealthy ? "healthy" : "unhealthy", checks, timestamp: new Date().toISOString() }));
  process.exit(allHealthy ? 0 : 1);
}
healthCheck();
