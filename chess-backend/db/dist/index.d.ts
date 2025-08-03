import { PrismaClient } from '../generated/prisma';
import { PrismaClientKnownRequestError } from "../generated/prisma/runtime/library";
export declare const prismaClient: PrismaClient<import("../generated/prisma").Prisma.PrismaClientOptions, never, import("../generated/prisma/runtime/library").DefaultArgs>;
export declare const prismaError: typeof PrismaClientKnownRequestError;
export * from "./dbQueries/userQueries";
//# sourceMappingURL=index.d.ts.map