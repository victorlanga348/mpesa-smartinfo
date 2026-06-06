import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PingStatus } from '../types';
import { TransactionService } from './TransactionService';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';

export class AdminService {
  static async register(name: string, email: string, passwordUnhashed: string) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Admin com este email já registado.');
    }

    const password = await bcrypt.hash(passwordUnhashed, 10);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password,
      },
    });

    return { id: admin.id, name: admin.name, email: admin.email };
  }

  static async login(email: string, passwordUnhashed: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw new Error('Email ou palavra-passe incorreta.');
    }

    const isValid = await bcrypt.compare(passwordUnhashed, admin.password);
    if (!isValid) {
      throw new Error('Email ou palavra-passe incorreta.');
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    };
  }

  static async getStats() {
    const totalUsers = await prisma.user.count();
    const totalAgents = await prisma.agent.count();
    const activeAgents = await prisma.agent.count({
      where: { status: { in: ['ONLINE', 'ON_MY_WAY'] } }
    });
    const totalPings = await prisma.ping.count();
    const pendingPings = await prisma.ping.count({
      where: { status: PingStatus.PENDING }
    });
    const completedPings = await prisma.ping.count({
      where: { status: PingStatus.COMPLETED }
    });
    const failedRequests = await prisma.ping.count({
      where: { status: { in: [PingStatus.CANCELLED, PingStatus.REJECTED, PingStatus.EXPIRED] } }
    });
    const transactionTypes = await TransactionService.getRequestsByType().catch(() => []);
    const requestsByType = transactionTypes.reduce<Record<string, number>>((acc, item) => {
      acc[item.operationType] = Number(item.count);
      return acc;
    }, {
      withdrawal: 0,
      deposit: 0,
      payment: 0,
      info: 0,
    });

    return {
      totalUsers,
      totalAgents,
      activeAgents,
      totalPings,
      pendingPings,
      completedPings,
      successfulRequests: completedPings,
      failedRequests,
      requestsByType
    };
  }

  // Calculate critical zones (areas with high density of pending pings)
  static async getCriticalZones() {
    const pings = await prisma.ping.findMany({
      where: { status: PingStatus.PENDING },
      select: { latitude: true, longitude: true }
    });

    // Grouping logic based on coordinate rounding to identify high-density clusters
    const zonesMap = new Map<string, { latitude: number; longitude: number; count: number }>();

    for (const p of pings) {
      // Round to 3 decimal places to cluster points within ~110 meters
      const latRounded = Math.round(p.latitude * 1000) / 1000;
      const lonRounded = Math.round(p.longitude * 1000) / 1000;
      const key = `${latRounded},${lonRounded}`;

      const existing = zonesMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        zonesMap.set(key, { latitude: latRounded, longitude: lonRounded, count: 1 });
      }
    }

    return Array.from(zonesMap.values())
      .map(zone => ({
        ...zone,
        severity: zone.count > 5 ? 'HIGH' : zone.count > 2 ? 'MEDIUM' : 'LOW'
      }))
      .sort((a, b) => b.count - a.count);
  }
}
