// src/config/tasks-quests.ts

import { GAMES, Game } from './games';

// Base interfaces
export interface BaseTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: {
    xp: number;
    items?: string[];
    currency?: number;
  };
  available: boolean;
  completed: boolean;
}

export interface Task extends BaseTask {
  type: 'onboarding' | 'progression' | 'community';
  prerequisiteTaskIds?: string[];
}

export interface QuestPeriod {
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface Quest extends BaseTask {
  gameId?: string; // Optional link to a specific game
  type: 'daily' | 'weekly' | 'monthly' | 'story' | 'side';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  period?: QuestPeriod; // For time-limited quests
  steps?: {
    id: string;
    description: string;
    completed: boolean;
  }[];
  prerequisiteQuestIds?: string[];
}

// Player Tasks - for onboarding and account setup
export const ONBOARDING_TASKS: Task[] = [
  {
    id: 'create-profile',
    title: 'Create a Player Profile',
    description: 'Set up your player profile to start your journey',
    icon: '👤',
    reward: {
      xp: 100
    },
    type: 'onboarding',
    available: true,
    completed: false
  },
  {
    id: 'create-clan',
    title: 'Create a Clan',
    description: 'Form a clan to unite warriors under your banner',
    icon: '🛡️',
    reward: {
      xp: 200
    },
    type: 'onboarding',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['create-profile']
  },
  {
    id: 'create-character',
    title: 'Create your first Character',
    description: 'Transform one of your NFTs into a playable character',
    icon: '🧙',
    reward: {
      xp: 150
    },
    type: 'onboarding',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['create-profile']
  },
  {
    id: 'play-first-game',
    title: 'Play your first Game',
    description: 'Enter one of the games with your character',
    icon: '🎮',
    reward: {
      xp: 250
    },
    type: 'onboarding',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['create-character']
  }
];

export const PROGRESSION_TASKS: Task[] = [
  {
    id: 'reach-level-5',
    title: 'Reach Player Level 5',
    description: 'Level up your player profile to unlock more features',
    icon: '📈',
    reward: {
      xp: 300,
      items: ['Basic Loot Box']
    },
    type: 'progression',
    available: true,
    completed: false,
    prerequisiteTaskIds: ['create-profile']
  },
  {
    id: 'reach-clan-level-3',
    title: 'Reach Clan Level 3',
    description: 'Grow your clan to unlock clan perks',
    icon: '🏰',
    reward: {
      xp: 350,
      items: ['Clan Banner Customization']
    },
    type: 'progression',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['create-clan']
  },
  {
    id: 'character-level-10',
    title: 'Level up a Character to 10',
    description: 'Advance a character to unlock specialized skills',
    icon: '⚔️',
    reward: {
      xp: 400,
      items: ['Character Cosmetic']
    },
    type: 'progression',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['create-character']
  },
  {
    id: 'create-second-clan',
    title: 'Create a Second Clan',
    description: 'Expand your influence by creating an additional clan',
    icon: '👑',
    reward: {
      xp: 500,
      items: ['Clan Emblem']
    },
    type: 'progression',
    available: false,
    completed: false,
    prerequisiteTaskIds: ['reach-level-5']
  }
];

export const COMMUNITY_TASKS: Task[] = [
  {
    id: 'invite-friend',
    title: 'Invite a Friend',
    description: 'Invite a friend to join the game',
    icon: '👥',
    reward: {
      xp: 150,
      currency: 100
    },
    type: 'community',
    available: true,
    completed: false,
    prerequisiteTaskIds: ['create-profile']
  },
  {
    id: 'join-discord',
    title: 'Join our Discord',
    description: 'Connect with the community on Discord',
    icon: '💬',
    reward: {
      xp: 100,
      items: ['Discord Badge']
    },
    type: 'community',
    available: true,
    completed: false,
    prerequisiteTaskIds: ['create-profile']
  }
];

// Daily Quests
export const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily-login',
    title: 'Daily Login',
    description: 'Log in to the game today',
    icon: '🌟',
    reward: {
      xp: 50,
      currency: 25
    },
    type: 'daily',
    difficulty: 'easy',
    available: true,
    completed: false,
    period: {
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    }
  },
  {
    id: 'daily-hordes',
    title: 'Daily Dice Roll',
    description: 'Play a round of Hordes today',
    icon: '🎲',
    gameId: 'hordes',
    reward: {
      xp: 75,
      currency: 40
    },
    type: 'daily',
    difficulty: 'easy',
    available: true,
    completed: false,
    period: {
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    }
  },
  {
    id: 'daily-spinner',
    title: 'Try Your Luck',
    description: 'Spin the Lucky Spinner at least once',
    icon: '🎡',
    gameId: 'lucky-spinner',
    reward: {
      xp: 60,
      currency: 30
    },
    type: 'daily',
    difficulty: 'easy',
    available: true,
    completed: false,
    period: {
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    }
  },
  {
    id: 'daily-fling-off',
    title: 'Battle Ready',
    description: 'Play a match of Fling-Off',
    icon: '🚀',
    gameId: 'fling-off',
    reward: {
      xp: 100,
      currency: 50
    },
    type: 'daily',
    difficulty: 'medium',
    available: true,
    completed: false,
    period: {
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    }
  }
];

