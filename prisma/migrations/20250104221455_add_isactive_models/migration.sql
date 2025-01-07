-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ForkliftOperator" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Validator" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
