import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e palavra-passe são obrigatórios.' });
      }

      const admin = await AdminService.register(name, email, password);
      return res.status(201).json(admin);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e palavra-passe são obrigatórios.' });
      }

      const data = await AdminService.login(email, password);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getCriticalZones(req: Request, res: Response) {
    try {
      const zones = await AdminService.getCriticalZones();
      return res.status(200).json(zones);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
