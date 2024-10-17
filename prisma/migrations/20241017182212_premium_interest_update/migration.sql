/*
  Warnings:

  - Added the required column `updatedAt` to the `PremiumInterest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PremiumInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PremiumInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PremiumInterest" ("createdAt", "id", "tier", "userId") SELECT "createdAt", "id", "tier", "userId" FROM "PremiumInterest";
DROP TABLE "PremiumInterest";
ALTER TABLE "new_PremiumInterest" RENAME TO "PremiumInterest";
CREATE UNIQUE INDEX "PremiumInterest_userId_tier_key" ON "PremiumInterest"("userId", "tier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
