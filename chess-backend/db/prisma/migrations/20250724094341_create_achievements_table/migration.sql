/*
  Warnings:

  - Added the required column `games_draw` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `win_streak` to the `player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" ALTER COLUMN "winnerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "player_stats" ADD COLUMN     "games_draw" INTEGER NOT NULL,
ADD COLUMN     "win_streak" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "achieved_At" TIMESTAMP(3) NOT NULL,
    "is_hidden" BOOLEAN NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
