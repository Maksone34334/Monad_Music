# 🎵 Monad Music - Web3 Music NFT Platform

A revolutionary Web3 music platform built on **Monad Testnet** that allows users to create, mint, and collect playlist NFTs. Transform your favorite music collections into unique digital assets on the blockchain.

![Monad Music](https://raw.githubusercontent.com/Maksone34334/Monad_Music/main/public/monad%20dj.png)

## 🚀 Features

- **🎼 Playlist NFTs**: Create playlists of 12 songs and mint them as NFTs
- **💰 Fair Pricing**: Mint NFTs for only 0.12 MON tokens
- **🖼️ IPFS Integration**: Decentralized storage for NFT metadata and images
- **⚡ Monad Powered**: Built on high-performance Monad blockchain
- **🎨 Modern UI**: Sleek black theme with glassmorphism effects
- **🔗 Web3 Ready**: Full MetaMask integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.2.4, TypeScript, Tailwind CSS
- **Blockchain**: Monad Testnet (Chain ID: 10143)
- **Smart Contracts**: Solidity 0.8.17, Hardhat
- **Web3**: ethers.js v6, MetaMask integration
- **Storage**: IPFS for decentralized metadata
- **UI Components**: Custom glassmorphism design system

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MetaMask wallet
- MON testnet tokens ([Get from faucet](https://testnet.monad.xyz))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maksone34334/Monad_Music.git
   cd Monad_Music
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Configure IPFS (Optional for audio upload)**
   ```bash
   # Get free API keys from https://pinata.cloud
   # Add to .env.local:
   NEXT_PUBLIC_PINATA_API_KEY=your_api_key
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Creating a Playlist NFT

1. **Connect Wallet**: Click "Connect Wallet" and connect MetaMask
2. **Add to Monad Network**: The app will automatically add Monad Testnet
3. **Create Playlist**: 
   - Enter playlist title and description
   - Add your name as creator
   - Upload 12 music files with titles
4. **Mint NFT**: Pay 0.12 MON to mint your playlist as an NFT
5. **Receive NFT**: Your playlist NFT will be minted with IPFS metadata

### Features

- **🎵 12-Track Playlists**: Each NFT contains exactly 12 songs
- **📊 Real-time Progress**: Track your playlist completion
- **🎨 Dynamic Covers**: Beautiful gradient covers for each playlist
- **⚡ Instant Minting**: Fast transactions on Monad network

## 🔗 Smart Contract

**Contract Address**: `0x231B66aDB7A9E83a409C522eDf029CCA0E53Fb62`  
**Network**: Monad Testnet (Chain ID: 10143)  
**Standard**: ERC-721 (NFT)  

### Contract Features
- Mint Price: 0.12 MON
- Max Songs per NFT: 12
- On-chain song metadata
- Owner withdrawal functions
- IPFS metadata integration

## 🌐 Network Configuration

Add Monad Testnet to MetaMask:

- **Network Name**: Monad Testnet
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Chain ID**: `10143`
- **Currency Symbol**: `MON`
- **Block Explorer**: `https://testnet-explorer.monad.xyz`

## 📱 Screenshots

### Home Page
Modern landing page with holographic effects and animated backgrounds.

### Create Playlist
Intuitive interface for uploading songs and creating playlists.

### Web3 Integration
Seamless MetaMask connection and transaction handling.

## 🛣️ Roadmap

- [ ] **IPFS File Upload**: Direct audio file uploads to IPFS
- [ ] **Playlist Marketplace**: Buy and sell playlist NFTs
- [ ] **Social Features**: Follow creators and discover playlists
- [ ] **Streaming Integration**: Play songs directly from NFTs
- [ ] **Cross-chain Support**: Deploy to Monad Mainnet
- [ ] **Mobile App**: React Native mobile application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Foundation** for the high-performance blockchain
- **OpenZeppelin** for secure smart contract templates
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first styling approach

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Join our community discussions
- Follow updates on social media

---

**Built with ❤️ by Maksone34334 for the Monad ecosystem**

*Transforming music into digital assets, one playlist at a time.*