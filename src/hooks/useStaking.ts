// src/hooks/useStaking.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, STAKING_CONFIG } from '@/config';

// Basic staking contract ABI - replace with your actual contract ABI
const STAKING_ABI = [
  "function stake(uint256 tokenId) external",
  "function unstake(uint256 tokenId) external",
  "function getStakedTokens(address owner) view returns (uint256[])",
  "function getRewards(address owner) view returns (uint256)",
  "function claimRewards() external"
];

// Basic ERC721 ABI for NFT collection
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)"
];

export interface StakedNFT {
  tokenId: number;
  stakedAt: number; // timestamp
  isHardStaked: boolean; // true for contract staked, false for soft staking
  rewards: number; // accumulated rewards
}

interface UseStakingProps {
  address: string;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

export default function useStaking({
  address,
  isConnected,
  provider,
  signer
}: UseStakingProps) {
  // Use contract addresses from config
  const nftContractAddress = BLOCKCHAIN_CONFIG.contracts.nftCollection;
  const stakingContractAddress = BLOCKCHAIN_CONFIG.contracts.staking;

  const [hardStakedNfts, setHardStakedNfts] = useState<StakedNFT[]>([]);
  const [softStakedNfts, setSoftStakedNfts] = useState<StakedNFT[]>([]);
  const [unstakedNfts, setUnstakedNfts] = useState<number[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Constants for reward calculation from config
  const HARD_STAKING_REWARD_RATE = STAKING_CONFIG.hardStakingRewardRate;
  const SOFT_STAKING_REWARD_RATE = STAKING_CONFIG.softStakingRewardRate;
  
  // Calculate soft staking rewards
  const calculateSoftStakingRewards = useCallback((nft: StakedNFT) => {
    if (!nft.isHardStaked) {
      const daysStaked = (Date.now() - nft.stakedAt) / (1000 * 60 * 60 * 24);
      return Math.floor(daysStaked * SOFT_STAKING_REWARD_RATE);
    }
    return 0;
  }, [SOFT_STAKING_REWARD_RATE]);
  
  // Fetch all NFTs and determine their staking status
  const fetchNFTs = useCallback(async () => {
    if (!isConnected || !provider || !address || !nftContractAddress || !stakingContractAddress) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create contract instances
      const nftContract = new ethers.Contract(
        nftContractAddress,
        ERC721_ABI,
        provider
      );
      
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        STAKING_ABI,
        provider
      );
      
      // 1. Get all tokens hard staked in the staking contract
      let hardStakedTokenIds: number[] = [];
      try {
        const result = await stakingContract.getStakedTokens(address);
        hardStakedTokenIds = result.map((id: ethers.BigNumber) => id.toNumber());
      } catch (err) {
        console.error("Error fetching hard staked tokens:", err);
        hardStakedTokenIds = [];
      }
      
      // 2. Get total rewards from staking contract
      let contractRewards = 0;
      try {
        const rewardsAmount = await stakingContract.getRewards(address);
        contractRewards = parseInt(ethers.utils.formatUnits(rewardsAmount, 0));
      } catch (err) {
        console.error("Error fetching rewards:", err);
      }
      
      // 3. Get all owned tokens from NFT contract
      const balance = await nftContract.balanceOf(address);
      const balanceNumber = balance.toNumber();
      
      const tokenIdPromises = [];
      for (let i = 0; i < balanceNumber; i++) {
        tokenIdPromises.push(nftContract.tokenOfOwnerByIndex(address, i));
      }
      
      const ownedTokenIds = (await Promise.all(tokenIdPromises))
        .map((id: ethers.BigNumber) => id.toNumber());
      
      // 4. Create hardStaked NFTs array
      const hardStaked = hardStakedTokenIds.map(tokenId => ({
        tokenId,
        stakedAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // Example: staked a week ago
        isHardStaked: true,
        rewards: 0 // Rewards come from contract
      }));
      
      // 5. Determine soft staked NFTs (owned but not listed)
      // This would require marketplace contract integration
      // For now, we'll consider all owned tokens as soft staked
      const softStaked = ownedTokenIds.map(tokenId => {
        const existingNft = softStakedNfts.find(nft => nft.tokenId === tokenId);
        const stakedAt = existingNft?.stakedAt || Date.now() - (3 * 24 * 60 * 60 * 1000); // Default: 3 days ago
        
        return {
          tokenId,
          stakedAt,
          isHardStaked: false,
          rewards: calculateSoftStakingRewards({
            tokenId,
            stakedAt,
            isHardStaked: false,
            rewards: 0
          })
        };
      });
      
      // 6. Calculate total rewards (hard staking + soft staking)
      const softStakingTotal = softStaked.reduce((sum, nft) => sum + nft.rewards, 0);
      const totalRewardsAmount = contractRewards + softStakingTotal;
      
      setHardStakedNfts(hardStaked);
      setSoftStakedNfts(softStaked);
      setUnstakedNfts([]); // For now, we don't track "unstaked" separately
      setTotalRewards(totalRewardsAmount);
      
    } catch (err: any) {
      console.error('Error fetching NFTs and staking info:', err);
      setError(err.message || 'Failed to fetch staking information');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, provider, nftContractAddress, stakingContractAddress, calculateSoftStakingRewards, softStakedNfts]);
  
  // Initial load and refresh interval
  useEffect(() => {
    fetchNFTs();
    
    // Refresh every minute
    const intervalId = setInterval(fetchNFTs, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchNFTs]);
  
  // Hard stake an NFT
  const hardStakeNft = async (tokenId: number) => {
    if (!isConnected || !signer || !stakingContractAddress || !nftContractAddress) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // First approve the NFT transfer
      const nftContract = new ethers.Contract(
        nftContractAddress,
        ["function approve(address to, uint256 tokenId) external"],
        signer
      );
      
      const approveTx = await nftContract.approve(stakingContractAddress, tokenId);
      await approveTx.wait();
      
      // Then stake the NFT
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        STAKING_ABI,
        signer
      );
      
      const stakeTx = await stakingContract.stake(tokenId);
      await stakeTx.wait();
      
      // Refresh NFT lists
      await fetchNFTs();
      
      return true;
    } catch (err: any) {
      console.error('Error staking NFT:', err);
      throw new Error(err.message || 'Failed to stake NFT');
    }
  };
  
