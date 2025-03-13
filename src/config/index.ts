// src/config/index.ts

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
    // Network configuration
    network: {
      chainId: "0x" + (33139).toString(16), // ApeChain Chain ID
      chainName: "ApeChain",
      nativeCurrency: {
        name: "APE",
        symbol: "APE",
        decimals: 18
      },
      rpcUrls: ["https://apechain.calderachain.xyz/http"],
      blockExplorerUrls: ["https://apechain.calderaexplorer.xyz/"]
    },
    
    // Contract addresses
    contracts: {
      nftCollection: "0x7bc055530c2FeE8D596CD0E4839584D2aFF717fF",
      staking: "0xYourStakingContractAddressHere"
    }
  };
  
  // NFT Collections with Multipliers
  export const MULTIPLIER_COLLECTIONS = [
    {
      address: "0x7bc055530c2FeE8D596CD0E4839584D2aFF717fF",
      name: "Flingers Collection",
      requiredAmount: 1,
      multiplier: 1.5
    },
    {
      address: "0x456789AbcdefGhijklMnopqrsTuvwxyz0123",
      name: "Special Collection",
      requiredAmount: 5,
      multiplier: 2.0
    },
    {
      address: "0xAbcdef0123456789GhijklMnopqrsTuvwxyz",
      name: "Rare Collection",
      requiredAmount: 3,
      multiplier: 2.5
    }
  ];
  
  // Staking Rewards Configuration
  export const STAKING_CONFIG = {
    // Hard staking (contract-based) rewards per day per NFT
    hardStakingRewardRate: 10,
    
    // Soft staking (ownership-based) rewards per day per NFT
    softStakingRewardRate: 5,
  
    // Claim fee (percentage)
    claimFee: 2.5,
    
    // Minimum claim amount
    minClaimAmount: 100
  };
  
  // Default profile settings
  export const DEFAULT_PROFILE_CONFIG = {
    // If true, will use a truncated wallet address as username for new users
    useWalletAddressAsDefaultUsername: true,
    
    // Starting balance for new users
    startingBalance: 1000
  };
  
  // Application settings
  export const APP_CONFIG = {
    // App name
    name: "Flingers Hub",
    
    // Version
    version: "1.0.0",
    
    // Support email
    supportEmail: "support@flingershub.com",
    
    // Terms of service URL
    termsUrl: "https://flingershub.com/terms",
    
    // Privacy policy URL
    privacyUrl: "https://flingershub.com/privacy"
  };