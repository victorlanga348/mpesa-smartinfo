import { Request, Response } from 'express';
import { PingService } from '../services/PingService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { PingStatus } from '../types';

export class PingController {
  static async createPing(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const { latitude, longitude, agentId, amount, operationType } = req.body;
      if (latitude === undefined || longitude === undefined || !agentId || !amount || !operationType) {
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
        // Emit to the specific agent room or everyone
        io.emit('newPing', ping);
      }

      return res.status(201).json(ping);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async acceptPing(req: AuthenticatedRequest, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Não autorizado.' });

      const { pingId } = req.params;
      const updatedPing = await PingService.acceptPing(pingId, agentId);

      const io = req.app.get('io');
      if (io) {
        io.emit('pingAccepted', updatedPing);
      }

      return res.status(200).json(updatedPing);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updatePingStatus(req: AuthenticatedRequest, res: Response) {
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
        io.emit('pingStatusUpdated', updatedPing);
      }

      return res.status(200).json(updatedPing);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getActivePings(req: Request, res: Response) {
    try {
      const pings = await PingService.getActivePings();
      return res.status(200).json(pings);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getPingById(req: Request, res: Response) {
    try {
      const { pingId } = req.params;
      const ping = await PingService.getPingById(pingId);
      if (!ping) return res.status(404).json({ error: 'Ping não encontrado.' });

      return res.status(200).json(ping);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
