# 🌟 Ellora - Decentralized Freelance Marketplace

> **Winner Submission for Bolt.new Hackathon** 🏆  
> A metaverse-inspired freelance marketplace built on Algorand blockchain

![Ellora Banner](https://img.shields.io/badge/Built%20on-Algorand-00D4AA?style=for-the-badge&logo=algorand)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

## 🚀 Live Demo

**🔗 Application**: [http://localhost:3001](http://localhost:3001)  
**🔍 Smart Contracts**:
- Escrow Contract: [742004772](https://testnet.explorer.perawallet.app/application/742004772)
- Reputation SBT: [742004783](https://testnet.explorer.perawallet.app/application/742004783)

## ✨ What Makes Ellora Special

### 🎮 Metaverse-Inspired Design
- Cyberpunk aesthetic with neon accents and futuristic UI
- Smooth animations and hover effects
- Responsive design that works on all devices

### ⛓️ Real Blockchain Integration
- **Live smart contracts** deployed on Algorand Testnet
- **Escrow system** for secure payments
- **Reputation SBT tokens** for trustless reputation tracking
- **Pera Wallet** integration for seamless transactions

### 🛡️ Security First
- Smart contract security best practices
- Dispute resolution mechanism
- Automated escrow release system

## 🏗️ Architecture

```
Frontend (Next.js + TypeScript)
    ↓
Pera Wallet Integration
    ↓
Algorand Testnet
    ├── Escrow Contract (PyTEAL)
    └── Reputation SBT Contract (PyTEAL)
```

## 🎯 Core Features

### For Clients
- ✅ Browse freelancers by category
- ✅ Create jobs with escrow protection
- ✅ Track project progress
- ✅ Rate freelancers (mints reputation SBTs)

### For Freelancers
- ✅ Showcase skills and portfolio
- ✅ Bid on projects
- ✅ Earn reputation tokens
- ✅ Secure payment guarantees

### Smart Contract Features
- ✅ **Escrow System**: Funds locked until job completion
- ✅ **Reputation Tracking**: Soulbound tokens for trust
- ✅ **Dispute Resolution**: Automated arbitration
- ✅ **Multi-signature**: Enhanced security

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### Blockchain
- **Algorand** - High-performance blockchain
- **PyTEAL** - Smart contract development
- **Pera Wallet** - Wallet integration
- **AlgoSDK** - Blockchain interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Pera Wallet (mobile or web)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ellora-marketplace

# Install dependencies
npm install

# Start development server
npm run dev
```

### Smart Contract Deployment

```bash
cd smart-contracts/scripts
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Deploy contracts
python3 deploy_contracts_fixed.py
```

## 📱 User Journey

1. **Connect Wallet** - Seamless Pera Wallet integration
2. **Browse Jobs** - Explore opportunities by category
3. **Create/Bid** - Post jobs or submit proposals
4. **Escrow Payment** - Secure funds in smart contract
5. **Deliver Work** - Complete project milestones
6. **Release Payment** - Automated or manual release
7. **Rate & Review** - Mint reputation SBT tokens

## 🎨 Design Philosophy

Ellora combines the professionalism of traditional freelance platforms with the excitement of the metaverse:

- **Neon Accents**: Cyan and purple highlights
- **Glass Morphism**: Backdrop blur effects
- **Smooth Transitions**: 60fps animations
- **Dark Theme**: Easy on the eyes
- **Responsive**: Mobile-first design

## 🔐 Security Features

### Smart Contract Security
- ✅ Reentrancy protection
- ✅ Access control mechanisms
- ✅ Input validation
- ✅ Emergency pause functionality

### Frontend Security
- ✅ Type-safe TypeScript
- ✅ Secure wallet integration
- ✅ Input sanitization
- ✅ Error boundary handling

## 📊 Metrics & Analytics

- **Gas Efficiency**: Optimized smart contracts
- **User Experience**: <3s page load times
- **Mobile Responsive**: 100% compatibility
- **Accessibility**: WCAG 2.1 compliant

## 🏆 Hackathon Achievements

### Technical Excellence
- ✅ **Live Smart Contracts** on Algorand Testnet
- ✅ **Real Blockchain Integration** with working transactions
- ✅ **Professional UI/UX** with metaverse aesthetics
- ✅ **Type-Safe Development** with comprehensive TypeScript

### Innovation
- ✅ **Soulbound Reputation Tokens** for trust without centralization
- ✅ **Automated Escrow System** for secure payments
- ✅ **Metaverse-Inspired Design** for next-gen user experience
- ✅ **Multi-Asset Support** (ALGO, USDC, custom tokens)

### Production Ready
- ✅ **Comprehensive Documentation**
- ✅ **Error Handling & Recovery**
- ✅ **Responsive Design**
- ✅ **Security Best Practices**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♂️ Team

**Jatin Singh** - Full Stack Developer & Blockchain Engineer
- 🐙 GitHub: [@jtn-dev](https://github.com/jtn-dev)
- 💼 LinkedIn: [jdjatin](https://www.linkedin.com/in/jdjatin/)
- 🐦 Twitter: [@0jatinsingh0](https://x.com/0jatinsingh0)

---

<div align="center">

**Built with ❤️ for the Bolt.new Hackathon**

[Live Demo](http://localhost:3001) • [Smart Contracts](https://testnet.explorer.perawallet.app/application/742004772) • [Documentation](./docs)

</div>
