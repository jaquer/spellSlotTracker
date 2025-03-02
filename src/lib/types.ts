  export interface PlayerData {
    name: string;
    level: number;
    deltas: Array<number>;
    onePerDays: Array<{ name: String; count: number }>;
    sps: number;
    health: number;
    maxHealth: number;
    showHealth: boolean;
    showSpells: boolean;
    showSps: boolean;
    jonMode: boolean;
  };
