import { PingStatus } from '../types';
export declare class PingService {
    static createPing(userId: string, latitude: number, longitude: number, agentId: string, amount: number, operationType: string): Promise<{
        user: {
            name: string;
            id: string;
            phone: string | null;
        };
        agent: {
            name: string;
            id: string;
            phone: string;
            reference: string | null;
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
    }>;
    static acceptPing(pingId: string, agentId: string): Promise<{
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
    }>;
    static updatePingStatus(pingId: string, status: PingStatus, agentId: string): Promise<{
        agent: {
            name: string;
            id: string;
            phone: string;
            status: string;
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
    }>;
    static getActivePings(): Promise<({
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
    static getPingById(pingId: string): Promise<({
        agent: {
            name: string;
            id: string;
            phone: string;
            latitude: number | null;
            longitude: number | null;
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
    }) | null>;
}
