import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare class UserController {
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateLocation(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPingHistory(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
