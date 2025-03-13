// src/components/WalletConnect.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from './WalletConnect.module.css';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onError: (message: string) => void;
}

export default function WalletConnect({ onConnect, onError }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  
  // Check if user has wallet installed
  const hasWallet = typeof window !== 'undefined' && !!window.ethereum;

  // Only check for existing connections without requesting access
  useEffect(() => {
    const checkIfAlreadyConnected = async () => {
      if (!hasWallet || !window.ethereum) return;
      
      try {
        // This only checks existing connections without prompting
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' // Not eth_requestAccounts which prompts
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };
    
    checkIfAlreadyConnected();
  }, [hasWallet]);
  
  // Listen for account changes
  useEffect(() => {
    if (!hasWallet || !window.ethereum) return;
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setConnected(false);
        setAddress(null);
      } else if (accounts[0] !== address) {
        // Account changed
        setAddress(accounts[0]);
        setConnected(true);
        // Only notify parent if we're already in connected state
        if (connected) {
          onConnect(accounts[0]);
        }
      }
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [hasWallet, address, connected, onConnect]);
  
  const connectWallet = async () => {
    if (!hasWallet || !window.ethereum) {
      onError('No Ethereum wallet detected. Please install MetaMask or another compatible wallet.');
      return;
    }
    
    setConnecting(true);
    
    try {
      // This will prompt the user to connect
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setConnected(true);
        // Only call onConnect when explicitly connecting via button
        onConnect(accounts[0]);
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      onError(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };
  
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <div className={styles.walletConnect}>
      {!connected ? (
        <button 
          className={styles.connectButton}
          onClick={connectWallet}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className={styles.connectedWallet}>
          <div className={styles.addressBadge}>
            <div className={styles.indicator}></div>
            {formatAddress(address!)}
          </div>
        </div>
      )}
    </div>
  );
}