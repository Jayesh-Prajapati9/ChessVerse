import { PrismaClient }  from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const prismaClient = new PrismaClient();
export const prismaError = PrismaClientKnownRequestError;
export * from "./dbQueries/userQueries";
