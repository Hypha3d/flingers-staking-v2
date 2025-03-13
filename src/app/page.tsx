// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isConnected, connect, disconnect, isAuthenticated, login, updateProfile } = useAppContext();
  const router = useRouter();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Connect wallet if not already connected
      if (!isConnected) {
        await connect();
      }
      
      // Try to login with wallet
      const success = await login();
      
      if (success) {
        // Update the profile with the entered username
        await updateProfile({ username });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Failed to authenticate with wallet');
        disconnect();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>WELCOME TO HOLOCENE</div>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                className={styles.formControl} 
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            
            {error && <div className={styles.loginError}>{error}</div>}
            
            <button 
              type="submit" 
              className={styles.btnPrimary}
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? 'CONNECTING...' : 'CONNECT & ENTER'}
            </button>
            
            <div className={styles.walletNote}>
              {isConnected ? (
                <span className={styles.walletConnected}>Wallet Connected ✅</span>
              ) : (
                <span>Requires wallet connection via MetaMask</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}