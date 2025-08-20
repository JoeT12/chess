import { query } from "../db/index.js";

export const userRepository = {
  async insertUser(email, hashedPassword) {
    return query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);
  },

  async retrieveUser(email) {
    return query("SELECT * FROM users WHERE email = $1", [email]);
  },

  async retrieveUserById(id) {
    return query("SELECT * FROM users WHERE id = $1", [id]);
  },
};
