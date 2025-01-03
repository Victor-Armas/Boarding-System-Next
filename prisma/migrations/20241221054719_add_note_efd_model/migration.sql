-- CreateTable
CREATE TABLE "NoteEfd" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardingEfdId" INTEGER NOT NULL,

    CONSTRAINT "NoteEfd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoteEfd" ADD CONSTRAINT "NoteEfd_boardingEfdId_fkey" FOREIGN KEY ("boardingEfdId") REFERENCES "BoardingEfd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
