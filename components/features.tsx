"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Trophy, Zap, Shield, Globe } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Music Discovery",
    description:
      "Explore curated playlists created by music lovers on Monad. Collect unique NFT playlists that match your musical taste.",
    gradient: "from-pink-500 via-rose-500 to-purple-500",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    icon: Users,
    title: "Artist Nexus",
    description:
      "Support artists directly through Monad's fast blockchain network. Every NFT mint helps creators monetize their curated playlists.",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    glowColor: "rgba(139, 92, 246, 0.5)",
  },
  {
    icon: Trophy,
    title: "Community Rewards",
    description:
      "Participate in the Monad ecosystem and unlock exclusive benefits. Earn recognition for creating and collecting the best playlists.",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    icon: Zap,
    title: "Fast Minting",
    description:
      "Mint your playlist NFTs instantly on Monad's high-performance blockchain. Create unique digital collectibles in seconds.",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description:
      "Your NFT playlists are secured by blockchain technology with IPFS integration. Immutable, verifiable, and permanently preserved.",
    gradient: "from-green-500 via-emerald-500 to-cyan-500",
    glowColor: "rgba(34, 197, 94, 0.5)",
  },
  {
    icon: Globe,
    title: "Universal Network",
    description:
      "Connect with beings across the sonic universe. Share frequencies, trade artifacts, and build the future of interdimensional music culture.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    glowColor: "rgba(99, 102, 241, 0.5)",
  },
]

export function Features() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8">
            <Zap className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
            <span className="text-sm font-medium text-white/90">Next-Gen Features</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="holographic">QUANTUM</span>
            <br />
            <span className="neon-text">CAPABILITIES</span>
          </h2>

          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Experience the convergence of music and technology through our revolutionary platform that transcends
            traditional boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card interactive-card group border-0 overflow-hidden relative"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Animated Border */}
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradient.split(" ")[1]}, ${feature.gradient.split(" ")[3]}, ${feature.gradient.split(" ")[5] || feature.gradient.split(" ")[3]})`,
                }}
              ></div>
              <div className="absolute inset-[1px] glass-card rounded-[inherit]"></div>

              <CardContent className="p-8 relative z-10">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-500"
                    style={{ backgroundColor: feature.glowColor }}
                  ></div>
                  <div
                    className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-all duration-500`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:neon-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="glass-card inline-flex items-center px-8 py-4 rounded-full">
            <span className="text-white/80 mr-4">Ready to enter the sonic metaverse?</span>
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
