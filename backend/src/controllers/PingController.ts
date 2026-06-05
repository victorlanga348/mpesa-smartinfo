import { Request, Response } from 'express';
import { PingService } from '../services/PingService';
import { PingStatus } from '../types';
import { getErrorMessage } from '../utils/errors';

export class PingController {
  static async createPing(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const { latitude, longitude, agentId, amount, operationType } = req.body;
      if (latitude === undefined || longitude === undefined || !agentId || amount === undefined || !operationType) {
        return res.status(400).json({ error: 'Campos obrigatórios em falta (latitude, longitude, agentId, amount, operationType).' });
      }

      const ping = await PingService.createPing(
        userId,
        Number(latitude),
        Number(longitude),
        agentId,
        Number(amount),
        operationType
      );
      
      const io = req.app.get('io');
      if (io) {
        io.to(`agent:${agentId}`).emit('ping:created', ping);
        io.to('admin').emit('admin:metrics-updated');
      }

      return res.status(201).json(ping);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async acceptPing(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Não autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.acceptPing(pingId, agentId);

      const io = req.app.get('io');
      if (io) {
        io.to(`client:${updatedPing.userId}`).emit('ping:accepted', updatedPing);
        io.to(`agent:${agentId}`).emit('ping:accepted', updatedPing);
        io.to('admin').emit('admin:metrics-updated');
      }

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async rejectPing(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.rejectPing(pingId, agentId);
      emitPingEvent(req, 'ping:rejected', updatedPing, agentId);

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async cancelPing(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.cancelPing(pingId, userId);
      emitPingEvent(req, 'ping:cancelled', updatedPing, updatedPing.agentId || undefined);

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async markArrived(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.markArrived(pingId, userId);
      emitPingEvent(req, 'ping:arrived', updatedPing, updatedPing.agentId || undefined);

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async completePing(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.completePing(pingId, agentId);
      emitPingEvent(req, 'ping:completed', updatedPing, agentId);

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async updatePingStatus(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Não autorizado.' });

      const { pingId } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(PingStatus).includes(status)) {
        return res.status(400).json({ error: 'Status de ping inválido.' });
      }

      const updatedPing = await PingService.updatePingStatus(pingId, status as PingStatus, agentId);

      const io = req.app.get('io');
      if (io) {
        const eventByStatus: Record<string, string> = {
          [PingStatus.ON_MY_WAY]: 'ping:on-the-way',
          [PingStatus.WAITING_LIST]: 'ping:waiting-list',
          [PingStatus.IN_SERVICE]: 'ping:in-service',
          [PingStatus.ARRIVED]: 'ping:arrived',
          [PingStatus.COMPLETED]: 'ping:completed',
          [PingStatus.CANCELLED]: 'ping:cancelled',
          [PingStatus.EXPIRED]: 'ping:expired',
          [PingStatus.REJECTED]: 'ping:rejected',
          [PingStatus.ACCEPTED]: 'ping:accepted',
        };
        const eventName = eventByStatus[status] || 'ping:status-updated';

        io.to(`client:${updatedPing.userId}`).emit(eventName, updatedPing);
        io.to(`agent:${agentId}`).emit(eventName, updatedPing);

        if (status === PingStatus.WAITING_LIST) {
          io.to(`client:${updatedPing.userId}`).emit('reservation:created', updatedPing);
          io.to(`agent:${agentId}`).emit('reservation:created', updatedPing);
        }

        if (status === PingStatus.EXPIRED || status === PingStatus.REJECTED) {
          io.to(`client:${updatedPing.userId}`).emit('reservation:expired', updatedPing);
          io.to(`agent:${agentId}`).emit('reservation:expired', updatedPing);
        }

        io.to('admin').emit('admin:metrics-updated');
      }

      return res.status(200).json(updatedPing);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getActivePings(req: Request, res: Response) {
    try {
      const pings = await PingService.getActivePings();
      return res.status(200).json(pings);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getAgentPendingPings(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const pings = await PingService.getAgentPendingPings(agentId);
      return res.status(200).json(pings);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getAgentQueue(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const pings = await PingService.getAgentQueue(agentId);
      return res.status(200).json(pings);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getPingById(req: Request, res: Response) {
    try {
      const { pingId } = req.params;
      const ping = await PingService.getPingById(pingId);
      if (!ping) return res.status(404).json({ error: 'Ping não encontrado.' });

      return res.status(200).json(ping);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}

function emitPingEvent(req: Request, eventName: string, ping: { userId: string; agentId?: string | null }, agentId?: string) {
  const io = req.app.get('io');
  if (!io) return;

  io.to(`client:${ping.userId}`).emit(eventName, ping);
  if (agentId) io.to(`agent:${agentId}`).emit(eventName, ping);
  io.to('admin').emit('admin:metrics-updated');
}
