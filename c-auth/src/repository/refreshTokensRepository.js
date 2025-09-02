import { query } from "../../../c-common/src/db/dbInterface.js";

export const refreshTokensRepository = {
  async insertNewRefreshToken(jti, userId, token, expiry) {
    return query(
      `insert into refresh_tokens (id, user_id, token_hash, expires_at)
     values ($1, $2, $3, $4)`,
      [jti, userId, token, expiry]
    );
  },

  async getRefreshToken(jti) {
    return query(
      "select id, user_id, token_hash, expires_at, revoked from refresh_tokens where id = $1",
      [jti]
    );
  },

  async revokeRefreshToken(jti) {
    return query("update refresh_tokens set revoked = true where id = $1", [
      jti,
    ]);
  },
};
