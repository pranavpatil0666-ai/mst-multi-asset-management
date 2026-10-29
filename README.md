# Universal Multi-Asset Management System on MST Blockchain

An enterprise-grade decentralized platform for managing heterogeneous real-world and digital assets on the **MST Blockchain** (EVM Layer 1).

The system handles diverse asset classes with purpose-built token standards, permissioning, and lifecycle mechanics:
- **Academic Degree & Professional Credentials**: Non-transferable (Soulbound ERC-721 / ERC-5192) issued exclusively by accredited universities, with on-chain revocation verification.
- **Carbon Credits**: Semi-fungible project batches (ERC-1155) issued by verified auditors, supporting trading, fractional holdings, and permanent burning/retirement producing non-transferable **Proof-of-Offset Receipts**.
- **Land Ownership & Property Deeds**: Unique cadastral parcels (ERC-721) with legal encumbrance/lien controls preventing unauthorized transfers during active mortgages or legal disputes.
- **Universal Asset Manager**: Aggregator providing unified portfolio summaries and multi-asset inventory views for any wallet.
- **Universal Marketplace**: Decentralized trading and escrow for transferable assets settled in native **MSTC** coin.

---

## 🏗️ System Architecture

The MST Multi-Asset Management System is structured into four decoupled, interoperable layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      1. PRESENTATION LAYER                             │
│   Next.js 15 • Tailwind CSS • Space Grotesk • MST Glassmorphism UI     │
│   (My Portfolio | Issuance Portal | Universal Marketplace | Admin RBAC)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Web3 / Ethers.js v6
┌───────────────────────────────────▼────────────────────────────────────┐
│                  2. DECENTRALIZED STORAGE LAYER                        │
│   Pinata IPFS Cloud Dedicated Gateway (gateway.pinata.cloud)           │
│   • Encrypted Transcripts  • GIS Cadastral Deeds  • Carbon Audits      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ IPFS CIDs & Cryptographic Hashes
┌───────────────────────────────────▼────────────────────────────────────┐
│              3. SMART CONTRACT & SETTLEMENT LAYER (EVM)                │
│                                                                        │
│   [Access Control]            [Asset Standard Contracts]               │
│   AuthorityRegistry.sol       ├── AcademicDegreeCertificate (ERC-5192) │
│   ├── UNIVERSITY_ROLE         ├── CarbonCreditBatch (ERC-1155)         │
│   ├── CARBON_AUDITOR_ROLE     ├── CarbonRetirementReceipt (Soulbound)  │
│   └── LAND_REGISTRAR_ROLE     └── LandOwnershipTitle (ERC-721 + Lien)  │
│                                                                        │
│   [Aggregation & Marketplace]                                          │
│   ├── UniversalAssetManager.sol (Multi-standard portfolio reader)      │
│   └── UniversalMarketplace.sol (Escrow & Settlement in native MSTC)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON-RPC (Chain ID: 4545 / 4646)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    4. MST BLOCKCHAIN LAYER 1                           │
│   Consensus: PoSA • Throughput: 4,000+ TPS • Block Time: ~3 Seconds   │
│   Native Currency: MSTC / tMSTC • EVM Cancun (Solidity 0.8.24)         │
│   Explorers: testnet.mstscan.com / mstscan.com                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technical Stack

