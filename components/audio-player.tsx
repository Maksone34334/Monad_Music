"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"

interface Song {
  title: string
  audioUrl?: string
  id: string
}

interface AudioPlayerProps {
  songs: Song[]
  currentSongIndex: number
  onSongChange: (index: number) => void
  className?: string
}

export function AudioPlayer({ songs, currentSongIndex, onSongChange, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong?.audioUrl) return

    audio.src = currentSong.audioUrl
    audio.load()

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (currentSongIndex < songs.length - 1) {
        onSongChange(currentSongIndex + 1)
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSong, currentSongIndex, songs.length, onSongChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!currentSong?.audioUrl) return
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const previousSong = () => {
    if (currentSongIndex > 0) {
      onSongChange(currentSongIndex - 1)
    }
  }

  const nextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      onSongChange(currentSongIndex + 1)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!currentSong?.audioUrl) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <p className="text-white/60 text-center">No audio available for this playlist</p>
      </div>
    )
  }

  return (
    <div className={`glass-card p-6 rounded-2xl space-y-6 ${className}`}>
      <audio ref={audioRef} preload="metadata" />

      {/* Current Song Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2 neon-text">{currentSong.title}</h3>
        <p className="text-white/60 text-sm">
          Track {currentSongIndex + 1} of {songs.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[duration ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousSong}
          disabled={currentSongIndex === 0}
          className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 disabled:opacity-50"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          className="btn-futuristic w-12 h-12 rounded-full hover:scale-110 transition-all duration-300 neon-glow"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSong}
          disabled={currentSongIndex === songs.length - 1}
          className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300 disabled:opacity-50"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-white/80 hover:text-white transition-colors duration-300"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  )
}
