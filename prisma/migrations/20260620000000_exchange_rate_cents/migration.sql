-- ExchangeRate: Float → centavos (enteros) para consistencia con el dominio de dinero.

ALTER TABLE "ExchangeRate" ADD COLUMN "buyArsCents" INTEGER;
ALTER TABLE "ExchangeRate" ADD COLUMN "sellArsCents" INTEGER;

UPDATE "ExchangeRate"
SET
  "buyArsCents" = ROUND("buyArs" * 100)::INTEGER,
  "sellArsCents" = ROUND("sellArs" * 100)::INTEGER;

ALTER TABLE "ExchangeRate" ALTER COLUMN "buyArsCents" SET NOT NULL;
ALTER TABLE "ExchangeRate" ALTER COLUMN "sellArsCents" SET NOT NULL;

ALTER TABLE "ExchangeRate" DROP COLUMN "buyArs";
ALTER TABLE "ExchangeRate" DROP COLUMN "sellArs";
