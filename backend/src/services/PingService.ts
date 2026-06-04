import { prisma } from '../lib/prisma';
import { PingStatus, AgentStatus } from '../types';

export class PingService {
  static async createPing(userId: string, latitude: number, longitude: number, agentId: string, amount: number, operationType: string) {
    return prisma.ping.create({
      data: {
        userId,
        agentId,
        amount,
        operationType,
        status: PingStatus.PENDING,
        latitude,
        longitude
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
            reference: true
          }
        }
      }
    });
  }

  static async acceptPing(pingId: string, agentId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping não encontrado.');
      if (ping.status !== PingStatus.PENDING) throw new Error('Ping já foi aceite ou expirou.');

      const agent = await tx.agent.findUnique({ where: { id: agentId } });
      if (!agent) throw new Error('Agente não encontrado.');

      // Update ping to ACCEPTED and assign to agent
      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: {
          status: PingStatus.ACCEPTED,
          agentId
        }
      });

      return updatedPing;
    });
  }

  static async updatePingStatus(pingId: string, status: PingStatus, agentId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping não encontrado.');
      if (ping.agentId !== agentId) throw new Error('Apenas o agente associado pode atualizar o status do ping.');

      let reservationToken = ping.reservationToken;
      let reservationExpires = ping.reservationExpires;

      // Implements Point 12 (Token de Reserva)
      // When status changes to ON_MY_WAY, generate a random token and 10 minutes expiration
      if (status === PingStatus.ON_MY_WAY && ping.status !== PingStatus.ON_MY_WAY) {
        // Generate random 6-digit numeric token
        reservationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // 10 minutes duration
        reservationExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Also update agent status to ON_MY_WAY
        await tx.agent.update({
          where: { id: agentId },
          data: { status: AgentStatus.ON_MY_WAY }
        });
      }

      // If status changes to COMPLETED, change agent status back to ONLINE
      if (status === PingStatus.COMPLETED) {
        await tx.agent.update({
          where: { id: agentId },
          data: { status: AgentStatus.ONLINE }
        });
      }

      return tx.ping.update({
        where: { id: pingId },
        data: {
          status,
          reservationToken,
          reservationExpires
        },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              phone: true,
              status: true
            }
          }
        }
      });
    });
  }

  static async getActivePings() {
    return prisma.ping.findMany({
      where: {
        status: {
          in: [PingStatus.PENDING, PingStatus.ACCEPTED, PingStatus.ON_MY_WAY]
        }
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });
  }

  static async getPingById(pingId: string) {
    return prisma.ping.findUnique({
      where: { id: pingId },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
            latitude: true,
            longitude: true
          }
        }
      }
    });
  }
}
