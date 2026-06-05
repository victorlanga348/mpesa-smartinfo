import { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';
import { AgentStatus } from '../types';
import { getErrorMessage } from '../utils/errors';

export class AgentController {
  static async list(req: Request, res: Response) {
    try {
      const agents = await AgentService.listAgents();
      return res.status(200).json(agents);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, phone, code } = req.body;
      if (!name || !phone || !code) {
        return res.status(400).json({ error: 'Nome, telefone e codigo sao obrigatorios.' });
      }

      const agent = await AgentService.register(name, phone, code);
      return res.status(201).json(agent);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        return res.status(400).json({ error: 'Nome e codigo do agente sao obrigatorios.' });
      }

      const data = await AgentService.login(name, code);
      return res.status(200).json(data);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { status } = req.body;
      if (!status || !Object.values(AgentStatus).includes(status)) {
        return res.status(400).json({ error: 'Status invalido.' });
      }

      const updated = await AgentService.updateStatus(agentId, status as AgentStatus);
      const io = req.app.get('io');
      if (io) {
        const eventName = status === AgentStatus.OFFLINE ? 'agent:offline' : 'agent:online';
        io.to('map').emit(eventName, updated);
        io.to('map').emit('agent:status-updated', updated);
        io.to('admin').emit('admin:metrics-updated');
        io.emit('agents:list-updated', { reason: 'status-updated', agent: updated });
      }
      return res.status(200).json(updated);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async updateLocation(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { latitude, longitude } = req.body;
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Latitude e longitude sao obrigatorias.' });
      }

      const updated = await AgentService.updateLocation(agentId, Number(latitude), Number(longitude));
      const io = req.app.get('io');
      if (io) {
        io.to('map').emit('agent:location-updated', updated);
        io.to('admin').emit('admin:metrics-updated');
        io.emit('agents:list-updated', { reason: 'location-updated', agent: updated });
      }
      return res.status(200).json(updated);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async updateReference(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { reference } = req.body;
      if (reference === undefined) {
        return res.status(400).json({ error: 'Referencia e obrigatoria.' });
      }

      const updated = await AgentService.updateReference(agentId, reference);
      return res.status(200).json(updated);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const agentId = req.agent?.id;
      if (!agentId) return res.status(401).json({ error: 'Nao autorizado.' });

      const profile = await AgentService.getProfile(agentId);
      if (!profile) return res.status(404).json({ error: 'Agente nao encontrado.' });

      return res.status(200).json(profile);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
