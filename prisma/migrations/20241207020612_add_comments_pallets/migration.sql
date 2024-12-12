/*
  Warnings:

  - Added the required column `comments` to the `Boarding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pallets` to the `Boarding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boarding" ADD COLUMN     "comments" TEXT NOT NULL,
ADD COLUMN     "pallets" INTEGER NOT NULL;
