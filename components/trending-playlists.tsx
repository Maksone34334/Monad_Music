"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Heart, Users, Zap, Star } from "lucide-react"
import Image from "next/image"
import { PlaylistModal } from "@/components/playlist-modal"
import { playlistStore } from "@/lib/playlist-store"

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

const defaultPlaylists = [
  {
    id: "default-1",
    title: "Neon Dreams",
    description: "Synthwave tracks inspired by the neon-lit world of blockchain innovation.",
    cover: "/placeholder.svg?height=300&width=300",
    collects: 42,
    creator: "CyberSonic",
    gradient: "from-orange-400 via-pink-500 to-purple-600",
    rarity: "Legendary",
    createdAt: new Date("2024-01-15"),
    songs: [],
  },
  {
    id: "default-2",
    title: "Monad Chill",
    description: "Lo-fi beats for coding on the fastest blockchain, perfect for development sessions.",
    cover: "/placeholder.svg?height=300&width=300",
    collects: 37,
    creator: "VoidMaster",
    gradient: "from-blue-400 via-purple-500 to-pink-600",
    rarity: "Epic",
    createdAt: new Date("2024-01-10"),
    songs: [],
  },
  {
    id: "default-3",
    title: "Indie Vibes",
    description: "Carefully curated indie tracks for the modern blockchain enthusiast.",
    cover: "/placeholder.svg?height=300&width=300",
    collects: 29,
    creator: "PixelPoet",
    gradient: "from-green-400 via-blue-500 to-purple-600",
    rarity: "Rare",
    createdAt: new Date("2024-01-05"),
    songs: [],
  },
]

const rarityColors = {
  Legendary: "from-yellow-400 to-orange-500",
  Mythic: "from-purple-500 to-pink-500",
  Epic: "from-blue-500 to-purple-500",
  Rare: "from-green-500 to-blue-500",
  Common: "from-gray-500 to-gray-600",
}

export default function TrendingPlaylists() {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadPlaylists = () => {
      setUserPlaylists(playlistStore.getPlaylists())
    }

    loadPlaylists()
    const unsubscribe = playlistStore.subscribe(loadPlaylists)

    return unsubscribe
  }, [])

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
      <section className="py-32 relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.02'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8 animate-glow">
              <Star className="w-5 h-5 text-yellow-400 mr-3 animate-pulse" />
              <span className="text-sm font-medium text-white/90">
                {userPlaylists.length > 0 ? "Your Creations & Trending" : "Trending in the Metaverse"}
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="holographic">SONIC</span>
              <br />
              <span className="neon-text">ARTIFACTS</span>
            </h2>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {userPlaylists.length > 0
                ? "Your created playlists and the most coveted NFTs in the digital cosmos."
                : "Discover the most coveted playlist NFTs in the digital cosmos, curated by interdimensional music architects."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPlaylists.map((playlist, index) => (
              <Card
                key={playlist.id}
                className="glass-card interactive-card group border-0 overflow-hidden relative cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlaylistClick(playlist)}
              >
                {/* User Created Badge */}
                {userPlaylists.some((p) => p.id === playlist.id) && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-green-400 to-cyan-400 shadow-lg">
                      Your Creation
                    </div>
                  </div>
                )}

                {/* Rarity Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                      rarityColors[playlist.rarity as keyof typeof rarityColors] || rarityColors.Common
                    } shadow-lg`}
                  >
                    {playlist.rarity}
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${playlist.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
                  ></div>
                  <Image
                    src={playlist.cover || "/placeholder.svg?height=300&width=300"}
                    alt={playlist.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Play Button */}
                  <Button
                    size="icon"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full glass-strong hover:neon-glow text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-125"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaylistClick(playlist)
                    }}
                  >
                    <Play className="w-6 h-6" />
                  </Button>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {!userPlaylists.some((p) => p.id === playlist.id) && (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-6 relative">
                  {/* Title and Heart */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:neon-text transition-all duration-300 flex-1">
                      {playlist.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-red-400 hover:scale-110 transition-all duration-300 ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 mb-6 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {playlist.description}
                  </p>

                  {/* Creator and Stats */}
                  <div className="flex items-center justify-between text-sm mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <span className="text-white/80 font-medium">{playlist.creator}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{playlist.collects}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full btn-futuristic text-white font-medium py-3 rounded-full hover:scale-105 transition-all duration-300 group/btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaylistClick(playlist)
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                    {userPlaylists.some((p) => p.id === playlist.id) ? "Listen Now" : "Collect Artifact"}
                  </Button>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              className="glass-card border-white/20 text-white px-12 py-4 rounded-full hover:glass-strong hover:scale-105 transition-all duration-300 group"
            >
              <span className="mr-3">Explore All Artifacts</span>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full group-hover:animate-pulse"></div>
            </Button>
          </div>
        </div>
      </section>

      {/* Playlist Modal */}
      <PlaylistModal playlist={selectedPlaylist} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
