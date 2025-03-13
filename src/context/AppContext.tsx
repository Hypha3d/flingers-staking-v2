// src/context/AppContext.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useWallet from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import useMultipliers from '@/hooks/useMultipliers';

interface AppContextProps {
  // Wallet state
  isConnected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: any;
  signer: any;
  
  // Auth state
  isAuthenticated: boolean;
  profile: any;
  login: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: any) => Promise<boolean>;
  
  // Multiplier state
  multipliers: any[];
  totalMultiplier: number;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const walletState = useWallet();
  const authState = useAuth(walletState.isConnected, walletState.address);
  const multiplierState = useMultipliers(
    walletState.address, 
    walletState.isConnected, 
    walletState.provider
  );
  
  // Handle wallet disconnection - ensure user is logged out
  useEffect(() => {
    if (!walletState.isConnected && authState.isAuthenticated) {
      authState.logout();
    }
  }, [walletState.isConnected, authState.isAuthenticated, authState.logout]);
  
  // Handle login with wallet
  const handleLogin = async () => {
    if (!walletState.isConnected) {
      await walletState.connect();
    }
    
    if (walletState.address && walletState.signer) {
      return authState.login(walletState.address, walletState.signer);
    }
    return false;
  };
  
  // Handle logout - disconnect wallet too
  const handleLogout = () => {
    authState.logout();
    walletState.disconnect();
  };
  
  const value = {
    // Wallet state
    isConnected: walletState.isConnected,
    address: walletState.address,
    connect: walletState.connect,
    disconnect: walletState.disconnect,
    provider: walletState.provider,
    signer: walletState.signer,
    
    // Auth state
    isAuthenticated: authState.isAuthenticated,
    profile: authState.profile,
    login: handleLogin,
    logout: handleLogout, // Use the combined logout function
    updateProfile: authState.updateProfile,
    
    // Multiplier state
    multipliers: multiplierState.multipliers,
    totalMultiplier: multiplierState.totalMultiplier,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}