// Weekly Quests
export const WEEKLY_QUESTS: Quest[] = [
  {
    id: 'weekly-win-5',
    title: 'Weekly Champion',
    description: 'Win 5 games in any mode this week',
    icon: '🏆',
    reward: {
      xp: 300,
      currency: 150,
      items: ['Rare Loot Box']
    },
    type: 'weekly',
    difficulty: 'medium',
    available: true,
    completed: false,
    period: {
      startTime: getWeekStartDate().toISOString(),
      endTime: getWeekEndDate().toISOString()
    }
  },
  {
    id: 'weekly-fling-off-tournament',
    title: 'Tournament Contender',
    description: 'Participate in this week\'s Fling-Off tournament',
    icon: '🏅',
    gameId: 'fling-off',
    reward: {
      xp: 500,
      currency: 250,
      items: ['Tournament Badge']
    },
    type: 'weekly',
    difficulty: 'hard',
    available: true,
    completed: false,
    period: {
      startTime: getWeekStartDate().toISOString(),
      endTime: getWeekEndDate().toISOString()
    }
  },
  {
    id: 'weekly-clan-contribution',
    title: 'Clan Contributor',
    description: 'Contribute 500 points to your clan this week',
    icon: '🛡️',
    reward: {
      xp: 400,
      currency: 200,
      items: ['Clan XP Boost']
    },
    type: 'weekly',
    difficulty: 'medium',
    available: true,
    completed: false,
    period: {
      startTime: getWeekStartDate().toISOString(),
      endTime: getWeekEndDate().toISOString()
    }
  }
];

// Monthly Quests
export const MONTHLY_QUESTS: Quest[] = [
  {
    id: 'monthly-character-advancement',
    title: 'Character Growth',
    description: 'Level up a character at least 5 times this month',
    icon: '📊',
    reward: {
      xp: 1000,
      currency: 500,
      items: ['Epic Loot Box', 'Character XP Boost']
    },
    type: 'monthly',
    difficulty: 'hard',
    available: true,
    completed: false,
    period: {
      startTime: getMonthStartDate().toISOString(),
      endTime: getMonthEndDate().toISOString()
    }
  },
  {
    id: 'monthly-clan-war',
    title: 'Clan War Veteran',
    description: 'Participate in 10 clan war battles this month',
    icon: '⚔️',
    reward: {
      xp: 1500,
      currency: 750,
      items: ['Clan Banner', 'Clan War Badge']
    },
    type: 'monthly',
    difficulty: 'epic',
    available: true,
    completed: false,
    period: {
      startTime: getMonthStartDate().toISOString(),
      endTime: getMonthEndDate().toISOString()
    }
  }
];

