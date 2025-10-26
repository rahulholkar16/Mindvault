import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validation.middlewares.js";
import { login, register } from "../controllers/auth.controller.js";
const router = Router();

router.route("/register").post(ValidationMiddleware, register);
router.route("/login").post(login);

export default router;