-- AlterTable
ALTER TABLE "Story" ADD COLUMN "embedding" TEXT;

-- CreateTable
CREATE TABLE "UserReadHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "readTime" DATETIME NOT NULL,
    CONSTRAINT "UserReadHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserReadHistory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserReadHistory_userId_idx" ON "UserReadHistory"("userId");

-- CreateIndex
CREATE INDEX "UserReadHistory_storyId_idx" ON "UserReadHistory"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReadHistory_userId_storyId_key" ON "UserReadHistory"("userId", "storyId");
