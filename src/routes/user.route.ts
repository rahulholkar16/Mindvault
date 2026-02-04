import { Router } from "express";
import {
    passwordValidator,
    ValidationMiddleware,
} from "../middlewares/validation.middlewares.js";
import {
    getCurrentUser,
    login,
    register,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPassword,
    resetForgotPassword,
    changeCurrentPassword,
    logout,
    togglePublic,
    createShareLink,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), ValidationMiddleware, register);
router.route("/login").post(login);
router.route("/logout").delete(auth, logout);
router.route("/me").get(auth, getCurrentUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/resend-email-verification").get(auth, resendEmailVerification);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/forgot-password").get(forgotPassword);
router
    .route("/reset-password/:resetToken")
    .post(passwordValidator, resetForgotPassword);
router
    .route("/changed-password")
    .post(passwordValidator, auth, changeCurrentPassword);
router.route("/toggle-public").get(auth, togglePublic);
router.route("/share-link").get(auth, createShareLink);
export default router;
