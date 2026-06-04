import { Server, Socket } from 'socket.io';
import { AgentService } from '../services/AgentService';

export function setupPingSockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Nova ligação socket estabelecida: ${socket.id}`);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} juntou-se à sala ${roomId}`);
    });

    // Real-time location tracking for agents
    socket.on('agentLocationUpdate', async (data: { agentId: string; latitude: number; longitude: number }) => {
      try {
        const updatedAgent = await AgentService.updateLocation(data.agentId, data.latitude, data.longitude);
        io.emit('locationUpdated', updatedAgent);
      } catch (error) {
        console.error('Erro ao atualizar localização do agente via Socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Ligação socket encerrada: ${socket.id}`);
    });
  });
}
