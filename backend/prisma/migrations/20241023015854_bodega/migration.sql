/*
  Warnings:

  - You are about to drop the column `lendingId` on the `alert` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `alert` DROP FOREIGN KEY `Alert_lendingId_fkey`;

-- AlterTable
ALTER TABLE `alert` DROP COLUMN `lendingId`,
    MODIFY `state` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `AlertLending` (
    `alertId` INTEGER NOT NULL,
    `lendingId` INTEGER NOT NULL,

    PRIMARY KEY (`alertId`, `lendingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `mail` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`mail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AlertLending` ADD CONSTRAINT `AlertLending_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `Alert`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlertLending` ADD CONSTRAINT `AlertLending_lendingId_fkey` FOREIGN KEY (`lendingId`) REFERENCES `Lending`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
