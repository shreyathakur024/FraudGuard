/*
  Warnings:

  - Added the required column `finalRiskLevel` to the `predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalRiskScore` to the `predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "predictions" ADD COLUMN     "finalRiskLevel" TEXT NOT NULL,
ADD COLUMN     "finalRiskScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "locationAnomaly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationRiskScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "recipientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 10000;

-- CreateIndex
CREATE INDEX "transactions_recipientId_idx" ON "transactions"("recipientId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
