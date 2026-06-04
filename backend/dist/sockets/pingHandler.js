"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPingSockets = setupPingSockets;
const AgentService_1 = require("../services/AgentService");
const types_1 = require("../types");
function setupPingSockets(io) {
    io.on('connection', (socket) => {
        console.log(`Socket conectado: ${socket.id}`);
        socket.on('join:map', () => {
            socket.join('map');
        });
        socket.on('join:agent', (agentId) => {
            if (agentId)
                socket.join(`agent:${agentId}`);
        });
        socket.on('join:client', (clientId) => {
            if (clientId)
                socket.join(`client:${clientId}`);
        });
        socket.on('join:admin', () => {
            socket.join('admin');
        });
        socket.on('joinRoom', (roomId) => {
            if (roomId)
                socket.join(roomId);
        });
        socket.on('agentLocationUpdate', async (data) => {
            await updateAgentLocation(io, data);
        });
        socket.on('agent:location-update', async (data) => {
            await updateAgentLocation(io, data);
        });
        socket.on('agent:status-update', async (data) => {
            try {
                const updatedAgent = await AgentService_1.AgentService.updateStatus(data.agentId, data.status);
                const eventName = data.status === types_1.AgentStatus.OFFLINE ? 'agent:offline' : 'agent:online';
                io.to('map').emit(eventName, updatedAgent);
                io.to('map').emit('agent:status-updated', updatedAgent);
                io.to('admin').emit('admin:metrics-updated');
                io.emit('agents:list-updated', { reason: 'status-updated', agent: updatedAgent });
            }
            catch (error) {
                console.error('Erro ao atualizar status do agente:', error);
            }
        });
        socket.on('temporary-agent:requested', (payload) => {
            io.to('admin').emit('temporary-agent:requested', payload);
            io.to('map').emit('temporary-agent:requested', payload);
        });
        socket.on('temporary-agent:accepted', (payload) => {
            io.to('admin').emit('temporary-agent:accepted', payload);
            io.to('map').emit('temporary-agent:accepted', payload);
        });
        socket.on('temporary-agent:available', (payload) => {
            io.to('map').emit('temporary-agent:available', payload);
            io.to('admin').emit('temporary-agent:available', payload);
        });
        socket.on('disconnect', () => {
            console.log(`Socket desconectado: ${socket.id}`);
        });
    });
}
async function updateAgentLocation(io, data) {
    try {
        const updatedAgent = await AgentService_1.AgentService.updateLocation(data.agentId, data.latitude, data.longitude);
        io.to('map').emit('agent:location-updated', updatedAgent);
        io.to('admin').emit('admin:metrics-updated');
        io.emit('agents:list-updated', { reason: 'location-updated', agent: updatedAgent });
    }
    catch (error) {
        console.error('Erro ao atualizar localizacao do agente:', error);
    }
}
