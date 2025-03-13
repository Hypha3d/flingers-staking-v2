// src/components/staking/MultipliersDisplay.tsx
"use client";

import { useState } from 'react';
import useMultipliers, { CollectionMultiplier } from '@/hooks/useMultipliers';
import styles from './MultipliersDisplay.module.css';

export default function MultipliersDisplay() {
  const { multipliers, totalMultiplier, isLoading } = useMultipliers();
  const [error, setError] = useState<string | null>(null);
  
  // Show fallback multiplier data if there's an error or no multipliers
  const showFallbackData = error !== null || (!isLoading && multipliers.length === 0);
  
  // Sample fallback data
  const fallbackMultipliers: CollectionMultiplier[] = [
    {
      address: "0x123",
      name: "Mega Collection",
      requiredAmount: 10,
      multiplier: 2.0,
      balance: 5,
      active: false
    },
    {
      address: "0x456",
      name: "Special Collection",
      requiredAmount: 5,
      multiplier: 1.5,
      balance: 5,
      active: true
    },
    {
      address: "0x789",
      name: "Basic Collection",
      requiredAmount: 1,
      multiplier: 1.2,
      balance: 2,
      active: true
    }
  ];
  
  // Choose which multipliers data to display
  const displayMultipliers = showFallbackData ? fallbackMultipliers : multipliers;
  const displayTotalMultiplier = showFallbackData ? 1.5 : totalMultiplier;
  
  if (isLoading) {
    return <div className={styles.loading}>Loading multipliers...</div>;
  }
  
  return (
    <div className={styles.multipliersContainer}>
      <div className={styles.header}>
        <h3>Staking Multipliers</h3>
        <div className={styles.totalMultiplier}>
          Total: <span>{displayTotalMultiplier}x</span>
        </div>
        {showFallbackData && (
          <span className={styles.sampleDataBadge}>Sample Data</span>
        )}
      </div>
      
      <div className={styles.multipliersList}>
        {displayMultipliers.map((multiplier, index) => (
          <MultiplierCard key={index} multiplier={multiplier} />
        ))}
      </div>
    </div>
  );
}

function MultiplierCard({ multiplier }: { multiplier: CollectionMultiplier }) {
  return (
    <div className={`${styles.multiplierCard} ${multiplier.active ? styles.active : ''}`}>
      <div className={styles.multiplierName}>{multiplier.name}</div>
      <div className={styles.multiplierDetails}>
        <div className={styles.multiplierValue}>{multiplier.multiplier}x</div>
        <div className={styles.requirement}>
          {multiplier.balance}/{multiplier.requiredAmount} NFTs
        </div>
      </div>
      <div className={styles.statusBadge}>
        {multiplier.active ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
}