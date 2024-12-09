-- AlterTable
ALTER TABLE `category` ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `lending` ADD COLUMN `hasProblems` BOOLEAN NOT NULL DEFAULT false;
