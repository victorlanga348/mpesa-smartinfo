export enum AgentStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ON_MY_WAY = 'ON_MY_WAY'
}

export enum PingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  WAITING_LIST = 'WAITING_LIST',
  IN_SERVICE = 'IN_SERVICE',
  ON_MY_WAY = 'ON_MY_WAY',
  ARRIVED = 'ARRIVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED'
}

export interface AgentPayload {
  id: string;
  name: string;
  phone: string;
}
