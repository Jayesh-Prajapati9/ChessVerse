import { Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prismaClient } from "../../../db/src/index";

export const userSignUp = async (req: Request, res: Response) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const dbResponse = await prismaClient.user.create({
		data: {
			username: name,
			password: hashPassword,
			email: email,
			joined_Date: new Date(),
		},
	});

	!dbResponse
		? res.status(404).json({
				message: "Invalid Credentials",
		  })
		: res.status(200).json({
				message: "SignUp Successfully",
				token: dbResponse.id,
		  });
};

export const userSignIn = async (req: Request, res: Response) => {
	const email = req.body.email;
	const password = req.body.password;

	const hashPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	const JWT_SECRET = process.env.JWT_SECRET || "JSON_WEB_TOKEN";

	const user = await prismaClient.user.findUnique({
		where: {
			email: email,
			password: hashPassword,
		},
	});

	if (!user) {
		res.status(404).json({ message: "Invalid Email or Password" });
		return;
	}

	const userId = user.id;

	const token = jwt.sign({ userId }, JWT_SECRET);

	res.status(200).json({
		message: "SignIn Successfully",
		token: token,
	});
};

export const getProfile = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const userDetails = await prismaClient.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!userDetails) {
		res.status(404).json({
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
			password: oldPassword,
		},
		data: {
			password: newPassword,
		},
	});

	if (!updateProfile) {
		res.status(404).json({
			message: "Invalid Password",
		});
	}

	res.status(200).json({
		message: "Profile Updated",
	});
};
