"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AgentController_1 = require("../controllers/AgentController");
const PingController_1 = require("../controllers/PingController");
const AdminController_1 = require("../controllers/AdminController");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// User routes (Clientes / Utilizadores) — login com nome + código
router.post('/user/register', UserController_1.UserController.register);
router.post('/user/login', UserController_1.UserController.login);
router.get('/user/profile', auth_1.authMiddleware, (0, auth_1.requireRole)('user'), UserController_1.UserController.getProfile);
router.put('/user/location', auth_1.authMiddleware, (0, auth_1.requireRole)('user'), UserController_1.UserController.updateLocation);
router.get('/user/pings', auth_1.authMiddleware, (0, auth_1.requireRole)('user'), UserController_1.UserController.getPingHistory);
// Agent routes (Agentes M-Pesa)
router.post('/agent/register', AgentController_1.AgentController.register);
router.post('/agent/login', AgentController_1.AgentController.login);
router.get('/agent', AgentController_1.AgentController.list);
router.get('/agent/profile', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), AgentController_1.AgentController.getProfile);
router.put('/agent/status', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), AgentController_1.AgentController.updateStatus);
router.put('/agent/location', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), AgentController_1.AgentController.updateLocation);
router.put('/agent/reference', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), AgentController_1.AgentController.updateReference);
// Admin routes — login com email + senha
router.post('/admin/register', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), AdminController_1.AdminController.register);
router.post('/admin/login', AdminController_1.AdminController.login);
router.get('/admin/stats', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), AdminController_1.AdminController.getStats);
router.get('/admin/critical-zones', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), AdminController_1.AdminController.getCriticalZones);
// Ping routes
router.post('/ping', auth_1.authMiddleware, (0, auth_1.requireRole)('user'), PingController_1.PingController.createPing);
router.get('/ping/active', PingController_1.PingController.getActivePings);
router.get('/ping/:pingId', PingController_1.PingController.getPingById);
router.put('/ping/:pingId/accept', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), PingController_1.PingController.acceptPing);
router.put('/ping/:pingId/status', auth_1.authMiddleware, (0, auth_1.requireRole)('agent'), PingController_1.PingController.updatePingStatus);
exports.default = router;
