import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validation.middlewares.js";
import { login, register } from "../controllers/auth.controller.js";
const router = Router();

router.route("/register").post(ValidationMiddleware, register);
router.route("/login").get(login);
router.route("/login").delete(login);

export default router;