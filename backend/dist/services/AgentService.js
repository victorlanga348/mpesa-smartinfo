"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';
class AgentService {
    static async register(name, phone, passwordUnhashed) {
        const existing = await prisma_1.prisma.agent.findUnique({ where: { phone } });
        if (existing) {
            throw new Error('Agente com este número já registado.');
        }
        const password = await bcryptjs_1.default.hash(passwordUnhashed, 10);
        const agent = await prisma_1.prisma.agent.create({
            data: {
                name,
                phone,
                password,
                status: types_1.AgentStatus.OFFLINE,
            },
        });
        return { id: agent.id, name: agent.name, phone: agent.phone };
    }
    static async login(phone, passwordUnhashed) {
        const agent = await prisma_1.prisma.agent.findUnique({ where: { phone } });
        if (!agent) {
            throw new Error('Telefone ou palavra-passe incorreta.');
        }
        const isValid = await bcryptjs_1.default.compare(passwordUnhashed, agent.password);
        if (!isValid) {
            throw new Error('Telefone ou palavra-passe incorreta.');
        }
        const token = jsonwebtoken_1.default.sign({ id: agent.id, name: agent.name, phone: agent.phone }, JWT_SECRET, { expiresIn: '24h' });
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
        return prisma_1.prisma.agent.findMany({
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
    static async updateStatus(agentId, status) {
        return prisma_1.prisma.agent.update({
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
    static async updateLocation(agentId, latitude, longitude) {
        return prisma_1.prisma.agent.update({
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
    static async updateReference(agentId, reference) {
        return prisma_1.prisma.agent.update({
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
    static async getProfile(agentId) {
        return prisma_1.prisma.agent.findUnique({
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
exports.AgentService = AgentService;
