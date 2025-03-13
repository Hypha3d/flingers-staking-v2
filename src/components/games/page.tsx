"use client";

import AppLayout from '@/components/layout/AppLayout';
import styles from './page.module.css';

export default function Games() {
  const gamesList = [
    {
      title: 'Crypto Dice',
      description: 'Roll the dice and multiply your points. Risk it all for the highest rewards!',
      icon: '🎲',
      players: 1245,
      points: 500
    },
    {
      title: 'NFT Poker',
      description: 'Use your NFTs as poker chips in this high-stakes card game!',
      icon: '🃏',
      players: 834,
      points: 750
    },
    {
      title: 'Moon Rocket',
      description: 'Launch your rocket to the moon. Cash out before it crashes!',
      icon: '🚀',
      players: 2145,
      points: 350
    },
    {
      title: 'Asteroid Miner',
      description: 'Mine asteroids for rare minerals and boost your score!',
      icon: '☄️',
      players: 976,
      points: 600
    }
  ];
  
  return (
    <AppLayout>
      <div className={styles.pageTitle}>SELECT A GAME</div>
      
      <div className={styles.gamesGrid}>
        {gamesList.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <div className={styles.gameImg}>
              {game.icon}
            </div>
            <div className={styles.gameDetails}>
              <div className={styles.gameTitle}>{game.title}</div>
              <div className={styles.gameDesc}>{game.description}</div>
              <div className={styles.gameStats}>
                <span>👥 {game.players} playing</span>
                <span>🏆 {game.points} points</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}