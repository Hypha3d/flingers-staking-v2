// src/utils/fallbackNfts.ts
import { NFT } from '@/hooks/useNFTs';

// Total number of NFTs in your collection (replace with your actual count)
const TOTAL_FALLBACK_NFTS = 20;

export const getFallbackNfts = (): NFT[] => {
  const fallbackNfts: NFT[] = [];
  
  // Create a representation of your NFTs based on your file structure
  for (let i = 1; i <= TOTAL_FALLBACK_NFTS; i++) {
    fallbackNfts.push({
      id: `NFT #${i}`,
      tokenId: i,
      name: `Flinger #${i}`,
      image: `/fallback/nfts/images/${i}.png`,
      owner: '0x0',
      attributes: [] // We could load these from JSON if needed
    });
  }
  
  return fallbackNfts;
};