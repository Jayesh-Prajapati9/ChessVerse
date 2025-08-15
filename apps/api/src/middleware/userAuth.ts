import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "JWT";

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.token;
	if (!token) {
		res.status(401).json({
			messgae: "Token Not Found",
		});
		return;
	}

	const decoded = jwt.verify(token, JWT_SECRET);

	if (!decoded || typeof decoded !== "object") {
		res.status(401).json({
			messgae: "Re-Login again to view the content",
		});
		return;
	}

	// can't load the types.d.ts
	(req as any).userId = decoded.userId;
	next();
};
