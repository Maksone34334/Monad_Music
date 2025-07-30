"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Music, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-web3"

export function Header() {
  const { isConnected, account, connectWallet, isConnecting, error } = useWeb3()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Particle Background */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "glass-strong" : "glass"}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-neon"></div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 neon-glow">
                  <Music className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold holographic">Monad Music</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="relative group">
                <span className="text-white/80 hover:text-white transition-colors font-medium">Home</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link href="/create" className="relative group">
                <span className="text-white/80 hover:text-white transition-colors font-medium">Create Playlist</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-futuristic text-white font-medium px-6 py-2 rounded-full hover:scale-105 transition-all duration-300"
                title={error || ''}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 
                 error ? 'Connection Error' :
                 isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 
                 'Connect Wallet'}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden glass p-2 rounded-lg hover:glass-strong transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-6 glass-card rounded-2xl mt-4 mx-4">
              <nav className="flex flex-col space-y-6 px-6">
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/create"
                  className="text-white/80 hover:text-white transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Playlist
                </Link>
                <Button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="btn-futuristic text-white font-medium py-3 rounded-full"
                  title={error || ''}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 
                   error ? 'Connection Error' :
                   isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 
                   'Connect Wallet'}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
