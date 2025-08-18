/*
  Warnings:

  - Added the required column `mode` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."game" ADD COLUMN     "mode" TEXT NOT NULL;
