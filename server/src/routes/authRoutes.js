import { Router } from "express";
import {
  createNewUser,
  loginUser,
  refreshUserToken,
} from "../controller/authController.js";

const router = new Router();

router.post("/createAccount", createNewUser);
router.post("/login", loginUser);
router.post("/token", refreshUserToken);

export default router;
