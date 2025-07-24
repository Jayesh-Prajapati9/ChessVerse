/*
  Warnings:

  - The primary key for the `player_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `player_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "player_stats_pkey" PRIMARY KEY ("userId");
