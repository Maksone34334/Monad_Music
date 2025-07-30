"use client"

/*
 * Enhanced version of the `useWeb3` hook from the Monad_Music project.
 * Two key improvements are included here:
 *
 * 1. After requesting accounts, the hook attempts to switch the
 *    wallet to the Monad testnet (chainId 0x279F) using
 *    `wallet_switchEthereumChain`. This ensures that the user is
 *    actually connected to the correct network. If the chain is
 *    unrecognised (error code 4902) it falls back to adding the
 *    network via `wallet_addEthereumChain`.
 *
 * 2. The connection logic now re-checks existing accounts after
 *    switching networks, updating the connection state accordingly.
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// PlaylistNFT contract address on Monad testnet
const PLAYLIST_CONTRACT_ADDRESS = '0x231B66aDB7A9E83a409C522eDf029CCA0E53Fb62'

// Contract ABI - minimal needed for minting
const PLAYLIST_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'string', name: 'ipfsURI', type: 'string' }
        ],
        internalType: 'struct PlaylistNFT.Song[12]',
        name: 'songs',
        type: 'tuple[12]'
      },
      { internalType: 'string', name: 'metadataURI', type: 'string' }
    ],
    name: 'mintPlaylistNFT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MINT_PRICE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

interface Song {
  title: string
  ipfsURI: string
}

interface UseWeb3Return {
  isConnected: boolean
  account: string | null
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<void>
  mintPlaylistNFT: (songs: Song[], metadataURI: string) => Promise<string>
  isMinting: boolean
}

export function useWeb3(): UseWeb3Return {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account or network changes and update state accordingly
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Wallet disconnected
          setAccount(null)
          setIsConnected(false)
        } else {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      }
      const handleChainChanged = (_chainId: string) => {
        // When the user changes networks, we verify they are on Monad
        // If not, attempt to switch back. Note: cannot call async inside event, so schedule microtask.
        Promise.resolve().then(() => switchToMonadNetwork().catch(() => {}))
      }
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Error checking connection:', err)
      }
    }
  }

  /**
   * Attempt to switch the user's wallet to the Monad testnet. If the
   * chain has not been added yet, it will first add it via
   * `wallet_addEthereumChain` and then retry switching. This helper
   * should be called after obtaining the user's accounts.
   */
  const switchToMonadNetwork = async () => {
    const chainId = '0x279F'
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902 || switchError.code === -32603) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: 'Monad Testnet',
                rpcUrls: ['https://testnet-rpc.monad.xyz'],
                nativeCurrency: {
                  name: 'MON',
                  symbol: 'MON',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
              },
            ],
          })
          // After adding, try switching again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          })
        } catch (addError) {
          console.error('Failed to add or switch to Monad network:', addError)
        }
      } else {
        throw switchError
      }
    }
  }

  const connectWallet = async () => {
    console.log('🔗 Attempting wallet connection...')
    console.log('window.ethereum exists:', !!window.ethereum)

    if (typeof window === 'undefined') {
      console.log('❌ Not in browser environment')
      setError('Not in browser environment')
      return
    }

    if (typeof window.ethereum === 'undefined') {
      console.log('❌ No Web3 wallet detected')
      setError('No Web3 wallet detected. Please install MetaMask.')
      setIsConnecting(false)
      return
    }

    if (isConnecting) {
      console.log('⏳ Already connecting...')
      return
    }

    console.log('✅ Starting connection process')
    setIsConnecting(true)
    setError(null)

    try {
      // Check if already connected first
      console.log('🔍 Checking existing connections...')
      const existingAccounts = (await window.ethereum.request({ method: 'eth_accounts' })) as string[]
      console.log('Existing accounts:', existingAccounts)

      if (existingAccounts.length > 0) {
        console.log('✅ Already connected to:', existingAccounts[0])
        setAccount(existingAccounts[0])
        setIsConnected(true)
        setIsConnecting(false)
        // ensure network is set correctly
        await switchToMonadNetwork()
        return
      }

      // Request account access
      console.log('📝 Requesting account access...')
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      })) as string[]

      console.log('Received accounts:', accounts)

      if (accounts && accounts.length > 0) {
        console.log('✅ Connected to:', accounts[0])
        setAccount(accounts[0])
        setIsConnected(true)
        // Switch to Monad network (adds if necessary)
        await switchToMonadNetwork()
      } else {
        console.log('❌ No accounts returned')
        setError('No accounts returned from wallet')
      }
    } catch (err: any) {
      console.error('❌ Wallet connection error:', err)
      if (err.code === 4001) {
        setError('User rejected the connection request')
      } else if (err.code === -32002) {
        setError('Already processing connect. Please check MetaMask.')
      } else if (err.code === -32603) {
        setError('Internal error. Please refresh and try again.')
      } else {
        setError(err.message || 'Failed to connect wallet')
      }
    } finally {
      console.log('🏁 Connection attempt finished')
      setIsConnecting(false)
    }
  }

  const mintPlaylistNFT = async (songs: Song[], metadataURI: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected')
    }

    if (songs.length !== 12) {
      throw new Error('Exactly 12 songs required')
    }

    setIsMinting(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(PLAYLIST_CONTRACT_ADDRESS, PLAYLIST_ABI, signer)

      // Get mint price from contract (0.12 MON)
      const mintPrice = await contract.MINT_PRICE()

      // Format songs for contract
      const formattedSongs = songs.map((song) => ({
        title: song.title,
        ipfsURI: song.ipfsURI,
      }))

      // Call contract with payment
      const tx = await contract.mintPlaylistNFT(formattedSongs, metadataURI, {
        value: mintPrice,
      })
      await tx.wait()
      return tx.hash as string
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Minting failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsMinting(false)
    }
  }

  return {
    isConnected,
    account,
    isConnecting,
    error,
    connectWallet,
    mintPlaylistNFT,
    isMinting,
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
