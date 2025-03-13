// src/config/games-integration.ts

import { Game, GAMES } from './games';
import { CharacterClass } from './progression';

// Game modes
export type GameMode = 'casual' | 'ranked' | 'tournament' | 'clan_war';

// Define reward multipliers by game mode
export interface GameModeMultiplier {
  mode: GameMode;
  xpMultiplier: number;
  currencyMultiplier: number;
  itemDropMultiplier: number;
  description: string;
  requirements?: {
    playerLevel?: number;
    characterLevel?: number;
    clanLevel?: number;
  };
}

// Define character class advantages per game
export interface GameClassAdvantage {
  gameId: string;
  classAdvantages: Record<CharacterClass, {
    description: string;
    statBoosts: {
      stat: string;
      value: number;
      isPercentage: boolean;
    }[];
  }>;
}

// Define game reward structures
export interface GameReward {
  gameId: string;
  baseRewards: {
    xp: number;
    currency: number;
    itemDropChance: number;
  };
  winBonusMultiplier: number;
  streakBonusMultiplier: number;
  maxStreakBonus: number;
  specialRewards?: {
    condition: string;
    reward: {
      item?: string;
      title?: string;
      currency?: number;
      xp?: number;
    };
  }[];
}

// Define game leaderboard structure
export interface GameLeaderboard {
  gameId: string;
  rewardPeriod: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  rewards: {
    rank: number | string; // Number for specific rank, string for range like "4-10"
    xp: number;
    currency: number;
    items?: string[];
    titles?: string[];
  }[];
}

// Game mode multipliers
export const GAME_MODE_MULTIPLIERS: GameModeMultiplier[] = [
  {
    mode: 'casual',
    xpMultiplier: 1.0,
    currencyMultiplier: 1.0,
    itemDropMultiplier: 1.0,
    description: 'Standard game mode with normal rewards. No ranking affected.',
    requirements: {}
  },
  {
    mode: 'ranked',
    xpMultiplier: 1.25,
    currencyMultiplier: 1.5,
    itemDropMultiplier: 1.25,
    description: 'Competitive mode with increased rewards. Affects player ranking.',
    requirements: {
      playerLevel: 5,
      characterLevel: 5
    }
  },
  {
    mode: 'tournament',
    xpMultiplier: 2.0,
    currencyMultiplier: 3.0,
    itemDropMultiplier: 2.0,
    description: 'Special tournament events with significant rewards. Time-limited.',
    requirements: {
      playerLevel: 10,
      characterLevel: 10
    }
  },
  {
    mode: 'clan_war',
    xpMultiplier: 1.75,
    currencyMultiplier: 2.0,
    itemDropMultiplier: 1.5,
    description: 'Clan vs. Clan battles with team-based rewards that benefit the entire clan.',
    requirements: {
      playerLevel: 15,
      characterLevel: 10,
      clanLevel: 5
    }
  }
];

