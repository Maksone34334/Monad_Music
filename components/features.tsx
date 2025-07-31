"use client"

/*
 * Patched version of the `features` component. This version renames
 * the second feature from "Artist Nexus" to "Monad Artist" to better
 * reflect the branding of the application. All other content and
 * styling are preserved from the original component.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Trophy, Zap, Shield, Globe } from "lucide-react"

// Feature definitions with updated title for the artist feature
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
    title: "Monad Artist",
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
      "Connect with creators across the Monad ecosystem. Share playlists, trade NFTs, and build the future of decentralized music culture.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    glowColor: "rgba(99, 102, 241, 0.5)",
  },
]

export function Features() {
  return (
    <>
      {/* This component displays the list of features in cards. The UI and
          layout remain unchanged; only the feature definitions above have
          been updated. */}
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-x-0 -top-10 -z-10 h-80 bg-gradient-to-b from-purple-700/50 to-transparent blur-2xl"></div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
          Next-Gen Features
        </h2>
        <p className="text-sm uppercase tracking-widest text-purple-400 mb-12">
          MONAD CAPABILITIES
        </p>
        <p className="max-w-2xl text-center text-base text-gray-300 mb-16">
          Experience the convergence of music and technology through our revolutionary platform that
          transcends traditional boundaries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${feature.gradient} text-white relative overflow-hidden shadow-lg rounded-xl`}
            >
              {/* Animated border */}
              <div className="absolute inset-0 opacity-20 z-0 blur-xl"
                   style={{ background: feature.glowColor }}></div>
              <CardContent className="relative z-10 p-8 flex flex-col items-start space-y-4">
                {/* Icon */}
                <div className="p-3 bg-white bg-opacity-10 rounded-md shadow-md">
                  <feature.icon className="h-6 w-6" />
                </div>
                {/* Title */}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                {/* Description */}
                <p className="text-sm text-white/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
