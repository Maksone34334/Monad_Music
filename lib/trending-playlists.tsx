"use client"

/*
 * Patched version of the TrendingPlaylists component. This version
 * automatically loads playlists minted on chain when the user
 * connects their wallet. It imports and uses the `loadUserPlaylists`
 * helper to fetch on‑chain playlists and insert them into the
 * playlistStore. Additionally, this file preserves the existing
 * UI, default playlists, and behaviour of the original component.
 */

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Heart, Users, Zap, Star } from 'lucide-react'
import Image from 'next/image'
import { PlaylistModal } from '@/components/playlist-modal'
import { playlistStore } from '@/lib/playlist-store'
import { useWeb3 } from '@/hooks/use-web3'
import { loadUserPlaylists } from '@/lib/load-user-playlists'

interface Song {
  title: string
  audioUrl?: string
  id: string
}

interface Playlist {
  id: string
  title: string
  description: string
  songs: Song[]
  creator: string
  createdAt: Date
  cover?: string
  gradient: string
  rarity: string
  collects: number
}

const defaultPlaylists: Playlist[] = [
  {
    id: 'default-1',
    title: 'Neon Dreams',
    description: 'Synthwave tracks inspired by the neon-lit world of blockchain innovation.',
    cover: '/placeholder.svg?height=300&width=300',
    collects: 42,
    creator: 'CyberSonic',
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
    rarity: 'Legendary',
    createdAt: new Date('2024-01-15'),
    songs: [],
  },
  {
    id: 'default-2',
    title: 'Monad Chill',
    description: 'Lo-fi beats for coding on the fastest blockchain, perfect for development sessions.',
    cover: '/placeholder.svg?height=300&width=300',
    collects: 37,
    creator: 'VoidMaster',
    gradient: 'from-blue-400 via-purple-500 to-pink-600',
    rarity: 'Epic',
    createdAt: new Date('2024-01-10'),
    songs: [],
  },
  {
    id: 'default-3',
    title: 'Indie Vibes',
    description: 'Carefully curated indie tracks for the modern blockchain enthusiast.',
    cover: '/placeholder.svg?height=300&width=300',
    collects: 29,
    creator: 'PixelPoet',
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    rarity: 'Rare',
    createdAt: new Date('2024-01-05'),
    songs: [],
  },
]

const rarityColors = {
  Legendary: 'from-yellow-400 to-orange-500',
  Mythic: 'from-purple-500 to-pink-500',
  Epic: 'from-blue-500 to-purple-500',
  Rare: 'from-green-500 to-blue-500',
  Common: 'from-gray-500 to-gray-600',
} as const

export default function TrendingPlaylists() {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { account } = useWeb3()

  useEffect(() => {
    const loadFromStore = () => {
      setUserPlaylists(playlistStore.getPlaylists() as any)
    }
    loadFromStore()
    const unsubscribe = playlistStore.subscribe(loadFromStore)
    // If the user is connected and no playlists have been loaded yet,
    // fetch their on‑chain playlists.
    if (account && playlistStore.getPlaylists().length === 0) {
      loadUserPlaylists(account)
    }
    return unsubscribe
  }, [account])

  const allPlaylists = [...userPlaylists, ...defaultPlaylists]

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPlaylist(null)
  }

  return (
    <>
      {/* Background Grid */}
      <div className="relative py-16">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-purple-900 to-black opacity-50 blur-sm"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            {userPlaylists.length > 0 ? 'Your Creations & Trending' : 'Trending in the Metaverse'}
          </h2>
          <p className="uppercase text-purple-400 tracking-widest mb-8">MONAD ARTIFACTS</p>
          <p className="text-gray-300 max-w-2xl mb-12">
            {userPlaylists.length > 0
              ? 'Your created playlists and the most coveted NFTs in the digital cosmos.'
              : 'Discover the most coveted playlist NFTs in the digital cosmos, curated by interdimensional music architects.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPlaylists.map((playlist) => {
              const isUserCreated = userPlaylists.some((p) => p.id === playlist.id)
              return (
                <div
                  key={playlist.id}
                  className="relative cursor-pointer group"
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  {/* User Created Badge */}
                  {isUserCreated && (
                    <span className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      Your Creation
                    </span>
                  )}
                  {/* Rarity Badge */}
                  <span
                    className={`absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded bg-gradient-to-r ${
                      rarityColors[playlist.rarity as keyof typeof rarityColors] || rarityColors.Common
                    } text-white`}
                  >
                    {playlist.rarity}
                  </span>
                  {/* Image Container */}
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    {playlist.cover ? (
                      <Image src={playlist.cover} alt={playlist.title} layout="fill" objectFit="cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                        <Play className="h-12 w-12 text-purple-400" />
                      </div>
                    )}
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition" />
                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlaylistClick(playlist)
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Play className="h-16 w-16 text-white" />
                    </button>
                  </div>
                  {/* Floating Elements */}
                  {!isUserCreated && (
                    <div className="absolute -bottom-3 right-4 z-10 bg-purple-600 text-white rounded-full p-2 shadow">
                      <Heart className="h-4 w-4" />
                    </div>
                  )}
                  {/* Card Content */}
                  <Card className="mt-4 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 p-4 rounded-lg shadow-lg">
                    <CardContent className="space-y-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">{playlist.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{playlist.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{playlist.creator}</span>
                        <span>{playlist.collects}</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlaylistClick(playlist)
                        }}
                        className="w-full mt-2"
                      >
                        {isUserCreated ? 'Listen Now' : 'Collect Artifact'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
          {/* View All Button */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg">
              Explore All Artifacts
            </Button>
          </div>
        </div>
      </div>
      {/* Playlist Modal */}
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isModalOpen}
          playlist={selectedPlaylist}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}