import { Router } from "express";
import {
  createNewUser,
  loginUser,
  logoutUser,
  refreshUserToken,
  fetchUser,
  validateUser,
} from "../controller/authController.js";
import { authenticateToken } from "../middleware/authentication.js";

const router = new Router();

router.post("/createAccount", createNewUser);
router.post("/login", loginUser);
router.post("/token", refreshUserToken);
router.post("/logout", logoutUser);
router.post("/validate", validateUser);

router.get("/me", authenticateToken, fetchUser);

export default router;
