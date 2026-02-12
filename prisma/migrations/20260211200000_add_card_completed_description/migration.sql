-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "description" TEXT,
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
