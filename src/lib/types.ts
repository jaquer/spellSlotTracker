  export interface PlayerData {
    name: string;
    level: number;
    deltas: Array<number>;
    onePerDays: Array<{ name: String; count: number }>;
    sps: number;
    health: number;
    maxHealth: number;
    showSpells: boolean;
    showSps: boolean;
    jonMode: boolean;
  };
