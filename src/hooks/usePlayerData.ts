import { useState } from "react";

// hooks/usePlayerData.ts
export function usePlayerData() {
    const [playerLevel, setPlayerLevel] = useState(1);
    const [playerXp, setPlayerXp] = useState(0);
    // ...other player-related state
  
    const addPlayerXp = (amount: number) => {
      // XP adding logic
    };
  
    // Other player-related functions
  
    return {
      playerLevel,
      playerXp,
      addPlayerXp,
      // ...other state and functions
    };
  }