// Class advantages for each game
export const GAME_CLASS_ADVANTAGES: GameClassAdvantage[] = [
  {
    gameId: 'hordes',
    classAdvantages: {
      warrior: {
        description: 'Warriors excel at defeating powerful single monsters.',
        statBoosts: [
          {
            stat: 'singleTargetDamage',
            value: 15,
            isPercentage: true
          },
          {
            stat: 'health',
            value: 10,
            isPercentage: true
          }
        ]
      },
      mage: {
        description: 'Mages excel at defeating groups of weaker monsters.',
        statBoosts: [
          {
            stat: 'areaDamage',
            value: 20,
            isPercentage: true
          },
          {
            stat: 'mana',
            value: 15,
            isPercentage: true
          }
        ]
      },
      archer: {
        description: 'Archers can target monsters from a distance, avoiding some damage.',
        statBoosts: [
          {
            stat: 'critChance',
            value: 10,
            isPercentage: true
          },
          {
            stat: 'dodgeChance',
            value: 15,
            isPercentage: true
          }
        ]
      },
      rogue: {
        description: 'Rogues can sneak past some monsters and deal critical strikes.',
        statBoosts: [
          {
            stat: 'critDamage',
            value: 25,
            isPercentage: true
          },
          {
            stat: 'stealthDuration',
            value: 20,
            isPercentage: true
          }
        ]
      }
    }
  },
  {
    gameId: 'lucky-spinner',
    classAdvantages: {
      warrior: {
        description: 'Warriors have improved rewards from combat segments.',
        statBoosts: [
          {
            stat: 'combatSegmentReward',
            value: 15,
            isPercentage: true
          }
        ]
      },
      mage: {
        description: 'Mages have improved rewards from magic segments.',
        statBoosts: [
          {
            stat: 'magicSegmentReward',
            value: 15,
            isPercentage: true
          }
        ]
      },
      archer: {
        description: 'Archers have improved rewards from precision segments.',
        statBoosts: [
          {
            stat: 'precisionSegmentReward',
            value: 15,
            isPercentage: true
          }
        ]
      },
      rogue: {
        description: 'Rogues have a chance to spin again after landing on low-reward segments.',
        statBoosts: [
          {
            stat: 'spinAgainChance',
            value: 15,
            isPercentage: true
          }
        ]
      }
    }
  },
  {
    gameId: 'fling-off',
    classAdvantages: {
      warrior: {
        description: 'Warriors have higher health and damage in direct combat.',
        statBoosts: [
          {
            stat: 'health',
            value: 20,
            isPercentage: true
          },
          {
            stat: 'meleeDamage',
            value: 15,
            isPercentage: true
          }
        ]
      },
      mage: {
        description: 'Mages have stronger spells and faster mana regeneration.',
        statBoosts: [
          {
            stat: 'spellDamage',
            value: 25,
            isPercentage: true
          },
          {
            stat: 'manaRegen',
            value: 20,
            isPercentage: true
          }
        ]
      },
      archer: {
        description: 'Archers have improved range and can spot hidden enemies.',
        statBoosts: [
          {
            stat: 'attackRange',
            value: 15,
            isPercentage: true
          },
          {
            stat: 'detectionRange',
            value: 25,
            isPercentage: true
          }
        ]
      },
      rogue: {
        description: 'Rogues can remain stealthed longer and deal bonus backstab damage.',
        statBoosts: [
          {
            stat: 'stealthDuration',
            value: 30,
            isPercentage: true
          },
          {
            stat: 'backstabDamage',
            value: 25,
            isPercentage: true
          }
        ]
      }
    }
  }
];

// Game reward structures
export const GAME_REWARDS: GameReward[] = [
  {
    gameId: 'hordes',
    baseRewards: {
      xp: 50,
      currency: 25,
      itemDropChance: 10 // percentage
    },
    winBonusMultiplier: 1.5,
    streakBonusMultiplier: 0.1, // +10% per streak
    maxStreakBonus: 1.0, // Max +100%
    specialRewards: [
      {
        condition: 'Reach wave 10',
        reward: {
          xp: 100,
          currency: 50
        }
      },
      {
        condition: 'Reach wave 20',
        reward: {
          xp: 250,
          currency: 125,
          item: 'Rare Dice Charm'
        }
      },
      {
        condition: 'Defeat the Hordes Boss',
        reward: {
          xp: 500,
          currency: 250,
          item: 'Epic Dice Weapon Skin',
          title: 'Horde Slayer'
        }
      }
    ]
  },
  {
    gameId: 'lucky-spinner',
    baseRewards: {
      xp: 30,
      currency: 40,
      itemDropChance: 15
    },
    winBonusMultiplier: 1.3,
    streakBonusMultiplier: 0.05,
    maxStreakBonus: 0.5,
    specialRewards: [
      {
        condition: 'Hit jackpot',
        reward: {
          currency: 1000,
          item: 'Lucky Coin Accessory'
        }
      },
      {
        condition: 'Hit 3 jackpots in one day',
        reward: {
          title: 'Fortune\'s Favorite'
        }
      }
    ]
  },
  {
    gameId: 'fling-off',
    baseRewards: {
      xp: 100,
      currency: 50,
      itemDropChance: 20
    },
    winBonusMultiplier: 2.0,
    streakBonusMultiplier: 0.15,
    maxStreakBonus: 1.5,
    specialRewards: [
      {
        condition: 'Win a match',
        reward: {
          xp: 150,
          currency: 75
        }
      },
      {
        condition: 'Win 3 matches in a row',
        reward: {
          xp: 300,
          currency: 150,
          item: 'Victory Token'
        }
      },
      {
        condition: 'Win a tournament',
        reward: {
          xp: 1000,
          currency: 500,
          item: 'Tournament Champion Armor',
          title: 'Fling-Off Champion'
        }
      }
    ]
  }
];

