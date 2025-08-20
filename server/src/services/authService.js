import bcrypt from "bcrypt";
import { BadRequestError } from "../utils/apiError.js";
import { userRepository } from "../repositories/userRepository.js";
import { refreshTokensRepository } from "../repositories/refreshTokensRepository.js";
import { bcryptSaltRounds } from "../config/env.js";
import {
  createNewRefreshToken,
  signAccessToken,
  REFRESH_COOKIE_OPTIONS,
  validateRefreshToken,
} from "../utils/refreshTokens.js";

export const authService = {
  async createUser(email, password) {
    if (!email || !password) {
      throw new BadRequestError("both email and password fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    await userRepository.insertUser(email, hashedPassword);
  },

  async loginUser(email, password) {
    if (!email || !password)
      throw new BadRequestError("both email and password fields are required");

    const result = await userRepository.retrieveUser(email);
    const user = result.rows[0];
    if (!user) new BadRequestError("invalid email");

    const passwordsEqual = await bcrypt.compare(password, user.password);
    if (!passwordsEqual) throw new BadRequestError("incorrect password");

    const access = signAccessToken(user);
    // Create refresh token (opaque), store hash in DB with jti
    const { jti, refreshToken } = await createNewRefreshToken(user.id);

    return {
      cookie: {
        name: "refresh_token",
        value: `${jti}.${refreshToken}`,
        options: REFRESH_COOKIE_OPTIONS,
      },
      accessToken: access,
    };
  },

  async refreshUserToken(req) {
    const cookie = req.cookies?.refresh_token;
    const { jti, userId } = await validateRefreshToken(cookie);

    // Rotate: revoke current, create new one linked via rotated_from
    await refreshTokensRepository.revokeRefreshToken(jti);
    const { jti: newJti, refreshToken: newRefreshToken } =
      await createNewRefreshToken(userId);

    // Issue new access token
    const { rows: userRows } = await userRepository.retrieveUserById(userId);
    const user = userRows[0];
    const access = signAccessToken(user);

    return {
      cookie: {
        name: "refresh_token",
        value: `${newJti}.${newRefreshToken}`,
        options: REFRESH_COOKIE_OPTIONS,
      },
      accessToken: access,
    };
  },
};
