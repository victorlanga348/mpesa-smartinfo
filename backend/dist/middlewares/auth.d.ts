import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    agent?: {
        id: string;
        name: string;
        phone: string;
    };
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
