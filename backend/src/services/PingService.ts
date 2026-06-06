import { prisma } from '../lib/prisma';
import { PingStatus, AgentStatus } from '../types';
import { parseMoneyAmount, TransactionService } from './TransactionService';
import { PingTimingService } from './PingTimingService';

const pingInclude = {
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
      status: true,
      latitude: true,
      longitude: true,
      reference: true
    }
  }
};

export class PingService {
  static async createPing(userId: string, latitude: number, longitude: number, agentId: string, amount: number, operationType: string) {
    const normalizedOperation = String(operationType || '').trim().toLowerCase();
    const normalizedAmount = parseMoneyAmount(amount);

    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.create({
        data: {
          userId,
          agentId,
          amount: normalizedAmount,
          operationType: normalizedOperation,
          status: PingStatus.PENDING,
          latitude,
          longitude
        },
        include: pingInclude
      });

      await TransactionService.createForPing(tx, {
        pingId: ping.id,
        userId,
        agentId,
        operationType: normalizedOperation,
        amount: normalizedAmount,
        status: PingStatus.PENDING
      });

      return ping;
    });
  }

  static async acceptPing(pingId: string, agentId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping não encontrado.');
      if (ping.status !== PingStatus.PENDING) throw new Error('Ping já foi aceite ou expirou.');

      const agent = await tx.agent.findUnique({ where: { id: agentId } });
      if (!agent) throw new Error('Agente não encontrado.');

      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: {
          status: PingStatus.ACCEPTED,
          agentId,
          reservationToken: Math.floor(100000 + Math.random() * 900000).toString(),
          reservationExpires: new Date(Date.now() + 10 * 60 * 1000)
        },
        include: pingInclude
      });

      await PingTimingService.markStatusTime(tx, pingId, PingStatus.ACCEPTED);
      await TransactionService.updateStatusByPing(tx, pingId, PingStatus.ACCEPTED);

      return updatedPing;
    });
  }

  static async rejectPing(pingId: string, agentId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping nao encontrado.');
      if (ping.agentId !== agentId) throw new Error('Apenas o agente associado pode rejeitar este pedido.');
      if (ping.status !== PingStatus.PENDING) throw new Error('Apenas pedidos pendentes podem ser rejeitados.');

      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: { status: PingStatus.REJECTED },
        include: pingInclude
      });

      await PingTimingService.markStatusTime(tx, pingId, PingStatus.REJECTED);
      await TransactionService.updateStatusByPing(tx, pingId, PingStatus.REJECTED);
      return updatedPing;
    });
  }

  static async completePing(pingId: string, agentId: string) {
    return this.updatePingStatus(pingId, PingStatus.COMPLETED, agentId);
  }

  static async cancelPing(pingId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping nao encontrado.');
      if (ping.userId !== userId) throw new Error('Apenas o cliente do pedido pode cancelar.');
      if (![PingStatus.PENDING, PingStatus.ACCEPTED, PingStatus.WAITING_LIST].includes(ping.status as PingStatus)) {
        throw new Error('Este pedido ja nao pode ser cancelado.');
      }

      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: { status: PingStatus.CANCELLED },
        include: pingInclude
      });

      await PingTimingService.markStatusTime(tx, pingId, PingStatus.CANCELLED);
      await TransactionService.updateStatusByPing(tx, pingId, PingStatus.CANCELLED);
      return updatedPing;
    });
  }

  static async markArrived(pingId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const ping = await tx.ping.findUnique({ where: { id: pingId } });
      if (!ping) throw new Error('Ping nao encontrado.');
      if (ping.userId !== userId) throw new Error('Apenas o cliente do pedido pode marcar chegada.');
      if (![PingStatus.ACCEPTED, PingStatus.WAITING_LIST].includes(ping.status as PingStatus)) {
        throw new Error('So pode marcar chegada depois do pedido ser aceite.');
      }

      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: { status: PingStatus.ARRIVED },
        include: pingInclude
      });

      await PingTimingService.markStatusTime(tx, pingId, PingStatus.ARRIVED);
      await TransactionService.updateStatusByPing(tx, pingId, PingStatus.ARRIVED);
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
      // When the agent confirms the waiting list, generate a short reservation token.
      if (status === PingStatus.WAITING_LIST && ping.status !== PingStatus.WAITING_LIST) {
        // Generate random 6-digit numeric token
        reservationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // 10 minutes duration
        reservationExpires = new Date(Date.now() + 10 * 60 * 1000);
      }

      if (status === PingStatus.IN_SERVICE) {
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

      const updatedPing = await tx.ping.update({
        where: { id: pingId },
        data: {
          status,
          reservationToken,
          reservationExpires
        },
        include: pingInclude
      });

      await PingTimingService.markStatusTime(tx, pingId, status);
      await TransactionService.updateStatusByPing(tx, pingId, status);
      return updatedPing;
    });
  }

  static async getActivePings() {
    return prisma.ping.findMany({
      where: {
        status: {
          in: [PingStatus.PENDING, PingStatus.ACCEPTED, PingStatus.WAITING_LIST, PingStatus.IN_SERVICE, PingStatus.ON_MY_WAY]
        }
      },
      include: pingInclude,
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getAgentPendingPings(agentId: string) {
    return prisma.ping.findMany({
      where: {
        agentId,
        status: PingStatus.PENDING
      },
      include: pingInclude,
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getAgentQueue(agentId: string) {
    return prisma.ping.findMany({
      where: {
        agentId,
        status: {
          in: [PingStatus.ACCEPTED, PingStatus.WAITING_LIST]
        }
      },
      include: pingInclude,
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getPingById(pingId: string) {
    return prisma.ping.findUnique({
      where: { id: pingId },
      include: pingInclude
    });
  }
}
