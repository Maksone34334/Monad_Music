"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Sparkles, TrendingUp, Zap, Music } from "lucide-react"

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 py-32 text-center z-10">
        <div className="max-w-5xl mx-auto">
          {/* Floating Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8 animate-glow">
            <Sparkles className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
            <span className="text-sm font-medium text-white/90">The Future of Music Collection</span>
            <div className="ml-3 w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="holographic block mb-4">WEB3 MUSIK</span>
            <span className="neon-text">REVOLUTION</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Enter the metaverse of music. Create, collect, and trade{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
              holographic playlist NFTs
            </span>{" "}
            in a world where sound meets the blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="btn-futuristic text-white text-lg px-10 py-6 rounded-full hover:scale-105 transition-all duration-300 neon-glow group"
            >
              <Link href="/create">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Launch Creator
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="glass-card border-white/20 text-white text-lg px-10 py-6 rounded-full hover:glass-strong hover:scale-105 transition-all duration-300 group bg-transparent"
            >
              <TrendingUp className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Explore Galaxy
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { value: "24", label: "Playlist NFTs", icon: "🎵" },
              { value: "12", label: "Active Users", icon: "👥" },
              { value: "288", label: "Songs Uploaded", icon: "⚡" },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-8 rounded-2xl interactive-card group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-4xl font-bold neon-text mb-2">{stat.value}</div>
                <div className="text-white/60 font-medium">{stat.label}</div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 glass w-20 h-20 rounded-full flex items-center justify-center animate-float opacity-60">
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <div
            className="absolute top-1/3 right-10 glass w-16 h-16 rounded-full flex items-center justify-center animate-float opacity-60"
            style={{ animationDelay: "1s" }}
          >
            <Music className="w-6 h-6 text-purple-400" />
          </div>
          <div
            className="absolute bottom-1/4 left-1/4 glass w-12 h-12 rounded-full flex items-center justify-center animate-float opacity-60"
            style={{ animationDelay: "3s" }}
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  )
}

export default Hero
