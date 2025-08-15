import express, { Router } from "express";
import {
	getProfile,
	getStats,
	updateProfile,
	SignIn,
	SignUp,
} from "../controller/userController";
import { userAuth } from "../middleware/userAuth";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.get("/auth/check", userAuth, getStats);
router.get("/profile", userAuth, getProfile);
router.post("/profile/update", userAuth, updateProfile);

export const userRoutes: Router = router;
