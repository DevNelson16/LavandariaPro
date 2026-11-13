/*
  Warnings:

  - You are about to alter the column `role` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `deliveryAt` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `role` ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE';

-- AlterTable
ALTER TABLE `order` DROP COLUMN `deliveryAt`,
    ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `estimatedDeliveryAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('PAID', 'PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Customer_phone_key` ON `Customer`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);
