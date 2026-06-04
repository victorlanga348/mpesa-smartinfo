import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';

function generateCode(): string {
  // Generate a 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class UserService {
  static async register(name: string, phone?: string) {
    // Generate a unique code for the client
    let code: string;
    let exists = true;
    do {
      code = generateCode();
      const check = await prisma.user.findUnique({ where: { code } });
      exists = !!check;
    } while (exists);

    const user = await prisma.user.create({
      data: {
        name,
        code,
        phone: phone || null,
      },
    });

    return { id: user.id, name: user.name, code: user.code, phone: user.phone };
  }

  static async login(name: string, code: string) {
    const user = await prisma.user.findUnique({ where: { code } });
    if (!user) {
      throw new Error('Código inválido.');
    }

    // Verify that the name matches (case-insensitive)
    if (user.name.toLowerCase() !== name.toLowerCase()) {
      throw new Error('Nome ou código incorreto.');
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, code: user.code, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        code: user.code,
        phone: user.phone,
      },
    };
  }

  static async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        code: true,
        phone: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  static async updateLocation(userId: string, latitude: number, longitude: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { latitude, longitude },
      select: {
        id: true,
        name: true,
        code: true,
        phone: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  static async getPingHistory(userId: string) {
    return prisma.ping.findMany({
      where: { userId },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
