import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AgentStatus } from '../types';

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
    return prisma.agent.findMany({
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
    });
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
      data: { reference },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        reference: true,
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
