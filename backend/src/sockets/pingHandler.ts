import { Server, Socket } from 'socket.io';
import { AgentService } from '../services/AgentService';
import { AgentStatus } from '../types';

export function setupPingSockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('join:map', () => {
      socket.join('map');
    });

    socket.on('join:agent', (agentId: string) => {
      if (agentId) socket.join(`agent:${agentId}`);
    });

    socket.on('join:client', (clientId: string) => {
      if (clientId) socket.join(`client:${clientId}`);
    });

    socket.on('join:admin', () => {
      socket.join('admin');
    });

    socket.on('joinRoom', (roomId: string) => {
      if (roomId) socket.join(roomId);
    });

    socket.on('agentLocationUpdate', async (data: { agentId: string; latitude: number; longitude: number }) => {
      await updateAgentLocation(io, data);
    });

    socket.on('agent:location-update', async (data: { agentId: string; latitude: number; longitude: number }) => {
      await updateAgentLocation(io, data);
    });

    socket.on('agent:status-update', async (data: { agentId: string; status: AgentStatus }) => {
      try {
        const updatedAgent = await AgentService.updateStatus(data.agentId, data.status);
        const eventName = data.status === AgentStatus.OFFLINE ? 'agent:offline' : 'agent:online';
        io.to('map').emit(eventName, updatedAgent);
        io.to('map').emit('agent:status-updated', updatedAgent);
        io.to('admin').emit('admin:metrics-updated');
        io.emit('agents:list-updated', { reason: 'status-updated', agent: updatedAgent });
      } catch (error) {
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

async function updateAgentLocation(
  io: Server,
  data: { agentId: string; latitude: number; longitude: number },
) {
  try {
    const updatedAgent = await AgentService.updateLocation(data.agentId, data.latitude, data.longitude);
    io.to('map').emit('agent:location-updated', updatedAgent);
    io.to('admin').emit('admin:metrics-updated');
    io.emit('agents:list-updated', { reason: 'location-updated', agent: updatedAgent });
  } catch (error) {
    console.error('Erro ao atualizar localizacao do agente:', error);
  }
}
