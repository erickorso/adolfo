-- CreateTable
CREATE TABLE "FpCertificate" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'fp-certificado',
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "family" TEXT,
    "level" INTEGER NOT NULL,
    "requiresBachiller" BOOLEAN NOT NULL,
    "hours" INTEGER NOT NULL,
    "modality" TEXT NOT NULL DEFAULT 'mixta',
    "url" TEXT NOT NULL,
    "programUrl" TEXT,
    "teleformation" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'SEPE · Certificado profesional',
    "location" TEXT DEFAULT 'España',
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FpCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FpCertificate_level_idx" ON "FpCertificate"("level");

-- CreateIndex
CREATE INDEX "FpCertificate_family_idx" ON "FpCertificate"("family");

-- CreateIndex
CREATE INDEX "FpCertificate_requiresBachiller_idx" ON "FpCertificate"("requiresBachiller");

-- CreateIndex
CREATE INDEX "FpCertificate_hidden_idx" ON "FpCertificate"("hidden");

-- CreateIndex
CREATE INDEX "FpCertificate_fetchedAt_idx" ON "FpCertificate"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FpCertificate_source_externalId_key" ON "FpCertificate"("source", "externalId");
