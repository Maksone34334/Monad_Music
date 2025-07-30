import Hero from "@/components/hero"
import { Features } from "@/components/features"
import TrendingPlaylists from "@/components/trending-playlists"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <TrendingPlaylists />
    </main>
  )
}
