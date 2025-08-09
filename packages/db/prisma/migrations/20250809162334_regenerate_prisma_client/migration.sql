/*
  Warnings:

  - Added the required column `fen` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."game" ADD COLUMN     "fen" TEXT NOT NULL;
