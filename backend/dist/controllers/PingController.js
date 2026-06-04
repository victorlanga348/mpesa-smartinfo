"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingController = void 0;
const PingService_1 = require("../services/PingService");
const types_1 = require("../types");
class PingController {
    static async createPing(req, res) {
        try {
            const userId = req.agent?.id;
            if (!userId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { latitude, longitude, agentId, amount, operationType } = req.body;
            if (latitude === undefined || longitude === undefined || !agentId || !amount || !operationType) {
                return res.status(400).json({ error: 'Campos obrigatórios em falta (latitude, longitude, agentId, amount, operationType).' });
            }
            const ping = await PingService_1.PingService.createPing(userId, Number(latitude), Number(longitude), agentId, Number(amount), operationType);
            const io = req.app.get('io');
            if (io) {
                io.to(`agent:${agentId}`).emit('ping:created', ping);
                io.to('admin').emit('admin:metrics-updated');
            }
            return res.status(201).json(ping);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async acceptPing(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { pingId } = req.params;
            const updatedPing = await PingService_1.PingService.acceptPing(pingId, agentId);
            const io = req.app.get('io');
            if (io) {
                io.to(`client:${updatedPing.userId}`).emit('ping:accepted', updatedPing);
                io.to(`agent:${agentId}`).emit('ping:accepted', updatedPing);
                io.to('admin').emit('admin:metrics-updated');
            }
            return res.status(200).json(updatedPing);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updatePingStatus(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { pingId } = req.params;
            const { status } = req.body;
            if (!status || !Object.values(types_1.PingStatus).includes(status)) {
                return res.status(400).json({ error: 'Status de ping inválido.' });
            }
            const updatedPing = await PingService_1.PingService.updatePingStatus(pingId, status, agentId);
            const io = req.app.get('io');
            if (io) {
                const eventByStatus = {
                    [types_1.PingStatus.ON_MY_WAY]: 'ping:on-the-way',
                    [types_1.PingStatus.COMPLETED]: 'ping:arrived',
                    [types_1.PingStatus.EXPIRED]: 'ping:expired',
                    [types_1.PingStatus.ACCEPTED]: 'ping:accepted',
                };
                const eventName = eventByStatus[status] || 'ping:status-updated';
                io.to(`client:${updatedPing.userId}`).emit(eventName, updatedPing);
                io.to(`agent:${agentId}`).emit(eventName, updatedPing);
                if (status === types_1.PingStatus.ON_MY_WAY) {
                    io.to(`client:${updatedPing.userId}`).emit('reservation:created', updatedPing);
                    io.to(`agent:${agentId}`).emit('reservation:created', updatedPing);
                }
                if (status === types_1.PingStatus.EXPIRED) {
                    io.to(`client:${updatedPing.userId}`).emit('reservation:expired', updatedPing);
                    io.to(`agent:${agentId}`).emit('reservation:expired', updatedPing);
                }
                io.to('admin').emit('admin:metrics-updated');
            }
            return res.status(200).json(updatedPing);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getActivePings(req, res) {
        try {
            const pings = await PingService_1.PingService.getActivePings();
            return res.status(200).json(pings);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getPingById(req, res) {
        try {
            const { pingId } = req.params;
            const ping = await PingService_1.PingService.getPingById(pingId);
            if (!ping)
                return res.status(404).json({ error: 'Ping não encontrado.' });
            return res.status(200).json(ping);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.PingController = PingController;
