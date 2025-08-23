import { query } from "../db/index.js";

export const userRepository = {
  async insertUser(user, hashedPassword) {
    const { email, firstName, lastName } = user;
    return query(
      "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)",
      [email, firstName, lastName, hashedPassword]
    );
  },

  async retrieveUser(email) {
    return query("SELECT * FROM users WHERE email = $1", [email]);
  },

  async retrieveUserById(id) {
    return query("SELECT * FROM users WHERE id = $1", [id]);
  },
};
