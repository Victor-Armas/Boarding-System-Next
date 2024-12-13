-- AlterTable
ALTER TABLE "Boarding" ADD COLUMN     "hasIssues" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProblemType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardingIssue" (
    "id" SERIAL NOT NULL,
    "boardingId" INTEGER NOT NULL,
    "state" "BoardingStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problemTypeId" INTEGER NOT NULL,

    CONSTRAINT "BoardingIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardingIssue" ADD CONSTRAINT "BoardingIssue_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "Boarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardingIssue" ADD CONSTRAINT "BoardingIssue_problemTypeId_fkey" FOREIGN KEY ("problemTypeId") REFERENCES "ProblemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
