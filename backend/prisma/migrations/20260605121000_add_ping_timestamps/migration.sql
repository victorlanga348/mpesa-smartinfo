-- AlterTable
ALTER TABLE "Ping" ADD COLUMN "acceptedAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "waitingListAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "arrivedAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "inServiceAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "completedAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Ping" ADD COLUMN "cancelledAt" TIMESTAMP(3);

-- Backfill completed pings so existing development data can contribute to averages.
UPDATE "Ping"
SET "completedAt" = "updatedAt"
WHERE "status" = 'COMPLETED' AND "completedAt" IS NULL;