// Game leaderboards
export const GAME_LEADERBOARDS: GameLeaderboard[] = [
  {
    gameId: 'hordes',
    rewardPeriod: 'weekly',
    rewards: [
      {
        rank: 1,
        xp: 1000,
        currency: 500,
        items: ['Legendary Dice Talisman'],
        titles: ['Dice Master']
      },
      {
        rank: 2,
        xp: 750,
        currency: 350,
        items: ['Epic Dice Talisman']
      },
      {
        rank: 3,
        xp: 500,
        currency: 250,
        items: ['Rare Dice Talisman']
      },
      {
        rank: '4-10',
        xp: 300,
        currency: 150,
        items: ['Uncommon Dice Charm']
      },
      {
        rank: '11-50',
        xp: 150,
        currency: 75
      }
    ]
  },
  {
    gameId: 'lucky-spinner',
    rewardPeriod: 'weekly',
    rewards: [
      {
        rank: 1,
        xp: 800,
        currency: 1000,
        items: ['Golden Spinner Token'],
        titles: ['Fortune\'s Champion']
      },
      {
        rank: 2,
        xp: 600,
        currency: 750,
        items: ['Silver Spinner Token']
      },
      {
        rank: 3,
        xp: 400,
        currency: 500,
        items: ['Bronze Spinner Token']
      },
      {
        rank: '4-10',
        xp: 250,
        currency: 250
      },
      {
        rank: '11-50',
        xp: 125,
        currency: 125
      }
    ]
  },
  {
    gameId: 'fling-off',
    rewardPeriod: 'monthly',
    rewards: [
      {
        rank: 1,
        xp: 5000,
        currency: 2500,
        items: ['Legendary Fling-Off Armor Set', 'Legendary Weapon Skin'],
        titles: ['Grand Champion']
      },
      {
        rank: 2,
        xp: 3500,
        currency: 1750,
        items: ['Epic Fling-Off Armor Set', 'Epic Weapon Skin'],
        titles: ['Champion']
      },
      {
        rank: 3,
        xp: 2500,
        currency: 1250,
        items: ['Rare Fling-Off Armor Set', 'Rare Weapon Skin'],
        titles: ['Contender']
      },
      {
        rank: '4-10',
        xp: 1500,
        currency: 750,
        items: ['Uncommon Fling-Off Accessory']
      },
      {
        rank: '11-50',
        xp: 750,
        currency: 375,
        items: ['Common Fling-Off Accessory']
      },
      {
        rank: '51-100',
        xp: 500,
        currency: 250
      }
    ]
  }
];

// Game progression requirements - need to reach certain player/character levels to access games
export interface GameProgressionRequirement {
  gameId: string;
  requirements: {
    playerLevel?: number;
    characterLevel?: number;
    clanLevel?: number;
    previousGameCompletion?: string[]; // Array of game IDs that must be completed first
  };
  modes: {
    mode: GameMode;
    requirements: {
      playerLevel?: number;
      characterLevel?: number;
      clanLevel?: number;
    };
  }[];
}

