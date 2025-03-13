// src/app/staking/page.tsx
"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import useStaking, { StakedNFT } from '@/hooks/useStaking';
import useNFTs, { NFT } from '@/hooks/useNFTs';
import { getFallbackNfts } from '@/utils/fallbackNfts';
import MultipliersDisplay from '@/components/staking/MultipliersDisplay';
import NFTDetailModal from '@/app/staking/NFTDetailModal'; // Ensure this path is correct or update it to the correct path
import { BLOCKCHAIN_CONFIG } from '@/config';
import styles from './page.module.css';

// Get contract addresses from config
const NFT_COLLECTION_ADDRESS = BLOCKCHAIN_CONFIG.contracts.nftCollection;
const STAKING_CONTRACT_ADDRESS = BLOCKCHAIN_CONFIG.contracts.staking;

export default function Staking() {
  const { 
    isConnected, 
    address, 
    connect, 
    disconnect, 
    provider, 
    signer,
    isAuthenticated,
    profile,
    login,
    totalMultiplier
  } = useAppContext();
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('all');
  
  // State for NFT modal
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedStakedNFT, setSelectedStakedNFT] = useState<StakedNFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get fallback NFTs
  const fallbackNfts = getFallbackNfts();
  
  // Fetch NFTs from the collection
  const { nfts: ownedNfts, isLoading: isLoadingNfts, error: nftError } = useNFTs({
    collectionAddress: NFT_COLLECTION_ADDRESS,
    ownerAddress: address,
    isConnected,
    provider
  });
  
  // Staking functionality
  const { 
    hardStakedNfts, 
    softStakedNfts, 
    totalRewards, 
    isLoading: isLoadingStaking, 
    error: stakingError,
    hardStakeNft,
    unstakeNft,
    claimRewards,
    getClaimFee
  } = useStaking({
    address,
    isConnected,
    provider,
    signer
  });
  
  // State to track which NFTs are being displayed
  const [displayedNfts, setDisplayedNfts] = useState<NFT[]>([]);
  const [displayedHardStaked, setDisplayedHardStaked] = useState<StakedNFT[]>([]);
  const [displayedSoftStaked, setDisplayedSoftStaked] = useState<StakedNFT[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  
  // Effect to handle authentication when connected
  useEffect(() => {
    if (isConnected && !isAuthenticated) {
      login();
    }
  }, [isConnected, isAuthenticated, login]);
  
  // Effect to update displayed NFTs
  useEffect(() => {
    if (isConnected) {
      if (ownedNfts.length > 0 || hardStakedNfts.length > 0 || softStakedNfts.length > 0) {
        // Using real data
        setUsingSampleData(false);
        setDisplayedNfts(ownedNfts);
        setDisplayedHardStaked(hardStakedNfts);
        setDisplayedSoftStaked(softStakedNfts);
      } else if (nftError || stakingError) {
        // Error fetching data, use fallback
        console.warn("Using fallback NFTs due to error:", nftError || stakingError);
        setUsingSampleData(true);
        
        // Split fallback NFTs between different categories
        const fallbackHardStaked: StakedNFT[] = fallbackNfts.slice(0, 2).map(nft => ({
          tokenId: nft.tokenId,
          stakedAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
          isHardStaked: true,
          rewards: 0
        }));
        
        const fallbackSoftStaked: StakedNFT[] = fallbackNfts.slice(2, 4).map(nft => ({
          tokenId: nft.tokenId,
          stakedAt: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
          isHardStaked: false,
          rewards: 75 // Example reward
        }));
        
        setDisplayedNfts(fallbackNfts.slice(4, 8));
        setDisplayedHardStaked(fallbackHardStaked);
        setDisplayedSoftStaked(fallbackSoftStaked);
      }
    } else {
      // Not connected, use fallback data
      console.log("Using fallback NFTs (not connected)");
      setUsingSampleData(true);
      
      // Split fallback NFTs between different categories
      const fallbackHardStaked: StakedNFT[] = fallbackNfts.slice(0, 2).map(nft => ({
        tokenId: nft.tokenId,
        stakedAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
        isHardStaked: true,
        rewards: 0
      }));
      
      const fallbackSoftStaked: StakedNFT[] = fallbackNfts.slice(2, 4).map(nft => ({
        tokenId: nft.tokenId,
        stakedAt: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
        isHardStaked: false,
        rewards: 75 // Example reward
      }));
      
      setDisplayedNfts(fallbackNfts.slice(4, 8));
      setDisplayedHardStaked(fallbackHardStaked);
      setDisplayedSoftStaked(fallbackSoftStaked);
    }
  }, [isConnected, ownedNfts, hardStakedNfts, softStakedNfts, nftError, stakingError, address, fallbackNfts]);
  
  // Handler for NFT card click - opens modal with NFT details
  const handleNFTClick = (nft: NFT, stakedNft?: StakedNFT) => {
    setSelectedNFT(nft);
    setSelectedStakedNFT(stakedNft || null);
    setIsModalOpen(true);
  };
  
  // Event handlers for staking actions
  const handleStakeNft = async (tokenId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await hardStakeNft(tokenId);
    } catch (error: any) {
      alert(`Error staking NFT: ${error.message}`);
    }
  };
  
  const handleUnstakeNft = async (tokenId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await unstakeNft(tokenId);
    } catch (error: any) {
      alert(`Error unstaking NFT: ${error.message}`);
    }
  };
  
  const handleClaimRewards = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await claimRewards();
      alert(`Successfully claimed ${totalRewards} reward points!`);
    } catch (error: any) {
      alert(`Error claiming rewards: ${error.message}`);
    }
  };
  
  // Calculate total rewards with multiplier and fee
  const calculatedRewards = Math.floor(totalRewards * totalMultiplier);
  const bonusRewards = calculatedRewards - totalRewards;
  const claimFee = getClaimFee(calculatedRewards);
  const netRewards = calculatedRewards - claimFee;
  
  // Helper function to find a staked NFT object from a regular NFT
  const findStakedNFTByTokenId = (tokenId: number): StakedNFT | undefined => {
    return [...displayedHardStaked, ...displayedSoftStaked].find(
      stakedNft => stakedNft.tokenId === tokenId
    );
  };
  
  // Helper to find a full NFT object from a staked NFT
  const findNFTByTokenId = (tokenId: number): NFT | undefined => {
    // Look in owned NFTs first
    const ownedNFT = displayedNfts.find(nft => nft.tokenId === tokenId);
    if (ownedNFT) return ownedNFT;
    
    // Otherwise create a placeholder NFT from fallback data
    const fallbackNFT = fallbackNfts.find(nft => nft.tokenId === tokenId);
    if (fallbackNFT) return fallbackNFT;
    
    // As a last resort, create a minimal NFT object
    return {
      id: `NFT #${tokenId}`,
      tokenId: tokenId,
      name: `Flinger #${tokenId}`,
      image: `/fallback/nfts/images/${tokenId % 20 + 1}.png`,
      owner: address || '0x0'
    };
  };
  
  // Filter NFTs based on active tab
  const getFilteredNFTs = () => {
    switch (activeTab) {
      case 'unstaked':
        return displayedNfts;
      case 'hardstaked':
        return displayedHardStaked.map(stakedNft => {
          return {
            stakedNft,
            nft: findNFTByTokenId(stakedNft.tokenId)
          };
        }).filter(item => item.nft !== undefined);
      case 'softstaked':
        return displayedSoftStaked.map(stakedNft => {
          return {
            stakedNft,
            nft: findNFTByTokenId(stakedNft.tokenId)
          };
        }).filter(item => item.nft !== undefined);
      case 'all':
      default:
        const unstaked = displayedNfts.map(nft => ({ nft }));
        const hardStaked = displayedHardStaked.map(stakedNft => ({
          stakedNft,
          nft: findNFTByTokenId(stakedNft.tokenId)
        })).filter(item => item.nft !== undefined);
        const softStaked = displayedSoftStaked.map(stakedNft => ({
          stakedNft,
          nft: findNFTByTokenId(stakedNft.tokenId)
        })).filter(item => item.nft !== undefined);
        
        return [...unstaked, ...hardStaked, ...softStaked];
    }
  };
  
  const filteredNFTs = getFilteredNFTs();
  
  return (
    <AppLayout>
      <div className={styles.pageTitle}>NFT STAKING</div>
      
      <div className={styles.walletInfo}>
        <div>
          <div>Connect your wallet to see your Flingers NFTs</div>
          <div className={styles.walletAddress}>
            {isConnected 
              ? `${address.slice(0, 6)}...${address.slice(-4)}` 
              : 'Not connected'}
          </div>
        </div>
        {!isConnected ? (
          <button className={styles.connectBtn} onClick={connect}>
            Connect Wallet
          </button>
        ) : (
          <button className={styles.disconnectBtn} onClick={disconnect}>
            Disconnect
          </button>
        )}
      </div>
      
      {isConnected && isAuthenticated && profile && (
        <div className={styles.profileBanner}>
          <div 
            className={styles.profileImage}
            style={{ backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none' }}
          >
            {!profile.profileImage && profile.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileUsername}>{profile.username}</div>
            <div className={styles.profileMultiplier}>Staking Multiplier: {totalMultiplier}x</div>
          </div>
        </div>
      )}
      
      {/* Multipliers Display */}
      <MultipliersDisplay />
      
      {/* Rewards section */}
      <div className={styles.rewardsSection}>
        <div className={styles.rewardsHeader}>
          <div>
            <div className={styles.sectionTitle}>Staking Rewards</div>
            <div className={styles.rewardValue}>{calculatedRewards} points</div>
            <div className={styles.multiplierInfo}>
              Base: {totalRewards} points × {totalMultiplier}x multiplier
              {bonusRewards > 0 && ` = +${bonusRewards} bonus`}
              {claimFee > 0 && ` • Fee: ${claimFee} points (Net: ${netRewards})`}
            </div>
          </div>
          <button 
            className={`${styles.claimBtn} ${calculatedRewards === 0 ? styles.disabled : ''}`}
            onClick={handleClaimRewards}
            disabled={calculatedRewards === 0}
          >
            Claim Rewards
          </button>
        </div>
        <div className={styles.rewardInfo}>
          <p>Hard staking: 10 points per NFT per day. Must be staked in contract.</p>
          <p>Soft staking: 5 points per NFT per day. Automatically applied to all owned NFTs.</p>
          <p>Your multiplier: {totalMultiplier}x - Increases all rewards based on your collections.</p>
        </div>
      </div>
      
      {isConnected && (isLoadingNfts || isLoadingStaking) && !usingSampleData ? (
        <div className={styles.loadingState}>
          Loading your NFTs...
        </div>
      ) : isConnected && (nftError || stakingError) && !usingSampleData ? (
        <div className={styles.errorState}>
          <div>Error loading NFTs: {nftError || stakingError}</div>
          <div className={styles.errorHelp}>
            Showing fallback NFTs for demonstration purposes.
          </div>
        </div>
      ) : (
        <div className={styles.tabsContainer}>
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All NFTs
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'unstaked' ? styles.active : ''}`}
              onClick={() => setActiveTab('unstaked')}
            >
              Unstaked ({displayedNfts.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'hardstaked' ? styles.active : ''}`}
              onClick={() => setActiveTab('hardstaked')}
            >
              Hard Staked ({displayedHardStaked.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'softstaked' ? styles.active : ''}`}
              onClick={() => setActiveTab('softstaked')}
            >
              Soft Staked ({displayedSoftStaked.length})
            </button>
          </div>
          
          {/* NFT Grid */}
          <div className={styles.nftContainer}>
            <div className={styles.nftGrid}>
              {filteredNFTs.length > 0 ? (
                filteredNFTs.map((item: any, index) => {
                  const nft = item.nft;
                  const stakedNft = item.stakedNft || findStakedNFTByTokenId(nft.tokenId);
                  const isStaked = !!stakedNft;
                  
                  return (
                    <div 
                      key={`${nft.id}-${index}`} 
                      className={styles.nftCard}
                      onClick={() => handleNFTClick(nft, stakedNft)}
                    >
                      <div className={styles.nftImg}>
                        {typeof nft.image === 'string' && (nft.image.startsWith('http') || nft.image.startsWith('/')) ? (
                          <img src={nft.image} alt={nft.name} className={styles.nftImage} />
                        ) : (
                          nft.image || '🖼️'
                        )}
                      </div>
                      <div className={styles.nftDetails}>
                        <div className={styles.nftTitle}>{nft.name}</div>
                        <div className={styles.nftId}>{nft.id}</div>
                        
                        {isStaked && (
                          <>
                            <div className={styles.stakeDate}>
                              {stakedNft.isHardStaked ? 'Hard' : 'Soft'} Staked: {new Date(stakedNft.stakedAt).toLocaleDateString()}
                            </div>
                            {stakedNft.rewards > 0 && (
                              <div className={styles.rewardAccrued}>
                                Rewards: {stakedNft.rewards} points
                              </div>
                            )}
                          </>
                        )}
                        
                        {!isStaked && (
                          <button 
                            className={styles.stakeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStakeNft(nft.tokenId);
                            }}
                          >
                            Stake
                          </button>
                        )}
                        
                        {isStaked && stakedNft.isHardStaked && (
                          <button 
                            className={styles.stakeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnstakeNft(stakedNft.tokenId);
                            }}
                          >
                            Unstake
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyState}>
                  No NFTs found in this category
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* NFT Detail Modal */}
      <NFTDetailModal
        nft={selectedNFT}
        stakedNft={selectedStakedNFT || undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStake={handleStakeNft}
        onUnstake={handleUnstakeNft}
      />
    </AppLayout>
  );
}