// Story Quests
export const STORY_QUESTS: Quest[] = [
  {
    id: 'story-introduction',
    title: 'The Flinger\'s Awakening',
    description: 'Begin your journey in the world of Flingers',
    icon: '📜',
    reward: {
      xp: 300,
      currency: 150,
      items: ['Novice Flinger\'s Handbook']
    },
    type: 'story',
    difficulty: 'easy',
    available: true,
    completed: false,
    steps: [
      {
        id: 'step1',
        description: 'Create your first character',
        completed: false
      },
      {
        id: 'step2',
        description: 'Complete the tutorial in any game',
        completed: false
      },
      {
        id: 'step3',
        description: 'Talk to the Elder in the main hub',
        completed: false
      }
    ]
  },
  {
    id: 'story-chapter1',
    title: 'Chapter 1: The Lost Artifact',
    description: 'Recover a powerful artifact that was stolen from the Elders',
    icon: '🏺',
    reward: {
      xp: 600,
      currency: 300,
      items: ['Artifact Fragment', 'Lore Book: Chapter 1']
    },
    type: 'story',
    difficulty: 'medium',
    available: false,
    completed: false,
    prerequisiteQuestIds: ['story-introduction'],
    steps: [
      {
        id: 'step1',
        description: 'Investigate the ruins in Fling-Off game',
        completed: false
      },
      {
        id: 'step2',
        description: 'Defeat the guardian in Hordes game (reach wave 10)',
        completed: false
      },
      {
        id: 'step3',
        description: 'Decipher the ancient code using the Lucky Spinner',
        completed: false
      },
      {
        id: 'step4',
        description: 'Return the artifact to the Elder',
        completed: false
      }
    ]
  }
];

// Side Quests
export const SIDE_QUESTS: Quest[] = [
  {
    id: 'side-hordes-master',
    title: 'Dice Master',
    description: 'Prove your skill at the Hordes minigame',
    icon: '🎲',
    gameId: 'hordes',
    reward: {
      xp: 250,
      currency: 125,
      items: ['Lucky Dice Charm']
    },
    type: 'side',
    difficulty: 'medium',
    available: true,
    completed: false,
    steps: [
      {
        id: 'step1',
        description: 'Reach wave 15 in Hordes',
        completed: false
      },
      {
        id: 'step2',
        description: 'Defeat the boss monster at wave 20',
        completed: false
      },
      {
        id: 'step3',
        description: 'Earn a high score of at least 10,000 points',
        completed: false
      }
    ]
  },
  {
    id: 'side-spinner-jackpot',
    title: 'Jackpot Hunter',
    description: 'Seek your fortune with the Lucky Spinner',
    icon: '🎡',
    gameId: 'lucky-spinner',
    reward: {
      xp: 200,
      currency: 100,
      items: ['Fortune Booster']
    },
    type: 'side',
    difficulty: 'easy',
    available: true,
    completed: false,
    steps: [
      {
        id: 'step1',
        description: 'Spin the Lucky Spinner 5 times',
        completed: false
      },
      {
        id: 'step2',
        description: 'Hit the jackpot at least once',
        completed: false
      }
    ]
  },
  {
    id: 'side-fling-off-virtuoso',
    title: 'Battle Virtuoso',
    description: 'Master the art of combat in Fling-Off',
    icon: '🚀',
    gameId: 'fling-off',
    reward: {
      xp: 400,
      currency: 200,
      items: ['Combat Specialist Badge', 'Rare Weapon Skin']
    },
    type: 'side',
    difficulty: 'hard',
    available: true,
    completed: false,
    steps: [
      {
        id: 'step1',
        description: 'Win 3 consecutive matches',
        completed: false
      },
      {
        id: 'step2',
        description: 'Defeat 50 opponents',
        completed: false
      },
      {
        id: 'step3',
        description: 'Finish in the top 3 positions 5 times',
        completed: false
      }
    ]
  }
];

// Helper functions to get date ranges
function getWeekStartDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for week starting on Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekEndDate(): Date {
  const startDate = getWeekStartDate();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}

function getMonthStartDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

function getMonthEndDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

// Utility function to get all available quests
export function getAllQuests(): Quest[] {
  return [
    ...DAILY_QUESTS,
    ...WEEKLY_QUESTS,
    ...MONTHLY_QUESTS,
    ...STORY_QUESTS,
    ...SIDE_QUESTS
  ];
}

// Utility function to get all tasks
export function getAllTasks(): Task[] {
  return [
    ...ONBOARDING_TASKS,
    ...PROGRESSION_TASKS,
    ...COMMUNITY_TASKS
  ];
}

// Utility function to get quest by game ID
export function getQuestsByGame(gameId: string): Quest[] {
  return getAllQuests().filter(quest => quest.gameId === gameId);
}

// Utility function to get active quests (based on current time)
export function getActiveQuests(): Quest[] {
  const now = new Date().toISOString();
  return getAllQuests().filter(quest => {
    // If it's not a time-limited quest, it's always active
    if (!quest.period) return true;
    
    // Check if the current time is within the quest period
    return quest.period.startTime <= now && quest.period.endTime >= now;
  });
}