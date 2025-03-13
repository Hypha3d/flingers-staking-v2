// src/config/character-clan-relationships.ts

// Import progression types
import { SkillTreeNode } from './progression';

export interface UnlockRequirement {
  type: 'player_level' | 'clan_level' | 'character_level' | 'task_completion' | 'quest_completion';
  id?: string; // Task/quest ID if applicable
  level?: number; // Level requirement if applicable
  count?: number; // For requirements that need counts (e.g., "have 3 characters")
}

export interface CharacterSlot {
  id: string;
  name: string;
  description: string;
  unlockRequirements: UnlockRequirement[];
  isBaseAllowed: boolean; // Whether this slot can be used for base characters
  isNftRequired: boolean; // Whether this slot requires an NFT character
  unlocked: boolean;
}

export interface ClanSlot {
  id: string;
  name: string;
  description: string;
  unlockRequirements: UnlockRequirement[];
  maxMembers: number; // Maximum members allowed (based on clan level)
  unlocked: boolean;
}

// Character slot definitions
export const CHARACTER_SLOTS: CharacterSlot[] = [
  {
    id: 'char-slot-1',
    name: 'Primary Character',
    description: 'Your first character slot.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 1
      }
    ],
    isBaseAllowed: true,
    isNftRequired: false,
    unlocked: true
  },
  {
    id: 'char-slot-2',
    name: 'Secondary Character',
    description: 'Your second character slot.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 5
      }
    ],
    isBaseAllowed: true,
    isNftRequired: false,
    unlocked: false
  },
  {
    id: 'char-slot-3',
    name: 'Tertiary Character',
    description: 'Your third character slot.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 8
      }
    ],
    isBaseAllowed: false,
    isNftRequired: true,
    unlocked: false
  },
  {
    id: 'char-slot-4',
    name: 'Elite Character',
    description: 'Elite character slot for specialized roles.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 15
      },
      {
        type: 'quest_completion',
        id: 'story-chapter1'
      }
    ],
    isBaseAllowed: false,
    isNftRequired: true,
    unlocked: false
  },
  {
    id: 'char-slot-5',
    name: 'Master Character',
    description: 'Master character slot for legendary warriors.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 25
      },
      {
        type: 'character_level',
        level: 15,
        count: 1 // At least one character at level 15
      }
    ],
    isBaseAllowed: false,
    isNftRequired: true,
    unlocked: false
  }
];

// Clan slot definitions
export const CLAN_SLOTS: ClanSlot[] = [
  {
    id: 'clan-slot-1',
    name: 'Primary Clan',
    description: 'Your first clan.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 1
      }
    ],
    maxMembers: 10, // Will be modified by clan level
    unlocked: true
  },
  {
    id: 'clan-slot-2',
    name: 'Secondary Clan',
    description: 'Your second clan.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 10
      }
    ],
    maxMembers: 10,
    unlocked: false
  },
  {
    id: 'clan-slot-3',
    name: 'Tertiary Clan',
    description: 'Your third clan.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 20
      },
      {
        type: 'clan_level',
        level: 5,
        count: 1 // At least one clan at level 5
      }
    ],
    maxMembers: 10,
    unlocked: false
  },
  {
    id: 'clan-slot-4',
    name: 'Alliance Clan',
    description: 'Your fourth clan for forming grand alliances.',
    unlockRequirements: [
      {
        type: 'player_level',
        level: 30
      },
      {
        type: 'clan_level',
        level: 8,
        count: 1 // At least one clan at level 8
      }
    ],
    maxMembers: 10,
    unlocked: false
  }
];

// Clan specializations
export interface ClanSpecialization {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  bonuses: {
    stat: string;
    value: number;
    isPercentage: boolean;
  }[];
}

