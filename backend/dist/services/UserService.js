"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';
function generateCode() {
    // Generate a 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
}
class UserService {
    static async register(name, phone) {
        // Generate a unique code for the client
        let code;
        let exists = true;
        do {
            code = generateCode();
            const check = await prisma_1.prisma.user.findUnique({ where: { code } });
            exists = !!check;
        } while (exists);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                code,
                phone: phone || null,
            },
        });
        return { id: user.id, name: user.name, code: user.code, phone: user.phone };
    }
    static async login(name, code) {
        const user = await prisma_1.prisma.user.findUnique({ where: { code } });
        if (!user) {
            throw new Error('Código inválido.');
        }
        // Verify that the name matches (case-insensitive)
        if (user.name.toLowerCase() !== name.toLowerCase()) {
            throw new Error('Nome ou código incorreto.');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, code: user.code, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
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
    static async getProfile(userId) {
        return prisma_1.prisma.user.findUnique({
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
    static async updateLocation(userId, latitude, longitude) {
        return prisma_1.prisma.user.update({
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
    static async getPingHistory(userId) {
        return prisma_1.prisma.ping.findMany({
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
exports.UserService = UserService;
