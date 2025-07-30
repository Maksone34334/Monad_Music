"use client"

interface Song {
  title: string
  file: File | null
  id: string
  audioUrl?: string
  ipfsURI?: string
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
  txHash?: string
}

class PlaylistStore {
  private playlists: Playlist[] = []
  private listeners: (() => void)[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem("pods-music-playlists")
      if (stored) {
        const data = JSON.parse(stored)
        this.playlists = data.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          songs: p.songs.map((s: any) => ({
            ...s,
            file: null, // Files can't be serialized
          })),
        }))
      }
    } catch (error) {
      console.error("Failed to load playlists from storage:", error)
    }
  }

  private saveToStorage() {
    try {
      const dataToStore = this.playlists.map((p) => ({
        ...p,
        songs: p.songs.map((s) => ({
          ...s,
          file: null, // Don't store file objects
        })),
      }))
      localStorage.setItem("pods-music-playlists", JSON.stringify(dataToStore))
    } catch (error) {
      console.error("Failed to save playlists to storage:", error)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  addPlaylist(playlist: Omit<Playlist, "id" | "createdAt" | "collects">) {
    const newPlaylist: Playlist = {
      ...playlist,
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      collects: 0,
    }

    // Convert files to URLs for playback
    newPlaylist.songs = newPlaylist.songs.map((song) => ({
      ...song,
      audioUrl: song.file ? URL.createObjectURL(song.file) : undefined,
    }))

    this.playlists.unshift(newPlaylist)
    this.saveToStorage()
    this.notify()
    return newPlaylist.id
  }

  getPlaylists(): Playlist[] {
    return [...this.playlists]
  }

  getPlaylist(id: string): Playlist | undefined {
    return this.playlists.find((p) => p.id === id)
  }

  incrementCollects(id: string) {
    const playlist = this.playlists.find((p) => p.id === id)
    if (playlist) {
      playlist.collects++
      this.saveToStorage()
      this.notify()
    }
  }
}

export const playlistStore = new PlaylistStore()
