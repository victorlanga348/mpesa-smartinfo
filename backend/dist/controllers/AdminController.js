"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
class AdminController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, email e palavra-passe são obrigatórios.' });
            }
            const admin = await AdminService_1.AdminService.register(name, email, password);
            return res.status(201).json(admin);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e palavra-passe são obrigatórios.' });
            }
            const data = await AdminService_1.AdminService.login(email, password);
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getStats(req, res) {
        try {
            const stats = await AdminService_1.AdminService.getStats();
            return res.status(200).json(stats);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getCriticalZones(req, res) {
        try {
            const zones = await AdminService_1.AdminService.getCriticalZones();
            return res.status(200).json(zones);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.AdminController = AdminController;
