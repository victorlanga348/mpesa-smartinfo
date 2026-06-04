import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';

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

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nao autorizado. Token nao fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ error: 'Token invalido ou expirado.' });
    }

    req.auth = decoded;
    req.agent = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido ou expirado.' });
  }
}

export function requireRole(...roles: AuthRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Nao autorizado.' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Permissao insuficiente.' });
    }

    return next();
  };
}
