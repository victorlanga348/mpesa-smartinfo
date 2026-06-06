import { Request, Response, NextFunction } from 'express';
export type AuthRole = 'user' | 'agent' | 'admin';
export interface AuthPayload {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    code?: string;
    role: AuthRole;
}
export interface AuthenticatedRequest extends Request {
    auth?: AuthPayload;
    agent?: AuthPayload;
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function requireRole(...roles: AuthRole[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
