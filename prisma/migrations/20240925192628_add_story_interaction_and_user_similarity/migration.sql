-- CreateTable
CREATE TABLE "StoryInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoryInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoryInteraction_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSimilarity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSimilarity_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSimilarity_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StoryInteraction_userId_idx" ON "StoryInteraction"("userId");

-- CreateIndex
CREATE INDEX "StoryInteraction_storyId_idx" ON "StoryInteraction"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryInteraction_userId_storyId_type_key" ON "StoryInteraction"("userId", "storyId", "type");

-- CreateIndex
CREATE INDEX "UserSimilarity_userId1_idx" ON "UserSimilarity"("userId1");

-- CreateIndex
CREATE INDEX "UserSimilarity_userId2_idx" ON "UserSimilarity"("userId2");

-- CreateIndex
CREATE UNIQUE INDEX "UserSimilarity_userId1_userId2_key" ON "UserSimilarity"("userId1", "userId2");
