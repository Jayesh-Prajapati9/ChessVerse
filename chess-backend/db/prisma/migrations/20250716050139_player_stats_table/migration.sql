-- CreateTable
CREATE TABLE "player_stats" (
    "id" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "games_won" INTEGER NOT NULL,
    "games_played" INTEGER NOT NULL,
    "win_rate" INTEGER NOT NULL,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
