"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

// Import config files
import { 
  getAllTasks, 
  getAllQuests, 
  getActiveQuests, 
  Task as ConfigTask, 
  Quest 
} from '@/config/tasks-quests';

import { 
  PLAYER_LEVELS, 
  CLAN_LEVELS, 
  CHARACTER_LEVELS, 
  PlayerLevel, 
  ClanLevel, 
  CharacterLevel,
  CHARACTER_CLASSES
} from '@/config/progression';

import { 
  CHARACTER_SLOTS, 
  CLAN_SLOTS, 
  CLAN_SPECIALIZATIONS, 
  getMaxBaseCharacters, 
  getCharacterSlotUnlockStatus, 
  getClanSlotUnlockStatus, 
  BASE_CHARACTER_LIMITS
} from '@/config/character-clan-relationships';

import { 
  getAvailableGames, 
  getAvailableGameModes, 
  calculateGameRewards, 
  GAME_ACHIEVEMENTS
} from '@/config/games-integration';

import { GAMES } from '@/config/games';

// Define types
interface Clan {
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

interface Character {
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

interface Task {
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

interface NFT {
  id: string;
  name: string;
  image?: string;
}

export default function PlayerHub() {
  const { profile, isAuthenticated } = useAppContext();
  
  // Player state
  const [hasPlayer, setHasPlayer] = useState(false);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXp, setPlayerXp] = useState(0);
  const [playerNextLevelXp, setPlayerNextLevelXp] = useState(100);
  const [playerCurrency, setPlayerCurrency] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState('tasks');
  const [activeTaskTab, setActiveTaskTab] = useState('onboarding');
  const [activeQuestTab, setActiveQuestTab] = useState('daily');
  const [isCreateClanModalOpen, setIsCreateClanModalOpen] = useState(false);
  const [isCreateCharModalOpen, setIsCreateCharModalOpen] = useState(false);
  const [isBaseCharModalOpen, setIsBaseCharModalOpen] = useState(false);
  const [isSkillTreeModalOpen, setIsSkillTreeModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // Form states
  const [clanName, setClanName] = useState('');
  const [clanColor, setClanColor] = useState('#6C11FF');
  const [clanSymbol, setClanSymbol] = useState('⚔️');
  const [characterName, setCharacterName] = useState('');
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [characterClass, setCharacterClass] = useState('warrior');
  
  // Data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [clans, setClans] = useState<Clan[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [unlockedCharacterSlots, setUnlockedCharacterSlots] = useState<Record<string, boolean>>({});
  const [unlockedClanSlots, setUnlockedClanSlots] = useState<Record<string, boolean>>({});
  
  // Sample NFTs
  const [ownedNfts, setOwnedNfts] = useState<NFT[]>([
    { id: '1', name: 'Flinger #1234', image: '/fallback/nfts/images/1.png' },
    { id: '2', name: 'Flinger #6789', image: '/fallback/nfts/images/2.png' },
    { id: '3', name: 'Flinger #4242', image: '/fallback/nfts/images/3.png' },
    { id: '4', name: 'Flinger #8888', image: '/fallback/nfts/images/4.png' },
    { id: '5', name: 'Flinger #9999', image: '/fallback/nfts/images/5.png' }
  ]);
  
  // Load initial data
  useEffect(() => {
    // In real implementation, this would fetch data from API/blockchain
    // For now, just using localStorage for demo purposes
    const hasExistingPlayer = localStorage.getItem('hasPlayerProfile') === 'true';
    setHasPlayer(hasExistingPlayer);
    
    if (hasExistingPlayer) {
      // Load player data
      const playerData = JSON.parse(localStorage.getItem('playerData') || '{}');
      if (playerData) {
        setPlayerLevel(playerData.level || 1);
        setPlayerXp(playerData.xp || 0);
        setPlayerNextLevelXp(playerData.nextLevelXp || 100);
        setPlayerCurrency(playerData.currency || 0);
        setCompletedTaskIds(playerData.completedTaskIds || []);
        setCompletedQuestIds(playerData.completedQuestIds || []);
        setCompletedGames(playerData.completedGames || []);
      }
      
      // Load clans
      const savedClans = JSON.parse(localStorage.getItem('playerClans') || '[]');
      setClans(savedClans);
      
      // Load characters
      const savedCharacters = JSON.parse(localStorage.getItem('playerCharacters') || '[]');
      setCharacters(savedCharacters);
    }
    
    // Initialize tasks from config
    initializeTasks();
    
    // Initialize quests from config
    initializeQuests();
    
    // Update unlocked slots
    updateUnlockedSlots();
  }, []);

  // Update tasks and quests when player level changes
  useEffect(() => {
    updateUnlockedSlots();
    updateTasksAvailability();
    updateQuestsAvailability();
  }, [playerLevel, clans, characters, completedTaskIds, completedQuestIds]);
  
  // Initialize tasks from config
  const initializeTasks = () => {
    const configTasks = getAllTasks();
    
    // Convert config tasks to UI tasks
    const uiTasks = configTasks.map(configTask => ({
      id: configTask.id,
      title: configTask.title,
      description: configTask.description,
      icon: configTask.icon,
      reward: configTask.reward,
      completed: completedTaskIds.includes(configTask.id),
      available: isTaskAvailable(configTask)
    }));
    
    setTasks(uiTasks);
  };
  
  // Initialize quests from config
  const initializeQuests = () => {
    const activeQuests = getActiveQuests();
    setQuests(activeQuests);
  };
  
  // Update unlocked slots based on player level
  const updateUnlockedSlots = () => {
    // Get character levels for checking prerequisites
    const characterLevels = characters.map(char => char.level);
    
    // Get clan levels for checking prerequisites
    const clanLevels = clans.map(clan => clan.level);
    
    // Check unlocked character slots
    const characterSlotStatus = getCharacterSlotUnlockStatus(
      playerLevel, 
      completedTaskIds, 
      completedQuestIds, 
      characterLevels
    );
    setUnlockedCharacterSlots(characterSlotStatus);
    
    // Check unlocked clan slots
    const clanSlotStatus = getClanSlotUnlockStatus(playerLevel, clanLevels);
    setUnlockedClanSlots(clanSlotStatus);
  };
  
  // Check if a task is available based on prerequisites
  const isTaskAvailable = (task: ConfigTask): boolean => {
    // If it's already completed, it's not available to do again
    if (completedTaskIds.includes(task.id)) return false;
    
    // If it has no prerequisites, it's available
    if (!task.prerequisiteTaskIds || task.prerequisiteTaskIds.length === 0) return true;
    
    // Check if all prerequisites are completed
    return task.prerequisiteTaskIds.every(prereqId => 
      completedTaskIds.includes(prereqId)
    );
  };
  
  // Update task availability
  const updateTasksAvailability = () => {
    const updatedTasks = tasks.map(task => {
      const configTask = getAllTasks().find(t => t.id === task.id);
      if (!configTask) return task;
      
      const isAvailable = isTaskAvailable(configTask);
      
      // Add action handler for available tasks
      let actionHandler;
      if (isAvailable) {
        switch (task.id) {
          case 'create-profile':
            actionHandler = createPlayerProfile;
            break;
          case 'create-clan':
            actionHandler = () => setIsCreateClanModalOpen(true);
            break;
          case 'create-character':
            actionHandler = () => setIsCreateCharModalOpen(true);
            break;
          case 'play-first-game':
            actionHandler = () => alert('Redirecting to games page...');
            break;
          default:
            actionHandler = () => completeTask(task.id);
            break;
        }
      }
      
      return {
        ...task,
        available: isAvailable,
        action: actionHandler
      };
    });
    
    setTasks(updatedTasks);
  };
  
  // Update quest availability
  const updateQuestsAvailability = () => {
    // Similar implementation to updateTasksAvailability
    // For quests, check period validity and prerequisites
  };
  
  // Create player profile
  const createPlayerProfile = () => {
    localStorage.setItem('hasPlayerProfile', 'true');
    
    const playerData = {
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      currency: 0,
      completedTaskIds: [],
      completedQuestIds: [],
      completedGames: []
    };
    localStorage.setItem('playerData', JSON.stringify(playerData));
    
    setHasPlayer(true);
    
    // Complete the create profile task
    completeTask('create-profile');
  };
  
  // Complete a task
  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Add to completed tasks
    const newCompletedTaskIds = [...completedTaskIds, taskId];
    setCompletedTaskIds(newCompletedTaskIds);
    
    // Award XP & currency
    addPlayerXp(task.reward.xp);
    if (task.reward.currency) {
      addPlayerCurrency(task.reward.currency);
    }
    
    // Update task completed status
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: true, available: false } : t
    );
    setTasks(updatedTasks);
    
