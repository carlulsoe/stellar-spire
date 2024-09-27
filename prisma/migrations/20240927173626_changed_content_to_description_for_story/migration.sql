/*
  Warnings:

  - You are about to drop the column `content` on the `Story` table. All the data in the column will be lost.
  - Added the required column `description` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("authorId", "createdAt", "id", "likesCount", "title", "updatedAt") SELECT "authorId", "createdAt", "id", "likesCount", "title", "updatedAt" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE INDEX "Story_authorId_idx" ON "Story"("authorId");
CREATE INDEX "Story_likesCount_idx" ON "Story"("likesCount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
