// src/components/SimpleWalletConnect.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import styles from './SimpleWalletConnect.module.css';

export default function SimpleWalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { connect, login } = useAppContext();
  
  const handleConnectClick = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Step 1: Connect wallet
      await connect();
      
      // Step 2: Login (this will handle both sign-up and login)
      const success = await login();
      
      // Step 3: Redirect if successful
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Failed to authenticate. Please try again.');
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <button 
        className={styles.connectButton}
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}