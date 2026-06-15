import dotenv from "dotenv";

dotenv.config();

const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required("DATABASE_URL", "postgresql://remotedesk:remotedesk@localhost:5432/remotedesk"),
  jwtSecret: required("JWT_SECRET", "dev-access-secret"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret"),
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:5173").split(",")
};
