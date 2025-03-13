// components/playerHub/ClansSection.tsx
import { FC } from 'react';
import styles from '@/app/playerHub/page.module.css';
import { Clan } from '@/types/playerHub';
import { ClanLevel } from '@/config/progression';

interface ClansSectionProps {
  clans: Clan[];
  unlockedClanSlots: Record<string, boolean>;
  setIsCreateClanModalOpen: (isOpen: boolean) => void;
  CLAN_LEVELS: ClanLevel[];
  getClanSpecializationName: (clanId: string) => string;
}

const ClansSection: FC<ClansSectionProps> = ({
  clans,
  unlockedClanSlots,
  setIsCreateClanModalOpen,
  CLAN_LEVELS,
  getClanSpecializationName
}) => {
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

export default ClansSection;