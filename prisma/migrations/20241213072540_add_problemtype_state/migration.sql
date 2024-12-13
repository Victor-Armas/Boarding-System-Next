/*
  Warnings:

  - Added the required column `state` to the `ProblemType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProblemType" ADD COLUMN     "state" "BoardingStatus" NOT NULL;
