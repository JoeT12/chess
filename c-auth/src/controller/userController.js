import Router from "express";
import { catchAsync } from "../../../c-common/src/utils/catchAsync.js";
import { userService } from "../service/userService.js";
import { authenticateToken } from "../utils/authenticateToken.js";

const router = Router();

router.post(
  "/createAccount",
  catchAsync(async (req, res, next) => {
    const user = req.body;
    await userService.createUser(user);
    res.sendStatus(201);
  })
);

router.get(
  "/me",
  authenticateToken,
  catchAsync(async (req, res, next) => {
    const user = req.user;
    return res.json(user);
  })
);

export default router;
