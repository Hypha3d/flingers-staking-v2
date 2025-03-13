// components/playerHub/ClanModal.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';

interface ClanModalProps {
  clanName: string;
  setClanName: (name: string) => void;
  clanColor: string;
  setClanColor: (color: string) => void;
  clanSymbol: string;
  setClanSymbol: (symbol: string) => void;
  handleCreateClan: () => void;
  setIsCreateClanModalOpen: (isOpen: boolean) => void;
}

const ClanModal: React.FC<ClanModalProps> = ({
  clanName,
  setClanName,
  clanColor,
  setClanColor,
  clanSymbol,
  setClanSymbol,
  handleCreateClan,
  setIsCreateClanModalOpen
}) => {
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

export default ClanModal;