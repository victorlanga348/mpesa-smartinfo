import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AgentStatus } from '../types';
import { PingTimingService } from './PingTimingService';
import { RatingService } from './RatingService';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';

export class AgentService {
  static async register(name: string, phone: string, codeUnhashed: string) {
    const existing = await prisma.agent.findUnique({ where: { phone } });
    if (existing) {
      throw new Error('Agente com este número já registado.');
    }

    const password = await bcrypt.hash(codeUnhashed, 10);
    const agent = await prisma.agent.create({
      data: {
        name,
        phone,
        password,
        status: AgentStatus.OFFLINE,
      },
    });

    return { id: agent.id, name: agent.name, phone: agent.phone };
  }

  static async login(name: string, codeUnhashed: string) {
    const agents = await prisma.agent.findMany({ where: { name } });

    for (const agent of agents) {
      const isValid = await bcrypt.compare(codeUnhashed, agent.password);
      if (!isValid) continue;

      const token = jwt.sign(
        { id: agent.id, name: agent.name, phone: agent.phone, role: 'agent' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        agent: {
          id: agent.id,
          name: agent.name,
          phone: agent.phone,
          status: agent.status,
          latitude: agent.latitude,
          longitude: agent.longitude,
          reference: agent.reference,
        },
      };
    }

    throw new Error('Nome ou codigo do agente incorreto.');
  }

  static async listAgents() {
    const [agents, averages, ratings] = await Promise.all([
      prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        latitude: true,
        longitude: true,
        reference: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      }),
      PingTimingService.getAverageServiceMinutesByAgent().catch(() => []),
      RatingService.getAverageRatingsByAgent().catch(() => []),
    ]);

    const averageByAgent = new Map(averages.map((item) => [
      item.agentId,
      {
        averageServiceMinutes: item.averageMinutes === null ? null : Number(item.averageMinutes),
        completedCount: Number(item.completedCount),
      }
    ]));
    const ratingByAgent = new Map(ratings.map((item) => [
      item.agentId,
      {
        ratingAverage: item.averageRating === null ? null : Number(item.averageRating),
        ratingCount: Number(item.ratingCount),
      }
    ]));

    return agents.map((agent) => ({
      ...agent,
      averageServiceMinutes: averageByAgent.get(agent.id)?.averageServiceMinutes ?? null,
      completedServiceCount: averageByAgent.get(agent.id)?.completedCount ?? 0,
      ratingAverage: ratingByAgent.get(agent.id)?.ratingAverage ?? null,
      ratingCount: ratingByAgent.get(agent.id)?.ratingCount ?? 0,
    }));
  }

  static async updateStatus(agentId: string, status: AgentStatus) {
    return prisma.agent.update({
      where: { id: agentId },
      data: { status },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        latitude: true,
        longitude: true,
        reference: true,
      },
    });
  }

  static async updateLocation(agentId: string, latitude: number, longitude: number) {
    return prisma.agent.update({
      where: { id: agentId },
      data: { latitude, longitude },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        latitude: true,
        longitude: true,
        reference: true,
      },
    });
  }

  static async updateReference(agentId: string, reference: string) {
    return prisma.agent.update({
      where: { id: agentId },
      data: { reference: reference.trim() || null },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        latitude: true,
        longitude: true,
        reference: true,
        updatedAt: true,
      },
    });
  }

  static async getProfile(agentId: string) {
    return prisma.agent.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        latitude: true,
        longitude: true,
        reference: true,
      },
    });
  }
}
