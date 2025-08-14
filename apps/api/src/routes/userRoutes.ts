import express, { Router } from "express";
import {
	getProfile,
	getUserDetails,
	updateProfile,
	userSignIn,
	userSignUp,
} from "../controller/userController";
import { userAuth } from "../middleware/userAuth";

const router = express.Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/dashboard", userAuth, getUserDetails);
router.get("/profile", userAuth, getProfile);
router.post("/profile/update", userAuth, updateProfile);

export const userRoutes: Router = router;
