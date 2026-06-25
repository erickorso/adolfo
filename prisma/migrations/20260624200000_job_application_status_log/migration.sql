-- CreateTable
CREATE TABLE "JobApplicationStatusLog" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplicationStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobApplicationStatusLog_applicationId_createdAt_idx" ON "JobApplicationStatusLog"("applicationId", "createdAt");

-- AddForeignKey
ALTER TABLE "JobApplicationStatusLog" ADD CONSTRAINT "JobApplicationStatusLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: log inicial por postulación existente
INSERT INTO "JobApplicationStatusLog" ("id", "applicationId", "status", "note", "createdAt")
SELECT
    "id" || '-initial',
    "id",
    "status",
    'Estado inicial',
    COALESCE("appliedAt", "createdAt")
FROM "JobApplication"
WHERE NOT EXISTS (
    SELECT 1 FROM "JobApplicationStatusLog" l WHERE l."applicationId" = "JobApplication"."id"
);
