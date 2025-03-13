// src/hooks/useNFTs.ts
"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Basic ERC721 ABI with only the functions we need
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export interface NFT {
  id: string;
  tokenId: number;
  name: string;
  image: string;
  attributes?: any[];
  owner: string;
}

interface UseNFTsProps {
  collectionAddress: string;
  ownerAddress?: string;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
}

export default function useNFTs({
  collectionAddress,
  ownerAddress,
  isConnected,
  provider
}: UseNFTsProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the NFTs when wallet connects or collection address changes
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || !provider || !ownerAddress || !collectionAddress) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the existing provider directly - don't try to create a new one
        // This avoids the "network detection" issues
        const nftContract = new ethers.Contract(
          collectionAddress,
          ERC721_ABI,
          provider
        );
        
        // Get the balance of NFTs
        const balance = await nftContract.balanceOf(ownerAddress);
        const balanceNumber = balance.toNumber();
        
        if (balanceNumber === 0) {
          setNfts([]);
          setIsLoading(false);
          return;
        }
        
        const nftPromises = [];
        
        // Fetch all NFTs owned by the address
        for (let i = 0; i < balanceNumber; i++) {
          nftPromises.push(
            (async () => {
              try {
                // Get token ID
                const tokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, i);
                
                // Get token URI
                const tokenURI = await nftContract.tokenURI(tokenId);
                
                // Handle possible token URI formats
                let metadata;
                try {
                  // Clean the URI
                  let cleanURI = tokenURI;
                  if (tokenURI.startsWith('ipfs://')) {
                    cleanURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
                  } else if (tokenURI.startsWith('ar://')) {
                    cleanURI = tokenURI.replace('ar://', 'https://arweave.net/');
                  }
                  
                  // Fetch the metadata
                  const response = await fetch(cleanURI);
                  metadata = await response.json();
                } catch (error) {
                  console.error("Error fetching metadata:", error);
                  // Provide default metadata if fetch fails
                  metadata = {
                    name: `Token #${tokenId.toString()}`,
                    image: ''
                  };
                }
                
                // Clean up the image URL if it exists
                let imageUrl = metadata.image || '';
                if (imageUrl.startsWith('ipfs://')) {
                  imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
                } else if (imageUrl.startsWith('ar://')) {
                  imageUrl = imageUrl.replace('ar://', 'https://arweave.net/');
                }
                
                return {
                  id: `NFT #${tokenId.toString()}`,
                  tokenId: tokenId.toNumber ? tokenId.toNumber() : parseInt(tokenId.toString()),
                  name: metadata.name || `Unnamed #${tokenId.toString()}`,
                  image: imageUrl || '🖼️',
                  attributes: metadata.attributes || [],
                  owner: ownerAddress
                };
              } catch (err) {
                console.error(`Error fetching NFT #${i}:`, err);
                return null;
              }
            })()
          );
        }
        
        const nftResults = await Promise.all(nftPromises);
        const validNfts = nftResults.filter(nft => nft !== null) as NFT[];
        
        setNfts(validNfts);
      } catch (err: any) {
        console.error('Error fetching NFTs:', err);
        setError(err.message || 'Failed to fetch NFTs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNFTs();
  }, [collectionAddress, ownerAddress, isConnected, provider]);
  
  return { nfts, isLoading, error };
}