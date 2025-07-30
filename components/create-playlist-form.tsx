"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Music, Trash2, CheckCircle, AlertCircle, Zap, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { playlistStore } from "@/lib/playlist-store"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/hooks/use-web3"

interface Song {
  title: string
  file: File | null
  id: string
}

export function CreatePlaylistForm() {
  const router = useRouter()
  const { isConnected, account, connectWallet, mintPlaylistNFT, isMinting, error: web3Error } = useWeb3()
  const [playlistTitle, setPlaylistTitle] = useState("")
  const [playlistDescription, setPlaylistDescription] = useState("")
  const [creatorName, setCreatorName] = useState("")
  const [songs, setSongs] = useState<Song[]>(
    Array.from({ length: 12 }, (_, i) => ({
      title: "",
      file: null,
      id: `song-${i}`,
    })),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "info" | null; message: string }>({
    type: null,
    message: "",
  })

  const [bulkUploadStatus, setBulkUploadStatus] = useState<string>("")

  const updateSong = (index: number, field: "title" | "file", value: string | File) => {
    setSongs((prev) => prev.map((song, i) => (i === index ? { ...song, [field]: value } : song)))
  }

  const removeSong = (index: number) => {
    setSongs((prev) => prev.map((song, i) => (i === index ? { title: "", file: null, id: song.id } : song)))
  }

  const clearAllSongs = () => {
    setSongs((prev) => prev.map((song) => ({ ...song, title: "", file: null })))
    setBulkUploadStatus("")
  }

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    if (files.length > 12) {
      setBulkUploadStatus(`⚠️ Too many files selected (${files.length}). Only the first 12 will be used.`)
      files.splice(12)
    } else if (files.length < 12) {
      setBulkUploadStatus(`📁 ${files.length} files uploaded. You can add ${12 - files.length} more individually.`)
    } else {
      setBulkUploadStatus(`✅ Perfect! All 12 files uploaded successfully.`)
    }

    // Update songs with uploaded files
    setSongs((prev) =>
      prev.map((song, index) => {
        if (index < files.length) {
          const file = files[index]
          const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
          return {
            ...song,
            file: file,
            title: song.title || fileName, // Use existing title or filename
          }
        }
        return song
      }),
    )

    // Clear the input
    e.target.value = ""

    // Clear status after 5 seconds
    setTimeout(() => setBulkUploadStatus(""), 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    // Validate playlist info
    if (!playlistTitle.trim() || !playlistDescription.trim() || !creatorName.trim()) {
      setStatus({
        type: "error",
        message: "Please fill in playlist title, description, and creator name.",
      })
      setIsSubmitting(false)
      return
    }

    const incompleteSongs = songs.filter((song) => !song.title.trim() || !song.file)
    if (incompleteSongs.length > 0) {
      setStatus({
        type: "error",
        message: "All 12 songs must have both title and audio file.",
      })
      setIsSubmitting(false)
      return
    }

    // Check wallet connection
    if (!isConnected) {
      setStatus({
        type: "error",
        message: "Please connect your Monad wallet first.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      setStatus({ type: "info", message: "Uploading audio files to IPFS storage..." })
      
      // In a real app, upload files to IPFS here
      // For demo, we'll use filenames as IPFS URIs
      const ipfsSongs = songs.map(song => ({
        title: song.title,
        ipfsURI: `ipfs://${song.file?.name || 'placeholder'}`
      }))

      setStatus({ type: "info", message: "Minting your playlist NFT on Monad testnet (0.12 MON fee)..." })
      
      // Create metadata URI (in real app, upload to IPFS)
      const metadata = {
        name: playlistTitle,
        description: playlistDescription,
        creator: creatorName,
        image: "ipfs://bafkreicecnx2gvntm6fbcrvnc336qze6st5u7qq7457igegamd3bzkx7ri", // Monad DJ IPFS image
        songs: ipfsSongs,
        attributes: [
          {
            trait_type: "Creator",
            value: creatorName
          },
          {
            trait_type: "Song Count",
            value: 12
          },
          {
            trait_type: "Network",
            value: "Monad"
          }
        ]
      }
      const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`

      // Mint the NFT on blockchain
      const txHash = await mintPlaylistNFT(ipfsSongs, metadataURI)

      // Save to local store for UI
      const gradients = [
        "from-purple-400 via-pink-500 to-red-600",
        "from-blue-400 via-purple-500 to-pink-600",
        "from-green-400 via-blue-500 to-purple-600",
        "from-yellow-400 via-orange-500 to-pink-600",
        "from-cyan-400 via-blue-500 to-purple-600",
      ]

      const rarities = ["Common", "Rare", "Epic", "Legendary", "Mythic"]

      const playlistId = playlistStore.addPlaylist({
        title: playlistTitle,
        description: playlistDescription,
        creator: creatorName,
        songs: songs,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
        rarity: rarities[Math.floor(Math.random() * rarities.length)],
        txHash: txHash
      })

      setStatus({
        type: "success",
        message: `🎉 Playlist NFT minted for 0.12 MON! Transaction: ${txHash.slice(0, 10)}...`,
      })

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "NFT minting failed. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedSongs = songs.filter((song) => song.title.trim() && song.file).length
  const progress = (completedSongs / 12) * 100

  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Playlist Info Section */}
      <Card className="glass-card border-0 neon-border relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 animate-gradient"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3 text-white">
            <Music className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="holographic">Playlist Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="playlist-title" className="text-sm font-medium text-white/90 mb-2 block">
                Playlist Title
              </Label>
              <Input
                id="playlist-title"
                type="text"
                value={playlistTitle}
                onChange={(e) => setPlaylistTitle(e.target.value)}
                placeholder="Enter your playlist name..."
                className="glass border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
            <div>
              <Label htmlFor="creator-name" className="text-sm font-medium text-white/90 mb-2 block">
                Creator Name
              </Label>
              <Input
                id="creator-name"
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Your artist name..."
                className="glass border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="playlist-description" className="text-sm font-medium text-white/90 mb-2 block">
              Description
            </Label>
            <Textarea
              id="playlist-description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="Describe your Monad music journey..."
              className="glass border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Upload Section */}
      <Card className="glass-card border-0 neon-border relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-pink-600/10 animate-gradient"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3 text-white">
            <Upload className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="holographic">Bulk Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Upload all 12 audio files at once. Files will be automatically assigned to song slots.
            </p>
            <div className="relative">
              <Input
                id="bulk-upload"
                type="file"
                accept="audio/*"
                multiple
                onChange={handleBulkUpload}
                className="hidden"
              />
              <label
                htmlFor="bulk-upload"
                className="flex items-center justify-center w-full h-32 glass-card border-2 border-dashed border-cyan-400/50 rounded-xl cursor-pointer hover:border-cyan-400 hover:glass-strong transition-all duration-300 group/bulk"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover/bulk:scale-110 transition-transform duration-300" />
                  <span className="text-lg text-white font-medium group-hover/bulk:text-cyan-400 transition-colors duration-300">
                    Select 12 Audio Files
                  </span>
                  <p className="text-sm text-white/60 mt-2">Choose multiple files to upload all at once</p>
                </div>
              </label>
            </div>
            {bulkUploadStatus && (
              <div className="glass px-4 py-2 rounded-lg">
                <p className="text-sm text-cyan-400">{bulkUploadStatus}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card className="glass-card border-0 neon-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 animate-gradient"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="holographic">Synthesis Progress</span>
            </div>
            <span className="text-sm font-normal text-white/70 glass px-3 py-1 rounded-full">
              {completedSongs}/12 frequencies
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="relative w-full h-4 glass rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            {completedSongs > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllSongs}
                className="ml-4 glass border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition-all duration-300 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          <p className="text-white/80 leading-relaxed">
            Upload all 12 music tracks to create your playlist NFT. Each song requires both
            <span className="text-cyan-400 font-semibold"> song title</span> and
            <span className="text-purple-400 font-semibold"> audio data</span>.
          </p>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {songs.map((song, index) => (
            <Card
              key={song.id}
              className={`interactive-card transition-all duration-500 border-0 relative overflow-hidden ${
                song.title && song.file ? "glass-strong neon-glow" : "glass-card hover:glass-strong"
              }`}
            >
              {/* Completion Indicator */}
              {song.title && song.file && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="glass-strong rounded-full p-2 animate-pulse-neon">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              )}

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center space-x-3 text-white">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 animate-pulse"></div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="neon-text">Frequency {index + 1}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                {/* Title Input */}
                <div>
                  <Label htmlFor={`title-${index}`} className="text-sm font-medium text-white/90 mb-2 block">
                    Song Title
                  </Label>
                  <Input
                    id={`title-${index}`}
                    type="text"
                    value={song.title}
                    onChange={(e) => updateSong(index, "title", e.target.value)}
                    placeholder="Enter song title..."
                    className="glass border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300"
                  />
                </div>

                {/* File Input */}
                <div>
                  <Label htmlFor={`file-${index}`} className="text-sm font-medium text-white/90 mb-2 block">
                    Audio File
                  </Label>
                  <div className="relative">
                    <Input
                      id={`file-${index}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        updateSong(index, "file", file as File)
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`file-${index}`}
                      className="flex items-center justify-center w-full h-28 glass-card border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-400 hover:glass-strong transition-all duration-300 group/upload"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-white/60 mx-auto mb-3 group-hover/upload:text-cyan-400 group-hover/upload:scale-110 transition-all duration-300" />
                        <span className="text-sm text-white/70 group-hover/upload:text-white transition-colors duration-300">
                          {song.file ? (
                            <span className="text-cyan-400 font-medium">{song.file.name}</span>
                          ) : (
                            "Upload audio file"
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Clear Button */}
                {(song.title || song.file) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSong(index)}
                    className="w-full glass border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Song
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Alert */}
        {status.type && (
          <Alert
            className={`glass-card border-0 ${
              status.type === "success"
                ? "neon-border bg-green-500/10"
                : status.type === "error"
                  ? "neon-border bg-red-500/10"
                  : "neon-border bg-blue-500/10"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : status.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-blue-400" />
            )}
            <AlertDescription
              className={`${
                status.type === "success"
                  ? "text-green-300"
                  : status.type === "error"
                    ? "text-red-300"
                    : "text-blue-300"
              } font-medium`}
            >
              {status.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Connection / Submit Button */}
        <Card className="glass-card border-0 neon-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-400/20 animate-gradient"></div>
          <CardContent className="p-8 relative z-10">
            {!isConnected ? (
              <Button
                type="button"
                onClick={connectWallet}
                className="w-full btn-futuristic text-white font-bold text-lg py-6 rounded-full hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Connect Monad Wallet
                </div>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  completedSongs < 12 ||
                  isSubmitting ||
                  isMinting ||
                  !playlistTitle.trim() ||
                  !playlistDescription.trim() ||
                  !creatorName.trim()
                }
                className="w-full btn-futuristic text-white font-bold text-lg py-6 rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                {isSubmitting || isMinting ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Minting NFT...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    Mint Playlist NFT
                  </div>
                )}
              </Button>
            )}
            
            <div className="text-center mt-4">
              {isConnected && account ? (
                <p className="text-sm text-cyan-400">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              ) : (
                <p className="text-sm text-white/70">
                  Connect your wallet to mint playlist NFTs
                </p>
              )}
              {web3Error && (
                <p className="text-sm text-red-400 mt-2">
                  {web3Error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
