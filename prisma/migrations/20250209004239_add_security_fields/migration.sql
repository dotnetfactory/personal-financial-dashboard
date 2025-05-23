-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "authorizedDate" DATETIME;
ALTER TABLE "Transaction" ADD COLUMN "authorizedDatetime" DATETIME;
ALTER TABLE "Transaction" ADD COLUMN "byOrderOf" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "closePrice" REAL;
ALTER TABLE "Transaction" ADD COLUMN "closePriceAsOf" DATETIME;
ALTER TABLE "Transaction" ADD COLUMN "cusip" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "datetime" DATETIME;
ALTER TABLE "Transaction" ADD COLUMN "industry" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "institutionSecurityId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "isCashEquivalent" BOOLEAN;
ALTER TABLE "Transaction" ADD COLUMN "isin" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "locationAddress" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "locationCity" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "locationCountry" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "locationLat" REAL;
ALTER TABLE "Transaction" ADD COLUMN "locationLon" REAL;
ALTER TABLE "Transaction" ADD COLUMN "locationPostalCode" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "locationRegion" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "marketIdentifierCode" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "merchantEntityId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "payee" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "payer" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "paymentChannel" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "paymentProcessor" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "personalFinanceCategory" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "ppd_id" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "reason" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "referenceNumber" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "sector" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "securityName" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "securityType" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "sedol" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "transactionCode" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "unofficialCurrencyCode" TEXT;
