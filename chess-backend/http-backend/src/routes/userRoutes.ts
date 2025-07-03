import express from "express";
import {
	getProfile,
	updateProfile,
	userSignIn,
	userSignUp,
} from "../controller/userController";
import { userAuth } from "../middleware/userAuth";

const router = express.Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/profile/:userId", userAuth, getProfile);
router.post("/profile/:userId/update", userAuth, updateProfile);

export const userRoutes = router;
