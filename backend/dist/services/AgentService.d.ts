import { AgentStatus } from '../types';
export declare class AgentService {
    static register(name: string, phone: string, passwordUnhashed: string): Promise<{
        id: string;
        name: string;
        phone: string;
    }>;
    static login(phone: string, passwordUnhashed: string): Promise<{
        token: string;
        agent: {
            id: string;
            name: string;
            phone: string;
            status: string;
            latitude: number | null;
            longitude: number | null;
            reference: string | null;
        };
    }>;
    static listAgents(): Promise<{
        name: string;
        id: string;
        phone: string;
        latitude: number | null;
        longitude: number | null;
        updatedAt: Date;
        status: string;
        reference: string | null;
    }[]>;
    static updateStatus(agentId: string, status: AgentStatus): Promise<{
        name: string;
        id: string;
        phone: string;
        latitude: number | null;
        longitude: number | null;
        status: string;
        reference: string | null;
    }>;
    static updateLocation(agentId: string, latitude: number, longitude: number): Promise<{
        name: string;
        id: string;
        phone: string;
        latitude: number | null;
        longitude: number | null;
        status: string;
        reference: string | null;
    }>;
    static updateReference(agentId: string, reference: string): Promise<{
        name: string;
        id: string;
        phone: string;
        status: string;
        reference: string | null;
    }>;
    static getProfile(agentId: string): Promise<{
        name: string;
        id: string;
        phone: string;
        latitude: number | null;
        longitude: number | null;
        status: string;
        reference: string | null;
    } | null>;
}
