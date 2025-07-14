import { Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import crypto from "crypto";

export const userSignUp = (req: Request, res: Response) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const JWT_SECRET = process.env.JWT_SECRET || "JSON_WEB_TOKEN";

	// db call

	// @ts-ignore
	const token = jwt.sign({ email }, JWT_SECRET);

	res.status(200).json({
		message: "SignUp Successfully",
		token: token,
	});
};

export const userSignIn = (req: Request, res: Response) => {
	const email = req.body.email;
	const password = req.body.password;

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const JWT_SECRET = process.env.JWT_SECRET || "";

	// db call
	// @ts-ignore
	const token = jwt.sign({ userId }, JWT_SECRET);

	res.status(200).json({
		message: "SignIn Successfully",
		token: token,
	});
};

export const getProfile = (req: Request, res: Response) => {
	const userId = req.params.userId;
	// db call for the particular User

	res.status(200).json({
		details: "User Details",
	});
};

export const updateProfile = (req: Request, res: Response) => {
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

	// db call for update profile
	// hasholdpass == db password

	res.status(200).json({
		message: "Profile Updated",
	});
};
