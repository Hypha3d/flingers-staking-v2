// context/PlayerContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

interface PlayerContextType {
  // Context properties and functions
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  // State and functions

  return (
    <PlayerContext.Provider value={{ /* context values */ }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}