/*
  Warnings:

  - Added the required column `ProblemTypeEfdId` to the `BoardingEfd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoardingEfd" ADD COLUMN     "ProblemTypeEfdId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProblemTypeEfd" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProblemTypeEfd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardingEfd" ADD CONSTRAINT "BoardingEfd_ProblemTypeEfdId_fkey" FOREIGN KEY ("ProblemTypeEfdId") REFERENCES "ProblemTypeEfd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
