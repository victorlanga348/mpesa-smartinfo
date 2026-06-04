"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPingSockets = setupPingSockets;
const AgentService_1 = require("../services/AgentService");
function setupPingSockets(io) {
    io.on('connection', (socket) => {
        console.log(`Nova ligação socket estabelecida: ${socket.id}`);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} juntou-se à sala ${roomId}`);
        });
        // Real-time location tracking for agents
        socket.on('agentLocationUpdate', async (data) => {
            try {
                const updatedAgent = await AgentService_1.AgentService.updateLocation(data.agentId, data.latitude, data.longitude);
                io.emit('locationUpdated', updatedAgent);
            }
            catch (error) {
                console.error('Erro ao atualizar localização do agente via Socket:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Ligação socket encerrada: ${socket.id}`);
        });
    });
}
