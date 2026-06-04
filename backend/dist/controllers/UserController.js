"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    static async register(req, res) {
        try {
            const { name, phone } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Nome é obrigatório.' });
            }
            const user = await UserService_1.UserService.register(name, phone);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { name, code } = req.body;
            if (!name || !code) {
                return res.status(400).json({ error: 'Nome e código são obrigatórios.' });
            }
            const data = await UserService_1.UserService.login(name, code);
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.agent?.id;
            if (!userId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const profile = await UserService_1.UserService.getProfile(userId);
            if (!profile)
                return res.status(404).json({ error: 'Utilizador não encontrado.' });
            return res.status(200).json(profile);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateLocation(req, res) {
        try {
            const userId = req.agent?.id;
            if (!userId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const { latitude, longitude } = req.body;
            if (latitude === undefined || longitude === undefined) {
                return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
            }
            const updated = await UserService_1.UserService.updateLocation(userId, Number(latitude), Number(longitude));
            return res.status(200).json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getPingHistory(req, res) {
        try {
            const userId = req.agent?.id;
            if (!userId)
                return res.status(401).json({ error: 'Não autorizado.' });
            const pings = await UserService_1.UserService.getPingHistory(userId);
            return res.status(200).json(pings);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
