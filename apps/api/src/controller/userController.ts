import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser, getUserDetails, prismaClient } from "@repo/db";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "JWT";

export const SignUp = async (req: Request, res: Response) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const dbResponse = await createUser({
		username: name,
		password: hashPassword,
		email: email,
	});

	if (typeof dbResponse === "string") {
		res.status(406).json({
			message: dbResponse,
		});
		return;
	}

	const userId = dbResponse.id;
	const token = jwt.sign({ userId }, JWT_SECRET);

	res.cookie("token", token, {
		httpOnly: true,
		secure: false, // In production use true and sameSite : strict
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.status(200).json({
		message: "SignUp Successfully",
		userId: userId,
	});
};

export const SignIn = async (req: Request, res: Response) => {
	const cookie = req.cookies.token;
	const email = req.body.email;
	const password = req.body.password;

	if (cookie) {
		const verified = jwt.verify(cookie, JWT_SECRET);

		if (typeof verified !== "string") {
			const loggedInUser = await getUserDetails(verified.id, null, null);
			res.status(200).json({
				message: "Already logged In",
			});
		}
	}

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const user = await getUserDetails(null, email, hashPassword);

	if (!user.success) {
		res.status(404).json({ message: "Invalid Email or Password" });
		return;
	}
	const userId = user;

	const token = jwt.sign({ userId }, JWT_SECRET);

	console.log(token);

	res.cookie("token", token, {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	res.status(200).json({
		message: "SignIn Successfully",
		token: token,
	});
};

export const getProfile = async (req: Request, res: Response) => {
	const userId = (req as any).userId;
	const userDetails = await getUserDetails(userId, null, null);

	if (!userDetails) {
		res.status(401).json({
			message: "Can't find the user details.",
		});
	}

	res.status(200).json({
		details: "User Details",
		user: userDetails,
	});
};

export const updateProfile = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const { name, newPassword, oldPassword } = req.body;

	const hashNewPassword = crypto
		.createHash("sha256")
		.update(newPassword)
		.digest("hex");

	const hashOldPassword = crypto
		.createHash("sha256")
		.update(oldPassword)
		.digest("hex");

	const updatedUser = await prismaClient.user.update({
		where: {
			id: userId,
			password: hashOldPassword,
		},
		data: {
			password: hashNewPassword,
		},
	});

	if (!updatedUser) {
		res.status(401).json({
			message: "Invalid Password",
		});
	}

	res.status(200).json({
		message: "Profile Updated",
	});
};

export const getStats = async (req: Request, res: Response) => {
	const userId = (req as any).userId;
	console.log("controller of getDetails -- ", userId);
	console.log("controller end of getDetails -- ");
	if (!userId) {
		console.log("controller ", userId);
		res.status(401).json({
			message: "User Id is empty",
		});
		return;
	}

	const userStats = await getUserDetails(userId, null, null);
	console.log("userStats", userStats);

	userStats.success
		? res.status(200).json({
				message: userStats.data,
			})
		: res.status(404).json({
				message: userStats.error.toString(),
			});
};