export const GAME_PROGRESSION_REQUIREMENTS: GameProgressionRequirement[] = [
  {
    gameId: 'hordes',
    requirements: {
      playerLevel: 1,
      characterLevel: 1
    },
    modes: [
      {
        mode: 'casual',
        requirements: {
          playerLevel: 1,
          characterLevel: 1
        }
      },
      {
        mode: 'ranked',
        requirements: {
          playerLevel: 5,
          characterLevel: 5
        }
      },
      {
        mode: 'tournament',
        requirements: {
          playerLevel: 10,
          characterLevel: 8
        }
      }
    ]
  },
  {
    gameId: 'lucky-spinner',
    requirements: {
      playerLevel: 1,
      characterLevel: 1
    },
    modes: [
      {
        mode: 'casual',
        requirements: {
          playerLevel: 1,
          characterLevel: 1
        }
      },
      {
        mode: 'ranked',
        requirements: {
          playerLevel: 5,
          characterLevel: 5
        }
      }
    ]
  },
  {
    gameId: 'fling-off',
    requirements: {
      playerLevel: 3,
      characterLevel: 3
    },
    modes: [
      {
        mode: 'casual',
        requirements: {
          playerLevel: 3,
          characterLevel: 3
        }
      },
      {
        mode: 'ranked',
        requirements: {
          playerLevel: 8,
          characterLevel: 8
        }
      },
      {
        mode: 'tournament',
        requirements: {
          playerLevel: 15,
          characterLevel: 12
        }
      },
      {
        mode: 'clan_war',
        requirements: {
          playerLevel: 15,
          characterLevel: 10,
          clanLevel: 5
        }
      }
    ]
  },
  {
    gameId: 'nft-poker',
    requirements: {
      playerLevel: 5,
      characterLevel: 5
    },
    modes: [
      {
        mode: 'casual',
        requirements: {
          playerLevel: 5,
          characterLevel: 5
        }
      },
      {
        mode: 'ranked',
        requirements: {
          playerLevel: 10,
          characterLevel: 8
        }
      },
      {
        mode: 'tournament',
        requirements: {
          playerLevel: 15,
          characterLevel: 10
        }
      }
    ]
  },
  {
    gameId: 'rpg',
    requirements: {
      playerLevel: 10,
      characterLevel: 10,
      previousGameCompletion: ['hordes', 'fling-off']
    },
    modes: [
      {
        mode: 'casual',
        requirements: {
          playerLevel: 10,
          characterLevel: 10
        }
      },
      {
        mode: 'clan_war',
        requirements: {
          playerLevel: 20,
          characterLevel: 15,
          clanLevel: 8
        }
      }
    ]
  }
];

// Helper functions
export function getAvailableGames(playerLevel: number, characterLevel: number, completedGames: string[] = []): Game[] {
  return GAMES.filter(game => {
    const requirements = GAME_PROGRESSION_REQUIREMENTS.find(req => req.gameId === game.id);
    if (!requirements) return true; // No requirements defined means it's available
    
    if (requirements.requirements.playerLevel && playerLevel < requirements.requirements.playerLevel) return false;
    if (requirements.requirements.characterLevel && characterLevel < requirements.requirements.characterLevel) return false;
    
    if (requirements.requirements.previousGameCompletion && requirements.requirements.previousGameCompletion.length > 0) {
      const requiredGames = requirements.requirements.previousGameCompletion;
      if (!requiredGames.every(gameId => completedGames.includes(gameId))) return false;
    }
    
    return true;
  });
}

export function getAvailableGameModes(gameId: string, playerLevel: number, characterLevel: number, clanLevel: number = 0): GameMode[] {
  const requirements = GAME_PROGRESSION_REQUIREMENTS.find(req => req.gameId === gameId);
  if (!requirements) return ['casual']; // Default to casual if no requirements
  
  return requirements.modes
    .filter(mode => {
      if (mode.requirements.playerLevel && playerLevel < mode.requirements.playerLevel) return false;
      if (mode.requirements.characterLevel && characterLevel < mode.requirements.characterLevel) return false;
      if (mode.requirements.clanLevel && clanLevel < mode.requirements.clanLevel) return false;
      return true;
    })
    .map(mode => mode.mode);
}

export function calculateGameRewards(
  gameId: string, 
  mode: GameMode, 
  won: boolean, 
  streak: number = 0
): { xp: number, currency: number, dropChance: number } {
  const gameReward = GAME_REWARDS.find(reward => reward.gameId === gameId);
  const modeMultiplier = GAME_MODE_MULTIPLIERS.find(m => m.mode === mode);
  
  if (!gameReward || !modeMultiplier) {
    return { xp: 0, currency: 0, dropChance: 0 };
  }
  
  const baseXp = gameReward.baseRewards.xp;
  const baseCurrency = gameReward.baseRewards.currency;
  const baseDropChance = gameReward.baseRewards.itemDropChance;
  
  // Apply multipliers based on mode
  let xp = baseXp * modeMultiplier.xpMultiplier;
  let currency = baseCurrency * modeMultiplier.currencyMultiplier;
  let dropChance = baseDropChance * modeMultiplier.itemDropMultiplier;
  
  // Apply win bonus if won
  if (won) {
    xp *= gameReward.winBonusMultiplier;
    currency *= gameReward.winBonusMultiplier;
    dropChance *= gameReward.winBonusMultiplier;
  }
  
  // Apply streak bonus
  const streakBonus = Math.min(streak * gameReward.streakBonusMultiplier, gameReward.maxStreakBonus);
  xp *= (1 + streakBonus);
  currency *= (1 + streakBonus);
  dropChance *= (1 + streakBonus);
  
  return {
    xp: Math.round(xp),
    currency: Math.round(currency),
    dropChance: Math.min(Math.round(dropChance), 100) // Cap at 100%
  };
}

