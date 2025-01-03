-- CreateEnum
CREATE TYPE "EfdStatus" AS ENUM ('PENDING', 'IN_PROCESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "BoardingEfd" ADD COLUMN     "status" "EfdStatus" NOT NULL DEFAULT 'PENDING';
