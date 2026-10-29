-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "picture" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_googleId_key" ON "admins"("googleId");
