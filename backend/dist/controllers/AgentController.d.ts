import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare class AgentController {
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateLocation(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateReference(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
