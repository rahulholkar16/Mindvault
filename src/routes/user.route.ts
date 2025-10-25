import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validation.middlewares.js";
import { registerUser } from "../controllers/auth.controller.js";
const router = Router();

router.route("/register").post(ValidationMiddleware, registerUser);

export default router;