
import "server-only";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  daalDbPool?: Pool;
};

function createPool(): Pool {
  const required = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
}

export const db =
  globalForDb.daalDbPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.daalDbPool = db;
}
