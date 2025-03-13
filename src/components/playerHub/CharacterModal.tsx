// components/playerHub/CharacterModal.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';
import type { NFT } from '@/types/playerHub';

interface CharacterModalProps {
  characterName: string;
  setCharacterName: (name: string) => void;
  characterClass: string;
  setCharacterClass: (characterClass: string) => void;
  selectedNft: NFT | null;
  setSelectedNft: (nft: NFT | null) => void;
  ownedNfts: NFT[];
  CHARACTER_CLASSES: any;
  handleCreateCharacter: () => void;
  setIsCreateCharModalOpen: (isOpen: boolean) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  characterName,
  setCharacterName,
  characterClass,
  setCharacterClass,
  selectedNft,
  setSelectedNft,
  ownedNfts,
  CHARACTER_CLASSES,
  handleCreateCharacter,
  setIsCreateCharModalOpen
}) => {
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

export default CharacterModal;