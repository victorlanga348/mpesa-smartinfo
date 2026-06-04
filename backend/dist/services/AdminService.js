"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';
class AdminService {
    static async register(name, email, passwordUnhashed) {
        const existing = await prisma_1.prisma.admin.findUnique({ where: { email } });
        if (existing) {
            throw new Error('Admin com este email já registado.');
        }
        const password = await bcryptjs_1.default.hash(passwordUnhashed, 10);
        const admin = await prisma_1.prisma.admin.create({
            data: {
                name,
                email,
                password,
            },
        });
        return { id: admin.id, name: admin.name, email: admin.email };
    }
    static async login(email, passwordUnhashed) {
        const admin = await prisma_1.prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            throw new Error('Email ou palavra-passe incorreta.');
        }
        const isValid = await bcryptjs_1.default.compare(passwordUnhashed, admin.password);
        if (!isValid) {
            throw new Error('Email ou palavra-passe incorreta.');
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
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
        const totalAgents = await prisma_1.prisma.agent.count();
        const activeAgents = await prisma_1.prisma.agent.count({
            where: { status: { in: ['ONLINE', 'ON_MY_WAY'] } }
        });
        const totalPings = await prisma_1.prisma.ping.count();
        const pendingPings = await prisma_1.prisma.ping.count({
            where: { status: types_1.PingStatus.PENDING }
        });
        const completedPings = await prisma_1.prisma.ping.count({
            where: { status: types_1.PingStatus.COMPLETED }
        });
        return {
            totalAgents,
            activeAgents,
            totalPings,
            pendingPings,
            completedPings
        };
    }
    // Calculate critical zones (areas with high density of pending pings)
    static async getCriticalZones() {
        const pings = await prisma_1.prisma.ping.findMany({
            where: { status: types_1.PingStatus.PENDING },
            select: { latitude: true, longitude: true }
        });
        // Grouping logic based on coordinate rounding to identify high-density clusters
        const zonesMap = new Map();
        for (const p of pings) {
            // Round to 3 decimal places to cluster points within ~110 meters
            const latRounded = Math.round(p.latitude * 1000) / 1000;
            const lonRounded = Math.round(p.longitude * 1000) / 1000;
            const key = `${latRounded},${lonRounded}`;
            const existing = zonesMap.get(key);
            if (existing) {
                existing.count += 1;
            }
            else {
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
exports.AdminService = AdminService;
