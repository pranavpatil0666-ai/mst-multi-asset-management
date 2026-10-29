# Universal Multi-Asset Management System on MST Blockchain

> **Official MST Blockchain RWA Infrastructure**: An institutional-grade decentralized framework uniting **Soulbound Academic Degrees**, **Certified Carbon Credits**, and **Cadastral Land Titles** on the high-throughput **MST Blockchain (EVM Layer 1)** with Pinata IPFS storage, on-chain Role-Based Access Control (RBAC), and a native MSTC Universal Marketplace.

🔗 **Live Production Deployment**: [https://frontend-snowy-ten-19.vercel.app](https://frontend-snowy-ten-19.vercel.app)  
📦 **GitHub Repository**: [https://github.com/pranavpatil0666-ai/mst-multi-asset-management](https://github.com/pranavpatil0666-ai/mst-multi-asset-management)

---

## 🌟 Executive Summary

Traditional real-world asset management is plagued by credential forgery, carbon credit double-counting, opaque cadastral land encumbrances, and siloed token standards. 

The **MST Multi-Asset Hub** solves this by establishing a heterogeneous token standard infrastructure natively deployed on the high-speed **MST Blockchain (PoSA, 4,000+ TPS, ~3s finality)**:
1. **Academic Degree & Professional Credentials**: Permanent, non-transferable **Soulbound ERC-721 / ERC-5192** certificates issued exclusively by accredited universities registered in `AuthorityRegistry.sol`. Includes tamper-proof IPFS transcript hashing and on-chain revocation verification.
2. **Certified Carbon Credits**: Semi-fungible **ERC-1155** project batches issued by verified environmental auditors (Verra VCS / Gold Standard), supporting fractional trading and permanent retirement (burning) that mints Soulbound **Proof-of-Offset Receipts**.
3. **Cadastral Land Titles & Property Deeds**: Unique **ERC-721** deeds linked to municipal cadastral survey identifiers and GIS boundaries, featuring programmatic **Encumbrance / Lien Locks** to prevent fraudulent transfers during active mortgages or litigation.
4. **On-Chain Role-Based Access Control (RBAC)**: An institutional authority directory governing university, auditor, and land registrar credentials with admin activation toggles.
5. **Decentralized Pinata IPFS Cloud Storage**: Direct integration with Pinata IPFS for pinning academic transcripts, legal land surveys, and third-party carbon audit reports.
6. **Universal Marketplace**: Trustless atomic escrow and trading protocol settled directly in native **MSTC** coin with automated 1.0% protocol fee distribution.

---

## 🏛️ Smart Contract Architecture

```
contracts/
├── access/
│   └── AuthorityRegistry.sol          # RBAC for Universities, Carbon Auditors, and Land Registrars
├── credentials/
│   └── AcademicDegreeCertificate.sol  # Soulbound ERC-721 / ERC-5192 for permanent credentials
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

## ⚙️ Token Standard & Permissions Matrix

| Asset Class | Contract | Standard | Transferable? | Issuing Authority Role |
| :--- | :--- | :--- | :--- | :--- |
| **Degree Certificates** | `AcademicDegreeCertificate` | ERC-5192 / Soulbound ERC-721 | ❌ No (Soulbound) | `UNIVERSITY_ROLE` |
| **Carbon Credits** | `CarbonCreditBatch` | ERC-1155 Multi-Token | ✅ Yes | `CARBON_AUDITOR_ROLE` |
| **Carbon Offset Receipts** | `CarbonRetirementReceipt` | Soulbound ERC-721 | ❌ No (Soulbound) | `CarbonCreditBatch` (on burn) |
| **Land Ownership Deeds** | `LandOwnershipTitle` | ERC-721 Property Deed | ✅ Yes (if unencumbered) | `LAND_REGISTRAR_ROLE` |
| **Asset Aggregator** | `UniversalAssetManager` | Multi-Standard Read Hub | N/A | Public / Read-Only |
| **RWA Marketplace** | `UniversalMarketplace` | Atomic Escrow (MSTC) | ✅ Yes | Any verified owner |

---

## 🌐 MST Blockchain Network Details

### **MST Testnet**
* **Network Name:** MST Testnet
* **Chain ID:** `4545` (`0x11C1`)
* **RPC Endpoint:** `https://testnetrpc.mstblockchain.com`
* **Block Explorer:** [https://testnet.mstscan.com](https://testnet.mstscan.com)
* **Native Currency:** `tMSTC` (18 Decimals)

### **MST Mainnet**
* **Network Name:** MST Mainnet
* **Chain ID:** `4646` (`0x1226`)
* **RPC Endpoint:** `https://mariorpc.mstblockchain.com` / `https://craftrpc.mstblockchain.com`
* **Block Explorer:** [https://mstscan.com](https://mstscan.com)
* **Native Currency:** `MSTC` (18 Decimals)

---

## 📝 Smart Contract Functionality Breakdown

### 1. `AuthorityRegistry.sol`
* Implements OpenZeppelin `AccessControlEnumerable`.
* Manages cryptographic institutional roles: `DEFAULT_ADMIN_ROLE`, `UNIVERSITY_ROLE`, `CARBON_AUDITOR_ROLE`, `LAND_REGISTRAR_ROLE`.
* Stores authority profiles: legal name, jurisdiction, official website, and registration identifier.
* Provides `isAuthorized(address, bytes32)` modifier checks consumed by asset contracts.

### 2. `AcademicDegreeCertificate.sol`
* ERC-721 with Soulbound non-transferability overrides (`_update` reverts on transfers).
* Emits ERC-5192 `Locked(uint256 tokenId)` on issuance.
* Stores immutable student details, graduation date, major, and IPFS transcript hash.
* Restricts issuance exclusively to addresses holding `UNIVERSITY_ROLE`.
* Features institutional revocation capability with reason logging.

### 3. `CarbonCreditBatch.sol`
* ERC-1155 multi-token standard representing fractional metric tonnes of CO2e.
* Batch metadata includes Verra/Gold Standard Project ID, methodology, vintage year, and audit report IPFS URI.
* Contains `retireCredits(...)` function that permanently burns ERC-1155 credits and calls `CarbonRetirementReceipt.sol` to mint a non-transferable proof-of-offset receipt.

### 4. `CarbonRetirementReceipt.sol`
* Soulbound ERC-721 certificate minted exclusively by `CarbonCreditBatch` during credit retirement.
* Records beneficiary name, tonnes retired, retirement reason, batch token ID, and timestamp.
* Non-transferable to guarantee zero double-counting of corporate carbon offsets.

### 5. `LandOwnershipTitle.sol`
* ERC-721 cadastral property deed storing parcel identifier, municipal jurisdiction, GIS polygon boundaries, and deed registry IPFS URI.
* Encumbrance / Lien flag: Municipal registrars can flag parcels with active mortgage liens or legal disputes, which programmatically halts transfers until released.

### 6. `UniversalAssetManager.sol`
* Unified on-chain aggregator querying all sub-contracts in a single static call.
* Returns structured portfolio counts: degrees, land parcels, carbon holdings, and retirement receipts.

### 7. `UniversalMarketplace.sol`
* Trustless escrow marketplace for both ERC-721 (Land) and ERC-1155 (Carbon).
* Atomic settlement in native MST Blockchain coin (**MSTC**).
* Built-in 1.0% protocol fee automatically deducted and sent to protocol treasury.

---

## 📍 Deployed Smart Contract Addresses

| Smart Contract | Target Network | Deployed Contract Address |
| :--- | :--- | :--- |
| **AuthorityRegistry** | MST Chain | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **AcademicDegreeCertificate** | MST Chain | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **CarbonCreditBatch** | MST Chain | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| **CarbonRetirementReceipt** | MST Chain | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| **LandOwnershipTitle** | MST Chain | `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707` |
| **UniversalAssetManager** | MST Chain | `0x0165878A594ca255338adfa4d48449f69242Eb8F` |
| **UniversalMarketplace** | MST Chain | `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853` |

*(Addresses are dynamic and fully configurable via the dApp UI settings drawer for any custom testnet/mainnet instance).*

---

## 🚀 Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/pranavpatil0666-ai/mst-multi-asset-management.git
cd mst-multi-asset-management
```

### 2. Install Smart Contract Dependencies
```bash
npm install
```

### 3. Compile Contracts (Solidity 0.8.24 Cancun)
```bash
npx hardhat compile
```

### 4. Run Automated Test Suite
```bash
npx hardhat test
```
*All 13 unit tests pass covering RBAC authorization, Soulbound mechanics, carbon burn receipts, lien locks, and marketplace escrow.*

### 5. Launch Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Frontend Design & Visual Branding

The dApp UI is built in strict adherence to the **official MST Blockchain Brand Identity**:
- **Palette**: Deep Red (`#9D1C1F`), Flame Red (`#e52e2e`, `#ff2d2d`), Jet Obsidian (`#08080c`), and St. Patrick's Navy (`#28276B`).
- **Typography**: Space Grotesk and Montserrat display fonts.
- **Background**: Interactive HTML5 canvas rendering MST Blockchain node graph topology with real-time mouse repulsion, radar scanline beam, and technical HUD telemetry.
- **Glassmorphism**: Obsidian translucent cards with glowing crimson border reflections.

---

## 📜 License
Distributed under the MIT License. Developed for the MST Blockchain Ecosystem.
