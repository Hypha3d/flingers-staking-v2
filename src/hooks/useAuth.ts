// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { saveToStorage, getFromStorage } from '@/utils/localStorage';
import { DEFAULT_PROFILE_CONFIG } from '@/config';

interface UserProfile {
  address: string;
  username: string;
  profileImage?: string;
  createdAt: number; // timestamp
  multipliers: {
    [collectionAddress: string]: number;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (address: string, signer: ethers.Signer) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

export default function useAuth(isConnected?: boolean, address?: string): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to create a default username from wallet address
  const getDefaultUsername = (walletAddress: string) => {
    if (DEFAULT_PROFILE_CONFIG.useWalletAddressAsDefaultUsername) {
      // Truncate the address: 0x1234...5678
      return `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
    } else {
      // Use the previous default pattern
      return `User_${walletAddress.substring(2, 8)}`;
    }
  };
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (!address) return;
      
      // Check if we have stored profile
      const profileKey = `profile_${address.toLowerCase()}`;
      const storedProfile = getFromStorage<UserProfile | null>(profileKey, null);
      
      if (storedProfile) {
        setProfile(storedProfile);
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [address]);
  
  // Sign message and authenticate
  const login = async (walletAddress: string, signer: ethers.Signer): Promise<boolean> => {
    if (!walletAddress || !signer) {
      setError("Wallet not connected properly");
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a message for the user to sign
      const message = `Welcome Flinger! Please,ign this message to authenticate with Holocene's mainframe\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`;
      
      // Have the user sign it
      const signature = await signer.signMessage(message);
      
      // Verify signature (in a real app, you'd verify this on your backend)
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new Error("Signature verification failed");
      }
      
      // Check if profile exists
      const profileKey = `profile_${walletAddress.toLowerCase()}`;
      const storedProfile = getFromStorage<UserProfile | null>(profileKey, null);
      
      if (storedProfile) {
        // User exists, load profile
        setProfile(storedProfile);
      } else {
        // New user, create profile
        const newProfile: UserProfile = {
          address: walletAddress,
          username: getDefaultUsername(walletAddress), // Use wallet address as default username
          createdAt: Date.now(),
          multipliers: {}
        };
        
        saveToStorage(profileKey, newProfile);
        setProfile(newProfile);
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Failed to authenticate");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Log out
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
  }, []);
  
  // Update profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!profile || !address) {
      console.warn("Not authenticated, skipping profile update");
      return false;
    }
    
    try {
      const updatedProfile = {
        ...profile,
        ...data
      };
      
      const profileKey = `profile_${address.toLowerCase()}`;
      saveToStorage(profileKey, updatedProfile);
      setProfile(updatedProfile);
      return true;
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
      return false;
    }
  };
  
  return {
    isAuthenticated,
    profile,
    isLoading,
    error,
    login,
    logout,
    updateProfile
  };
}