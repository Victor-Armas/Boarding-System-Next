-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COORDINATOR', 'ASSISTANT', 'BUYER');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "Store" AS ENUM ('RYDER9', 'PLANTG');

-- CreateEnum
CREATE TYPE "BoardingStatus" AS ENUM ('PENDING_DOWNLOAD', 'DOWNLOADING', 'VALIDATING', 'CAPTURING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CajaType" AS ENUM ('CAMIONETA', 'TORTON', 'MARITIMO', 'CAJA_CERRADA', 'FULL');

-- CreateTable
CREATE TABLE "Ramp" (
    "id" SERIAL NOT NULL,
    "nameRamp" TEXT NOT NULL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ramp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForkliftOperator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ForkliftOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assistant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boarding" (
    "id" SERIAL NOT NULL,
    "boxNumber" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "boxType" "CajaType" NOT NULL,
    "status" "BoardingStatus" NOT NULL,
    "rampId" INTEGER,
    "forkliftOperatorId" INTEGER,
    "validatorId" INTEGER,
    "assistantId" INTEGER,
    "downloadStartDate" TIMESTAMP(3),
    "downloadEndDate" TIMESTAMP(3),
    "validationStartDate" TIMESTAMP(3),
    "validationEndDate" TIMESTAMP(3),
    "captureStartDate" TIMESTAMP(3),
    "captureEndDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "timeUntilRamp" INTEGER,
    "downloadDuration" INTEGER,
    "validationDuration" INTEGER,
    "captureDuration" INTEGER,

    CONSTRAINT "Boarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BUYER',
    "store" "Store" NOT NULL DEFAULT 'RYDER9',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_rampId_fkey" FOREIGN KEY ("rampId") REFERENCES "Ramp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_forkliftOperatorId_fkey" FOREIGN KEY ("forkliftOperatorId") REFERENCES "ForkliftOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boarding" ADD CONSTRAINT "Boarding_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
