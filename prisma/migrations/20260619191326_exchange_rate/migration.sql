-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'dolarapi',
    "type" TEXT NOT NULL,
    "buyArs" DOUBLE PRECISION NOT NULL,
    "sellArs" DOUBLE PRECISION NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_source_type_key" ON "ExchangeRate"("source", "type");
