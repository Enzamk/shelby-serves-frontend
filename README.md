# Shelby Serves - High-Performance Content Hub

*A Web3 infrastructure dashboard for real-time video delivery on the Shelby Protocol.*

---

## Project Overview

Shelby Serves leverages Shelby's **"Hot Storage"** layer to provide a sub-second retrieval alternative to traditional decentralized storage solutions like IPFS and Arweave. By combining the reliability of centralized CDNs with the decentralization of Web3, Shelby Serves delivers video content at lightning speeds while maintaining the security and censorship resistance of blockchain-based storage.

Traditional decentralized storage solutions often suffer from slow retrieval times and inconsistent availability. Shelby's Hot Storage layer solves this by maintaining a distributed network of high-performance nodes that keep frequently accessed content readily available, ensuring users can stream videos without the latency typically associated with decentralized storage.

---

## Key Features

### 1. Decentralized Video Ingestion
- Upload videos directly to the Shelby Network
- Automatic sharding across multiple storage nodes
- Content Addressable Storage (CAS) with unique Shelby Content IDs
- Support for multiple video formats and resolutions

### 2. Erasure Coding Health Monitoring
- Real-time monitoring of data redundancy across storage shards
- 99.9%+ health status indicators
- Automatic repair of degraded shards
- Visual dashboard showing storage node distribution

### 3. Real-time Node Latency Analytics
- Live protocol latency metrics (typically 35-50ms)
- Data throughput visualization in MiB/s
- Network performance tracking across Shelby nodes
- Historical analytics for capacity planning

### 4. Aptos/Petra Wallet Integration
- Seamless connection to Petra Wallet
- Builder rewards claiming system
- Token-gated content access (coming soon)
- Secure authentication for content management

---

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for video metadata
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **Cloudinary** - Video processing and CDN

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **React Hot Toast** - Notification system

### Infrastructure
- **Shelby Protocol Devnet** - Decentralized storage layer
- **Aptos Network** - Blockchain for wallet integration
- **Petra Wallet** - Web3 wallet provider

---

## How It Works

### Video Upload Flow

1. **Encoding Phase**
   - User uploads video through the dashboard
   - Video is encoded for optimal streaming quality
   - Metadata is stored in MongoDB

2. **Sharding & Distribution**
   - Video is split into multiple shards using erasure coding
   - Each shard is distributed across 10+ storage nodes
   - Redundancy ensures maximum uptime and data availability

3. **Indexing**
   - Content is broadcast to the Aptos Indexer
   - Unique Shelby Content ID is generated
   - Metadata is recorded on-chain for verification

4. **Retrieval**
   - When a user requests content, the nearest node responds
   - Sub-second retrieval from Hot Storage layer
   - Automatic failover if a node becomes unavailable

### Network Architecture

```
┌─────────────────┐
│   User Upload   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Encoding Layer │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Erasure Coding │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Shelby Storage Nodes           │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │Node1│ │Node2│ │Node3│ ...    │
│  └─────┘ └─────┘ └─────┘        │
└────────┬──────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Aptos Indexer  │
└─────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Petra Wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/shelby-serves.git
   cd shelby-serves
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd src/frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in a new terminal)
   cd src/frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## Future Roadmap

### Near Term
- [ ] Enhanced video transcoding options
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile-responsive improvements

### Mid Term
- [ ] **Token-Gated Content**
  - Content creators can restrict access to token holders
  - Integration with Aptos token standards
  - Flexible access control mechanisms

- [ ] **Protocol Governance**
  - Community-driven decision making
  - On-chain voting for protocol upgrades
  - Staking mechanisms for node operators

### Long Term
- [ ] Cross-chain compatibility
- [ ] AI-powered content recommendations
- [ ] Decentralized CDN marketplace
- [ ] Creator economy tools and monetization

---

## Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Website**: https://shelby.network
- **Twitter**: [@ShelbyProtocol](https://twitter.com/ShelbyProtocol)
- **Discord**: [Join our community](https://discord.gg/shelby)

---

**Built with ❤️ for the decentralized web**
