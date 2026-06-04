export declare class AdminService {
    static register(name: string, email: string, passwordUnhashed: string): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
    static login(email: string, passwordUnhashed: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    static getStats(): Promise<{
        totalAgents: number;
        activeAgents: number;
        totalPings: number;
        pendingPings: number;
        completedPings: number;
    }>;
    static getCriticalZones(): Promise<{
        severity: string;
        latitude: number;
        longitude: number;
        count: number;
    }[]>;
}
