/*
  Warnings:

  - Made the column `embedding` on table `Story` required. This step will fail if there are existing NULL values in that column.

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
    "embedding" TEXT NOT NULL,
    CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("authorId", "createdAt", "description", "embedding", "id", "likesCount", "title", "updatedAt") SELECT "authorId", "createdAt", "description", "embedding", "id", "likesCount", "title", "updatedAt" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE INDEX "Story_authorId_idx" ON "Story"("authorId");
CREATE INDEX "Story_likesCount_idx" ON "Story"("likesCount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
