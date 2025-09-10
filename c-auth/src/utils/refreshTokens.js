import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../../c-common/src/error/apiError.js";
import { refreshTokensRepository } from "../repository/refreshTokensRepository.js";
import {
  bcryptSaltRounds,
  JWTPrivateKey,
  JWTTokenTTL,
  RefreshTokenTTL,
} from "../config/env.js";
import { env } from "../../../c-common/src/config/env.js";

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none", // consider 'strict' for pure web apps
  secure: env === "development" ? false : true, // true on HTTPS in production
  path: "/",
  maxAge: RefreshTokenTTL * 24 * 60 * 60 * 1000,
};

const expiresAt = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      user: user.email,
      role: user.role_id,
    },
    JWTPrivateKey,
    { algorithm: "RS256", expiresIn: JWTTokenTTL }
  );
};

/** Validates the refresh token stored in the given cookie.
 *
 * @param {string} cookie - The cookie containing the refresh token (expected to be in the format: "<jti>.<token>").
 * @returns {Promise<void | UnauthorizedError>} Resolves with `void` if valid, or returns an `UnauthorizedError` if invalid.
 */
export const validateRefreshToken = async (cookie) => {
  if (!cookie) return new UnauthorizedError("missing refresh token");

  const [jti, token] = cookie.split(".");
  if (!jti || !token) return new UnauthorizedError("malformed refresh token");

  // Lookup stored token
  const { rows } = await refreshTokensRepository.getRefreshToken(jti);
  if (rows.length === 0)
    return new UnauthorizedError("refresh token not found");

  const rt = rows[0];
  if (rt.revoked) return new UnauthorizedError("refresh token revoked");
  if (new Date(rt.expires_at) < new Date())
    return new UnauthorizedError("refresh token expired");

  const valid = await bcrypt.compare(token, rt.token_hash);
  if (!valid) {
    // Token mismatch -> revoke this chain immediately
    await refreshTokensRepository.revokeRefreshToken(jti);
    return new UnauthorizedError("invalid refresh token");
  }

  return { jti, userId: rt.user_id };
};

/** Creates a new refresh token for the given user.
 *
 * @param {string} userId The (INT) id of the user
 *
 * @return {Promise<{jti: string, refresh_token: string}>} Info about the created refresh token
 */
export const createNewRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  const refreshTokenHash = await bcrypt.hash(refreshToken, bcryptSaltRounds);
  const jti = crypto.randomUUID();
  const exp = expiresAt(RefreshTokenTTL);

  await refreshTokensRepository.insertNewRefreshToken(
    jti,
    userId,
    refreshTokenHash,
    exp
  );

  return {
    jti: jti,
    refreshToken: refreshToken,
  };
};