// Game achievements that can unlock special rewards
export interface GameAchievement {
  id: string;
  gameId: string;
  name: string;
  description: string;
  icon: string;
  requirements: string;
  rewards: {
    xp?: number;
    currency?: number;
    items?: string[];
    title?: string;
    unlocks?: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
}

export const GAME_ACHIEVEMENTS: GameAchievement[] = [
  // Hordes Achievements
  {
    id: 'hordes-novice',
    gameId: 'hordes',
    name: 'Novice Dice Roller',
    description: 'Complete 10 games of Hordes',
    icon: '🎲',
    requirements: 'Play 10 games of Hordes',
    rewards: {
      xp: 200,
      currency: 100
    },
    difficulty: 'easy'
  },
  {
    id: 'hordes-wave-master',
    gameId: 'hordes',
    name: 'Wave Master',
    description: 'Reach wave 30 in a single game of Hordes',
    icon: '🌊',
    requirements: 'Survive until wave 30',
    rewards: {
      xp: 500,
      currency: 250,
      items: ['Master Dice Charm'],
      title: 'Wave Rider'
    },
    difficulty: 'hard'
  },
  {
    id: 'hordes-perfect',
    gameId: 'hordes',
    name: 'Perfect Roll',
    description: 'Complete a game of Hordes without taking any damage',
    icon: '✨',
    requirements: 'Complete the game with 100% health',
    rewards: {
      xp: 1000,
      currency: 500,
      items: ['Perfect Dice Set'],
      title: 'The Untouchable'
    },
    difficulty: 'legendary'
  },
  
  // Lucky Spinner Achievements
  {
    id: 'spinner-novice',
    gameId: 'lucky-spinner',
    name: 'Fortune Seeker',
    description: 'Spin the wheel 50 times',
    icon: '🎡',
    requirements: 'Use the Lucky Spinner 50 times',
    rewards: {
      xp: 200,
      currency: 100
    },
    difficulty: 'easy'
  },
  {
    id: 'spinner-jackpot',
    gameId: 'lucky-spinner',
    name: 'Jackpot Hunter',
    description: 'Hit the jackpot 5 times',
    icon: '💰',
    requirements: 'Land on the jackpot segment 5 times',
    rewards: {
      xp: 500,
      currency: 1000,
      items: ['Lucky Rabbit\'s Foot'],
      title: 'Lucky One'
    },
    difficulty: 'medium'
  },
  {
    id: 'spinner-legendary',
    gameId: 'lucky-spinner',
    name: 'Lady Luck\'s Favorite',
    description: 'Hit the jackpot 3 times in a row',
    icon: '👑',
    requirements: 'Land on the jackpot segment 3 consecutive times',
    rewards: {
      xp: 2000,
      currency: 5000,
      items: ['Golden Spinner Replica'],
      title: 'Fortune\'s Chosen'
    },
    difficulty: 'legendary'
  },
  
  // Fling-Off Achievements
  {
    id: 'flingoff-novice',
    gameId: 'fling-off',
    name: 'Combat Initiate',
    description: 'Win 5 matches in Fling-Off',
    icon: '🚀',
    requirements: 'Win 5 matches in any mode',
    rewards: {
      xp: 300,
      currency: 150
    },
    difficulty: 'easy'
  },
  {
    id: 'flingoff-veteran',
    gameId: 'fling-off',
    name: 'Battle Veteran',
    description: 'Win 50 matches in Fling-Off',
    icon: '🏆',
    requirements: 'Win 50 matches in any mode',
    rewards: {
      xp: 1000,
      currency: 500,
      items: ['Veteran\'s Medal'],
      title: 'Veteran'
    },
    difficulty: 'medium'
  },
  {
    id: 'flingoff-champion',
    gameId: 'fling-off',
    name: 'Tournament Champion',
    description: 'Win a tournament in Fling-Off',
    icon: '🏅',
    requirements: 'Place first in a tournament',
    rewards: {
      xp: 2000,
      currency: 1000,
      items: ['Champion\'s Crown', 'Unique Weapon Skin'],
      title: 'The Champion',
      unlocks: ['special-tournament-access']
    },
    difficulty: 'hard'
  },
  {
    id: 'flingoff-legend',
    gameId: 'fling-off',
    name: 'Living Legend',
    description: 'Win 10 consecutive matches in ranked mode',
    icon: '🔥',
    requirements: 'Achieve a 10-win streak in ranked mode',
    rewards: {
      xp: 3000,
      currency: 1500,
      items: ['Legendary Armor Set', 'Exclusive Mount'],
      title: 'The Legend',
      unlocks: ['legendary-quests']
    },
    difficulty: 'legendary'
  }
];

// Player rank system
export interface PlayerRank {
  id: string;
  name: string;
  icon: string;
  requiredPoints: number;
  rewards: {
    xp: number;
    currency: number;
    items?: string[];
  };
  perks: string[];
}

export const PLAYER_RANKS: PlayerRank[] = [
  {
    id: 'rank-bronze',
    name: 'Bronze',
    icon: '🥉',
    requiredPoints: 0,
    rewards: {
      xp: 0,
      currency: 0
    },
    perks: [
      'Access to basic games',
      'Basic daily quests'
    ]
  },
  {
    id: 'rank-silver',
    name: 'Silver',
    icon: '🥈',
    requiredPoints: 1000,
    rewards: {
      xp: 500,
      currency: 250
    },
    perks: [
      'Access to all basic games',
      'Daily and weekly quests',
      '+5% XP gain'
    ]
  },
  {
    id: 'rank-gold',
    name: 'Gold',
    icon: '🥇',
    requiredPoints: 5000,
    rewards: {
      xp: 1000,
      currency: 500,
      items: ['Gold Rank Badge']
    },
    perks: [
      'Access to all regular games',
      'All quest types available',
      '+10% XP gain',
      'Daily login bonus'
    ]
  },
  {
    id: 'rank-platinum',
    name: 'Platinum',
    icon: '💎',
    requiredPoints: 15000,
    rewards: {
      xp: 2000,
      currency: 1000,
      items: ['Platinum Rank Badge', 'Exclusive Accessory']
    },
    perks: [
      'Access to all games including beta tests',
      'All quest types available',
      '+15% XP gain',
      'Enhanced daily login bonus',
      'Priority tournament entry'
    ]
  },
  {
    id: 'rank-diamond',
    name: 'Diamond',
    icon: '💠',
    requiredPoints: 30000,
    rewards: {
      xp: 5000,
      currency: 2500,
      items: ['Diamond Rank Badge', 'Exclusive Armor Set', 'Exclusive Weapon Skin']
    },
    perks: [
      'Access to all content including alpha tests',
      'All quest types with enhanced rewards',
      '+20% XP gain',
      'Premium daily login bonus',
      'Reserved tournament spots',
      'Access to Diamond-only events'
    ]
  },
  {
    id: 'rank-master',
    name: 'Master',
    icon: '👑',
    requiredPoints: 50000,
    rewards: {
      xp: 10000,
      currency: 5000,
      items: ['Master Rank Badge', 'Legendary Armor Set', 'Legendary Weapon', 'Exclusive Mount']
    },
    perks: [
      'Access to all content',
      'All quest types with maximum rewards',
      '+25% XP gain',
      'Elite daily login bonus',
      'Automatic tournament qualification',
      'Access to Master-only events',
      'Custom title creation',
      'Champion aura effect'
    ]
  }
];

// Character titles that can be earned through various activities
export interface CharacterTitle {
  id: string;
  name: string;
  description: string;
  source: string;
  requirements: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  buffs?: {
    stat: string;
    value: number;
    isPercentage: boolean;
  }[];
}

export const CHARACTER_TITLES: CharacterTitle[] = [
  {
    id: 'title-novice',
    name: 'Novice',
    description: 'A beginner in the world of Flingers',
    source: 'Default',
    requirements: 'Automatically assigned to new characters',
    rarity: 'common'
  },
  {
    id: 'title-adventurer',
    name: 'Adventurer',
    description: 'One who has embarked on many quests',
    source: 'Quest Completion',
    requirements: 'Complete 10 quests of any type',
    rarity: 'common',
    buffs: [
      {
        stat: 'xpGain',
        value: 2,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-veteran',
    name: 'Veteran',
    description: 'A seasoned player with many victories',
    source: 'Game Achievement',
    requirements: 'Win 50 matches in Fling-Off',
    rarity: 'uncommon',
    buffs: [
      {
        stat: 'combatStats',
        value: 3,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-dice-master',
    name: 'Dice Master',
    description: 'One who has mastered the game of Hordes',
    source: 'Leaderboard',
    requirements: 'Reach #1 on the Hordes weekly leaderboard',
    rarity: 'rare',
    buffs: [
      {
        stat: 'hordesBonus',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-lucky-one',
    name: 'Lucky One',
    description: 'Fortune seems to favor this player',
    source: 'Game Achievement',
    requirements: 'Hit the jackpot 5 times in Lucky Spinner',
    rarity: 'rare',
    buffs: [
      {
        stat: 'luck',
        value: 5,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-the-champion',
    name: 'The Champion',
    description: 'A proven champion of the Fling-Off tournaments',
    source: 'Tournament Victory',
    requirements: 'Win a Fling-Off tournament',
    rarity: 'epic',
    buffs: [
      {
        stat: 'damage',
        value: 5,
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
    id: 'title-the-untouchable',
    name: 'The Untouchable',
    description: 'So skilled that enemies cannot land a hit',
    source: 'Game Achievement',
    requirements: 'Complete Hordes without taking any damage',
    rarity: 'legendary',
    buffs: [
      {
        stat: 'dodgeChance',
        value: 5,
        isPercentage: true
      },
      {
        stat: 'damageReduction',
        value: 3,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-fortunes-chosen',
    name: 'Fortune\'s Chosen',
    description: 'Blessed by Lady Luck herself',
    source: 'Game Achievement',
    requirements: 'Hit the jackpot 3 times in a row in Lucky Spinner',
    rarity: 'legendary',
    buffs: [
      {
        stat: 'luck',
        value: 10,
        isPercentage: true
      },
      {
        stat: 'critChance',
        value: 5,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-the-legend',
    name: 'The Legend',
    description: 'A living legend whose name is known throughout the realm',
    source: 'Game Achievement',
    requirements: 'Win 10 consecutive matches in ranked Fling-Off',
    rarity: 'mythic',
    buffs: [
      {
        stat: 'allStats',
        value: 5,
        isPercentage: true
      },
      {
        stat: 'xpGain',
        value: 10,
        isPercentage: true
      }
    ]
  },
  {
    id: 'title-realm-protector',
    name: 'Realm Protector',
    description: 'The ultimate defender of the Flingers world',
    source: 'Story Completion',
    requirements: 'Complete all story quests',
    rarity: 'mythic',
    buffs: [
      {
        stat: 'allStats',
        value: 8,
        isPercentage: true
      },
      {
        stat: 'damageReduction',
        value: 5,
        isPercentage: true
      },
      {
        stat: 'damage',
        value: 5,
        isPercentage: true
      }
    ]
  }
];

// Helper function to calculate rank from points
export function getPlayerRank(rankPoints: number): PlayerRank {
  // Sort ranks by required points in descending order
  const sortedRanks = [...PLAYER_RANKS].sort((a, b) => b.requiredPoints - a.requiredPoints);
  
  // Find the highest rank the player qualifies for
  for (const rank of sortedRanks) {
    if (rankPoints >= rank.requiredPoints) {
      return rank;
    }
  }
  
  // Default to the lowest rank if no match (should never happen if ranks are properly defined)
  return PLAYER_RANKS[0];
}

// Helper function to check if a game is unlocked
export function isGameUnlocked(
  gameId: string, 
  playerLevel: number, 
  characterLevel: number, 
  completedGames: string[] = []
): boolean {
  const requirement = GAME_PROGRESSION_REQUIREMENTS.find(req => req.gameId === gameId);
  if (!requirement) return true; // No requirements means it's unlocked
  
  if (requirement.requirements.playerLevel && playerLevel < requirement.requirements.playerLevel) return false;
  if (requirement.requirements.characterLevel && characterLevel < requirement.requirements.characterLevel) return false;
  
  if (requirement.requirements.previousGameCompletion && requirement.requirements.previousGameCompletion.length > 0) {
    if (!requirement.requirements.previousGameCompletion.every(id => completedGames.includes(id))) return false;
  }
  
  return true;
}