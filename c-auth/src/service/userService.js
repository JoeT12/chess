import { bcryptSaltRounds } from "../config/env.js";
import bcrypt from 'bcrypt';
import { userRepository } from "../repository/userRepository.js";

export const userService = {
  async createUser(user) {
    if (!user.email || !user.password || !user.firstName || !user.lastName) {
      throw new BadRequestError("not all required fields were provided");
    }

    const hashedPassword = await bcrypt.hash(user.password, bcryptSaltRounds);
    await userRepository.insertUser(user, hashedPassword);
  },
};
