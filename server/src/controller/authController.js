import { catchAsync } from "../utils/catchAsync.js";
import { authService } from "../services/authService.js";

export const createNewUser = catchAsync(async (req, res, next) => {
  const user  = req.body;
  await authService.createUser(user);
  res.sendStatus(201);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { cookie, accessToken: access } = await authService.loginUser(
    email,
    password
  );
  res.cookie(cookie.name, cookie.value, cookie.options);
  res.json({ accessToken: access });
});

export const logoutUser = catchAsync(async (req, res, next) => {
  const cookie = req.cookies?.refresh_token;
  await authService.logoutUser(cookie);
  res.clearCookie("refresh_token", { path: '/' })
  res.sendStatus(204);
});

export const refreshUserToken = catchAsync(async (req, res, next) => {
  const { cookie, accessToken: access } = await authService.refreshUserToken(
    req
  );
  res.cookie(cookie.name, cookie.value, cookie.options);
  res.json({ accessToken: access });
});

export const fetchUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  return res.json(user);
});

export const validateUser = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const user = await authService.validateUser(token);
  if (user) res.sendStatus(200);
  else res.sendStatus(401);
})
