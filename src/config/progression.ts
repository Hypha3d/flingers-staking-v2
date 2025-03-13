// src/config/progression.ts

// Define player level structure
export interface PlayerLevel {
    level: number;
    xpRequired: number;
    totalXpRequired: number; // Total XP from level 1 to reach this level
    unlocks: {
      description: string;
      type: 'clan' | 'character' | 'feature' | 'stat';
      value?: number | string;
    }[];
  }
  
  // Define clan level structure
  export interface ClanLevel {
    level: number;
    xpRequired: number;
    totalXpRequired: number;
    memberSlots: number; // Number of characters that can join the clan
    bonuses: {
      name: string;
      description: string;
      type: 'stat' | 'resource' | 'reward';
      value: number; // Percentage or absolute value depending on type
    }[];
  }
  
  // Define character level structure
  export interface CharacterLevel {
    level: number;
    xpRequired: number;
    totalXpRequired: number;
    stats: {
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
      luck: number;
    };
    skillPoints: number; // Skill points awarded at this level
  }
  
  // Player skill tree nodes
  export interface SkillTreeNode {
    id: string;
    name: string;
    description: string;
    icon: string;
    levelRequired: number;
    pointCost: number;
    bonuses: {
      stat: string;
      value: number;
      isPercentage: boolean;
    }[];
    prerequisiteSkills?: string[]; // IDs of skills required before this can be unlocked
    unlocked: boolean;
    maxRank: number; // Maximum times this skill can be upgraded
    currentRank: number; // Current upgrade level
  }
  
  // Character class types
  export type CharacterClass = 'warrior' | 'mage' | 'archer' | 'rogue';
  
  // Character class definitions
  export interface ClassDefinition {
    className: CharacterClass;
    description: string;
    baseStats: {
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
      luck: number;
    };
    growthRates: {
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
      luck: number;
    }; // Per level multipliers
    abilities: {
      id: string;
      name: string;
      description: string;
      unlockLevel: number;
      cooldown?: number; // in seconds
      effect: string;
    }[];
    skillTree: SkillTreeNode[];
  }
  
  // Player level progression table
  export const PLAYER_LEVELS: PlayerLevel[] = [
    {
      level: 1,
      xpRequired: 0,
      totalXpRequired: 0,
      unlocks: [
        {
          description: "Create your first clan",
          type: "clan"
        },
        {
          description: "Create base character",
          type: "character"
        }
      ]
    },
    {
      level: 2,
      xpRequired: 100,
      totalXpRequired: 100,
      unlocks: [
        {
          description: "Daily quests",
          type: "feature"
        }
      ]
    },
    {
      level: 3,
      xpRequired: 250,
      totalXpRequired: 350,
      unlocks: [
        {
          description: "Reward multiplier",
          type: "stat",
          value: 1.05 // 5% boost to all rewards
        }
      ]
    },
    {
      level: 4,
      xpRequired: 400,
      totalXpRequired: 750,
      unlocks: [
        {
          description: "Weekly quests",
          type: "feature"
        }
      ]
    },
    {
      level: 5,
      xpRequired: 750,
      totalXpRequired: 1500,
      unlocks: [
        {
          description: "Additional character slot",
          type: "character"
        },
        {
          description: "Player skill tree",
          type: "feature"
        }
      ]
    },
    {
      level: 6,
      xpRequired: 1100,
      totalXpRequired: 2600,
      unlocks: [
        {
          description: "XP gain boost",
          type: "stat",
          value: 1.05 // 5% boost to XP gain
        }
      ]
    },
    {
      level: 7,
      xpRequired: 1600,
      totalXpRequired: 4200,
      unlocks: [
        {
          description: "Monthly quests",
          type: "feature"
        }
      ]
    },
    {
      level: 8,
      xpRequired: 2200,
      totalXpRequired: 6400,
      unlocks: [
        {
          description: "Additional character slot",
          type: "character"
        }
      ]
    },
    {
      level: 9,
      xpRequired: 3000,
      totalXpRequired: 9400,
      unlocks: [
        {
          description: "Reward multiplier increase",
          type: "stat",
          value: 1.1 // 10% total boost to all rewards
        }
      ]
    },
    {
      level: 10,
      xpRequired: 4000,
      totalXpRequired: 13400,
      unlocks: [
        {
          description: "Create second clan",
          type: "clan"
        },
        {
          description: "Clan war participation",
          type: "feature"
        }
      ]
    },
    {
      level: 15,
      xpRequired: 10000,
      totalXpRequired: 40000,
      unlocks: [
        {
          description: "Additional character slot",
          type: "character"
        },
        {
          description: "Reward multiplier increase",
          type: "stat",
          value: 1.15 // 15% total boost to all rewards
        }
      ]
    },
    {
      level: 20,
      xpRequired: 20000,
      totalXpRequired: 100000,
      unlocks: [
        {
          description: "Create third clan",
          type: "clan"
        },
        {
          description: "Special tournament access",
          type: "feature"
        }
      ]
    },
    {
      level: 25,
      xpRequired: 40000,
      totalXpRequired: 200000,
      unlocks: [
        {
          description: "Masterclass characters",
          type: "feature"
        },
        {
          description: "Reward multiplier increase",
          type: "stat",
          value: 1.2 // 20% total boost to all rewards
        }
      ]
    },
    {
      level: 30,
      xpRequired: 80000,
      totalXpRequired: 400000,
      unlocks: [
        {
          description: "Create fourth clan",
          type: "clan"
        },
        {
          description: "Legendary quests",
          type: "feature"
        }
      ]
    }
  ];
  
  // Character class definitions
  export const CHARACTER_CLASSES: Record<CharacterClass, ClassDefinition> = {
    warrior: {
      className: 'warrior',
      description: 'Masters of close combat who rely on strength and durability to overcome their foes.',
      baseStats: {
        strength: 15,
        intelligence: 8,
        dexterity: 10,
        constitution: 14,
        luck: 8
      },
      growthRates: {
        strength: 1.5,
        intelligence: 0.7,
        dexterity: 1.0,
        constitution: 1.3,
        luck: 0.8
      },
      abilities: [
        {
          id: 'war-charge',
          name: 'Battle Charge',
          description: 'Rush toward enemies, dealing damage and stunning them briefly.',
          unlockLevel: 1,
          cooldown: 30,
          effect: 'Damage and stun enemies in a straight line'
        },
        {
          id: 'war-shout',
          name: 'Battle Shout',
          description: 'Boost the morale and strength of all nearby allies.',
          unlockLevel: 3,
          cooldown: 60,
          effect: '+15% Strength for nearby allies for 30 seconds'
        },
        {
          id: 'war-cleave',
          name: 'Cleaving Strike',
          description: 'A powerful swing that hits multiple enemies.',
          unlockLevel: 5,
          cooldown: 25,
          effect: 'Deal damage to all enemies in a wide arc'
        },
        {
          id: 'war-berserk',
          name: 'Berserker Rage',
          description: 'Enter a frenzied state, increasing damage but reducing defense.',
          unlockLevel: 10,
          cooldown: 120,
          effect: '+30% Damage, -15% Defense for 20 seconds'
        }
      ],
      skillTree: [
        {
          id: 'war-weapon-mastery',
          name: 'Weapon Mastery',
          description: 'Increases damage with all weapons.',
          icon: '⚔️',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'damage',
              value: 5,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'war-toughness',
          name: 'Toughness',
          description: 'Increases maximum health.',
          icon: '🛡️',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'health',
              value: 10,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'war-critical-strike',
          name: 'Critical Strike',
          description: 'Increases chance of landing critical hits.',
          icon: '💥',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'critChance',
              value: 3,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['war-weapon-mastery'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'war-defender',
          name: 'Defender',
          description: 'Reduces damage taken from all sources.',
          icon: '🔰',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'damageReduction',
              value: 5,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['war-toughness'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'war-berserker',
          name: 'Berserker',
          description: 'Gain increased damage the lower your health gets.',
          icon: '😡',
          levelRequired: 10,
          pointCost: 3,
          bonuses: [
            {
              stat: 'lowHealthDamage',
              value: 10,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['war-critical-strike'],
          unlocked: false,
          maxRank: 2,
          currentRank: 0
        }
      ]
    },
    mage: {
      className: 'mage',
      description: 'Masters of arcane magic who can control the elements and cast powerful spells.',
      baseStats: {
        strength: 6,
        intelligence: 15,
        dexterity: 9,
        constitution: 8,
        luck: 12
      },
      growthRates: {
        strength: 0.6,
        intelligence: 1.7,
        dexterity: 0.9,
        constitution: 0.8,
        luck: 1.2
      },
      abilities: [
        {
          id: 'mage-fireball',
          name: 'Fireball',
          description: 'Launch a ball of fire that explodes on impact.',
          unlockLevel: 1,
          cooldown: 15,
          effect: 'Fire damage + area effect'
        },
        {
          id: 'mage-frostbolt',
          name: 'Frost Bolt',
          description: 'Fire a bolt of ice that slows enemies.',
          unlockLevel: 3,
          cooldown: 18,
          effect: 'Ice damage + slow effect'
        },
        {
          id: 'mage-teleport',
          name: 'Teleport',
          description: 'Instantly teleport a short distance.',
          unlockLevel: 5,
          cooldown: 45,
          effect: 'Teleport up to 20 meters'
        },
        {
          id: 'mage-meteor',
          name: 'Meteor Storm',
          description: 'Call down a shower of meteors on your enemies.',
          unlockLevel: 10,
          cooldown: 180,
          effect: 'Massive area damage over 5 seconds'
        }
      ],
      skillTree: [
        {
          id: 'mage-arcane-power',
          name: 'Arcane Power',
          description: 'Increases spell damage.',
          icon: '✨',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'spellDamage',
              value: 5,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'mage-mana-pool',
          name: 'Mana Pool',
          description: 'Increases maximum mana.',
          icon: '🔵',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'mana',
              value: 10,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'mage-elemental-mastery',
          name: 'Elemental Mastery',
          description: 'Increases damage with elemental spells.',
          icon: '🔮',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'elementalDamage',
              value: 8,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['mage-arcane-power'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'mage-mana-efficiency',
          name: 'Mana Efficiency',
          description: 'Reduces mana cost of all spells.',
          icon: '📘',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'manaCost',
              value: -5,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['mage-mana-pool'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'mage-archmage',
          name: 'Archmage',
          description: 'Powerful spells have a chance to cost no mana.',
          icon: '👑',
          levelRequired: 10,
          pointCost: 3,
          bonuses: [
            {
              stat: 'freeSpellChance',
              value: 10,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['mage-elemental-mastery'],
          unlocked: false,
          maxRank: 2,
          currentRank: 0
        }
      ]
    },
    archer: {
      className: 'archer',
      description: 'Masters of ranged combat who excel at precision attacks from a distance.',
      baseStats: {
        strength: 9,
        intelligence: 10,
        dexterity: 15,
        constitution: 9,
        luck: 12
      },
      growthRates: {
        strength: 0.9,
        intelligence: 1.0,
        dexterity: 1.6,
        constitution: 0.9,
        luck: 1.2
      },
      abilities: [
        {
          id: 'arch-aimed-shot',
          name: 'Aimed Shot',
          description: 'A carefully aimed shot that deals increased damage.',
          unlockLevel: 1,
          cooldown: 20,
          effect: 'Deal 50% more damage with a single shot'
        },
        {
          id: 'arch-multi-shot',
          name: 'Multi-Shot',
          description: 'Fire multiple arrows at once in a cone.',
          unlockLevel: 3,
          cooldown: 30,
          effect: 'Fire 3 arrows in a cone pattern'
        },
        {
          id: 'arch-trap',
          name: 'Hunter\'s Trap',
          description: 'Place a trap that snares enemies who step on it.',
          unlockLevel: 5,
          cooldown: 45,
          effect: 'Immobilize enemies for 4 seconds'
        },
        {
          id: 'arch-rain',
          name: 'Arrow Rain',
          description: 'Call down a rain of arrows on an area.',
          unlockLevel: 10,
          cooldown: 150,
          effect: 'Area damage over 8 seconds'
        }
      ],
      skillTree: [
        {
          id: 'arch-marksmanship',
          name: 'Marksmanship',
          description: 'Increases ranged damage.',
          icon: '🏹',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'rangedDamage',
              value: 5,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'arch-agility',
          name: 'Agility',
          description: 'Increases movement speed.',
          icon: '👟',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'movementSpeed',
              value: 5,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'arch-deadly-aim',
          name: 'Deadly Aim',
          description: 'Increases critical hit chance with ranged attacks.',
          icon: '🎯',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'rangedCritChance',
              value: 5,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['arch-marksmanship'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'arch-evasion',
          name: 'Evasion',
          description: 'Chance to dodge incoming attacks.',
          icon: '💨',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'dodgeChance',
              value: 3,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['arch-agility'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'arch-sniper',
          name: 'Sniper',
          description: 'Increases damage done the further you are from your target.',
          icon: '🔭',
          levelRequired: 10,
          pointCost: 3,
          bonuses: [
            {
              stat: 'rangeDamageBonus',
              value: 2,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['arch-deadly-aim'],
          unlocked: false,
          maxRank: 2,
          currentRank: 0
        }
      ]
    },
    rogue: {
      className: 'rogue',
      description: 'Masters of stealth and subterfuge who excel at quick, precise attacks.',
      baseStats: {
        strength: 10,
        intelligence: 10,
        dexterity: 14,
        constitution: 8,
        luck: 13
      },
      growthRates: {
        strength: 1.0,
        intelligence: 1.0,
        dexterity: 1.5,
        constitution: 0.8,
        luck: 1.4
      },
      abilities: [
        {
          id: 'rogue-backstab',
          name: 'Backstab',
          description: 'A devastating attack from behind that deals bonus damage.',
          unlockLevel: 1,
          cooldown: 25,
          effect: 'Deal 100% more damage from behind'
        },
        {
          id: 'rogue-stealth',
          name: 'Stealth',
          description: 'Become invisible to enemies until you attack.',
          unlockLevel: 3,
          cooldown: 60,
          effect: 'Enter stealth mode for up to 30 seconds'
        },
        {
          id: 'rogue-poison',
          name: 'Deadly Poison',
          description: 'Coat your weapons with poison that damages over time.',
          unlockLevel: 5,
          cooldown: 45,
          effect: 'Add poison damage to attacks for 20 seconds'
        },
        {
          id: 'rogue-vanish',
          name: 'Vanish',
          description: 'Instantly break combat and enter stealth, dropping all threat.',
          unlockLevel: 10,
          cooldown: 180,
          effect: 'Instant stealth and combat reset'
        }
      ],
      skillTree: [
        {
          id: 'rogue-lethality',
          name: 'Lethality',
          description: 'Increases damage from stealth and critical strikes.',
          icon: '🗡️',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'critDamage',
              value: 5,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'rogue-shadow-arts',
          name: 'Shadow Arts',
          description: 'Improves stealth and stealth recovery.',
          icon: '🌑',
          levelRequired: 3,
          pointCost: 1,
          bonuses: [
            {
              stat: 'stealthDuration',
              value: 10,
              isPercentage: true
            }
          ],
          unlocked: false,
          maxRank: 5,
          currentRank: 0
        },
        {
          id: 'rogue-deadly-brew',
          name: 'Deadly Brew',
          description: 'Improves poison damage and duration.',
          icon: '☠️',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'poisonDamage',
              value: 10,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['rogue-lethality'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'rogue-fleet-foot',
          name: 'Fleet of Foot',
          description: 'Increases movement speed and reduces fall damage.',
          icon: '👣',
          levelRequired: 5,
          pointCost: 2,
          bonuses: [
            {
              stat: 'movementSpeed',
              value: 7,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['rogue-shadow-arts'],
          unlocked: false,
          maxRank: 3,
          currentRank: 0
        },
        {
          id: 'rogue-assassin',
          name: 'Assassin',
          description: 'Your first attack from stealth always critically hits.',
          icon: '⚰️',
          levelRequired: 10,
          pointCost: 3,
          bonuses: [
            {
              stat: 'stealthCritChance',
              value: 100,
              isPercentage: true
            }
          ],
          prerequisiteSkills: ['rogue-deadly-brew'],
          unlocked: false,
          maxRank: 1,
          currentRank: 0
        }
      ]
    }
  };
  
  // Clan level progression table
  export const CLAN_LEVELS: ClanLevel[] = [
    {
      level: 1,
      xpRequired: 0,
      totalXpRequired: 0,
      memberSlots: 5,
      bonuses: [
        {
          name: "Base Bonus",
          description: "Basic clan formation bonus",
          type: "stat",
          value: 2 // 2% stat boost
        }
      ]
    },
    {
      level: 2,
      xpRequired: 500,
      totalXpRequired: 500,
      memberSlots: 8,
      bonuses: [
        {
          name: "Enhanced Stats",
          description: "Improved stat boost for all members",
          type: "stat",
          value: 5 // 5% stat boost
        }
      ]
    },
    {
      level: 3,
      xpRequired: 1200,
      totalXpRequired: 1700,
      memberSlots: 12,
      bonuses: [
        {
          name: "XP Bonus",
          description: "Clan members earn additional XP",
          type: "reward",
          value: 5 // 5% XP boost
        },
        {
          name: "Resource Bonus",
          description: "Increased resource gathering",
          type: "resource",
          value: 10 // 10% more resources
        }
      ]
    },
    {
      level: 4,
      xpRequired: 2500,
      totalXpRequired: 4200,
      memberSlots: 15,
      bonuses: [
        {
          name: "Enhanced Stats II",
          description: "Further stat improvements",
          type: "stat",
          value: 8 // 8% stat boost
        }
      ]
    },
    {
      level: 5,
      xpRequired: 5000,
      totalXpRequired: 9200,
      memberSlots: 20,
      bonuses: [
        {
          name: "Clan Specialization",
          description: "Unlocks clan specialization choices",
          type: "reward",
          value: 1
        },
        {
          name: "XP Bonus II",
          description: "Enhanced XP gain for members",
          type: "reward",
          value: 10 // 10% XP boost
        }
      ]
    },
    {
      level: 6,
      xpRequired: 8000,
      totalXpRequired: 17200,
      memberSlots: 25,
      bonuses: [
        {
          name: "Enhanced Stats III",
          description: "Major stat improvements",
          type: "stat",
          value: 12 // 12% stat boost
        }
      ]
    },
    {
      level: 7,
      xpRequired: 12000,
      totalXpRequired: 29200,
      memberSlots: 30,
      bonuses: [
        {
          name: "Resource Bonus II",
          description: "Greatly increased resource gathering",
          type: "resource",
          value: 25 // 25% more resources
        }
      ]
    },
    {
      level: 8,
      xpRequired: 18000,
      totalXpRequired: 47200,
      memberSlots: 35,
      bonuses: [
        {
          name: "Clan War Advantage",
          description: "Bonus during clan wars",
          type: "stat",
          value: 15 // 15% advantage
        }
      ]
    },
    {
      level: 9,
      xpRequired: 25000,
      totalXpRequired: 72200,
      memberSlots: 40,
      bonuses: [
        {
          name: "XP Bonus III",
          description: "Major XP gain for members",
          type: "reward",
          value: 15 // 15% XP boost
        }
      ]
    },
    {
      level: 10,
      xpRequired: 35000,
      totalXpRequired: 107200,
      memberSlots: 50,
      bonuses: [
        {
          name: "Clan Headquarters",
          description: "Unlocks customizable clan HQ",
          type: "reward",
          value: 1
        },
        {
          name: "Enhanced Stats IV",
          description: "Maximum stat improvements",
          type: "stat",
          value: 20 // 20% stat boost
        }
      ]
    }
  ];
  
  // Character level progression (base values, modified by class)
  export const CHARACTER_LEVELS: CharacterLevel[] = [
    {
      level: 1,
      xpRequired: 0,
      totalXpRequired: 0,
      stats: {
        strength: 10,
        intelligence: 10,
        dexterity: 10,
        constitution: 10,
        luck: 10
      },
      skillPoints: 0
    },
    {
      level: 2,
      xpRequired: 100,
      totalXpRequired: 100,
      stats: {
        strength: 12,
        intelligence: 12,
        dexterity: 12,
        constitution: 12,
        luck: 11
      },
      skillPoints: 1
    },
    {
      level: 3,
      xpRequired: 250,
      totalXpRequired: 350,
      stats: {
        strength: 14,
        intelligence: 14,
        dexterity: 14,
        constitution: 14,
        luck: 12
      },
      skillPoints: 1
    },
    {
      level: 4,
      xpRequired: 400,
      totalXpRequired: 750,
      stats: {
        strength: 16,
        intelligence: 16,
        dexterity: 16,
        constitution: 16,
        luck: 13
      },
      skillPoints: 1
    },
    {
      level: 5,
      xpRequired: 700,
      totalXpRequired: 1450,
      stats: {
        strength: 18,
        intelligence: 18,
        dexterity: 18,
        constitution: 18,
        luck: 14
      },
      skillPoints: 2
    },
    {
      level: 6,
      xpRequired: 1000,
      totalXpRequired: 2450,
      stats: {
        strength: 20,
        intelligence: 20,
        dexterity: 20,
        constitution: 20,
        luck: 15
      },
      skillPoints: 1
    },
    {
      level: 7,
      xpRequired: 1500,
      totalXpRequired: 3950,
      stats: {
        strength: 22,
        intelligence: 22,
        dexterity: 22,
        constitution: 22, 
        luck: 16
      },
      skillPoints: 1
    },
    {
      level: 8,
      xpRequired: 2000,
      totalXpRequired: 5950,
      stats: {
        strength: 24,
        intelligence: 24,
        dexterity: 24,
        constitution: 24,
        luck: 17
      },
      skillPoints: 1
    },
    {
      level: 9,
      xpRequired: 2700,
      totalXpRequired: 8650,
      stats: {
        strength: 26,
        intelligence: 26,
        dexterity: 26,
        constitution: 26,
        luck: 18
      },
      skillPoints: 1
    },
    {
      level: 10,
      xpRequired: 3500,
      totalXpRequired: 12150,
      stats: {
        strength: 30,
        intelligence: 30,
        dexterity: 30,
        constitution: 30,
        luck: 20
      },
      skillPoints: 3
    },
    {
      level: 15,
      xpRequired: 10000,
      totalXpRequired: 40000,
      stats: {
        strength: 45,
        intelligence: 45,
        dexterity: 45,
        constitution: 45,
        luck: 25
      },
      skillPoints: 5
    },
    {
      level: 20,
      xpRequired: 25000,
      totalXpRequired: 100000,
      stats: {
        strength: 60,
        intelligence: 60,
        dexterity: 60,
        constitution: 60,
        luck: 30
      },
      skillPoints: 5
    }
  ];