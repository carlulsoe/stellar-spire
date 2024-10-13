/*
  Warnings:

  - A unique constraint covering the columns `[storyId]` on the table `StoryImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoryImage_storyId_key" ON "StoryImage"("storyId");
