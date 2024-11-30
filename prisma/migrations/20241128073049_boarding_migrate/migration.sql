-- CreateTable
CREATE TABLE "Box" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boarding" (
    "id" SERIAL NOT NULL,
    "numberBox" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "operator" TEXT NOT NULL,
    "validator" TEXT NOT NULL,
    "capturist" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "pallets" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,
    "perforations" BOOLEAN NOT NULL DEFAULT false,
    "documentation" BOOLEAN NOT NULL DEFAULT false,
    "security" BOOLEAN NOT NULL DEFAULT false,
    "boxId" INTEGER NOT NULL,

    CONSTRAINT "Boarding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