| Layer | Technology / Tool | Description & Implementation |
| :--- | :--- | :--- |
| **Layer 1 Blockchain** | **MST Blockchain (EVM L1)** | High-performance PoSA consensus with 4,000+ TPS and ~3-second deterministic finality. |
| **Smart Contracts** | **Solidity `^0.8.24` (Cancun)** | Optimized with `viaIR: true` and 200 optimization runs for minimal gas execution. |
| **Development Suite** | **Hardhat 2.22** | Unit test suite (13 tests), mock in-memory EVM, and multi-network deployment scripts. |
| **Standard Libraries** | **OpenZeppelin Contracts v5.0** | ERC-5192 (Soulbound), ERC-1155 (Multi-Token), ERC-721 (Property Deed), `AccessControlEnumerable`. |
| **Decentralized Storage** | **Pinata IPFS Cloud** | Enterprise IPFS pinning with dedicated gateways for transcripts, GIS deed surveys, and audit logs. |
| **Web3 Client Library** | **Ethers.js v6** | BrowserProvider wallet connectivity, BigInt math, transaction broadcasting, and contract interfaces. |
| **Frontend Framework** | **Next.js 15 (App Router)** | High-speed React 19 architecture with SSR-safe client components and optimized asset pipelines. |
| **Design System** | **Tailwind CSS v3.4** | Custom MST Blockchain obsidian-glass palette (`#9D1C1F`, `#e52e2e`, `#08080c`, `#28276B`). |
| **Graphics & VFX** | **HTML5 Canvas API** | Custom GPU-accelerated interactive blockchain network node topology with real-time mouse repulsion. |
| **Typography & UI** | **Google Fonts & Lucide React** | Space Grotesk & Montserrat display fonts with crisp vector iconography. |
| **Cloud Hosting** | **Vercel Production Edge** | Serverless production deployment with instant global CDN distribution. |

---

## 🏛️ Smart Contract Architecture

```
contracts/
├── access/
│   └── AuthorityRegistry.sol          # RBAC for Universities, Carbon Auditors, and Land Registrars
├── credentials/
│   └── AcademicDegreeCertificate.sol  # Soulbound ERC-721 for permanent credentials
├── carbon/
│   ├── CarbonCreditBatch.sol          # ERC-1155 multi-vintage carbon credit batches
│   └── CarbonRetirementReceipt.sol    # Soulbound ERC-721 proof-of-offset receipt
├── land/
│   └── LandOwnershipTitle.sol         # ERC-721 property deed with lien/encumbrance lock
├── manager/
│   └── UniversalAssetManager.sol      # Unified multi-asset portfolio aggregator
└── marketplace/
    └── UniversalMarketplace.sol       # Native MSTC trading & escrow for transferable assets
```

---

## 🔄 Lifecycle Workflows

### 1. Institutional Notarization & RBAC Workflow
```
[Protocol Admin]
       │
       ▼
AuthorityRegistry.registerAuthority(address, role, name, jurisdiction, website, regId)
       │
       ├─► Grants specialized role (UNIVERSITY_ROLE, CARBON_AUDITOR_ROLE, or LAND_REGISTRAR_ROLE)
       ├─► Saves authority profile with legal jurisdiction and verification registration ID
       └─► Target authority address is now cryptographically authorized to issue on-chain assets
```

### 2. Academic Credential Workflow (Soulbound ERC-5192)
```
[Accredited University]
       │
       ├─► 1. Pins student transcript PDF to Pinata IPFS (generates ipfs:// URI)
       ├─► 2. Computes keccak256 hash of Student ID for privacy preservation
       │
       ▼
AcademicDegreeCertificate.issueDegree(studentWallet, studentName, studentIdHash, degree, major, date, ipfsUri)
       │
       ├─► Verifies caller holds active UNIVERSITY_ROLE in AuthorityRegistry
       ├─► Emits ERC-5192 Locked(tokenId) event
       └─► Permanently binds non-transferable diploma to student address (anti-credential fraud)
```

### 3. Carbon Credit & Permanent Retirement Workflow (ERC-1155 & Soulbound)
```
[Certified Carbon Auditor]
       │
       ├─► 1. Validates environmental project (Verra VCS / Gold Standard)
       ├─► 2. Uploads third-party methodology & audit report to Pinata IPFS
       ▼
CarbonCreditBatch.createAndMintBatch(recipient, projectId, standard, vintage, tonnes, ipfsUri)
       │
       ├─► Verifies caller holds CARBON_AUDITOR_ROLE
       ├─► Mints ERC-1155 batch credits to project developer
       │
       ▼
[Trading & Offsetting]
       │
       ├─► Developer lists credits on UniversalMarketplace in native MSTC
       ▼
[Corporate Offset Buyer]
       │
       ▼
CarbonCreditBatch.retireCredits(tokenId, tonnes, beneficiaryName, retirementReason)
       │
       ├─► Permanently burns ERC-1155 tokens on-chain (guaranteeing zero double-spending)
       └─► Calls CarbonRetirementReceipt.sol to mint a non-transferable Soulbound Proof-of-Offset
```

