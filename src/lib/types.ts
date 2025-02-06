  export interface PlayerData {
    level: number;
    deltas: Array<number>;
    onePerDays: Array<{ name: String; state: boolean }>;
    sps: number;
    health: number;
    maxHealth: number;
  };
