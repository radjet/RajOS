export interface Sector {
  id: string;
  label: string;
  color: string;
  x: number; // pixel X on large canvas
  y: number; // pixel Y on large canvas
}

export interface Node {
  id: string;
  sectorId: string;
  label: string;
  x: number; // pixel X on large canvas
  y: number; // pixel Y on large canvas
  fogLevel: number; // 0-100
}

export interface FogState {
  [nodeId: string]: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  content: string;
  context?: {
    nodeId?: string;
    nodeLabel?: string;
    sectorLabel?: string;
  };
}

export enum ViewMode {
  MAP = 'MAP',
  INBOX = 'INBOX',
}
