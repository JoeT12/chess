import { JWTPublicKey } from "../../../c-common/src/config/env.js";
import { UnauthorizedError } from "../../../c-common/src/error/apiError.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../../c-common/src/utils/catchAsync.js";

export const authenticateSocket = catchAsync((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, JWTPublicKey, (err, payload) => {
    if (err) return next(new UnauthorizedError("Invalid token"));
    socket.user = {
      id: payload.id,
      email: payload.user,
      role: payload.role,
    };
    next();
  });
});
