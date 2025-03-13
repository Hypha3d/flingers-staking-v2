// types/playerHub.ts

export interface Clan {
    id: string;
    name: string;
    color: string;
    symbol: string;
    membersCount: number;
    level: number;
    xp: number;
    createdAt: string;
    specialization?: string; // ID of the specialization
  }
  
  export interface Character {
    id: string;
    name: string;
    level: number;
    xp: number;
    class: string;
    isBase: boolean;
    clan?: string;
    nftId?: string;
    image?: string;
    skillPoints?: number;
    stats?: {
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
      luck: number;
    };
    unlockedSkills?: string[]; // IDs of unlocked skills
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    icon: string;
    reward: {
      xp: number;
      items?: string[];
      currency?: number;
    };
    completed: boolean;
    available: boolean;
    action?: () => void;
  }
  
  export interface NFT {
    id: string;
    name: string;
    image?: string;
  }