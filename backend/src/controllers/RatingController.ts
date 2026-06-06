import { Request, Response } from 'express';
import { RatingService } from '../services/RatingService';
import { getErrorMessage } from '../utils/errors';

export class RatingController {
  static async rateAgent(req: Request, res: Response) {
    try {
      const userId = req.agent?.id;
      if (!userId) return res.status(401).json({ error: 'Nao autorizado.' });

      const { pingId } = req.params;
      const { rating, comment } = req.body;
      const result = await RatingService.rateAgent(userId, pingId, Number(rating), comment);

      const io = req.app.get('io');
      if (io) {
        io.to('map').emit('agent:rating-updated', result);
        io.to('admin').emit('admin:metrics-updated');
        io.emit('agents:list-updated', { reason: 'rating-updated', rating: result });
      }

      return res.status(201).json(result);
    } catch (error: unknown) {
      return res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
