import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import { createContent, deleteContent, getAllContent, getContentById } from "../controllers/content.controller.js";

const router = Router();

router.route("/content").post(auth, createContent);
router.route("/content").get(auth, getAllContent);
router.route("/content/:contentId").get(auth, getContentById);
router.route("/content/:contentId").get(auth, getContentById);
router.route("/content/:contentId").delete(auth, deleteContent);