// components/playerHub/PlayerProfile.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';
import type { Clan, Character } from '@/types/playerHub';

interface PlayerProfileProps {
  profile: any;
  playerLevel: number;
  playerXp: number;
  playerCurrency: number;
  clans: Clan[];
  characters: Character[];
  playerNextLevelXp: number;
  calculateXpPercentage: () => number;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({
  profile,
  playerLevel,
  playerXp,
  playerCurrency,
  clans,
  characters,
  playerNextLevelXp,
  calculateXpPercentage
}) => {
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
            profile?.username?.charAt(0)?.toUpperCase() || 'P'
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

export default PlayerProfile;