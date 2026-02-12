-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "due" TIMESTAMP(3),
ADD COLUMN     "dueComplete" TIMESTAMP(3),
ADD COLUMN     "dueReminder" TIMESTAMP(3);
