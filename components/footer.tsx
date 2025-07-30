import Link from "next/link"
import { Music, Twitter, Github, DiscIcon as Discord, Zap, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="glass-card border-0 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 animate-pulse"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold holographic">Monad Music</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Create, discover, and collect unique playlist NFTs on Monad's high-performance blockchain. The future of music ownership is here.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60">Connected to Monad Network</span>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-bold mb-6 text-white flex items-center">
                <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                Platform
              </h3>
              <ul className="space-y-4 text-sm">
                {[
                  { name: "Home", href: "/" },
                  { name: "Create Playlist", href: "/create" },
                  { name: "Browse Playlists", href: "#" },
                  { name: "Community", href: "#" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-white hover:neon-text transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold mb-6 text-white flex items-center">
                <Globe className="w-4 h-4 mr-2 text-purple-400" />
                Resources
              </h3>
              <ul className="space-y-4 text-sm">
                {["Documentation", "Help Center", "Terms of Service", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/70 hover:text-white hover:neon-text transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-bold mb-6 text-white">Community</h3>
              <div className="flex space-x-4 mb-6">
                {[
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Discord, href: "#", color: "hover:text-purple-400" },
                  { icon: Github, href: "#", color: "hover:text-green-400" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`glass p-3 rounded-xl text-white/70 ${social.color} transition-all duration-300 hover:scale-110 hover:glass-strong group`}
                  >
                    <social.icon className="w-5 h-5 group-hover:animate-pulse" />
                  </Link>
                ))}
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60">Network Status: Online</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <span className="text-white/60">Monad Sync: Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-white/60">&copy; 2025 Monad Music. Built for the Monad ecosystem.</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="glass px-4 py-2 rounded-full flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/70">Powered by Monad Blockchain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
