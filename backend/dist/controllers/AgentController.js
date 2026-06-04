"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const AgentService_1 = require("../services/AgentService");
const types_1 = require("../types");
class AgentController {
    static async list(req, res) {
        try {
            const agents = await AgentService_1.AgentService.listAgents();
            return res.status(200).json(agents);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async register(req, res) {
        try {
            const { name, phone, password } = req.body;
            if (!name || !phone || !password) {
                return res.status(400).json({ error: 'Nome, telefone e palavra-passe são obrigatórios.' });
            }
            const agent = await AgentService_1.AgentService.register(name, phone, password);
            return res.status(201).json(agent);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { phone, password } = req.body;
            if (!phone || !password) {
                return res.status(400).json({ error: 'Telefone e palavra-passe são obrigatórios.' });
            }
            const data = await AgentService_1.AgentService.login(phone, password);
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { status } = req.body;
            if (!status || !Object.values(types_1.AgentStatus).includes(status)) {
                return res.status(400).json({ error: 'Status inválido.' });
            }
            const updated = await AgentService_1.AgentService.updateStatus(agentId, status);
            const io = req.app.get('io');
            if (io) {
                const eventName = status === types_1.AgentStatus.OFFLINE ? 'agent:offline' : 'agent:online';
                io.to('map').emit(eventName, updated);
                io.to('map').emit('agent:status-updated', updated);
                io.to('admin').emit('admin:metrics-updated');
                io.emit('agents:list-updated', { reason: 'status-updated', agent: updated });
            }
            return res.status(200).json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateLocation(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { latitude, longitude } = req.body;
            if (latitude === undefined || longitude === undefined) {
                return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
            }
            const updated = await AgentService_1.AgentService.updateLocation(agentId, Number(latitude), Number(longitude));
            const io = req.app.get('io');
            if (io) {
                io.to('map').emit('agent:location-updated', updated);
                io.to('admin').emit('admin:metrics-updated');
                io.emit('agents:list-updated', { reason: 'location-updated', agent: updated });
            }
            return res.status(200).json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateReference(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { reference } = req.body;
            if (reference === undefined) {
                return res.status(400).json({ error: 'Referência é obrigatória.' });
            }
            const updated = await AgentService_1.AgentService.updateReference(agentId, reference);
            return res.status(200).json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getProfile(req, res) {
        try {
            const agentId = req.agent?.id;
            if (!agentId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const profile = await AgentService_1.AgentService.getProfile(agentId);
            if (!profile)
                return res.status(404).json({ error: 'Agente não encontrado.' });
            return res.status(200).json(profile);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.AgentController = AgentController;
