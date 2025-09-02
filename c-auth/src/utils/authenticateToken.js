import { catchAsync } from "../../../c-common/src/utils/catchAsync.js";
import { UnauthorizedError } from "../../../c-common/src/error/apiError.js";
import jwt from "jsonwebtoken";
import { JWTPrivateKey } from "../config/env.js";

export const authenticateToken = catchAsync((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError();

  jwt.verify(token, JWTPrivateKey, (err, payload) => {
    if (err) throw new UnauthorizedError();
    req.user = {
      id: payload.id,
      email: payload.user,
      role: payload.role,
    };
    next();
  });
});