### 4. Cadastral Land Title & Mortgage Encumbrance Workflow (ERC-721)
```
[Municipal Land Registrar]
       │
       ├─► 1. Verifies cadastral deed survey and GIS polygon boundaries
       ├─► 2. Pins deed survey documents to Pinata IPFS
       ▼
LandOwnershipTitle.registerLand(ownerWallet, parcelIdentifier, jurisdiction, areaSqM, ipfsUri)
       │
       ├─► Verifies caller holds LAND_REGISTRAR_ROLE
       ├─► Mints unique 1-of-1 ERC-721 Property Deed to owner
       │
       ▼
[Mortgage / Lien Security Mechanism]
       │
       ├─► Bank / Court notices active lien -> Registrar calls setEncumbrance(tokenId, true, reason)
       ├─► On-chain transfer hook halts all transfer / marketplace attempts (anti-fraud protection)
       │
       ▼
[Lien Clearance & Marketplace Settlement]
       │
       ├─► Mortgage cleared -> Registrar calls setEncumbrance(tokenId, false, "Lien Cleared")
       ├─► Owner approves & lists Land Title on UniversalMarketplace
       └─► Buyer purchases atomically with native MSTC; title transfers automatically
```

---

## ⚙️ Token Standard Matrix

| Asset Class | Contract | Standard | Transferable? | Issuing Authority Role |
| :--- | :--- | :--- | :--- | :--- |
| **Degree Certificates** | `AcademicDegreeCertificate` | ERC-5192 / Soulbound ERC-721 | ❌ No | `UNIVERSITY_ROLE` |
| **Carbon Credits** | `CarbonCreditBatch` | ERC-1155 | ✅ Yes | `CARBON_AUDITOR_ROLE` |
| **Carbon Offset Receipts** | `CarbonRetirementReceipt` | Soulbound ERC-721 | ❌ No | `CarbonCreditBatch` (on burn) |
| **Land Ownership Deeds** | `LandOwnershipTitle` | ERC-721 | ✅ Yes (if unencumbered) | `LAND_REGISTRAR_ROLE` |

---

## 🌐 MST Blockchain Network Details

### **MST Testnet**
* **Chain ID:** `4545`
* **RPC Endpoint:** `https://testnetrpc.mstblockchain.com`
* **Explorer:** [https://testnet.mstscan.com](https://testnet.mstscan.com)
* **Native Coin:** `tMSTC`

### **MST Mainnet**
* **Chain ID:** `4646` (`0x1226`)
* **RPC Endpoint:** `https://mariorpc.mstblockchain.com`
* **Explorer:** [https://mstscan.com](https://mstscan.com)
* **Native Coin:** `MSTC`

---

## 🚀 Quick Start

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Run Automated Test Suite
Executes 13 unit tests covering RBAC, Soulbound restrictions, retirement burning, encumbrance locks, portfolio aggregation, and marketplace trades:
```bash
npx hardhat test
```

### 3. Deploy

#### Local In-Memory Network
```bash
npx hardhat run scripts/deploy.js
```

#### MST Testnet
Configure your `PRIVATE_KEY` in `.env` (funded with testnet `tMSTC`), then run:
```bash
npm run deploy:testnet
```

#### MST Mainnet
```bash
npm run deploy:mainnet
```

Deployment metadata, contract addresses, and network details will be automatically written to `deployments/<network>.json`.

---

## 💻 Frontend dApp (Next.js & Tailwind CSS)

The full-featured Web3 frontend dashboard is located in `frontend/`.

### Run the Development Server
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Key Capabilities in the Dashboard:
- **My Multi-Asset Portfolio**: Real-time overview of owned Soulbound degrees, land parcel deeds, active carbon holdings, and permanent offset receipts.
- **Institutional Issuance Portal**: Authorized interfaces for universities to mint degrees, auditors to issue carbon batches, and registrars to register land deeds or manage mortgage liens.
- **MSTC RWA Marketplace**: Browse and execute atomic asset purchases with native MSTC, and list owned assets for sale.
- **One-Click Network Switcher**: Seamlessly switches MetaMask between **MST Testnet (Chain ID 4545)** and **MST Mainnet (Chain ID 4646)**.
