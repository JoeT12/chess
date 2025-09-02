import Router from "express";
import { catchAsync } from "../../../c-common/src/utils/catchAsync.js";
import { authService } from "../service/authService.js";

const router = Router();

router.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { cookie, accessToken: access } = await authService.loginUser(
      email,
      password
    );
    res.cookie(cookie.name, cookie.value, cookie.options);
    res.json({ accessToken: access });
  })
);

router.post(
  "/logout",
  catchAsync(async (req, res, next) => {
    const cookie = req.cookies?.refresh_token;
    await authService.logoutUser(cookie);
    res.clearCookie("refresh_token", { path: "/" });
    res.sendStatus(204);
  })
);

router.post(
  "/validate",
  catchAsync(async (req, res, next) => {
    const { token } = req.body;
    const user = await authService.validateUser(token);
    if (user) res.sendStatus(200);
    else res.sendStatus(401);
  })
);

router.post(
  "/token",
  catchAsync(async (req, res, next) => {
    const { cookie, accessToken: access } = await authService.refreshUserToken(
      req
    );
    res.cookie(cookie.name, cookie.value, cookie.options);
    res.json({ accessToken: access });
  })
);

export default router;
