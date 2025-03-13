"use client";

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

export default function Leaderboard() {
  const { profile } = useAppContext();
  const [activePeriod, setActivePeriod] = useState('daily');
  
  // Sample leaderboard data
  const leaderboardData = {
    daily: [
      { rank: 1, avatar: 'CK', name: 'CryptoKing', score: 24563, rewards: 1200 },
      { rank: 2, avatar: 'NG', name: 'NftGuru', score: 22105, rewards: 900 },
      { rank: 3, avatar: 'BM', name: 'BlockchainMaster', score: 19844, rewards: 750 },
      { rank: 4, avatar: 'EW', name: 'EtherWizard', score: 18652, rewards: 500 },
      { rank: 5, avatar: 'CM', name: 'CoinMaster', score: 16987, rewards: 400 },
      { rank: 6, avatar: 'PS', name: 'PixelSlayer', score: 15423, rewards: 350 },
      { rank: 7, avatar: 'GG', name: 'GameGod', score: 14856, rewards: 300 },
      { rank: 8, avatar: 'JS', name: 'John Smith', score: 12345, rewards: 250 },
      { rank: 9, avatar: 'TX', name: 'TokenX', score: 11765, rewards: 200 },
      { rank: 10, avatar: 'CP', name: 'CryptoPunk', score: 10542, rewards: 150 }
    ],
    weekly: [
      { rank: 1, avatar: 'NG', name: 'NftGuru', score: 105324, rewards: 5000 },
      { rank: 2, avatar: 'CK', name: 'CryptoKing', score: 98752, rewards: 4000 },
      { rank: 3, avatar: 'BM', name: 'BlockchainMaster', score: 87621, rewards: 3500 },
      { rank: 4, avatar: 'GG', name: 'GameGod', score: 76543, rewards: 3000 },
      { rank: 5, avatar: 'CM', name: 'CoinMaster', score: 65432, rewards: 2500 },
      { rank: 6, avatar: 'PS', name: 'PixelSlayer', score: 54321, rewards: 2000 },
      { rank: 7, avatar: 'EW', name: 'EtherWizard', score: 43210, rewards: 1500 },
      { rank: 8, avatar: 'TX', name: 'TokenX', score: 32109, rewards: 1000 },
      { rank: 9, avatar: 'CP', name: 'CryptoPunk', score: 21098, rewards: 500 },
      { rank: 10, avatar: 'JS', name: 'John Smith', score: 10987, rewards: 250 }
    ],
    monthly: [
      { rank: 1, avatar: 'BM', name: 'BlockchainMaster', score: 456321, rewards: 10000 },
      { rank: 2, avatar: 'NG', name: 'NftGuru', score: 432567, rewards: 8000 },
      { rank: 3, avatar: 'CK', name: 'CryptoKing', score: 398765, rewards: 6000 },
      { rank: 4, avatar: 'CM', name: 'CoinMaster', score: 356789, rewards: 5000 },
      { rank: 5, avatar: 'GG', name: 'GameGod', score: 325678, rewards: 4000 },
      { rank: 6, avatar: 'EW', name: 'EtherWizard', score: 298765, rewards: 3000 },
      { rank: 7, avatar: 'PS', name: 'PixelSlayer', score: 265432, rewards: 2000 },
      { rank: 8, avatar: 'TX', name: 'TokenX', score: 234567, rewards: 1000 },
      { rank: 9, avatar: 'JS', name: 'John Smith', score: 198765, rewards: 500 },
      { rank: 10, avatar: 'CP', name: 'CryptoPunk', score: 165432, rewards: 250 }
    ],
    allTime: [
      { rank: 1, avatar: 'CK', name: 'CryptoKing', score: 1256345, rewards: 50000 },
      { rank: 2, avatar: 'BM', name: 'BlockchainMaster', score: 1132654, rewards: 40000 },
      { rank: 3, avatar: 'NG', name: 'NftGuru', score: 1098765, rewards: 30000 },
      { rank: 4, avatar: 'GG', name: 'GameGod', score: 987654, rewards: 25000 },
      { rank: 5, avatar: 'CM', name: 'CoinMaster', score: 876543, rewards: 20000 },
      { rank: 6, avatar: 'EW', name: 'EtherWizard', score: 765432, rewards: 15000 },
      { rank: 7, avatar: 'PS', name: 'PixelSlayer', score: 654321, rewards: 10000 },
      { rank: 8, avatar: 'TX', name: 'TokenX', score: 543210, rewards: 5000 },
      { rank: 9, avatar: 'CP', name: 'CryptoPunk', score: 432109, rewards: 2500 },
      { rank: 10, avatar: 'JS', name: 'John Smith', score: 321098, rewards: 1000 }
    ]
  };
  
  return (
    <AppLayout>
      <div className={styles.pageTitle}>LEADERBOARDS</div>
      
      <div className={styles.leaderboardTabs}>
        <button 
          className={`${styles.tabBtn} ${activePeriod === 'daily' ? styles.active : ''}`}
          onClick={() => setActivePeriod('daily')}
        >
          Daily
        </button>
        <button 
          className={`${styles.tabBtn} ${activePeriod === 'weekly' ? styles.active : ''}`}
          onClick={() => setActivePeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`${styles.tabBtn} ${activePeriod === 'monthly' ? styles.active : ''}`}
          onClick={() => setActivePeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`${styles.tabBtn} ${activePeriod === 'allTime' ? styles.active : ''}`}
          onClick={() => setActivePeriod('allTime')}
        >
          All Time
        </button>
      </div>
      
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Rewards</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData[activePeriod as keyof typeof leaderboardData].map((player) => (
            <tr 
              key={player.rank} 
              className={profile && player.name === profile.username ? styles.highlightedRow : ''}
            >
              <td>
                <span className={`${styles.rank} ${styles['rank' + player.rank]}`}>
                  {player.rank}
                </span>
              </td>
              <td>
                <div className={styles.playerName}>
                  <div className={styles.playerAvatar}>{player.avatar}</div>
                  <span>{player.name}</span>
                </div>
              </td>
              <td>
                <span className={styles.score}>{player.score.toLocaleString()}</span>
              </td>
              <td>{player.rewards.toLocaleString()} points</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
}