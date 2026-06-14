-- AlterTable
ALTER TABLE `User`
  ADD COLUMN `resetTokenHash` VARCHAR(191) NULL,
  ADD COLUMN `resetTokenExpiresAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Destination`
  ADD COLUMN `latitude` DOUBLE NULL,
  ADD COLUMN `longitude` DOUBLE NULL;

-- CreateIndex
CREATE INDEX `User_resetTokenHash_idx` ON `User`(`resetTokenHash`);
