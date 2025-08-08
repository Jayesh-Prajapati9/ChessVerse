import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.token;

	const JWT_SECRET = process.env.JWT_SECRET || "";

	const decoded = jwt.verify(token, JWT_SECRET);

	if (!decoded || typeof decoded !== "object") {
		res.status(401).json({
			messgae: "Re-Login again to view the content",
		});
		return;
	}

	req.body.userId = decoded.userId;
	next();
};
