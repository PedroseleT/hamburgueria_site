/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Restaurant` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENT';
