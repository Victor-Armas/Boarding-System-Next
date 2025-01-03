/*
  Warnings:

  - Added the required column `authorId` to the `NoteEfd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NoteEfd" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "NoteEfd" ADD CONSTRAINT "NoteEfd_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
