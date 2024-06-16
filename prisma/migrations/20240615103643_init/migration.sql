/*
  Warnings:

  - You are about to drop the column `customer` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - Added the required column `bankPaid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cashPaid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVoided` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mpesaPaid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printerIp` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmountPaid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voidedBy` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `customer`,
    DROP COLUMN `location`,
    DROP COLUMN `payment`,
    DROP COLUMN `status`,
    ADD COLUMN `bankPaid` DOUBLE NOT NULL,
    ADD COLUMN `cashPaid` DOUBLE NOT NULL,
    ADD COLUMN `customerId` INTEGER NOT NULL,
    ADD COLUMN `discountAmount` DOUBLE NOT NULL,
    ADD COLUMN `isVoided` BOOLEAN NOT NULL,
    ADD COLUMN `mpesaPaid` DOUBLE NOT NULL,
    ADD COLUMN `printerIp` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxAmount` DOUBLE NOT NULL,
    ADD COLUMN `totalAmountPaid` DOUBLE NOT NULL,
    ADD COLUMN `voidedBy` BOOLEAN NOT NULL;
