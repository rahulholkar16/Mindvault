import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import { createContent } from "../controllers/content.controller.js";

const router = Router();

router.route("/content").post(auth, createContent);
