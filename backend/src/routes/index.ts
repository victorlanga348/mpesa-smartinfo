import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { PingController } from '../controllers/PingController';
import { AdminController } from '../controllers/AdminController';
import { UserController } from '../controllers/UserController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();

// User routes (Clientes / Utilizadores) — login com nome + código
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.get('/user/profile', authMiddleware as any, requireRole('user') as any, UserController.getProfile);
router.put('/user/location', authMiddleware as any, requireRole('user') as any, UserController.updateLocation);
router.get('/user/pings', authMiddleware as any, requireRole('user') as any, UserController.getPingHistory);

// Agent routes (Agentes M-Pesa)
router.post('/agent/register', AgentController.register);
router.post('/agent/login', AgentController.login);
router.get('/agent', AgentController.list);
router.get('/agent/profile', authMiddleware as any, requireRole('agent') as any, AgentController.getProfile);
router.put('/agent/status', authMiddleware as any, requireRole('agent') as any, AgentController.updateStatus);
router.put('/agent/location', authMiddleware as any, requireRole('agent') as any, AgentController.updateLocation);
router.put('/agent/reference', authMiddleware as any, requireRole('agent') as any, AgentController.updateReference);

// Admin routes — login com email + senha
router.post('/admin/register', authMiddleware as any, requireRole('admin') as any, AdminController.register);
router.post('/admin/login', AdminController.login);
router.get('/admin/stats', authMiddleware as any, requireRole('admin') as any, AdminController.getStats);
router.get('/admin/critical-zones', authMiddleware as any, requireRole('admin') as any, AdminController.getCriticalZones);

// Ping routes
router.post('/ping', authMiddleware as any, requireRole('user') as any, PingController.createPing);
router.get('/ping/active', PingController.getActivePings);
router.get('/ping/:pingId', PingController.getPingById);
router.put('/ping/:pingId/accept', authMiddleware as any, requireRole('agent') as any, PingController.acceptPing);
router.put('/ping/:pingId/status', authMiddleware as any, requireRole('agent') as any, PingController.updatePingStatus);

export default router;
