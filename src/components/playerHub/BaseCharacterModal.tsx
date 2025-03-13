// components/playerHub/BaseCharacterModal.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';

interface BaseCharacterLimits {
  playerLevel: number;
  maxBaseCharacters: number;
  baseCharacterRestrictions: string[];
}

interface BaseCharacterModalProps {
  characterName: string;
  setCharacterName: (name: string) => void;
  characterClass: string;
  setCharacterClass: (characterClass: string) => void;
  CHARACTER_CLASSES: any;
  BASE_CHARACTER_LIMITS: BaseCharacterLimits[];
  playerLevel: number;
  handleCreateBaseChar: () => void;
  setIsBaseCharModalOpen: (isOpen: boolean) => void;
}

const BaseCharacterModal: React.FC<BaseCharacterModalProps> = ({
  characterName,
  setCharacterName,
  characterClass,
  setCharacterClass,
  CHARACTER_CLASSES,
  BASE_CHARACTER_LIMITS,
  playerLevel,
  handleCreateBaseChar,
  setIsBaseCharModalOpen
}) => {
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
                {BASE_CHARACTER_LIMITS.find(limit => playerLevel >= limit.playerLevel)?.baseCharacterRestrictions.map((restriction: string, index: number) => (
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

export default BaseCharacterModal;