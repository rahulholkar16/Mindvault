import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import { createContent, deleteContent, getAllContent, getContentById, getSpecificContent } from "../controllers/content.controller.js";

const router = Router();

router.route("/content").post(auth, createContent);
router.route("/content").get(auth, getAllContent);
router.route("/content/:type").get(auth, getSpecificContent);
router.route("/content/:contentId").get(auth, getContentById);
router.route("/content/:contentId").get(auth, getContentById);
router.route("/content/:contentId").delete(auth, deleteContent);

export default router;