-- AlterTable
ALTER TABLE "CompanyMetric" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "AiCache" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiCache_key_key" ON "AiCache"("key");

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
