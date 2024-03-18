/*
  Warnings:

  - You are about to drop the column `timeSpentEatinginMin` on the `Eaten` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Eaten" DROP COLUMN "timeSpentEatinginMin",
ADD COLUMN     "price" INTEGER;
