-- CreateTable
CREATE TABLE "PremiumInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PremiumInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Chapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("content", "createdAt", "id", "likesCount", "number", "storyId", "title", "updatedAt") SELECT "content", "createdAt", "id", "likesCount", "number", "storyId", "title", "updatedAt" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE INDEX "Chapter_storyId_idx" ON "Chapter"("storyId");
CREATE INDEX "Chapter_storyId_number_idx" ON "Chapter"("storyId", "number");
CREATE INDEX "Chapter_likesCount_idx" ON "Chapter"("likesCount");
CREATE UNIQUE INDEX "Chapter_storyId_number_key" ON "Chapter"("storyId", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
