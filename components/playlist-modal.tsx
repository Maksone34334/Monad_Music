"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import { Music, User, Calendar, Zap } from "lucide-react"
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

interface PlaylistModalProps {
  playlist: Playlist | null
  isOpen: boolean
  onClose: () => void
}

export function PlaylistModal({ playlist, isOpen, onClose }: PlaylistModalProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  if (!playlist) return null

  const handleCollect = () => {
    playlistStore.incrementCollects(playlist.id)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${playlist.gradient} opacity-20 rounded-t-2xl`}></div>
          <div className="relative z-10 p-6">
            <DialogTitle className="text-3xl font-bold text-white mb-4">
              <span className="holographic">{playlist.title}</span>
            </DialogTitle>
            <p className="text-white/80 text-lg leading-relaxed mb-6">{playlist.description}</p>

            {/* Playlist Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass p-4 rounded-xl flex items-center space-x-3">
                <User className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-white/60">Creator</p>
                  <p className="text-white font-medium">{playlist.creator}</p>
                </div>
              </div>
              <div className="glass p-4 rounded-xl flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-white/60">Created</p>
                  <p className="text-white font-medium">{formatDate(playlist.createdAt)}</p>
                </div>
              </div>
              <div className="glass p-4 rounded-xl flex items-center space-x-3">
                <Music className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-xs text-white/60">Tracks</p>
                  <p className="text-white font-medium">{playlist.songs.length}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Audio Player */}
          <AudioPlayer songs={playlist.songs} currentSongIndex={currentSongIndex} onSongChange={setCurrentSongIndex} />

          {/* Track List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Music className="w-5 h-5 text-cyan-400" />
              <span>Track List</span>
            </h3>
            <div className="space-y-2">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 hover:glass-strong ${
                    index === currentSongIndex ? "neon-border bg-purple-500/10" : ""
                  }`}
                  onClick={() => setCurrentSongIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === currentSongIndex
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "glass text-white/60"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            index === currentSongIndex ? "text-white neon-text" : "text-white/90"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-xs text-white/60">
                          {song.audioUrl ? "Ready to play" : "No audio available"}
                        </p>
                      </div>
                    </div>
                    {index === currentSongIndex && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-1 h-4 bg-purple-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-4 bg-pink-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collect Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleCollect}
              className="btn-futuristic text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 neon-glow group"
            >
              <Zap className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Collect Artifact ({playlist.collects})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
