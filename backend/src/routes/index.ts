import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { PingController } from '../controllers/PingController';
import { AdminController } from '../controllers/AdminController';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// User routes (Clientes / Utilizadores) — login com nome + código
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.get('/user/profile', authMiddleware as any, UserController.getProfile);
router.put('/user/location', authMiddleware as any, UserController.updateLocation);
router.get('/user/pings', authMiddleware as any, UserController.getPingHistory);

// Agent routes (Agentes M-Pesa)
router.post('/agent/register', AgentController.register);
router.post('/agent/login', AgentController.login);
router.get('/agent', AgentController.list);
router.get('/agent/profile', authMiddleware as any, AgentController.getProfile);
router.put('/agent/status', authMiddleware as any, AgentController.updateStatus);
router.put('/agent/location', authMiddleware as any, AgentController.updateLocation);
router.put('/agent/reference', authMiddleware as any, AgentController.updateReference);

// Admin routes — login com email + senha
router.post('/admin/register', AdminController.register);
router.post('/admin/login', AdminController.login);
router.get('/admin/stats', AdminController.getStats);
router.get('/admin/critical-zones', AdminController.getCriticalZones);

// Ping routes
router.post('/ping', authMiddleware as any, PingController.createPing);
router.get('/ping/active', PingController.getActivePings);
router.get('/ping/:pingId', PingController.getPingById);
router.put('/ping/:pingId/accept', authMiddleware as any, PingController.acceptPing);
router.put('/ping/:pingId/status', authMiddleware as any, PingController.updatePingStatus);

export default router;
