-- AlterTable
ALTER TABLE "Client" ADD COLUMN "password" TEXT NULL,
ADD COLUMN "username" TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_username_key" ON "Client"("username");
