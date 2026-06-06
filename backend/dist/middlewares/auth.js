"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmpesatoken';
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Nao autorizado. Token nao fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ error: 'Token invalido ou expirado.' });
        }
        req.auth = decoded;
        req.agent = decoded;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token invalido ou expirado.' });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({ error: 'Nao autorizado.' });
        }
        if (!roles.includes(req.auth.role)) {
            return res.status(403).json({ error: 'Permissao insuficiente.' });
        }
        return next();
    };
}
