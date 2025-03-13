// components/playerHub/CharactersSection.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';
import { Character, Clan } from '@/types/playerHub';

interface CharactersSectionProps {
  characters: Character[];
  unlockedCharacterSlots: Record<string, boolean>;
  maxBaseCharacters: number;
  playerLevel: number;
  CHARACTER_CLASSES: any;
  getClanNameById: (id?: string) => string;
  openSkillTree: (character: Character) => void;
  assignCharacterToClan: (characterId: string, clanId: string) => void;
  clans: Clan[];
  setIsCreateCharModalOpen: (isOpen: boolean) => void;
  setIsBaseCharModalOpen: (isOpen: boolean) => void;
}

const CharactersSection: React.FC<CharactersSectionProps> = ({
  characters,
  unlockedCharacterSlots,
  maxBaseCharacters,
  playerLevel,
  CHARACTER_CLASSES,
  getClanNameById,
  openSkillTree,
  assignCharacterToClan,
  clans,
  setIsCreateCharModalOpen,
  setIsBaseCharModalOpen
}) => {
  // Get number of base characters
  const baseCharacterCount = characters.filter(c => c.isBase).length;
  
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

export default CharactersSection;