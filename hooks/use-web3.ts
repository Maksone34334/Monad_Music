"use client"

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

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Error checking connection:', err)
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

    // Prevent multiple simultaneous connection attempts
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
      const existingAccounts = await window.ethereum.request({ method: 'eth_accounts' })
      console.log('Existing accounts:', existingAccounts)
      
      if (existingAccounts.length > 0) {
        console.log('✅ Already connected to:', existingAccounts[0])
        setAccount(existingAccounts[0])
        setIsConnected(true)
        setIsConnecting(false)
        return
      }

      // Request account access
      console.log('📝 Requesting account access...')
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: []
      })
      
      console.log('Received accounts:', accounts)
      
      if (accounts && accounts.length > 0) {
        console.log('✅ Connected to:', accounts[0])
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Add Monad testnet if not already added
        console.log('🌐 Adding Monad network...')
        await addMonadNetwork()
        console.log('✅ Network setup complete')
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

  const addMonadNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x279F', // 10143 in hex
          chainName: 'Monad Testnet',
          rpcUrls: ['https://testnet-rpc.monad.xyz'],
          nativeCurrency: {
            name: 'MON',
            symbol: 'MON',
            decimals: 18
          },
          blockExplorerUrls: ['https://testnet-explorer.monad.xyz']
        }]
      })
    } catch (err) {
      // Network might already be added
      console.log('Network add failed or already exists:', err)
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
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(PLAYLIST_CONTRACT_ADDRESS, PLAYLIST_ABI, signer)

      // Get mint price from contract (0.12 MON)
      const mintPrice = await contract.MINT_PRICE()

      // Format songs for contract
      const formattedSongs = songs.map(song => ({
        title: song.title,
        ipfsURI: song.ipfsURI
      }))

      // Call contract with payment
      const tx = await contract.mintPlaylistNFT(formattedSongs, metadataURI, {
        value: mintPrice
      })
      const receipt = await tx.wait()

      return tx.hash
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
    isMinting
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}