    // Save to localStorage
    const playerData = {
      level: playerLevel,
      xp: playerXp + task.reward.xp,
      nextLevelXp: playerNextLevelXp,
      currency: playerCurrency + (task.reward.currency || 0),
      completedTaskIds: newCompletedTaskIds,
      completedQuestIds,
      completedGames
    };
    localStorage.setItem('playerData', JSON.stringify(playerData));
  };
  
  // Complete a quest
  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    
    // Add to completed quests
    const newCompletedQuestIds = [...completedQuestIds, questId];
    setCompletedQuestIds(newCompletedQuestIds);
    
    // Award XP & currency
    addPlayerXp(quest.reward.xp);
    if (quest.reward.currency) {
      addPlayerCurrency(quest.reward.currency);
    }
    
    // Save to localStorage
    const playerData = {
      level: playerLevel,
      xp: playerXp + quest.reward.xp,
      nextLevelXp: playerNextLevelXp,
      currency: playerCurrency + (quest.reward.currency || 0),
      completedTaskIds,
      completedQuestIds: newCompletedQuestIds,
      completedGames
    };
    localStorage.setItem('playerData', JSON.stringify(playerData));
  };
  
  // Add XP to player
  const addPlayerXp = (amount: number) => {
    let newXp = playerXp + amount;
    let newLevel = playerLevel;
    let nextXp = playerNextLevelXp;
    
    // Check if player leveled up
    const currentLevelData = PLAYER_LEVELS.find(l => l.level === playerLevel);
    const nextLevelData = PLAYER_LEVELS.find(l => l.level === playerLevel + 1);
    
    if (nextLevelData && newXp >= nextLevelData.totalXpRequired) {
      // Level up
      newLevel += 1;
      nextXp = nextLevelData.xpRequired;
      
      // Show level up notification
      alert(`Congratulations! You've reached level ${newLevel}!`);
      
      // Check for new unlocks
      const unlocks = nextLevelData.unlocks;
      if (unlocks.length > 0) {
        const unlockMessages = unlocks.map(u => u.description).join('\n- ');
        alert(`You've unlocked:\n- ${unlockMessages}`);
      }
    }
    
    setPlayerXp(newXp);
    setPlayerLevel(newLevel);
    setPlayerNextLevelXp(nextXp);
  };
  
  // Add currency to player
  const addPlayerCurrency = (amount: number) => {
    const newCurrency = playerCurrency + amount;
    setPlayerCurrency(newCurrency);
  };
  
  // Create a new clan
  const handleCreateClan = () => {
    if (!clanName.trim()) {
      alert('Please enter a clan name');
      return;
    }
    
    // Check if player has reached clan limit
    const unlockedClanCount = Object.values(unlockedClanSlots).filter(Boolean).length;
    if (clans.length >= unlockedClanCount) {
      alert(`You've reached your clan limit. Reach a higher player level to create more clans.`);
      return;
    }
    
    const newClan: Clan = {
      id: `clan-${Date.now()}`,
      name: clanName,
      color: clanColor,
      symbol: clanSymbol,
      membersCount: 1,
      level: 1,
      xp: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedClans = [...clans, newClan];
    setClans(updatedClans);
    
    // Save to local storage
    localStorage.setItem('playerClans', JSON.stringify(updatedClans));
    
    // Mark task as completed if appropriate
    if (completedTaskIds.indexOf('create-clan') === -1) {
      completeTask('create-clan');
    }
    
    // Reset form and close modal
    setClanName('');
    setClanColor('#6C11FF');
    setClanSymbol('⚔️');
    setIsCreateClanModalOpen(false);
  };
  
  // Create a new character from NFT
  const handleCreateCharacter = () => {
    if (!characterName.trim() || !selectedNft) {
      alert('Please enter a character name and select an NFT');
      return;
    }
    
    // Check if player has reached character limit
    const unlockedCharCount = Object.values(unlockedCharacterSlots).filter(Boolean).length;
    if (characters.length >= unlockedCharCount) {
      alert(`You've reached your character limit. Reach a higher player level to create more characters.`);
      return;
    }
    
    // Get base stats for the class
    const classData = CHARACTER_CLASSES[characterClass as keyof typeof CHARACTER_CLASSES];
    
    const newCharacter: Character = {
      id: `char-${Date.now()}`,
      name: characterName,
      level: 1,
      xp: 0,
      class: characterClass,
      isBase: false,
      clan: clans.length > 0 ? clans[0].id : undefined,
      nftId: selectedNft.id,
      image: selectedNft.image,
      skillPoints: 0,
      stats: { ...classData.baseStats },
      unlockedSkills: []
    };
    
    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    
    // Save to local storage
    localStorage.setItem('playerCharacters', JSON.stringify(updatedCharacters));
    
    // Mark task as completed if appropriate
    if (completedTaskIds.indexOf('create-character') === -1) {
      completeTask('create-character');
    }
    
    // Reset form and close modal
    setCharacterName('');
    setSelectedNft(null);
    setCharacterClass('warrior');
    setIsCreateCharModalOpen(false);
  };
  
  // Create a base character
  const handleCreateBaseChar = () => {
    if (!characterName.trim()) {
      alert('Please enter a character name');
      return;
    }
    
    // Check if player has reached base character limit
    const maxBaseChars = getMaxBaseCharacters(playerLevel);
    const currentBaseChars = characters.filter(c => c.isBase).length;
    
    if (currentBaseChars >= maxBaseChars) {
      alert(`You've reached your base character limit. Reach a higher player level to create more base characters.`);
      return;
    }
    
    // Get base stats for the class
    const classData = CHARACTER_CLASSES[characterClass as keyof typeof CHARACTER_CLASSES];
    
    const newCharacter: Character = {
      id: `base-char-${Date.now()}`,
      name: characterName,
      level: 1,
      xp: 0,
      class: characterClass,
      isBase: true,
      clan: clans.length > 0 ? clans[0].id : undefined,
      image: `/base-characters/${characterClass}.png`,
      skillPoints: 0,
      stats: {
        // Base characters have lower stats
        strength: Math.round(classData.baseStats.strength * 0.8),
        intelligence: Math.round(classData.baseStats.intelligence * 0.8),
        dexterity: Math.round(classData.baseStats.dexterity * 0.8),
        constitution: Math.round(classData.baseStats.constitution * 0.8),
        luck: Math.round(classData.baseStats.luck * 0.8)
      },
      unlockedSkills: []
    };
    
    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    
    // Save to local storage
    localStorage.setItem('playerCharacters', JSON.stringify(updatedCharacters));
    
    // Mark task as completed if appropriate
    if (completedTaskIds.indexOf('create-character') === -1) {
      completeTask('create-character');
    }
    
    // Reset form and close modal
    setCharacterName('');
    setCharacterClass('warrior');
    setIsBaseCharModalOpen(false);
  };
  
  // Level up a character
  const levelUpCharacter = (characterId: string, xpGained: number) => {
    const updatedCharacters = characters.map(char => {
      if (char.id !== characterId) return char;
      
      let newXp = char.xp + xpGained;
      let newLevel = char.level;
      let newSkillPoints = char.skillPoints || 0;
      
      // Check if character leveled up
      const nextLevelData = CHARACTER_LEVELS.find(l => l.level === char.level + 1);
      
      if (nextLevelData && newXp >= nextLevelData.totalXpRequired) {
        newLevel += 1;
        newSkillPoints += nextLevelData.skillPoints;
        
        // Update stats based on class growth rates
        const classData = CHARACTER_CLASSES[char.class as keyof typeof CHARACTER_CLASSES];
        const newStats = {
          strength: Math.round(char.stats!.strength + classData.growthRates.strength),
          intelligence: Math.round(char.stats!.intelligence + classData.growthRates.intelligence),
          dexterity: Math.round(char.stats!.dexterity + classData.growthRates.dexterity),
          constitution: Math.round(char.stats!.constitution + classData.growthRates.constitution),
          luck: Math.round(char.stats!.luck + classData.growthRates.luck)
        };
        
        return {
          ...char,
          level: newLevel,
          xp: newXp,
          skillPoints: newSkillPoints,
          stats: newStats
        };
      }
      
      return {
        ...char,
        xp: newXp
      };
    });
    
    setCharacters(updatedCharacters);
    localStorage.setItem('playerCharacters', JSON.stringify(updatedCharacters));
  };
  
  // Level up a clan
  const levelUpClan = (clanId: string, xpGained: number) => {
    const updatedClans = clans.map(clan => {
      if (clan.id !== clanId) return clan;
      
      let newXp = clan.xp + xpGained;
      let newLevel = clan.level;
      
      // Check if clan leveled up
      const nextLevelData = CLAN_LEVELS.find(l => l.level === clan.level + 1);
      
      if (nextLevelData && newXp >= nextLevelData.totalXpRequired) {
        newLevel += 1;
        alert(`Your clan "${clan.name}" has reached level ${newLevel}!`);
        
        // Check for new bonuses
        const bonuses = nextLevelData.bonuses;
        if (bonuses.length > 0) {
          const bonusMessages = bonuses.map(b => `${b.name}: ${b.description}`).join('\n- ');
          alert(`Your clan has unlocked:\n- ${bonusMessages}`);
        }
      }
      
      return {
        ...clan,
        level: newLevel,
        xp: newXp
      };
    });
    
    setClans(updatedClans);
    localStorage.setItem('playerClans', JSON.stringify(updatedClans));
  };
  
  // Open character skill tree
  const openSkillTree = (character: Character) => {
    setSelectedCharacter(character);
    setIsSkillTreeModalOpen(true);
  };
  
  // Unlock a skill for a character
  const unlockSkill = (characterId: string, skillId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    
    // Get character class data
    const classData = CHARACTER_CLASSES[character.class as keyof typeof CHARACTER_CLASSES];
    
    // Find the skill in the skill tree
    const skill = classData.skillTree.find(s => s.id === skillId);
    if (!skill) return;
    
    // Check if character has enough skill points
    if ((character.skillPoints || 0) < skill.pointCost) {
      alert('Not enough skill points!');
      return;
    }
    
    // Check if character meets level requirement
    if (character.level < skill.levelRequired) {
      alert(`This skill requires level ${skill.levelRequired}!`);
      return;
    }
    
    // Check if prerequisites are met
    if (skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0) {
      const hasPrereqs = skill.prerequisiteSkills.every(
        prereqId => character.unlockedSkills?.includes(prereqId)
      );
      
      if (!hasPrereqs) {
        alert('You need to unlock prerequisite skills first!');
        return;
      }
    }
    
    // Update character's unlocked skills and skill points
    const updatedCharacters = characters.map(char => {
      if (char.id !== characterId) return char;
      
      const updatedSkills = [...(char.unlockedSkills || []), skillId];
      const updatedSkillPoints = (char.skillPoints || 0) - skill.pointCost;
      
      return {
        ...char,
        unlockedSkills: updatedSkills,
        skillPoints: updatedSkillPoints
      };
    });
    
    setCharacters(updatedCharacters);
    localStorage.setItem('playerCharacters', JSON.stringify(updatedCharacters));
  };
  
  // Assign character to clan
  const assignCharacterToClan = (characterId: string, clanId: string) => {
    const updatedCharacters = characters.map(char => 
      char.id === characterId ? { ...char, clan: clanId } : char
    );
    
    setCharacters(updatedCharacters);
    localStorage.setItem('playerCharacters', JSON.stringify(updatedCharacters));
  };
  
  // Set clan specialization
  const setClanSpecialization = (clanId: string, specializationId: string) => {
    const clan = clans.find(c => c.id === clanId);
    if (!clan) return;
    
    // Check if clan meets level requirement
    if (clan.level < 5) {
      alert('Clan must be at least level 5 to specialize!');
      return;
    }
    
    const updatedClans = clans.map(c => 
      c.id === clanId ? { ...c, specialization: specializationId } : c
    );
    
    setClans(updatedClans);
    localStorage.setItem('playerClans', JSON.stringify(updatedClans));
  };
  
  // Calculate XP progress percentage
  const calculateXpPercentage = () => {
    return Math.min(Math.round((playerXp / playerNextLevelXp) * 100), 100);
  };
  
  // Get clan name by ID
  const getClanNameById = (id?: string) => {
    if (!id) return 'None';
    
    const clan = clans.find(c => c.id === id);
    return clan ? clan.name : 'None';
  };
  
  // Get clan specialization name
  const getClanSpecializationName = (clanId: string) => {
    const clan = clans.find(c => c.id === clanId);
    if (!clan || !clan.specialization) return 'None';
    
    const specialization = CLAN_SPECIALIZATIONS.find(s => s.id === clan.specialization);
    return specialization ? specialization.name : 'None';
  };
  
  // Render player profile section if player exists
  const renderPlayerProfile = () => {
    if (!hasPlayer) return null;
    
    return (
      <div className={styles.playerProfile}>
        <div className={styles.profileHeader}>
          <div className={styles.playerAvatar}>
            {profile?.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile?.username} 
                className={styles.playerAvatarImg} 
              />
            ) : (
              profile?.username?.charAt(0).toUpperCase() || 'P'
            )}
            <div className={styles.playerLevel}>{playerLevel}</div>
          </div>
          
          <div className={styles.playerInfo}>
            <div className={styles.playerUsername}>{profile?.username || 'Player'}</div>
            <div className={styles.walletInfo}>
              <div className={styles.walletAddress}>
                Shadow Wallet: {profile?.address ? `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}` : 'Not connected'}
              </div>
              <div className={styles.walletType}>Managed</div>
            </div>
            
            <div className={styles.playerStats}>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>🏆</span>
                <span className={styles.statValue}>Level {playerLevel}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>✨</span>
                <span className={styles.statValue}>{playerXp} XP</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>💰</span>
                <span className={styles.statValue}>{playerCurrency} Coins</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>👥</span>
                <span className={styles.statValue}>{clans.length} Clans</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>👤</span>
                <span className={styles.statValue}>{characters.length} Characters</span>
              </div>
            </div>
            
            <div className={styles.levelProgress}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${calculateXpPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the tasks section with tabs for different task types
  const renderTasks = () => {
    const onboardingTasks = tasks.filter(task => 
      getAllTasks().find(t => t.id === task.id)?.type === 'onboarding'
    );
    
    const progressionTasks = tasks.filter(task => 
      getAllTasks().find(t => t.id === task.id)?.type === 'progression'
    );
    
    const communityTasks = tasks.filter(task => 
      getAllTasks().find(t => t.id === task.id)?.type === 'community'
    );
    
    return (
      <div className={styles.taskSection}>
        <div className={styles.sectionTitle}>
          Player Tasks
        </div>
        
        <div className={styles.tabsNav} style={{ marginBottom: '15px' }}>
          <button 
            className={`${styles.tabBtn} ${activeTaskTab === 'onboarding' ? styles.active : ''}`}
            onClick={() => setActiveTaskTab('onboarding')}
          >
            Onboarding
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTaskTab === 'progression' ? styles.active : ''}`}
            onClick={() => setActiveTaskTab('progression')}
          >
            Progression
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTaskTab === 'community' ? styles.active : ''}`}
            onClick={() => setActiveTaskTab('community')}
          >
            Community
          </button>
        </div>
        
        <div className={styles.taskList}>
          {activeTaskTab === 'onboarding' && onboardingTasks.map((task) => renderTaskCard(task))}
          {activeTaskTab === 'progression' && progressionTasks.map((task) => renderTaskCard(task))}
          {activeTaskTab === 'community' && communityTasks.map((task) => renderTaskCard(task))}
        </div>
      </div>
    );
  };
  
  // Render the quests section with tabs for different quest types
  const renderQuests = () => {
    const dailyQuests = quests.filter(quest => quest.type === 'daily');
    const weeklyQuests = quests.filter(quest => quest.type === 'weekly');
    const monthlyQuests = quests.filter(quest => quest.type === 'monthly');
    const storyQuests = quests.filter(quest => quest.type === 'story');
    const sideQuests = quests.filter(quest => quest.type === 'side');
    
    return (
      <div className={styles.taskSection}>
        <div className={styles.sectionTitle}>
          Game Quests
        </div>
        
        <div className={styles.tabsNav} style={{ marginBottom: '15px' }}>
          <button 
            className={`${styles.tabBtn} ${activeQuestTab === 'daily' ? styles.active : ''}`}
            onClick={() => setActiveQuestTab('daily')}
          >
            Daily
          </button>
          <button 
            className={`${styles.tabBtn} ${activeQuestTab === 'weekly' ? styles.active : ''}`}
            onClick={() => setActiveQuestTab('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`${styles.tabBtn} ${activeQuestTab === 'monthly' ? styles.active : ''}`}
            onClick={() => setActiveQuestTab('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`${styles.tabBtn} ${activeQuestTab === 'story' ? styles.active : ''}`}
            onClick={() => setActiveQuestTab('story')}
          >
            Story
          </button>
          <button 
            className={`${styles.tabBtn} ${activeQuestTab === 'side' ? styles.active : ''}`}
            onClick={() => setActiveQuestTab('side')}
          >
            Side
          </button>
        </div>
        
        <div className={styles.taskList}>
          {activeQuestTab === 'daily' && dailyQuests.map((quest) => renderQuestCard(quest))}
          {activeQuestTab === 'weekly' && weeklyQuests.map((quest) => renderQuestCard(quest))}
          {activeQuestTab === 'monthly' && monthlyQuests.map((quest) => renderQuestCard(quest))}
          {activeQuestTab === 'story' && storyQuests.map((quest) => renderQuestCard(quest))}
          {activeQuestTab === 'side' && sideQuests.map((quest) => renderQuestCard(quest))}
        </div>
      </div>
    );
  };
  
  // Render a single task card
  const renderTaskCard = (task: Task) => {
    return (
      <div key={task.id} className={styles.taskCard}>
        <div className={styles.taskContent}>
          <div className={styles.taskTitle}>
            <span className={styles.taskIcon}>{task.icon}</span>
            {task.title}
          </div>
          <div className={styles.taskDesc}>{task.description}</div>
        </div>
        
        <div className={styles.taskAction}>
          <div className={styles.taskReward}>
            <span className={styles.rewardIcon}>✨</span>
            {task.reward.xp} XP
            {task.reward.currency && (
              <>
                <span className={styles.rewardIcon} style={{ marginLeft: '8px' }}>💰</span>
                {task.reward.currency}
              </>
            )}
          </div>
          
          {task.completed ? (
            <div className={`${styles.taskStatus} ${styles.statusComplete}`}>
              Completed
            </div>
          ) : (
            task.available ? (
              <button 
                className={styles.taskBtn}
                onClick={task.action}
              >
                Start
              </button>
            ) : (
              <button className={`${styles.taskBtn} ${styles.disabled}`} disabled>
                Locked
              </button>
            )
          )}
        </div>
      </div>
    );
  };
  
  // Render a single quest card
  const renderQuestCard = (quest: Quest) => {
    const isCompleted = completedQuestIds.includes(quest.id);
    
    // Check if quest has a game link
    const linkedGame = quest.gameId ? GAMES.find(game => game.id === quest.gameId) : null;
    
    return (
      <div key={quest.id} className={styles.taskCard}>
        <div className={styles.taskContent}>
          <div className={styles.taskTitle}>
            <span className={styles.taskIcon}>{quest.icon}</span>
            {quest.title}
            {linkedGame && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-dim)' }}>
                [{linkedGame.title}]
              </span>
            )}
          </div>
          <div className={styles.taskDesc}>{quest.description}</div>
          
          {/* Show quest steps if it has steps */}
          {quest.steps && quest.steps.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '13px' }}>
              {quest.steps.map((step, index) => (
                <div key={step.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '4px',
                  opacity: step.completed ? 0.7 : 1 
                }}>
                  <span style={{ 
                    marginRight: '5px', 
                    color: step.completed ? 'var(--success-color)' : 'var(--text-dim)' 
                  }}>
                    {step.completed ? '✓' : '○'}
                  </span>
                  {step.description}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.taskAction}>
          <div>
            <div className={styles.taskReward}>
              <span className={styles.rewardIcon}>✨</span>
              {quest.reward.xp} XP
            </div>
            
            {quest.reward.currency && (
              <div className={styles.taskReward} style={{ marginTop: '4px' }}>
                <span className={styles.rewardIcon}>💰</span>
                {quest.reward.currency}
              </div>
            )}
            
            {quest.reward.items && quest.reward.items.length > 0 && (
              <div className={styles.taskReward} style={{ marginTop: '4px' }}>
                <span className={styles.rewardIcon}>🎁</span>
                {quest.reward.items.join(', ')}
              </div>
            )}
            
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-dim)', 
              marginTop: '5px',
              textAlign: 'right'
            }}>
              {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
            </div>
          </div>
          
          {isCompleted ? (
            <div className={`${styles.taskStatus} ${styles.statusComplete}`}>
              Completed
            </div>
          ) : (
            <button 
              className={styles.taskBtn}
              onClick={() => {
                if (linkedGame) {
                  alert(`Redirecting to ${linkedGame.title}...`);
                } else {
                  // For demo purposes, just mark it as completed
                  completeQuest(quest.id);
                }
              }}
            >
              {linkedGame ? 'Play' : 'Complete'}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Render clans section
  const renderClans = () => {
    return (
      <div className={styles.clanSection}>
        {clans.map((clan) => (
          <div key={clan.id} className={styles.clanCard}>
            <div 
              className={styles.clanImg}
              style={{ backgroundColor: clan.color }}
            >
              {clan.symbol}
            </div>
            <div className={styles.clanDetails}>
              <div className={styles.clanTitle}>
                {clan.name}
                <span>Lvl {clan.level}</span>
              </div>
              
              <div className={styles.clanStats}>
                <div className={styles.clanStatItem}>
                  <div>Members:</div>
                  <div className={styles.clanStatValue}>{clan.membersCount}</div>
                </div>
                <div className={styles.clanStatItem}>
                  <div>Created:</div>
                  <div className={styles.clanStatValue}>
                    {new Date(clan.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={styles.clanStatItem}>
                  <div>XP:</div>
                  <div className={styles.clanStatValue}>{clan.xp}</div>
                </div>
                <div className={styles.clanStatItem}>
                  <div>Characters:</div>
                  <div className={styles.clanStatValue}>
                    {characters.filter(c => c.clan === clan.id).length}
                  </div>
                </div>
                {clan.level >= 5 && (
                  <div className={styles.clanStatItem} style={{ gridColumn: '1 / span 2' }}>
                    <div>Specialization:</div>
                    <div className={styles.clanStatValue}>
                      {clan.specialization ? getClanSpecializationName(clan.id) : 
                        <button 
                          className={styles.miniBtn}
                          onClick={() => alert('Specialization modal would open here')}
                        >
                          Select
                        </button>
                      }
                    </div>
                  </div>
                )}
              </div>
              
              {clan.level < CLAN_LEVELS.length && (
                <div style={{ marginTop: '10px', fontSize: '13px' }}>
                  <div className={styles.levelProgress} style={{ height: '4px', marginBottom: '4px' }}>
                    <div 
                      className={styles.progressBar} 
                      style={{ 
                        width: `${(clan.xp / CLAN_LEVELS[clan.level].xpRequired) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <span>{clan.xp} / {CLAN_LEVELS[clan.level].xpRequired} XP</span>
                    <span>Level {clan.level} → {clan.level + 1}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {Object.values(unlockedClanSlots).filter(Boolean).length > clans.length && (
          <div className={styles.addClanBtn} onClick={() => setIsCreateClanModalOpen(true)}>
            <div className={styles.addIcon}>+</div>
            <div className={styles.addText}>Create New Clan</div>
          </div>
        )}
      </div>
    );
  };
  // Add these missing functions to your PlayerHub component

// Render characters section
const renderCharacters = () => {
  // Get number of base characters
  const baseCharacterCount = characters.filter(c => c.isBase).length;
  const maxBaseCharacters = getMaxBaseCharacters(playerLevel);
  
  // Get the number of unlocked character slots
  const unlockedSlotCount = Object.values(unlockedCharacterSlots).filter(Boolean).length;
  
  return (
    <div className={styles.characterSection}>
      {characters.map((character) => {
        // Get class data for this character
        const classData = CHARACTER_CLASSES[character.class as keyof typeof CHARACTER_CLASSES];
        
        return (
          <div key={character.id} className={styles.characterCard}>
            <div className={styles.characterImg}>
              {character.image ? (
                <img src={character.image} alt={character.name} className={styles.characterImage} />
              ) : (
                character.class === 'warrior' ? '⚔️' :
                character.class === 'mage' ? '🧙' :
                character.class === 'archer' ? '🏹' : 
                character.class === 'rogue' ? '🗡️' : '👤'
              )}
              <div className={styles.characterLevel}>Lvl {character.level}</div>
              <div className={styles.characterClan}>
                <span className={styles.clanIcon}>🛡️</span>
                {getClanNameById(character.clan)}
              </div>
              {character.isBase && (
                <div className={styles.baseCharacterBadge}>
                  Base
                </div>
              )}
            </div>
            <div className={styles.characterDetails}>
              <div className={styles.characterName}>{character.name}</div>
              <div className={styles.characterClass}>
                {character.class.charAt(0).toUpperCase() + character.class.slice(1)}
              </div>
              
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '5px' }}>
                {character.stats && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>STR: {character.stats.strength}</span>
                      <span>INT: {character.stats.intelligence}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>DEX: {character.stats.dexterity}</span>
                      <span>CON: {character.stats.constitution}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>LUCK: {character.stats.luck}</span>
                      <span>SP: {character.skillPoints || 0}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles.characterExp}>
                XP: {character.xp} / {character.level * 100}
              </div>
              <div className={styles.characterExpBar}>
                <div 
                  className={styles.characterExpProgress} 
                  style={{ width: `${(character.xp / (character.level * 100)) * 100}%` }}
                ></div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '8px',
                gap: '8px' 
              }}>
                <button 
                  className={styles.miniBtn}
                  style={{ flex: 1 }}
                  onClick={() => openSkillTree(character)}
                >
                  Skills
                </button>
                
                {/* Show assign button if clans exist */}
                {clans.length > 0 && (
                  <button 
                    className={styles.miniBtn}
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (clans.length === 1) {
                        assignCharacterToClan(character.id, clans[0].id);
                      } else {
                        alert('Clan selection modal would open here');
                      }
                    }}
                  >
                    {character.clan ? 'Change Clan' : 'Assign Clan'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Show NFT character creation button if slots are available */}
      {characters.length < unlockedSlotCount && (
        <div className={styles.addCharacterBtn} onClick={() => setIsCreateCharModalOpen(true)}>
          <div className={styles.addIcon}>+</div>
          <div className={styles.addText}>Create Character from NFT</div>
        </div>
      )}
      
      {/* Show base character creation button if slots are available */}
      {baseCharacterCount < maxBaseCharacters && characters.length < unlockedSlotCount && (
        <div 
          className={`${styles.addCharacterBtn} ${styles.addBaseCharacterBtn}`} 
          onClick={() => setIsBaseCharModalOpen(true)}
        >
          <div className={styles.addIcon}>+</div>
          <div className={styles.addText}>Create Base Character</div>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {baseCharacterCount}/{maxBaseCharacters} Used
          </div>
        </div>
      )}
    </div>
  );
};

// Render tabs
const renderTabs = () => {
  if (!hasPlayer) return null;
  
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsNav}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'tasks' ? styles.active : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'quests' ? styles.active : ''}`}
          onClick={() => setActiveTab('quests')}
        >
          Quests
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'clans' ? styles.active : ''}`}
          onClick={() => setActiveTab('clans')}
        >
          Clans
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'characters' ? styles.active : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>
      </div>
      
      <div className={`${styles.tabContent} ${activeTab === 'tasks' ? styles.active : ''}`}>
        {renderTasks()}
      </div>
      
      <div className={`${styles.tabContent} ${activeTab === 'quests' ? styles.active : ''}`}>
        {renderQuests()}
      </div>
      
      <div className={`${styles.tabContent} ${activeTab === 'clans' ? styles.active : ''}`}>
        {renderClans()}
      </div>
      
      <div className={`${styles.tabContent} ${activeTab === 'characters' ? styles.active : ''}`}>
        {renderCharacters()}
      </div>
    </div>
  );
};

// Render initial hero section for non-players
const renderHeroSection = () => {
  if (hasPlayer) return null;
  
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroTitle}>Become a Player</div>
      <div className={styles.heroSubtitle}>
        Create your own player profile to access games, join clans, 
        and transform your NFTs into playable characters!
      </div>
      <button className={styles.createPlayerBtn} onClick={createPlayerProfile}>
        Create Player Profile
      </button>
    </div>
  );
};

// Render create clan modal
const renderCreateClanModal = () => {
  if (!isCreateClanModalOpen) return null;
  
  // Color options
  const colorOptions = [
    '#6C11FF', '#FF1177', '#11BBFF', '#FF8811', 
    '#11FF77', '#FF1111', '#1111FF', '#11FFFF'
  ];
  
  // Symbol options
  const symbolOptions = [
    '⚔️', '🛡️', '🏹', '🧙', '🐉', '🦁', '🐺', '🦅',
    '⚡', '🔥', '❄️', '🌪️', '🌟', '☠️', '👑', '🐲'
  ];
  
  return (
    <div className={styles.modalOverlay} onClick={() => setIsCreateClanModalOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create New Clan</h3>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsCreateClanModalOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Clan Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={clanName}
              onChange={(e) => setClanName(e.target.value)}
              placeholder="Enter clan name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Clan Color</label>
            <div className={styles.colorOptions}>
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorOption} ${color === clanColor ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setClanColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Clan Symbol</label>
            <div className={styles.symbolOptions}>
              {symbolOptions.map((symbol) => (
                <div
                  key={symbol}
                  className={`${styles.symbolOption} ${symbol === clanSymbol ? styles.selected : ''}`}
                  onClick={() => setClanSymbol(symbol)}
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.previewSection}>
            <div className={styles.previewTitle}>Preview</div>
            <div className={styles.previewContent}>
              <div 
                className={styles.clanPreview}
                style={{ backgroundColor: clanColor }}
              >
                {clanSymbol}
              </div>
            </div>
            <div className={styles.previewName}>{clanName || 'Clan Name'}</div>
          </div>
          
          <div className={styles.modalActions}>
            <button 
              className={`${styles.modalBtn} ${styles.cancelBtn}`}
              onClick={() => setIsCreateClanModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className={`${styles.modalBtn} ${styles.createBtn}`}
              onClick={handleCreateClan}
            >
              Create Clan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render create character modal
const renderCreateCharacterModal = () => {
  if (!isCreateCharModalOpen) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={() => setIsCreateCharModalOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create NFT Character</h3>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsCreateCharModalOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Character Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Character Class</label>
            <select 
              className={styles.characClassSelect}
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
            >
              <option value="warrior">Warrior</option>
              <option value="mage">Mage</option>
              <option value="archer">Archer</option>
              <option value="rogue">Rogue</option>
            </select>
            
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-dim)' }}>
              {CHARACTER_CLASSES[characterClass as keyof typeof CHARACTER_CLASSES]?.description || ''}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select NFT to Transform</label>
            <div className={styles.nftList}>
              {ownedNfts.map((nft) => (
                <div
                  key={nft.id}
                  className={`${styles.nftOption} ${selectedNft?.id === nft.id ? styles.selected : ''}`}
                  onClick={() => setSelectedNft(nft)}
                >
                  <div className={styles.nftImg}>
                    {nft.image ? (
                      <img src={nft.image} alt={nft.name} className={styles.nftImage} />
                    ) : (
                      '🖼️'
                    )}
                  </div>
                  <div className={styles.nftName}>{nft.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button 
              className={`${styles.modalBtn} ${styles.cancelBtn}`}
              onClick={() => setIsCreateCharModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className={`${styles.modalBtn} ${styles.createBtn}`}
              onClick={handleCreateCharacter}
            >
              Create Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render base character modal
const renderBaseCharacterModal = () => {
  if (!isBaseCharModalOpen) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={() => setIsBaseCharModalOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Create Base Character</h3>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsBaseCharModalOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Character Name</label>
            <input
              type="text"
              className={`${styles.formInput} ${styles.baseCharInput}`}
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Character Class</label>
            <select 
              className={styles.characClassSelect}
              value={characterClass}
              onChange={(e) => setCharacterClass(e.target.value)}
            >
              <option value="warrior">Warrior</option>
              <option value="mage">Mage</option>
              <option value="archer">Archer</option>
              <option value="rogue">Rogue</option>
            </select>
            
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-dim)' }}>
              {CHARACTER_CLASSES[characterClass as keyof typeof CHARACTER_CLASSES]?.description || ''}
            </div>
          </div>
          
          <div className={styles.previewSection}>
            <div className={styles.previewTitle}>Note</div>
            <p>
              Base characters have reduced functionality and rewards in games.
              For the full experience, create a character from one of your NFTs.
            </p>
            
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-dim)' }}>
              <strong>Limitations:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                {BASE_CHARACTER_LIMITS.find(limit => playerLevel >= limit.playerLevel)?.baseCharacterRestrictions.map((restriction, index) => (
                  <li key={index}>{restriction}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button 
              className={`${styles.modalBtn} ${styles.cancelBtn}`}
              onClick={() => setIsBaseCharModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className={`${styles.modalBtn} ${styles.createBtn}`}
              onClick={handleCreateBaseChar}
            >
              Create Base Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render skill tree modal
const renderSkillTreeModal = () => {
  if (!isSkillTreeModalOpen || !selectedCharacter) return null;
  
  // Get the class data for the selected character
  const classData = CHARACTER_CLASSES[selectedCharacter.class as keyof typeof CHARACTER_CLASSES];
  
  return (
    <div className={styles.modalOverlay} onClick={() => setIsSkillTreeModalOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ width: '700px', maxWidth: '90%' }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {selectedCharacter.name} - Skill Tree
            <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 'normal', color: 'var(--text-dim)' }}>
              Level {selectedCharacter.level} {selectedCharacter.class.charAt(0).toUpperCase() + selectedCharacter.class.slice(1)}
            </span>
          </h3>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsSkillTreeModalOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '15px',
            padding: '10px', 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Available Skill Points</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {selectedCharacter.skillPoints || 0}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Unlocked Skills</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {selectedCharacter.unlockedSkills?.length || 0} / {classData.skillTree.length}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {classData.skillTree.map((skill) => {
              const isUnlocked = selectedCharacter.unlockedSkills?.includes(skill.id);
              const canUnlock = !isUnlocked && 
                (selectedCharacter.skillPoints || 0) >= skill.pointCost &&
                selectedCharacter.level >= skill.levelRequired &&
                (!skill.prerequisiteSkills ||
                  skill.prerequisiteSkills.every(prereq => 
                    selectedCharacter.unlockedSkills?.includes(prereq)
                  )
                );
              
              return (
                <div 
                  key={skill.id}
                  className={styles.previewSection}
                  style={{ 
                    position: 'relative',
                    opacity: selectedCharacter.level < skill.levelRequired ? 0.6 : 1
                  }}
                >
                  <div className={styles.previewTitle} style={{ 
                    color: isUnlocked ? 'var(--primary-color)' : 'var(--text-dim)'
                  }}>
                    {skill.name}
                  </div>
                  
                  <div style={{ 
                    fontSize: '24px', 
                    marginBottom: '10px',
                    color: isUnlocked ? 'var(--primary-color)' : 'var(--text-dim)'
                  }}>
                    {skill.icon}
                  </div>
                  
                  <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                    {skill.description}
                  </div>
                  
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    <div>Level required: {skill.levelRequired}</div>
                    <div>Cost: {skill.pointCost} point{skill.pointCost > 1 ? 's' : ''}</div>
                    {skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0 && (
                      <div>
                        Requires: {skill.prerequisiteSkills.map(prereqId => {
                          const prereqSkill = classData.skillTree.find(s => s.id === prereqId);
                          return prereqSkill?.name;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  {skill.bonuses.length > 0 && (
                    <div style={{ fontSize: '11px', marginTop: '8px' }}>
                      {skill.bonuses.map((bonus, idx) => (
                        <div key={idx} style={{ color: isUnlocked ? 'var(--success-color)' : 'var(--text-dim)' }}>
                          {bonus.stat}: +{bonus.value}{bonus.isPercentage ? '%' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isUnlocked && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: 'var(--success-color)',
                        fontSize: '16px'
                      }}
                    >
                      ✓
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <button
                      className={styles.miniBtn}
                      style={{ 
                        marginTop: '10px',
                        width: '100%',
                        opacity: canUnlock ? 1 : 0.5
                      }}
                      onClick={() => {
                        if (canUnlock) {
                          unlockSkill(selectedCharacter.id, skill.id);
                        } else if (selectedCharacter.level < skill.levelRequired) {
                          alert(`You need to reach level ${skill.levelRequired} to unlock this skill.`);
                        } else if ((selectedCharacter.skillPoints || 0) < skill.pointCost) {
                          alert(`You need ${skill.pointCost} skill points to unlock this skill.`);
                        } else {
                          alert('You need to unlock prerequisite skills first.');
                        }
                      }}
                      disabled={!canUnlock}
                    >
                      {canUnlock ? 'Unlock' : 'Locked'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Return statement for the component
return (
  <AppLayout>
    <div className={styles.pageContainer}>
      <div className={styles.pageTitle}>
        {hasPlayer ? "PLAYER HUB" : "BECOME A PLAYER"}
      </div>
      
      {renderHeroSection()}
      {renderPlayerProfile()}
      {renderTabs()}
      {renderCreateClanModal()}
      {renderCreateCharacterModal()}
      {renderBaseCharacterModal()}
      {renderSkillTreeModal()}
    </div>
  </AppLayout>
);
}