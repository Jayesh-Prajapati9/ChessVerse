import { PrismaClient } from "../generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const prismaClient = new PrismaClient();
export const prismaError = PrismaClientKnownRequestError 