import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validation.middlewares.js";
import { getCurrentUser, login, register, verifyEmail } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middlewares.js"
const router = Router();

router.route("/register").post(ValidationMiddleware, register);
router.route("/login").get(login);
router.route("/login").delete(auth, login);
router.route("/me").get(auth, getCurrentUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
export default router;