export const CLAN_SPECIALIZATIONS: ClanSpecialization[] = [
  {
    id: 'spec-combat',
    name: 'Combat Focus',
    description: 'Specialize your clan in combat prowess, boosting damage and survivability.',
    icon: '⚔️',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'damage',
        value: 10,
        isPercentage: true
      },
      {
        stat: 'health',
        value: 5,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-arcane',
    name: 'Arcane Focus',
    description: 'Specialize your clan in magical abilities, boosting spell power and mana.',
    icon: '✨',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'spellPower',
        value: 10,
        isPercentage: true
      },
      {
        stat: 'mana',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-exploration',
    name: 'Exploration Focus',
    description: 'Specialize your clan in exploration, improving resource gathering and discovery.',
    icon: '🧭',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'resourceGathering',
        value: 15,
        isPercentage: true
      },
      {
        stat: 'discoveryChance',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-trade',
    name: 'Trade Focus',
    description: 'Specialize your clan in trade and commerce, improving currency gains and market access.',
    icon: '💰',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'currencyGain',
        value: 15,
        isPercentage: true
      },
      {
        stat: 'marketDiscount',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-defense',
    name: 'Defensive Focus',
    description: 'Specialize your clan in defensive tactics, improving survivability in combat.',
    icon: '🛡️',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'damageReduction',
        value: 10,
        isPercentage: true
      },
      {
        stat: 'blockChance',
        value: 5,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-tactical',
    name: 'Tactical Focus',
    description: 'Specialize your clan in tactical combat, improving critical strikes and precision.',
    icon: '🎯',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'critChance',
        value: 8,
        isPercentage: true
      },
      {
        stat: 'critDamage',
        value: 15,
        isPercentage: true
      }
    ]
  },
  {
    id: 'spec-support',
    name: 'Support Focus',
    description: 'Specialize your clan in supporting abilities, improving healing and buffs.',
    icon: '💞',
    requiredLevel: 5,
    bonuses: [
      {
        stat: 'healingPower',
        value: 15,
        isPercentage: true
      },
      {
        stat: 'buffDuration',
        value: 20,
        isPercentage: true
      }
    ]
  }
];

// Character-Clan relationship benefits
export interface CharacterClanBenefit {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  requirements: {
    playerLevel?: number;
    clanLevel?: number;
    characterLevel?: number;
    specialization?: string;
  };
  effect: {
    stat: string;
    value: number;
    isPercentage: boolean;
  }[];
}

