"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG } from '@/config';

export interface WalletState {
  isConnected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
}

// Get the network config from our centralized config file
const CHAIN_CONFIG = BLOCKCHAIN_CONFIG.network;

export default function useWallet(): WalletState {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  
  // Function to switch to the correct chain
  const switchToChain = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.ethereum) return false;
    
    try {
      // Try to switch to the chain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_CONFIG.chainId }]
      });
      return true;
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [CHAIN_CONFIG]
          });
          return true;
        } catch (addError) {
          console.error("Error adding chain:", addError);
          return false;
        }
      } else {
        console.error("Error switching to chain:", error);
        return false;
      }
    }
  };
  
  // Create a provider - avoid passing network info to prevent ENS errors
  const createProvider = (ethereum: any) => {
    return new ethers.providers.Web3Provider(ethereum);
  };
  
  // REMOVED auto-connection on initial load
  // This was causing the wallet to open as soon as the page loaded
  
  // Listen for account changes but only AFTER we've connected
  useEffect(() => {
    if (!isConnected || typeof window === 'undefined' || !window.ethereum) return;
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (isConnected) {
        setAddress(accounts[0]);
      }
    };
    
    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      
      // Check if it's not our chain and prompt to switch
      if (parseInt(CHAIN_CONFIG.chainId, 16) !== newChainId) {
        switchToChain();
      } else {
        // Refresh the page if chain change was to our chain
        window.location.reload();
      }
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isConnected]);
  
  // The connect function is now the ONLY place where the wallet connection is initiated
  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access - THIS WILL PROMPT THE USER
        // This is the first and only time MetaMask will open automatically
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts returned from wallet');
        }
        
        // Create provider
        const ethersProvider = createProvider(window.ethereum);
        
        // Switch to correct chain
        const switched = await switchToChain();
        if (!switched) {
          console.warn("Failed to switch to chain, but continuing connection");
        }
        
        // Refresh provider after chain switch
        const refreshedProvider = createProvider(window.ethereum);
        const ethersSigner = refreshedProvider.getSigner();
        
        // Get address
        const connectedAddress = await ethersSigner.getAddress();
        
        // Get network info
        let networkChainId;
        try {
          const network = await refreshedProvider.getNetwork();
          networkChainId = network.chainId;
        } catch (error) {
          console.warn("Error getting network:", error);
          networkChainId = parseInt(CHAIN_CONFIG.chainId, 16);
        }
        
        setProvider(refreshedProvider);
        setSigner(ethersSigner);
        setAddress(connectedAddress);
        setChainId(networkChainId);
        setIsConnected(true);
        
        // Store wallet connection state
        localStorage.setItem('walletConnected', 'true');
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask or another compatible wallet to use this feature');
    }
  };
  
  const disconnect = () => {
    setIsConnected(false);
    setAddress('');
    setProvider(null);
    setSigner(null);
    setChainId(null);
    
    // Remove wallet connection state
    localStorage.removeItem('walletConnected');
  };
  
  return {
    isConnected,
    address,
    connect,
    disconnect,
    provider,
    signer,
    chainId
  }
}