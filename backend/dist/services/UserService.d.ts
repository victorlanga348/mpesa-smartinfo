export declare class UserService {
    static register(name: string, phone?: string): Promise<{
        id: string;
        name: string;
        code: string;
        phone: string | null;
    }>;
    static login(name: string, code: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            code: string;
            phone: string | null;
        };
    }>;
    static getProfile(userId: string): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        latitude: number | null;
        longitude: number | null;
    } | null>;
    static updateLocation(userId: string, latitude: number, longitude: number): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        latitude: number | null;
        longitude: number | null;
    }>;
    static getPingHistory(userId: string): Promise<({
        agent: {
            name: string;
            id: string;
            phone: string;
        } | null;
    } & {
        id: string;
        latitude: number;
        longitude: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        amount: number | null;
        operationType: string | null;
        userId: string;
        agentId: string | null;
        reservationToken: string | null;
        reservationExpires: Date | null;
    })[]>;
}
