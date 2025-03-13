// src/components/layout/AppLayout.tsx (Updated)
"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Header from './Header';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    if (requireAuth && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/');
    }
  }, [requireAuth, isAuthenticated, router]);
  
  // Only show content if authenticated or auth not required
  const showContent = !requireAuth || isAuthenticated;
  
  return (
    <div className="container">
      <Header />
      
      <div className={styles.content}>
        {showContent && children}
      </div>
      
      <Navbar />
    </div>
  );
}