export const CHARACTER_CLAN_BENEFITS: CharacterClanBenefit[] = [
  {
    id: 'clan-passive-damage',
    name: 'Clan Strength',
    description: 'Characters in this clan receive a damage bonus based on clan level.',
    type: 'passive',
    requirements: {
      clanLevel: 2
    },
    effect: [
      {
        stat: 'damage',
        value: 5,
        isPercentage: true
      }
    ]
  },
  {
    id: 'clan-passive-health',
    name: 'Clan Vitality',
    description: 'Characters in this clan receive a health bonus based on clan level.',
    type: 'passive',
    requirements: {
      clanLevel: 3
    },
    effect: [
      {
        stat: 'health',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'clan-active-rally',
    name: 'Clan Rally',
    description: 'Once per day, boost all clan members\' stats for 30 minutes.',
    type: 'active',
    requirements: {
      clanLevel: 5,
      playerLevel: 10
    },
    effect: [
      {
        stat: 'allStats',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'clan-passive-xp',
    name: 'Clan Wisdom',
    description: 'Characters in this clan gain additional XP from all sources.',
    type: 'passive',
    requirements: {
      clanLevel: 7
    },
    effect: [
      {
        stat: 'xpGain',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'clan-specialization-bonus',
    name: 'Specialization Mastery',
    description: 'Further enhances the clan\'s specialization bonuses.',
    type: 'passive',
    requirements: {
      clanLevel: 8,
      specialization: 'any'
    },
    effect: [
      {
        stat: 'specializationBonus',
        value: 50,
        isPercentage: true
      }
    ]
  },
  {
    id: 'clan-active-war-cry',
    name: 'Clan War Cry',
    description: 'During clan wars, activate to boost all clan members\' combat stats significantly.',
    type: 'active',
    requirements: {
      clanLevel: 10,
      playerLevel: 15
    },
    effect: [
      {
        stat: 'combatStats',
        value: 25,
        isPercentage: true
      }
    ]
  }
];

// Base character limitation system
export interface BaseCharacterLimits {
  playerLevel: number;
  maxBaseCharacters: number;
  baseCharacterRestrictions: string[];
}

export const BASE_CHARACTER_LIMITS: BaseCharacterLimits[] = [
  {
    playerLevel: 1,
    maxBaseCharacters: 1,
    baseCharacterRestrictions: [
      'Limited to level 10 maximum',
      'Cannot participate in clan wars',
      'Cannot equip rare or higher items'
    ]
  },
  {
    playerLevel: 10,
    maxBaseCharacters: 2,
    baseCharacterRestrictions: [
      'Limited to level 15 maximum',
      'Cannot participate in clan wars',
      'Cannot equip epic or higher items'
    ]
  },
  {
    playerLevel: 20,
    maxBaseCharacters: 3,
    baseCharacterRestrictions: [
      'Limited to level 20 maximum',
      'Can participate in clan wars with penalties',
      'Cannot equip legendary items'
    ]
  },
  {
    playerLevel: 30,
    maxBaseCharacters: 4,
    baseCharacterRestrictions: [
      'Limited to level 25 maximum',
      'Can participate in all activities with minor penalties',
      'Cannot equip mythic items'
    ]
  }
];

// Helper functions for checking unlock status
export function checkPlayerLevelRequirement(playerLevel: number, requirement: number): boolean {
  return playerLevel >= requirement;
}

export function checkClanLevelRequirement(clanLevels: number[], requirement: number, count: number = 1): boolean {
  return clanLevels.filter(level => level >= requirement).length >= count;
}

export function checkCharacterLevelRequirement(characterLevels: number[], requirement: number, count: number = 1): boolean {
  return characterLevels.filter(level => level >= requirement).length >= count;
}

export function getMaxBaseCharacters(playerLevel: number): number {
  const limit = BASE_CHARACTER_LIMITS.filter(limit => playerLevel >= limit.playerLevel)
    .sort((a, b) => b.playerLevel - a.playerLevel)[0];
  return limit ? limit.maxBaseCharacters : 0;
}

export function getCharacterSlotUnlockStatus(playerLevel: number, completedTaskIds: string[], completedQuestIds: string[], characterLevels: number[]): Record<string, boolean> {
  return CHARACTER_SLOTS.reduce((result, slot) => {
    let unlocked = true;
    
    for (const req of slot.unlockRequirements) {
      switch (req.type) {
        case 'player_level':
          if (!checkPlayerLevelRequirement(playerLevel, req.level || 0)) {
            unlocked = false;
          }
          break;
        case 'task_completion':
          if (req.id && !completedTaskIds.includes(req.id)) {
            unlocked = false;
          }
          break;
        case 'quest_completion':
          if (req.id && !completedQuestIds.includes(req.id)) {
            unlocked = false;
          }
          break;
        case 'character_level':
          if (!checkCharacterLevelRequirement(characterLevels, req.level || 0, req.count || 1)) {
            unlocked = false;
          }
          break;
      }
    }
    
    result[slot.id] = unlocked;
    return result;
  }, {} as Record<string, boolean>);
}

export function getClanSlotUnlockStatus(playerLevel: number, clanLevels: number[]): Record<string, boolean> {
  return CLAN_SLOTS.reduce((result, slot) => {
    let unlocked = true;
    
    for (const req of slot.unlockRequirements) {
      switch (req.type) {
        case 'player_level':
          if (!checkPlayerLevelRequirement(playerLevel, req.level || 0)) {
            unlocked = false;
          }
          break;
        case 'clan_level':
          if (!checkClanLevelRequirement(clanLevels, req.level || 0, req.count || 1)) {
            unlocked = false;
          }
          break;
      }
    }
    
    result[slot.id] = unlocked;
    return result;
  }, {} as Record<string, boolean>);
}