# Universal Multi-Asset Management System on MST Blockchain

An enterprise-grade decentralized platform for managing heterogeneous real-world and digital assets on the **MST Blockchain** (EVM Layer 1).

The system handles diverse asset classes with purpose-built token standards, permissioning, and lifecycle mechanics:
- **Academic Degree & Professional Credentials**: Non-transferable (Soulbound ERC-721 / ERC-5192) issued exclusively by accredited universities, with on-chain revocation verification.
- **Carbon Credits**: Semi-fungible project batches (ERC-1155) issued by verified auditors, supporting trading, fractional holdings, and permanent burning/retirement producing non-transferable **Proof-of-Offset Receipts**.
- **Land Ownership & Property Deeds**: Unique cadastral parcels (ERC-721) with legal encumbrance/lien controls preventing unauthorized transfers during active mortgages or legal disputes.
- **Universal Asset Manager**: Aggregator providing unified portfolio summaries and multi-asset inventory views for any wallet.
- **Universal Marketplace**: Decentralized trading and escrow for transferable assets settled in native **MSTC** coin.

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

