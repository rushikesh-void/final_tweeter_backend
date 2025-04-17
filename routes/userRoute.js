import express from "express";
import { Register, Login, logout, getMyProfile, follow, unfollow,getOtherUsers, bookmark } from "../controllers/userController.js";

import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);

export default router;