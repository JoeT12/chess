import { JWTPrivateKey } from "../config/env.js";
import { UnauthorizedError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";

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

export const authenticateSocket = catchAsync((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, JWTPrivateKey, (err, payload) => {
    if (err) return next(new UnauthorizedError("Invalid token"));
    socket.user = {
      id: payload.id,
      email: payload.user,
      role: payload.role,
    };
    next();
  });
});
