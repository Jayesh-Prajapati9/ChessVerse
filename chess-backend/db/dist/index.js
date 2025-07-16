"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaError = exports.prismaClient = void 0;
const prisma_1 = require("../generated/prisma");
const library_1 = require("../generated/prisma/runtime/library");
exports.prismaClient = new prisma_1.PrismaClient();
exports.prismaError = library_1.PrismaClientKnownRequestError;
