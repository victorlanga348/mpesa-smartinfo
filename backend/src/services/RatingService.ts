import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma';
import { PingStatus } from '../types';

export class RatingService {
  static async rateAgent(userId: string, pingId: string, ratingValue: number, comment?: string) {
    const rating = Number(ratingValue);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Avaliacao invalida. Use uma nota entre 1 e 5.');
    }

    const ping = await prisma.ping.findUnique({ where: { id: pingId } });
    if (!ping) throw new Error('Atendimento nao encontrado.');
    if (ping.userId !== userId) throw new Error('Apenas o cliente deste atendimento pode avaliar.');
    if (ping.status !== PingStatus.COMPLETED) throw new Error('So e possivel avaliar depois do atendimento concluido.');
    if (!ping.agentId) throw new Error('Este atendimento nao tem agente associado.');

    const existing = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id" FROM "AgentRating"
      WHERE "pingId" = ${pingId} AND "userId" = ${userId}
      LIMIT 1
    `;
    if (existing.length > 0) throw new Error('Este atendimento ja foi avaliado.');

    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO "AgentRating" ("id", "pingId", "userId", "agentId", "rating", "comment", "createdAt", "updatedAt")
      VALUES (${id}, ${pingId}, ${userId}, ${ping.agentId}, ${rating}, ${comment?.trim() || null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    return {
      id,
      pingId,
      userId,
      agentId: ping.agentId,
      rating,
      comment: comment?.trim() || null,
    };
  }

  static async getAverageRatingsByAgent() {
    return prisma.$queryRaw<Array<{ agentId: string; averageRating: number | null; ratingCount: bigint }>>`
      SELECT
        "agentId",
        AVG("rating") AS "averageRating",
        COUNT(*)::bigint AS "ratingCount"
      FROM "AgentRating"
      GROUP BY "agentId"
    `;
  }
}
