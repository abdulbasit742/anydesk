import http from "node:http";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { installGracefulShutdown } from "./lifecycle/gracefulShutdown.js";
import { createRateLimit } from "./middleware/rateLimit.js";
import { requestId } from "./middleware/requestId.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import { noStore } from "./middleware/noStore.js";
import { rejectUnsupportedContentEncoding } from "./middleware/rejectUnsupportedContentEncoding.js";
import { rejectUnsupportedJsonCharset } from "./middleware/rejectUnsupportedJsonCharset.js";
import { requireJsonContentType } from "./middleware/requireJsonContentType.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { asyncHandler } from "./middleware/asyncHandler.js";
import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import launchRoutes from "./routes/launch.routes.js";
import connectorRoutes from "./routes/connector.routes.js";
import betaRoutes from "./routes/beta.routes.js";
import { initSocketServer } from "./socket/index.js";
import { checkDatabaseHealth } from "./observability/dependencyHealth.js";
import { health } from "./observability/health.js";
import { logger } from "./observability/safeLogger.js";

const HTTP_REQUEST_TIMEOUT_MS = 120_000;
const HTTP_HEADERS_TIMEOUT_MS = 30_000;
const HTTP_KEEP_ALIVE_TIMEOUT_MS = 5_000;
const CORS_PREFLIGHT_MAX_AGE_SECONDS = 600;
const ALLOWED_CORS_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
const ALLOWED_REQUEST_HEADERS = ["authorization", "content-type", "x-request-id"];
const EXPOSED_RESPONSE_HEADERS = ["x-request-id"];

const app = express();
const server = http.createServer(app);
server.requestTimeout = HTTP_REQUEST_TIMEOUT_MS;
server.headersTimeout = HTTP_HEADERS_TIMEOUT_MS;
server.keepAliveTimeout = HTTP_KEEP_ALIVE_TIMEOUT_MS;
server.timeout = HTTP_REQUEST_TIMEOUT_MS;

async function readinessBody() {
  const body = health.readiness();
  const database = await checkDatabaseHealth();
  const ready = body.ready && database.status === "ok";

  return {
    ...body,
    ready,
    status: ready ? ("ready" as const) : ("not_ready" as const),
    dependencies: {
      database
    }
  };
}

app.disable("x-powered-by");
app.disable("etag");
app.set("query parser", "simple");
app.use(requestId);
app.use(securityHeaders);
app.use(cors({ origin: env.corsOrigin, credentials: true, methods: ALLOWED_CORS_METHODS, allowedHeaders: ALLOWED_REQUEST_HEADERS, exposedHeaders: EXPOSED_RESPONSE_HEADERS, maxAge: CORS_PREFLIGHT_MAX_AGE_SECONDS, optionsSuccessStatus: 204 }));
app.use(rejectUnsupportedContentEncoding);
app.use(requireJsonContentType);
app.use(rejectUnsupportedJsonCharset);
app.use(express.json({ limit: "1mb", type: ["application/json", "application/*+json"], inflate: false, strict: true }));

app.get("/health", (_req, res) => {
  res.json(health.liveness());
});

app.get("/health/live", (_req, res) => {
  res.json(health.liveness());
});

app.get("/healthz", (_req, res) => {
  res.json(health.liveness());
});

app.get("/health/ready", asyncHandler(async (_req, res) => {
  const body = await readinessBody();
  res.status(body.ready ? 200 : 503).json(body);
}));

app.get("/readyz", asyncHandler(async (_req, res) => {
  const body = await readinessBody();
  res.status(body.ready ? 200 : 503).json(body);
}));

app.use(createRateLimit({ windowMs: 60_000, max: 240, name: "global-api" }));
app.use("/api", noStore);

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/launch", launchRoutes);
app.use("/api/connectors", connectorRoutes);
app.use("/api/beta", betaRoutes);

app.use(notFound);
app.use(errorHandler);

const io = initSocketServer(server);
health.markReady();
installGracefulShutdown({ server, io });

server.listen(env.port, () => {
  logger.info("RemoteDesk API listening", {
    event: "api.startup",
    status: "ready",
    port: env.port
  });
});
