import http from "node:http";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createRateLimit } from "./middleware/rateLimit.js";
import { requestId } from "./middleware/requestId.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import launchRoutes from "./routes/launch.routes.js";
import connectorRoutes from "./routes/connector.routes.js";
import { initSocketServer } from "./socket/index.js";
import { health } from "./observability/health.js";
import { logger } from "./observability/safeLogger.js";

const app = express();
const server = http.createServer(app);

app.disable("x-powered-by");
app.use(requestId);
app.use(securityHeaders);
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json(health.liveness());
});

app.get("/health/live", (_req, res) => {
  res.json(health.liveness());
});

app.get("/healthz", (_req, res) => {
  res.json(health.liveness());
});

app.get("/health/ready", (_req, res) => {
  const body = health.readiness();
  res.status(body.ready ? 200 : 503).json(body);
});

app.get("/readyz", (_req, res) => {
  const body = health.readiness();
  res.status(body.ready ? 200 : 503).json(body);
});

app.use(createRateLimit({ windowMs: 60_000, max: 240 }));

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/launch", launchRoutes);
app.use("/api/connectors", connectorRoutes);

initSocketServer(server);
health.markReady();

server.listen(env.port, () => {
  logger.info("RemoteDesk API listening", {
    event: "api.startup",
    status: "ready",
    port: env.port
  });
});
