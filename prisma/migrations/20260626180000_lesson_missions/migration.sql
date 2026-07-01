-- AlterTable
ALTER TABLE "LessonProgress" ADD COLUMN "missionReadme" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LessonProgress" ADD COLUMN "missionVideo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LessonProgress" ADD COLUMN "missionCode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LessonProgress" ADD COLUMN "missionXpEarned" INTEGER NOT NULL DEFAULT 0;
