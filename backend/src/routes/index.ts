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
router.get('/user/profile', authMiddleware, requireRole('user'), UserController.getProfile);
router.put('/user/location', authMiddleware, requireRole('user'), UserController.updateLocation);
router.get('/user/pings', authMiddleware, requireRole('user'), UserController.getPingHistory);

// Agent routes (Agentes M-Pesa)
router.post('/agent/register', AgentController.register);
router.post('/agent/login', AgentController.login);
router.get('/agent', AgentController.list);
router.get('/agent/profile', authMiddleware, requireRole('agent'), AgentController.getProfile);
router.put('/agent/status', authMiddleware, requireRole('agent'), AgentController.updateStatus);
router.put('/agent/location', authMiddleware, requireRole('agent'), AgentController.updateLocation);
router.put('/agent/reference', authMiddleware, requireRole('agent'), AgentController.updateReference);

// Admin routes — login com email + senha
router.post('/admin/register', authMiddleware, requireRole('admin'), AdminController.register);
router.post('/admin/login', AdminController.login);
router.get('/admin/stats', authMiddleware, requireRole('admin'), AdminController.getStats);
router.get('/admin/critical-zones', authMiddleware, requireRole('admin'), AdminController.getCriticalZones);

// Ping routes
router.post('/ping', authMiddleware, requireRole('user'), PingController.createPing);
router.get('/ping/active', PingController.getActivePings);
router.get('/ping/agent/pending', authMiddleware, requireRole('agent'), PingController.getAgentPendingPings);
router.get('/ping/agent/queue', authMiddleware, requireRole('agent'), PingController.getAgentQueue);
router.get('/ping/:pingId', PingController.getPingById);
router.put('/ping/:pingId/accept', authMiddleware, requireRole('agent'), PingController.acceptPing);
router.put('/ping/:pingId/reject', authMiddleware, requireRole('agent'), PingController.rejectPing);
router.put('/ping/:pingId/complete', authMiddleware, requireRole('agent'), PingController.completePing);
router.put('/ping/:pingId/cancel', authMiddleware, requireRole('user'), PingController.cancelPing);
router.put('/ping/:pingId/arrive', authMiddleware, requireRole('user'), PingController.markArrived);
router.put('/ping/:pingId/status', authMiddleware, requireRole('agent'), PingController.updatePingStatus);

export default router;
