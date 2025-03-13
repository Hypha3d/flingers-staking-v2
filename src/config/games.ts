// src/config/games.ts

// Define game status types
export type GameStatus = 'development' | 'alpha' | 'beta' | 'release';

// Define game category types
export type GameCategory = 'staking' | 'minigame' | 'online' | 'release';

// Define update/devlog entry
export interface DevlogEntry {
  date: string; // Format: YYYY-MM-DD
  title: string;
  content: string;
  version?: string;
}

// Define game interface
export interface Game {
  id: string; // Unique identifier for the game
  title: string;
  description: string;
  longDescription?: string;
  icon: string;
  players: number;
  points: number;
  status: GameStatus;
  category: GameCategory;
  comingSoon?: boolean;
  releaseDate?: string; // Format: YYYY-MM-DD or "TBC"
  lastUpdated?: string; // Format: YYYY-MM-DD
  devlogs?: DevlogEntry[];
}

// Export the list of games
export const GAMES: Game[] = [
  {
    id: "hordes",
    title: 'Minigame: Hordes',
    description: 'Roll the dice and multiply your points. Risk it all for the highest rewards!',
    longDescription: 'Hordes is a dice-based minigame where you battle against increasingly difficult waves of monsters. Each successful wave completed earns you points, but the difficulty increases with each wave. How far can you go?',
    icon: '🎲',
    players: 1245,
    points: 500,
    status: 'beta',
    category: 'minigame',
    releaseDate: '2024-12-15',
    lastUpdated: '2025-02-28',
    devlogs: [
      {
        date: '2025-02-28',
        title: 'Special Events Added',
        version: '0.8.5',
        content: 'Added special holiday events with unique monsters and rewards. Fixed several bugs related to wave progression. Improved UI responsiveness on mobile devices.'
      },
      {
        date: '2025-01-20',
        title: 'Balance Update',
        version: '0.8.0',
        content: 'Rebalanced monster difficulty progression. Increased rewards for higher waves. Added new monster types with special abilities.'
      },
      {
        date: '2024-12-15',
        title: 'Beta Launch',
        version: '0.7.0',
        content: 'Initial beta release of Hordes. Basic gameplay mechanics implemented. Players can progress through waves of monsters and earn points based on performance.'
      }
    ]
  },
  {
    id: "lucky-spinner",
    title: 'Minigame: Lucky Spinner',
    description: 'Spin the wheel for a chance to win big rewards! Different segments offer different point multipliers.',
    longDescription: 'Test your luck with the Lucky Spinner minigame. Each spin costs points, but landing on the right segment can multiply your investment many times over. Special segments unlock temporary multipliers for your staking rewards!',
    icon: '🎡',
    players: 834,
    points: 750,
    status: 'alpha',
    category: 'minigame',
    releaseDate: '2025-01-10',
    lastUpdated: '2025-03-05',
    devlogs: [
      {
        date: '2025-03-05',
        title: 'New Rewards Added',
        version: '0.5.2',
        content: 'Added new special reward segments including NFT rewards and staking multipliers. Fixed animation issues on different devices.'
      },
      {
        date: '2025-02-02',
        title: 'UI Improvements',
        version: '0.4.8',
        content: 'Complete visual overhaul of the spinner. Added sound effects and haptic feedback. Improved result animations.'
      },
      {
        date: '2025-01-10',
        title: 'Alpha Launch',
        version: '0.4.0',
        content: 'Initial alpha release with basic spinning mechanics and rewards system. Limited time offers added to celebrate the launch.'
      }
    ]
  },
  {
    id: "shithead",
    title: 'Shit Head',
    description: 'Play the classic card game against other players. Be the first to empty your hand to win points!',
    longDescription: 'Shit Head is a popular multiplayer card game. The goal is to be the first player to get rid of all your cards. Special cards have special effects. Win to earn points, with bonuses for perfect plays and win streaks.',
    icon: '🃏',
    players: 834,
    points: 750,
    status: 'development',
    category: 'staking',
    releaseDate: 'TBC',
    devlogs: [
      {
        date: '2025-03-01',
        title: 'Development Update',
        content: 'Card design finalized. Basic game mechanics implemented. Currently working on multiplayer functionality and staking system integration.'
      }
    ]
  },
  {
    id: "nft-poker",
    title: 'Staking Game: NFT Poker',
    description: 'Use your NFTs as poker chips in this high-stakes card game!',
    longDescription: 'NFT Poker allows you to use your Flingers NFTs in a high-stakes poker game. Each NFT has a base value based on its rarity, and you can win other players\' NFTs or points. Special tournament events will be held weekly with larger prize pools.',
    icon: '♠️',
    players: 412,
    points: 1200,
    status: 'development',
    category: 'staking',
    releaseDate: 'TBC',
    devlogs: [
      {
        date: '2025-02-15',
        title: 'Development Update',
        content: 'Staking system prototype completed. Working on card mechanics and NFT valuation algorithms. Planning alpha testing for Q2 2025.'
      }
    ]
  },
  {
    id: "fling-off",
    title: 'Multiplayer: Fling-Off',
    description: 'Compete against other players in this fast-paced action game. Last player standing wins!',
    longDescription: 'Fling-Off is a battle royale style game where Flingers face off against each other. Use special abilities based on your NFT attributes, collect power-ups, and be the last one standing to earn massive point rewards. Limited-time events and seasons will offer exclusive rewards.',
    icon: '🚀',
    players: 2145,
    points: 1350,
    status: 'alpha',
    category: 'online',
    releaseDate: '2024-11-30',
    lastUpdated: '2025-03-10',
    devlogs: [
      {
        date: '2025-03-10',
        title: 'Season 2 Launch',
        version: '0.6.0',
        content: 'Season 2 begins! New map added with volcanic terrain. Added new power-ups and special abilities. First tournament scheduled for March 20.'
      },
      {
        date: '2025-01-15',
        title: 'Major Update',
        version: '0.5.0',
        content: 'Added ranking system. Fixed server stability issues. Introduced new cosmetic rewards for top players. Season 1 concludes at the end of February.'
      },
      {
        date: '2024-12-20',
        title: 'Holiday Update',
        version: '0.4.2',
        content: 'Special holiday-themed map and limited-time power-ups added. Fixed various bugs and improved matchmaking.'
      },
      {
        date: '2024-11-30',
        title: 'Alpha Launch',
        version: '0.4.0',
        content: 'Initial alpha release with core battle royale gameplay. One map available with basic power-ups. Limited to 50 players per match.'
      }
    ]
  },
  {
    id: "rpg",
    title: 'Flingers: RPG',
    description: 'Embark on a full RPG adventure. Complete quests, battle monsters, and level up your Flinger.',
    longDescription: 'Flingers RPG is our flagship game, offering a full-fledged RPG experience. Your Flinger NFT becomes your character, with unique abilities based on its attributes. Explore vast lands, complete quests, battle monsters, and interact with other players in this immersive experience. Progress is saved to the blockchain, and your achievements earn you points and exclusive items.',
    icon: '⚔️',
    players: 976,
    points: 2000,
    status: 'development',
    category: 'release',
    releaseDate: '2025-09-30',
    comingSoon: true,
    devlogs: [
      {
        date: '2025-03-01',
        title: 'Development Update',
        content: 'First zone map completed. Character progression system in testing. Core combat mechanics implemented. Working on quest system and NPC interactions.'
      },
      {
        date: '2025-01-15',
        title: 'Development Kickoff',
        content: 'Full development of Flingers RPG has officially begun! Design documents finalized and team assembled. Targeting Q3 2025 for beta release.'
      }
    ]
  },
];