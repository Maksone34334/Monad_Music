import { CreatePlaylistForm } from "@/components/create-playlist-form"
import { Sparkles, Zap } from "lucide-react"

export default function CreatePage() {
  return (
    <main className="min-h-screen pt-24 relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8 animate-glow">
              <Zap className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-sm font-medium text-white/90">Monad Creation Studio</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="holographic block mb-2">CREATE</span>
              <span className="neon-text">YOUR PLAYLIST</span>
            </h1>

            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Upload your favorite songs and mint them as an{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
                NFT playlist on Monad
              </span>
              . Each playlist becomes a unique digital collectible, forever preserved on the blockchain.
            </p>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 glass w-16 h-16 rounded-full flex items-center justify-center animate-float opacity-60">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div
              className="absolute top-32 right-10 glass w-12 h-12 rounded-full flex items-center justify-center animate-float opacity-60"
              style={{ animationDelay: "1.5s" }}
            >
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <CreatePlaylistForm />
        </div>
      </div>
    </main>
  )
}
