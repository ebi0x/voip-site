import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string) {
  if (password.length < 10 || password.length > 128) {
    throw new Error("Invalid password length");
  }

  const salt = randomBytes(32).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split(":");

  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  try {
    const salt = parts[1];
    const expected = Buffer.from(parts[2], "hex");
    if (expected.length !== 64) return false;

    const actual = (await scrypt(password, salt, 64)) as Buffer;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}