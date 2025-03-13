// src/app/page.tsx
"use client";

import SimpleWalletConnect from '@/components/walletconnect/SimpleWalletConnect';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>WELCOME TO HOLOCENE</div>
          
          <SimpleWalletConnect />
          
          <div className={styles.walletNote}>
            <span>Connect your wallet to enter Holocene</span>
          </div>
        </div>
      </div>
    </main>
  );
}