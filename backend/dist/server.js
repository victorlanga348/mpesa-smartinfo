"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const pingHandler_1 = require("./sockets/pingHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean);
const isPrivateNetworkOrigin = (origin) => {
    return /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/.test(origin);
};
const isAllowedOrigin = (origin) => {
    return !origin || allowedOrigins.includes(origin) || isPrivateNetworkOrigin(origin);
};
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Origem nao permitida pelo CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Origem nao permitida pelo CORS'));
    },
}));
app.use(express_1.default.json());
// Expose io instance to express controllers
app.set('io', io);
// API routes
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});
// Configure WebSockets
(0, pingHandler_1.setupPingSockets)(io);
// Start server
server.listen(Number(PORT), HOST, () => {
    console.log(`Servidor M-Pesa SmartInfo a correr em ${HOST}:${PORT}`);
});
