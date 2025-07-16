-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_Url" TEXT,
    "joined_Date" TIMESTAMP(3) NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "played_At" TIMESTAMP(3) NOT NULL,
    "blackmoves" TEXT[],
    "whitemoves" TEXT[],
    "winnerId" INTEGER,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_user1_fkey" FOREIGN KEY ("user1") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_user2_fkey" FOREIGN KEY ("user2") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
