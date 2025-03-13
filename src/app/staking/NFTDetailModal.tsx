// src/components/staking/NFTDetailModal.tsx
"use client";

import { useState } from 'react';
import { NFT } from '@/hooks/useNFTs';
import { StakedNFT } from '@/hooks/useStaking';
import styles from '@/app/staking/page.module.css';

interface NFTDetailModalProps {
  nft: NFT | null;
  stakedNft?: StakedNFT;
  isOpen: boolean;
  onClose: () => void;
  onStake?: (tokenId: number) => Promise<void>;
  onUnstake?: (tokenId: number) => Promise<void>;
}

export default function NFTDetailModal({ 
  nft, 
  stakedNft, 
  isOpen, 
  onClose,
  onStake,
  onUnstake
}: NFTDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen || !nft) return null;
  
  const isStaked = !!stakedNft;
  const stakedDate = stakedNft ? new Date(stakedNft.stakedAt).toLocaleDateString() : null;
  const stakedType = stakedNft?.isHardStaked ? 'Hard Staked' : 'Soft Staked';
  
  // Format attributes for display
  const formatAttributes = (attrs: any[] = []) => {
    if (!attrs || attrs.length === 0) return "No attributes";
    
    // Just return the first few attributes for UI simplicity
    return attrs.slice(0, 4).map(attr => 
      `${attr.trait_type || 'Trait'}: ${attr.value}`
    ).join(', ');
  };
  
  const handleAction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isStaked && onUnstake) {
        await onUnstake(nft.tokenId);
      } else if (!isStaked && onStake) {
        await onStake(nft.tokenId);
      }
      onClose();
    } catch (error: any) {
      console.error('Error performing action:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{nft.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.modalImageContainer}>
            {typeof nft.image === 'string' && (nft.image.startsWith('http') || nft.image.startsWith('/')) ? (
              <img src={nft.image} alt={nft.name} className={styles.modalImage} />
            ) : (
              <div className={styles.modalImage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '80px' }}>
                {nft.image || '🖼️'}
              </div>
            )}
          </div>
          
          <div className={styles.modalInfo}>
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Token ID</div>
              <div className={styles.modalInfoValue}>{nft.tokenId}</div>
            </div>
            
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Status</div>
              <div className={styles.modalInfoValue}>
                {isStaked ? stakedType : 'Not Staked'}
              </div>
            </div>
            
            {isStaked && stakedDate && (
              <div className={styles.modalInfoItem}>
                <div className={styles.modalInfoLabel}>Staked Since</div>
                <div className={styles.modalInfoValue}>{stakedDate}</div>
              </div>
            )}
            
            {stakedNft && stakedNft.rewards > 0 && (
              <div className={styles.modalInfoItem}>
                <div className={styles.modalInfoLabel}>Rewards Accrued</div>
                <div className={styles.modalInfoValue}>{stakedNft.rewards} points</div>
              </div>
            )}
            
            <div className={styles.modalInfoItem} style={{ gridColumn: '1 / span 2' }}>
              <div className={styles.modalInfoLabel}>Attributes</div>
              <div className={styles.modalInfoValue}>{formatAttributes(nft.attributes)}</div>
            </div>
          </div>
          
          {(onStake || onUnstake) && (
            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalButton} ${styles.secondaryButton}`} 
                onClick={onClose}
              >
                Close
              </button>
              
              {isStaked && onUnstake ? (
                <button 
                  className={`${styles.modalButton} ${styles.primaryButton}`} 
                  onClick={handleAction}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Unstake NFT'}
                </button>
              ) : !isStaked && onStake ? (
                <button 
                  className={`${styles.modalButton} ${styles.primaryButton}`} 
                  onClick={handleAction}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Stake NFT'}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}