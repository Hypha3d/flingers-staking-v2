// components/playerHub/HeroSection.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';

interface HeroSectionProps {
  createPlayerProfile: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ createPlayerProfile }) => {
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

export default HeroSection;