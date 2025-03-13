"use client";

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useAppContext();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return (
    <AppLayout>
      <div className={styles.dashboardContent}>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>YOUR SCORE</div>
            <div className={styles.statValue}>12,345</div>
            <div className={styles.statChange}>+1,234 (10.5%) this week</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statTitle}>RANK POSITION</div>
            <div className={styles.statValue}>#42</div>
            <div className={styles.statChange}>+5 positions this week</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statTitle}>STAKING REWARDS</div>
            <div className={styles.statValue}>450</div>
            <div className={styles.statChange}>+45 (10%) this week</div>
          </div>
        </div>
        
        <div className={styles.actionRow}>
        <div 
            className={styles.actionCard} 
            onClick={() => handleNavigate('/playerHub')}
          >
            <div className={styles.actionIcon}>📱</div>
            <div className={styles.actionTitle}>PLAYER HUB</div>
          </div>
          <div 
            className={styles.actionCard} 
            onClick={() => handleNavigate('/games')}
          >
            <div className={styles.actionIcon}>🎮</div>
            <div className={styles.actionTitle}>PLAY GAMES</div>
          </div>
          
          <div 
            className={styles.actionCard} 
            onClick={() => handleNavigate('/staking')}
          >
            <div className={styles.actionIcon}>💰</div>
            <div className={styles.actionTitle}>STAKING</div>
          </div>
          
          <div 
            className={styles.actionCard} 
            onClick={() => handleNavigate('/leaderboard')}
          >
            <div className={styles.actionIcon}>🏆</div>
            <div className={styles.actionTitle}>LEADERBOARDS</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}