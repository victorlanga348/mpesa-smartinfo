import { prisma } from '../lib/prisma';
import { PingStatus } from '../types';

type RawExecutor = {
  $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<number>;
};

export class PingTimingService {
  static async markStatusTime(db: RawExecutor, pingId: string, status: PingStatus) {
    if (status === PingStatus.ACCEPTED) {
      await db.$executeRaw`UPDATE "Ping" SET "acceptedAt" = COALESCE("acceptedAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.WAITING_LIST) {
      await db.$executeRaw`UPDATE "Ping" SET "waitingListAt" = COALESCE("waitingListAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.ARRIVED) {
      await db.$executeRaw`UPDATE "Ping" SET "arrivedAt" = COALESCE("arrivedAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.IN_SERVICE) {
      await db.$executeRaw`UPDATE "Ping" SET "inServiceAt" = COALESCE("inServiceAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.COMPLETED) {
      await db.$executeRaw`UPDATE "Ping" SET "completedAt" = COALESCE("completedAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.REJECTED) {
      await db.$executeRaw`UPDATE "Ping" SET "rejectedAt" = COALESCE("rejectedAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    } else if (status === PingStatus.CANCELLED) {
      await db.$executeRaw`UPDATE "Ping" SET "cancelledAt" = COALESCE("cancelledAt", CURRENT_TIMESTAMP) WHERE "id" = ${pingId}`;
    }
  }

  static async getAverageServiceMinutesByAgent() {
    return prisma.$queryRaw<Array<{ agentId: string; averageMinutes: number | null; completedCount: bigint }>>`
      SELECT
        "agentId",
        AVG(EXTRACT(EPOCH FROM (COALESCE("completedAt", "updatedAt") - "createdAt")) / 60.0) AS "averageMinutes",
        COUNT(*)::bigint AS "completedCount"
      FROM "Ping"
      WHERE "status" = 'COMPLETED' AND "agentId" IS NOT NULL
      GROUP BY "agentId"
    `;
  }
}
