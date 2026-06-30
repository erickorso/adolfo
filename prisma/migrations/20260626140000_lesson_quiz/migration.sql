-- AlterTable
ALTER TABLE "LessonProgress" ALTER COLUMN "completedAt" DROP NOT NULL;
ALTER TABLE "LessonProgress" ALTER COLUMN "xpEarned" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "LessonProgress" ADD COLUMN "quizScore" INTEGER;
ALTER TABLE "LessonProgress" ADD COLUMN "quizPassedAt" TIMESTAMP(3);
ALTER TABLE "LessonProgress" ADD COLUMN "quizXpEarned" INTEGER NOT NULL DEFAULT 0;
