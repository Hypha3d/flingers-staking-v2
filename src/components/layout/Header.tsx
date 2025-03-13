// src/components/layout/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/profile/ProfileModal';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, profile, logout } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  
  const handleLoginClick = () => {
    // If not authenticated, redirect to home page for login
    if (!isAuthenticated) {
      router.push('/');
    }
  };
  
  const handleLogoutClick = () => {
    logout(); // This will call the combined logout function from AppContext
    router.push('/'); // Redirect to home page after logout
    setShowProfileMenu(false);
  };
  
  return (
    <header className={styles.header}>
      <Link href="/dashboard" className={styles.logo}>
        HOLOCENE
      </Link>
      
      <div className={styles.headerRight}>
        {isAuthenticated && profile ? (
          <div className={styles.profile}>
            <div 
              className={styles.profileWrapper}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div 
                className={styles.profileImage}
                style={{ backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none' }}
              >
                {!profile.profileImage && profile.username.charAt(0).toUpperCase()}
              </div>
              <span className={styles.username}>{profile.username}</span>
            </div>
            
            {showProfileMenu && (
              <div className={styles.profileMenu}>
                <button 
                  className={styles.menuItem}
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileMenu(false);
                  }}
                >
                  Edit Profile
                </button>
                <button 
                  className={styles.menuItem}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className={styles.loginButton}
            onClick={handleLoginClick}
          >
            Login
          </button>
        )}
      </div>
      
      {showProfileModal && (
        <ProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </header>
  );
}