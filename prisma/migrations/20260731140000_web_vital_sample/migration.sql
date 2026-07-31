-- AlterTable
CREATE TABLE "WebVitalSample" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "delta" DOUBLE PRECISION,
    "navigationType" TEXT,
    "pathname" TEXT NOT NULL,
    "locale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebVitalSample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebVitalSample_name_createdAt_idx" ON "WebVitalSample"("name", "createdAt");

-- CreateIndex
CREATE INDEX "WebVitalSample_createdAt_idx" ON "WebVitalSample"("createdAt");
