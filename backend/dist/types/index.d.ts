export declare enum AgentStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    ON_MY_WAY = "ON_MY_WAY"
}
export declare enum PingStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    ON_MY_WAY = "ON_MY_WAY",
    EXPIRED = "EXPIRED",
    COMPLETED = "COMPLETED"
}
export interface AgentPayload {
    id: string;
    name: string;
    phone: string;
}
