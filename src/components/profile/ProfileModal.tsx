// src/components/profile/ProfileModal.tsx
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAppContext();
  const [username, setUsername] = useState(profile?.username || '');
  const [profileImage, setProfileImage] = useState<string | undefined>(profile?.profileImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen || !profile) return null;
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const success = await updateProfile({
        username,
        profileImage
      });
      
      if (success) {
        onClose();
      } else {
        setError('Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Edit Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.profileImageContainer}>
            <div 
              className={styles.profileImage}
              style={{ backgroundImage: profileImage ? `url(${profileImage})` : 'none' }}
            >
              {!profileImage && profile.address.substring(2, 4).toUpperCase()}
            </div>
            <button 
              type="button" 
              className={styles.changeImageButton}
              onClick={() => fileInputRef.current?.click()}
            >
              Change Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className={styles.hiddenInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Choose a username"
            />
          </div>
          
          <div className={styles.addressDisplay}>
            <span className={styles.addressLabel}>Wallet Address:</span>
            <span className={styles.address}>
              {profile.address.substring(0, 6)}...{profile.address.substring(profile.address.length - 4)}
            </span>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}