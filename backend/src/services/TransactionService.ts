import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma';

type RawExecutor = {
  $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<number>;
};

const FINANCIAL_OPERATIONS = new Set(['withdrawal', 'deposit', 'payment', 'transfer']);

export function parseMoneyAmount(value: unknown): number {
  const amount = typeof value === 'string' ? Number(value.replace(',', '.').trim()) : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Valor monetario invalido. Informe um valor maior que zero.');
  }
  return Math.round(amount * 100) / 100;
}

export function isFinancialOperation(operationType: string) {
  return FINANCIAL_OPERATIONS.has(operationType);
}

export class TransactionService {
  static async createForPing(
    db: RawExecutor,
    data: {
      pingId: string;
      userId: string;
      agentId: string;
      operationType: string;
      amount: number;
      status: string;
    }
  ) {
    if (!isFinancialOperation(data.operationType)) return;

    await db.$executeRaw`
      INSERT INTO "Transaction" ("id", "pingId", "userId", "agentId", "operationType", "amount", "status", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${data.pingId}, ${data.userId}, ${data.agentId}, ${data.operationType}, ${data.amount}, ${data.status}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("pingId") DO NOTHING
    `;
  }

  static async updateStatusByPing(db: RawExecutor, pingId: string, status: string) {
    await db.$executeRaw`
      UPDATE "Transaction"
      SET "status" = ${status}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "pingId" = ${pingId}
    `;
  }

  static async getRequestsByType() {
    return prisma.$queryRaw<Array<{ operationType: string; count: bigint }>>`
      SELECT "operationType", COUNT(*)::bigint AS "count"
      FROM "Transaction"
      GROUP BY "operationType"
    `;
  }
}
