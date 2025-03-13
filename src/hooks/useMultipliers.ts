// src/hooks/useMultipliers.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MULTIPLIER_COLLECTIONS } from '@/config';

// ERC721 Interface
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

export interface CollectionMultiplier {
  address: string;
  name: string;
  requiredAmount: number;
  multiplier: number;
  balance: number;
  active: boolean;
}

export default function useMultipliers(address?: string, isConnected?: boolean, provider?: ethers.providers.Web3Provider | null) {
  const [multipliers, setMultipliers] = useState<CollectionMultiplier[]>([]);
  const [totalMultiplier, setTotalMultiplier] = useState(1); // Default multiplier is 1x
  const [isLoading, setIsLoading] = useState(false);
  
  // Load multipliers when connected
  const loadMultipliers = useCallback(async () => {
    // Start with default state
    setMultipliers(MULTIPLIER_COLLECTIONS.map(collection => ({
      ...collection,
      balance: 0,
      active: false
    })));
    
    // If not connected, return early with defaults
    if (!isConnected || !provider || !address) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const multiplierPromises = MULTIPLIER_COLLECTIONS.map(async (collection) => {
        try {
          const contract = new ethers.Contract(
            collection.address,
            ERC721_ABI,
            provider
          );
          
          const balance = await contract.balanceOf(address);
          const balanceNumber = balance.toNumber();
          
          // Check if meets requirement
          const active = balanceNumber >= collection.requiredAmount;
          
          return {
            ...collection,
            balance: balanceNumber,
            active
          };
        } catch (err) {
          console.error(`Error checking collection ${collection.name}:`, err);
          return {
            ...collection,
            balance: 0,
            active: false
          };
        }
      });
      
      const results = await Promise.all(multiplierPromises);
      setMultipliers(results);
      
      // Calculate total multiplier (only the highest applies)
      const activeMultipliers = results.filter(m => m.active);
      const highestMultiplier = activeMultipliers.length > 0
        ? Math.max(...activeMultipliers.map(m => m.multiplier))
        : 1;
      
      setTotalMultiplier(highestMultiplier);
    } catch (err) {
      console.error("Error loading multipliers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, provider]);
  
  useEffect(() => {
    loadMultipliers().catch(err => {
      console.error("Unhandled error in loadMultipliers:", err);
    });
  }, [loadMultipliers]);
  
  return {
    multipliers,
    totalMultiplier,
    isLoading,
    refreshMultipliers: loadMultipliers
  };
}