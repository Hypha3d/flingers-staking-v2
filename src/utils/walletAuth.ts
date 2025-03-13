// src/utils/walletAuth.ts
import { ethers } from 'ethers';

/**
 * Create a simple message to sign
 * This replaces multiple signature requests with a single one
 */
export function createAuthMessage(address: string): string {
  return `Welcome to Holocene!

Please sign this message to verify your wallet ownership.
This signature will not trigger any blockchain transaction or cost any gas fees.

Wallet: ${address}
Time: ${new Date().toISOString()}
`;
}

/**
 * Verify a signature against a message and address
 */
export function verifySignature(
  message: string,
  signature: string,
  address: string
): boolean {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    // Compare with the original address (case-insensitive)
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Request a signature from the user
 * This centralizes signature requests to avoid multiple prompts
 */
export async function requestSignature(
  provider: ethers.providers.Web3Provider,
  address: string
): Promise<string> {
  try {
    const signer = provider.getSigner();
    const message = createAuthMessage(address);
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error('Error requesting signature:', error);
    throw new Error('User rejected signature request');
  }
}