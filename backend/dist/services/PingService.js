"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingService = void 0;
const prisma_1 = require("../lib/prisma");
const types_1 = require("../types");
class PingService {
    static async createPing(userId, latitude, longitude, agentId, amount, operationType) {
        return prisma_1.prisma.ping.create({
            data: {
                userId,
                agentId,
                amount,
                operationType,
                status: types_1.PingStatus.PENDING,
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
    static async acceptPing(pingId, agentId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const ping = await tx.ping.findUnique({ where: { id: pingId } });
            if (!ping)
                throw new Error('Ping não encontrado.');
            if (ping.status !== types_1.PingStatus.PENDING)
                throw new Error('Ping já foi aceite ou expirou.');
            const agent = await tx.agent.findUnique({ where: { id: agentId } });
            if (!agent)
                throw new Error('Agente não encontrado.');
            // Update ping to ACCEPTED and assign to agent
            const updatedPing = await tx.ping.update({
                where: { id: pingId },
                data: {
                    status: types_1.PingStatus.ACCEPTED,
                    agentId
                }
            });
            return updatedPing;
        });
    }
    static async updatePingStatus(pingId, status, agentId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const ping = await tx.ping.findUnique({ where: { id: pingId } });
            if (!ping)
                throw new Error('Ping não encontrado.');
            if (ping.agentId !== agentId)
                throw new Error('Apenas o agente associado pode atualizar o status do ping.');
            let reservationToken = ping.reservationToken;
            let reservationExpires = ping.reservationExpires;
            // Implements Point 12 (Token de Reserva)
            // When status changes to ON_MY_WAY, generate a random token and 10 minutes expiration
            if (status === types_1.PingStatus.ON_MY_WAY && ping.status !== types_1.PingStatus.ON_MY_WAY) {
                // Generate random 6-digit numeric token
                reservationToken = Math.floor(100000 + Math.random() * 900000).toString();
                // 10 minutes duration
                reservationExpires = new Date(Date.now() + 10 * 60 * 1000);
                // Also update agent status to ON_MY_WAY
                await tx.agent.update({
                    where: { id: agentId },
                    data: { status: types_1.AgentStatus.ON_MY_WAY }
                });
            }
            // If status changes to COMPLETED, change agent status back to ONLINE
            if (status === types_1.PingStatus.COMPLETED) {
                await tx.agent.update({
                    where: { id: agentId },
                    data: { status: types_1.AgentStatus.ONLINE }
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
        return prisma_1.prisma.ping.findMany({
            where: {
                status: {
                    in: [types_1.PingStatus.PENDING, types_1.PingStatus.ACCEPTED, types_1.PingStatus.ON_MY_WAY]
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
    static async getPingById(pingId) {
        return prisma_1.prisma.ping.findUnique({
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
exports.PingService = PingService;
