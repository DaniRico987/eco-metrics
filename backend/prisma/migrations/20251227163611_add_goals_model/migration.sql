-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('ENERGY', 'WATER', 'WASTE', 'TRANSPORT');

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "category" "GoalCategory" NOT NULL,
    "target" DECIMAL(65,30) NOT NULL,
    "year" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Goal_companyId_category_year_key" ON "Goal"("companyId", "category", "year");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
