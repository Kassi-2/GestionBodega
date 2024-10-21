-- CreateTable
CREATE TABLE `Lending` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` ENUM('Active', 'Pending', 'Finalized', 'Inactive') NOT NULL DEFAULT 'Active',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finalizeDate` DATETIME(3) NULL,
    `eliminateDate` DATETIME(3) NULL,
    `comments` VARCHAR(191) NULL,
    `BorrowerId` INTEGER NOT NULL,
    `teacherId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL,
    `lendingId` INTEGER NOT NULL,

    UNIQUE INDEX `Alert_lendingId_key`(`lendingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LendingProduct` (
    `lendingId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    UNIQUE INDEX `LendingProduct_lendingId_productId_key`(`lendingId`, `productId`),
    PRIMARY KEY (`lendingId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lending` ADD CONSTRAINT `Lending_BorrowerId_fkey` FOREIGN KEY (`BorrowerId`) REFERENCES `Borrower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lending` ADD CONSTRAINT `Lending_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_lendingId_fkey` FOREIGN KEY (`lendingId`) REFERENCES `Lending`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LendingProduct` ADD CONSTRAINT `LendingProduct_lendingId_fkey` FOREIGN KEY (`lendingId`) REFERENCES `Lending`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LendingProduct` ADD CONSTRAINT `LendingProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
