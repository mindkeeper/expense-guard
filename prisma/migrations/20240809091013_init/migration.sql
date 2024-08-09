/*
  Warnings:

  - Added the required column `category_type` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "category_type" "CategoryType" NOT NULL;
