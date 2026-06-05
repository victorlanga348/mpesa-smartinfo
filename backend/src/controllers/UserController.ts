import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { getErrorMessage } from '../utils/errors';

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { name, phone } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório.' });
      }

      const user = await UserService.register(name, phone);
      return res.status(201).json(user);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        return res.status(400).json({ error: 'Nome e código são obrigatórios.' });
      }

      const data = await UserService.login(name, code);
      return res.status(200).json(data);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const profile = await UserService.getProfile(userId);
      if (!profile) return res.status(404).json({ error: 'Utilizador não encontrado.' });

      return res.status(200).json(profile);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async updateLocation(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const { latitude, longitude } = req.body;
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
      }

      const updated = await UserService.updateLocation(userId, Number(latitude), Number(longitude));
      return res.status(200).json(updated);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  static async getPingHistory(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const pings = await UserService.getPingHistory(userId);
      return res.status(200).json(pings);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