  // Unstake an NFT from hard staking
  const unstakeNft = async (tokenId: number) => {
    if (!isConnected || !signer || !stakingContractAddress) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        STAKING_ABI,
        signer
      );
      
      const unstakeTx = await stakingContract.unstake(tokenId);
      await unstakeTx.wait();
      
      // Refresh NFT lists
      await fetchNFTs();
      
      return true;
    } catch (err: any) {
      console.error('Error unstaking NFT:', err);
      throw new Error(err.message || 'Failed to unstake NFT');
    }
  };
  
  // Claim rewards
  const claimRewards = async () => {
    if (!isConnected || !signer || !stakingContractAddress) {
      throw new Error('Wallet not connected');
    }
    
    // Check if rewards meet minimum claim amount
    if (totalRewards < STAKING_CONFIG.minClaimAmount) {
      throw new Error(`Minimum claim amount is ${STAKING_CONFIG.minClaimAmount} points`);
    }
    
    try {
      // For hard staking rewards
      if (hardStakedNfts.length > 0) {
        const stakingContract = new ethers.Contract(
          stakingContractAddress,
          STAKING_ABI,
          signer
        );
        
        const claimTx = await stakingContract.claimRewards();
        await claimTx.wait();
      }
      
      // For soft staking, we just reset the rewards in our state
      // In a real app, this would involve a backend call
      setSoftStakedNfts(prev => 
        prev.map(nft => ({
          ...nft,
          rewards: 0,
          stakedAt: Date.now() // Reset staking start time
        }))
      );
      
      // Reset total rewards
      setTotalRewards(0);
      
      return true;
    } catch (err: any) {
      console.error('Error claiming rewards:', err);
      throw new Error(err.message || 'Failed to claim rewards');
    }
  };
  
  // Calculate claim fee
  const getClaimFee = (amount: number) => {
    return Math.floor(amount * (STAKING_CONFIG.claimFee / 100));
  };
  
  return {
    hardStakedNfts,
    softStakedNfts,
    unstakedNfts,
    totalRewards,
    isLoading,
    error,
    hardStakeNft,
    unstakeNft,
    claimRewards,
    getClaimFee,
    refreshNfts: fetchNFTs
  };
}