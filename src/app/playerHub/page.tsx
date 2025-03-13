// app/playerHub/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

// Import extracted components
import PlayerProfile from '@/components/playerHub/PlayerProfile';
import TasksSection from '@/components/playerHub/TasksSection';
import QuestsSection from '@/components/playerHub/QuestsSection';
import ClansSection from '@/components/playerHub/ClansSection';
import CharactersSection from '@/components/playerHub/CharacterSection';
import ClanModal from '@/components/playerHub/ClanModal';
import CharacterModal from '@/components/playerHub/CharacterModal';
import BaseCharacterModal from '@/components/playerHub/BaseCharacterModal';
import SkillTreeModal from '@/components/playerHub/SkillTreeModal';
import HeroSection from '@/components/playerHub/HeroSection';

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

// Import shared types
import type { Clan, Character, Task, NFT } from '@/types/playerHub';

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
    
    // Initialize tasks and quests
    initializeTasks();
    initializeQuests();
    
    // Update unlocked slots
    updateUnlockedSlots();
  }, []);

  // Initialize tasks and quests when player status or data changes
  useEffect(() => {
    if (hasPlayer) {
      initializeTasks();
      initializeQuests();
    }
  }, [hasPlayer, completedTaskIds, completedQuestIds]);

  // Update tasks, quests, and slots when relevant state changes
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
    const configTasks = getAllTasks();
    const updatedTasks = configTasks.map(configTask => {
      const isAvailable = isTaskAvailable(configTask);
      const isCompleted = completedTaskIds.includes(configTask.id);
      
      // Add action handler for available tasks
      let actionHandler;
      if (isAvailable && !isCompleted) {
        switch (configTask.id) {
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
            actionHandler = () => completeTask(configTask.id);
            break;
        }
      }
      
      return {
        id: configTask.id,
        title: configTask.title,
        description: configTask.description,
        icon: configTask.icon,
        reward: configTask.reward,
        completed: isCompleted,
        available: isAvailable,
        action: actionHandler
      };
    });
    
    setTasks(updatedTasks);
  };
  
  // Update quest availability
  const updateQuestsAvailability = () => {
    // For simplicity, we'll just refresh all quests
    const activeQuests = getActiveQuests();
    setQuests(activeQuests);
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

  // Render functions for quest and task items
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

  const renderQuestCard = (quest: Quest) => {
    const isCompleted = completedQuestIds.includes(quest.id);
    
    return (
      <div key={quest.id} className={styles.taskCard}>
        <div className={styles.taskContent}>
          <div className={styles.taskTitle}>
            <span className={styles.taskIcon}>{quest.icon}</span>
            {quest.title}
            {quest.gameId && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-dim)' }}>
                [{quest.gameId}]
              </span>
            )}
          </div>
          <div className={styles.taskDesc}>{quest.description}</div>
          
          {/* Show quest steps if it has steps */}
          {quest.steps && quest.steps.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '13px' }}>
              {quest.steps.map((step, index) => (
                <div key={step.id} className={styles.questStep}>
                  <span className={`${styles.questStepIcon} ${step.completed ? styles.completed : ''}`}>
                    {step.completed ? '✓' : '○'}
                  </span>
                  <span className={`${styles.questStepText} ${step.completed ? styles.completed : ''}`}>
                    {step.description}
                  </span>
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
              onClick={() => completeQuest(quest.id)}
            >
              {quest.gameId ? 'Play' : 'Complete'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageTitle}>
          {hasPlayer ? "PLAYER HUB" : "BECOME A PLAYER"}
        </div>
        
        {!hasPlayer && (
          <HeroSection createPlayerProfile={createPlayerProfile} />
        )}
        
        {hasPlayer && (
          <>
            <PlayerProfile 
              profile={profile}
              playerLevel={playerLevel}
              playerXp={playerXp}
              playerCurrency={playerCurrency}
              clans={clans}
              characters={characters}
              playerNextLevelXp={playerNextLevelXp}
              calculateXpPercentage={calculateXpPercentage}
            />
            
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
                <TasksSection 
                  tasks={tasks}
                  activeTaskTab={activeTaskTab}
                  setActiveTaskTab={setActiveTaskTab}
                  renderTaskCard={renderTaskCard}
                />
              </div>
              
              <div className={`${styles.tabContent} ${activeTab === 'quests' ? styles.active : ''}`}>
                <QuestsSection 
                  quests={quests}
                  activeQuestTab={activeQuestTab}
                  setActiveQuestTab={setActiveQuestTab}
                  renderQuestCard={renderQuestCard}
                />
              </div>
              
              <div className={`${styles.tabContent} ${activeTab === 'clans' ? styles.active : ''}`}>
                <ClansSection 
                  clans={clans}
                  unlockedClanSlots={unlockedClanSlots}
                  setIsCreateClanModalOpen={setIsCreateClanModalOpen}
                  CLAN_LEVELS={CLAN_LEVELS}
                  getClanSpecializationName={getClanSpecializationName}
                />
              </div>
              
              <div className={`${styles.tabContent} ${activeTab === 'characters' ? styles.active : ''}`}>
                <CharactersSection 
                  characters={characters}
                  unlockedCharacterSlots={unlockedCharacterSlots}
                  maxBaseCharacters={getMaxBaseCharacters(playerLevel)}
                  playerLevel={playerLevel}
                  CHARACTER_CLASSES={CHARACTER_CLASSES}
                  getClanNameById={getClanNameById}
                  openSkillTree={openSkillTree}
                  assignCharacterToClan={assignCharacterToClan}
                  clans={clans}
                  setIsCreateCharModalOpen={setIsCreateCharModalOpen}
                  setIsBaseCharModalOpen={setIsBaseCharModalOpen}
                />
              </div>
            </div>
          </>
        )}
        
        {isCreateClanModalOpen && (
          <ClanModal 
            clanName={clanName}
            setClanName={setClanName}
            clanColor={clanColor}
            setClanColor={setClanColor}
            clanSymbol={clanSymbol}
            setClanSymbol={setClanSymbol}
            handleCreateClan={handleCreateClan}
            setIsCreateClanModalOpen={setIsCreateClanModalOpen}
          />
        )}
        
        {isCreateCharModalOpen && (
          <CharacterModal 
            characterName={characterName}
            setCharacterName={setCharacterName}
            characterClass={characterClass}
            setCharacterClass={setCharacterClass}
            selectedNft={selectedNft}
            setSelectedNft={setSelectedNft}
            ownedNfts={ownedNfts}
            CHARACTER_CLASSES={CHARACTER_CLASSES}
            handleCreateCharacter={handleCreateCharacter}
            setIsCreateCharModalOpen={setIsCreateCharModalOpen}
          />
        )}
        
        {isBaseCharModalOpen && (
          <BaseCharacterModal 
            characterName={characterName}
            setCharacterName={setCharacterName}
            characterClass={characterClass}
            setCharacterClass={setCharacterClass}
            CHARACTER_CLASSES={CHARACTER_CLASSES}
            BASE_CHARACTER_LIMITS={BASE_CHARACTER_LIMITS}
            playerLevel={playerLevel}
            handleCreateBaseChar={handleCreateBaseChar}
            setIsBaseCharModalOpen={setIsBaseCharModalOpen}
          />
        )}
        
        {isSkillTreeModalOpen && selectedCharacter && (
          <SkillTreeModal 
            selectedCharacter={selectedCharacter}
            CHARACTER_CLASSES={CHARACTER_CLASSES}
            unlockSkill={unlockSkill}
            setIsSkillTreeModalOpen={setIsSkillTreeModalOpen}
          />
        )}
      </div>
    </AppLayout>
  );
}