import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AgentStatus } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';

export class AgentService {
  static async register(name: string, phone: string, passwordUnhashed: string) {
    const existing = await prisma.agent.findUnique({ where: { phone } });
    if (existing) {
      throw new Error('Agente com este número já registado.');
    }

    const password = await bcrypt.hash(passwordUnhashed, 10);
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

  static async login(phone: string, passwordUnhashed: string) {
    const agent = await prisma.agent.findUnique({ where: { phone } });
    if (!agent) {
      throw new Error('Telefone ou palavra-passe incorreta.');
    }

    const isValid = await bcrypt.compare(passwordUnhashed, agent.password);
    if (!isValid) {
      throw new Error('Telefone ou palavra-passe incorreta.');
    }

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
