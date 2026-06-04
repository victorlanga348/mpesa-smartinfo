import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare class PingController {
    static createPing(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static acceptPing(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePingStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getActivePings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPingById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
