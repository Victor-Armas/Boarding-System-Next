-- CreateEnum
CREATE TYPE "Responsible" AS ENUM ('RYDER', 'CARRIER');

-- CreateTable
CREATE TABLE "BoardingEfd" (
    "id" SERIAL NOT NULL,
    "crateEfdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysElapsed" INTEGER,
    "boardingId" INTEGER NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "material" TEXT NOT NULL,
    "quantityInvoiced" DOUBLE PRECISION NOT NULL,
    "quantityPhysical" DOUBLE PRECISION NOT NULL,
    "quantityAsn" DOUBLE PRECISION NOT NULL,
    "asnNumber" TEXT NOT NULL,
    "image" TEXT,
    "responsible" "Responsible" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardingEfd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardingEfd" ADD CONSTRAINT "BoardingEfd_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "Boarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardingEfd" ADD CONSTRAINT "BoardingEfd_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardingEfd" ADD CONSTRAINT "BoardingEfd_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
