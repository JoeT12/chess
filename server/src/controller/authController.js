import { catchAsync } from "../utils/catchAsync.js";
import { authService } from "../services/authService.js";

export const createNewUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  await authService.createUser(email, password);
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

export const refreshUserToken = catchAsync(async (req, res, next) => {
  const { cookie, accessToken: access } = await authService.refreshUserToken(
    req
  );
  res.cookie(cookie.name, cookie.value, cookie.options);
  res.json({ accessToken: access });
});
