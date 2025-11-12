import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import { createContent, getAllContent } from "../controllers/content.controller.js";

const router = Router();

router.route("/content").post(auth, createContent);
router.route('/content').get(auth, getAllContent);
