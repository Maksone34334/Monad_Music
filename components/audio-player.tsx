"use client"

/*
 * Modified version of the AudioPlayer component. This version avoids
 * using a HEAD request on blob: or data: URIs, which leads to
 * `ERR_METHOD_NOT_SUPPORTED` errors in Chromium. Instead, it
 * immediately assigns the source for these protocols. For http/https
 * URLs, it still performs a HEAD check to ensure the resource is
 * accessible and falls back gracefully if the check fails.
 */

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

    const url = currentSong.audioUrl
    const isLocal = url.startsWith('blob:') || url.startsWith('data:')

    const loadAudio = () => {
      audio.src = url
      audio.load()
    }

    if (isLocal) {
      // Avoid HEAD request for local/blob URLs
      loadAudio()
    } else {
      // Check if the remote URL is accessible
      const checkHead = async () => {
        try {
          const response = await fetch(url, { method: 'HEAD' })
          if (response.ok) {
            loadAudio()
          } else {
            console.warn('Audio file no longer available:', currentSong.title)
            setIsPlaying(false)
          }
        } catch (error) {
          // Even if the HEAD request fails (e.g. due to CORS), attempt to play anyway
          console.warn('Audio HEAD check failed, attempting to play anyway:', currentSong.title, error)
          loadAudio()
        }
      }
      checkHead()
    }

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
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  if (!currentSong?.audioUrl) {
    return (
      <div className="p-4 text-center text-sm text-gray-400">
        <p className="font-semibold">🎵 Audio Preview Not Available</p>
        <p>Audio files are stored locally and become unavailable after page refresh.</p>
        <p>Full IPFS integration coming soon!</p>
      </div>
    )
  }
  return (
    <div className={`w-full ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      {/* Song info */}
      <div className="mb-2 text-center">
        <div className="font-semibold text-lg">{currentSong.title}</div>
        <div className="text-xs text-gray-400">Track {currentSongIndex + 1} of {songs.length}</div>
      </div>
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs w-8 text-right">{formatTime(currentTime)}</span>
        <Slider value={[duration ? (currentTime / duration) * 100 : 0]} onValueChange={handleSeek} className="flex-1" />
        <span className="text-xs w-8">{formatTime(duration)}</span>
      </div>
      {/* Controls */}
      <div className="mt-3 flex items-center justify-center space-x-4">
        <Button variant="ghost" size="icon" onClick={previousSong}><SkipBack /></Button>
        <Button variant="ghost" size="icon" onClick={togglePlay}>{isPlaying ? <Pause /> : <Play />}</Button>
        <Button variant="ghost" size="icon" onClick={nextSong}><SkipForward /></Button>
        <Button variant="ghost" size="icon" onClick={toggleMute}>{isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}</Button>
        <Slider value={[volume * 100]} onValueChange={handleVolumeChange} className="w-24" />
      </div>
    </div>
  )
}
