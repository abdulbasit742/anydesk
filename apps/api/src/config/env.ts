import dotenv from "dotenv";

dotenv.config();

type RuntimeMode = "development" | "test" | "production";

interface RequiredEnvOptions {
  devFallback?: string;
  minLength?: number;
  secret?: boolean;
}

const DEV_DATABASE_URL = "postgresql://remotedesk:remotedesk@localhost:5432/remotedesk";
const DEV_JWT_SECRET = "dev-access-secret";
const DEV_JWT_REFRESH_SECRET = "dev-refresh-secret";
const DEV_CORS_ORIGIN = "http://localhost:3000,http://localhost:5173";
const DEFAULT_SECRET_MIN_LENGTH = 32;

const nodeEnv = (process.env.NODE_ENV ?? "development") as RuntimeMode;
const isProduction = nodeEnv === "production";

const forbiddenProductionValues = new Set([
  DEV_DATABASE_URL,
  DEV_JWT_SECRET,
  DEV_JWT_REFRESH_SECRET,
  "changeme",
  "change-me",
  "secret",
  "password",
  "password123"
]);

function readRequired(key: string, options: RequiredEnvOptions = {}): string {
  const rawValue = process.env[key] ?? (!isProduction ? options.devFallback : undefined);
  if (!rawValue) throw new Error(`Missing environment variable: ${key}`);

  const value = rawValue.trim();
  if (!value) throw new Error(`Environment variable ${key} cannot be empty`);

  if (isProduction) {
    if (forbiddenProductionValues.has(value)) {
      throw new Error(`Environment variable ${key} is using an unsafe development/default value`);
    }

    if (options.secret && value.length < (options.minLength ?? DEFAULT_SECRET_MIN_LENGTH)) {
      throw new Error(`Environment variable ${key} must be at least ${options.minLength ?? DEFAULT_SECRET_MIN_LENGTH} characters in production`);
    }
  }

  return value;
}

function readOptional(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function readNumber(key: string, fallback: number): number {
  const rawValue = process.env[key];
  if (!rawValue) return fallback;
  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Environment variable ${key} must be a positive number`);
  }
  return value;
}

function normalizeCorsOrigin(origin: string): string {
  if (origin === "*") {
    throw new Error("CORS_ORIGIN cannot use * because credentialed CORS is enabled");
  }

  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    throw new Error(`CORS_ORIGIN contains an invalid origin: ${origin}`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`CORS_ORIGIN must use http or https: ${origin}`);
  }

  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(`CORS_ORIGIN must be an origin only, without path/query/hash: ${origin}`);
  }

  return parsed.origin;
}

function readCorsOrigins(): string[] {
  const rawValue = process.env.CORS_ORIGIN ?? (!isProduction ? DEV_CORS_ORIGIN : undefined);
  if (!rawValue) throw new Error("Missing environment variable: CORS_ORIGIN");

  const origins = rawValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeCorsOrigin);

  const uniqueOrigins = [...new Set(origins)];
  if (uniqueOrigins.length === 0) throw new Error("CORS_ORIGIN must include at least one origin");
  return uniqueOrigins;
}

export const env = {
  nodeEnv,
  isProduction,
  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",
  // When true: all /api routes are served from in-memory state (no DB). Dev only.
  devInMemoryFallback: process.env.DEV_IN_MEMORY_FALLBACK === "true" && !isProduction,
  port: readNumber("PORT", 5000),
  databaseUrl: readRequired("DATABASE_URL", { devFallback: DEV_DATABASE_URL }),
  jwtSecret: readRequired("JWT_SECRET", { devFallback: DEV_JWT_SECRET, secret: true }),
  jwtRefreshSecret: readRequired("JWT_REFRESH_SECRET", { devFallback: DEV_JWT_REFRESH_SECRET, secret: true }),
  corsOrigin: readCorsOrigins(),
  engineId: readOptional("ENGINE_ID"),
  dashboardEngineSigningSecret: readOptional("DASHBOARD_ENGINE_SIGNING_SECRET"),
  engineWebhookSigningSecret: readOptional("ENGINE_WEBHOOK_SIGNING_SECRET"),
  dashboardEngineWebhookUrl: readOptional("DASHBOARD_ENGINE_WEBHOOK_URL"),
  releaseManifestUrl: readOptional("RELEASE_MANIFEST_URL")
} as const;
