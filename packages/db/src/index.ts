import { PrismaClient }  from '../generated/prisma';
import { PrismaClientKnownRequestError } from "../generated/prisma/runtime/library";

export const prismaClient = new PrismaClient();
export const prismaError = PrismaClientKnownRequestError;
export * from "./dbQueries/userQueries";
