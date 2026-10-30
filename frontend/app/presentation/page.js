"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  ExternalLink,
  ShieldCheck,
  Award,
  Leaf,
  Landmark,
  Layers,
  ArrowRight,
  Flame,
  Globe,
  Wallet,
  CheckCircle2,
  FileText,
  Lock,
  GitBranch,
  Cpu,
  Database,
  Building,
  Check,
  Maximize2,
  Minimize2,
  Download,
} from "lucide-react";

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState("deck"); // "deck" or "all"

  const slides = [
    // SLIDE 1: Cover
    {
      id: "cover",
      badge: "MST BLOCKCHAIN HACKATHON // OFFICIAL PITCH DECK",
      title: "Universal Multi-Asset Management System",
      subtitle:
        "An enterprise-grade decentralized platform uniting Soulbound Academic Degrees, Certified Carbon Credits, and Cadastral Land Titles on the MST Blockchain (EVM L1).",
      content: (
        <div className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <span className="text-[11px] font-mono text-red-400 block mb-1">PROJECT NAME</span>
              <p className="text-base font-bold text-white">MST Multi-Asset Hub</p>
              <p className="text-xs text-slate-400 mt-1">Enterprise Real-World Asset Platform</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <span className="text-[11px] font-mono text-red-400 block mb-1">TEAM NAME & LEADER</span>
              <p className="text-base font-bold text-white">MST Alpha Innovators</p>
              <p className="text-xs text-slate-400 mt-1">Pranav Patil (pranavpatil0666@gmail.com)</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <span className="text-[11px] font-mono text-red-400 block mb-1">TARGET INFRASTRUCTURE</span>
              <p className="text-base font-bold text-white">MST Blockchain (EVM L1)</p>
              <p className="text-xs text-slate-400 mt-1">PoSA • 4,000+ TPS • BridgeKey Native</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20">
              ERC-5192 Soulbound
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ERC-1155 Carbon Batches
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ERC-721 Encumbered Land Deeds
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Pinata IPFS Cloud
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 2: Problem Statement
    {
      id: "problem",
      badge: "THE CHALLENGE",
      title: "The Fragmentation & Vulnerability of Real-World Assets",
      subtitle: "Current Web3 and legacy institutional systems fail to handle heterogeneous legal and economic requirements.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left">
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 w-fit text-red-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Academic Credential Fraud</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unverifiable paper and PDF degrees can be easily forged. Standard NFTs fail because degrees must be 
              <strong> strictly non-transferable</strong> (Soulbound) while protecting student privacy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-fit text-emerald-400">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Carbon Double-Spending</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Voluntary carbon markets are fraught with greenwashing and double-counting. Offsetting requires 
              <strong> irreversible on-chain burning</strong> that produces immutable proof-of-retirement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 w-fit text-amber-400">
              <Landmark className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Land Title & Lien Conflicts</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real estate deeds require <strong>legal encumbrance enforcement</strong>. If a property is mortgaged or in dispute, 
              transfers must be cryptographically locked until released by authorities.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 3: Proposed Solution
    {
      id: "solution",
      badge: "OUR ARCHITECTURE",
      title: "Heterogeneous Multi-Standard Asset Engine",
      subtitle: "A purpose-built smart contract suite aligning token standards with exact legal asset mechanics.",
      content: (
        <div className="space-y-6 mt-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                ERC-5192 SOULBOUND
              </span>
              <h4 className="text-base font-bold text-white">Degrees & Diplomas</h4>
              <p className="text-xs text-slate-400">
                Permanently locked to student wallets upon issuance. Keccak256 hashed IDs for GDPR compliance and on-chain revocation verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ERC-1155 + SOULBOUND RECEIPT
              </span>
              <h4 className="text-base font-bold text-white">Carbon Credit Batches</h4>
              <p className="text-xs text-slate-400">
                Semi-fungible project vintages (1 token = 1 tonne CO2e). Retiring credits permanently burns the token and mints a non-transferable Proof-of-Offset.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                ERC-721 + ENCUMBRANCE
              </span>
              <h4 className="text-base font-bold text-white">Cadastral Land Titles</h4>
              <p className="text-xs text-slate-400">
                Unique GIS land parcels. Municipal registrars can flag active bank mortgage liens, halting all transfers and marketplace sales instantly.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-red-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Institutional Authority Registry (RBAC)</p>
                <p className="text-[11px] text-slate-400">
                  Only verified institutional bodies (accredited universities, certified carbon auditors, municipal registrars) hold minting rights.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
              Zero Unauthorized Minting
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 4: System Architecture
    {
      id: "architecture",
      badge: "SYSTEM TOPOLOGY",
      title: "End-to-End Enterprise Architecture",
      subtitle: "Four interoperable layers delivering speed, cryptographic security, and persistent decentralized storage.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold">LAYER 1</span>
              <h4 className="text-base font-bold text-white mt-1">Presentation Layer</h4>
              <p className="text-xs text-slate-400 mt-2">
                Next.js 15 App Router with responsive obsidian glassmorphism UI. Real-time portfolio inspector, role-based issuance portal, and marketplace.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-300">
              Next.js 15 • Tailwind • Ethers.js
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold">LAYER 2</span>
              <h4 className="text-base font-bold text-white mt-1">Storage Layer</h4>
              <p className="text-xs text-slate-400 mt-2">
                Pinata IPFS Cloud dedicated gateway storing heavy payloads: encrypted academic transcripts, GIS land deeds, and carbon auditor certifications.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-300">
              Pinata Cloud • IPFS CIDs
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold">LAYER 3</span>
              <h4 className="text-base font-bold text-white mt-1">Smart Contracts</h4>
              <p className="text-xs text-slate-400 mt-2">
                Solidity 0.8.24 (Cancun EVM). AuthorityRegistry, DegreeSoulbound, CarbonBatch, OffsetReceipt, LandTitle, AssetManager, and Marketplace.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-300">
              OpenZeppelin v5 • Cancun Ready
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold">LAYER 4</span>
              <h4 className="text-base font-bold text-white mt-1">MST Blockchain</h4>
              <p className="text-xs text-slate-400 mt-2">
                High-throughput PoSA L1 executing ~3-second block finality and 4,000+ TPS. Settlement in native MSTC coin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-300">
              Chain 91562037 / 4646
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: How MST Blockchain is Implemented
    {
      id: "mst-impl",
      badge: "BLOCKCHAIN CORE",
      title: "Native Implementation on MST Blockchain",
      subtitle: "Why MST Blockchain is the ideal Layer 1 execution environment for institutional RWAs.",
      content: (
        <div className="space-y-6 mt-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30">
              <span className="text-3xl font-black text-white font-mono">4,000+</span>
              <p className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">Transactions / Sec</p>
              <p className="text-xs text-slate-300 mt-2">
                PoSA consensus enables high-frequency carbon credit batch settlements without network congestion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30">
              <span className="text-3xl font-black text-white font-mono">~3 Sec</span>
              <p className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">Deterministic Finality</p>
              <p className="text-xs text-slate-300 mt-2">
                Instant verification of degree credentials and rapid real estate escrow clearance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30">
              <span className="text-3xl font-black text-white font-mono">Native MSTC</span>
              <p className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">Native Gas & Escrow</p>
              <p className="text-xs text-slate-300 mt-2">
                Zero wrapper contracts. Marketplace sales and gas fees settle directly in native MSTC/tMSTC.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>MST Testnet RPC:</span>
              <span className="text-red-400">https://testnetrpc.mstblockchain.com</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Verified Testnet Chain ID:</span>
              <span className="text-emerald-400 font-bold">91562037 (0x5752035)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>MST Mainnet RPC:</span>
              <span className="text-red-400">https://mariorpc.mstblockchain.com (Chain 4646)</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: BridgeKey Wallet Integration
    {
      id: "bridgekey",
      badge: "WALLET INTEGRATION",
      title: "First-Class BridgeKey Native Integration",
      subtitle: "Frictionless Web3 UX with the official non-custodial wallet by Masterstroke Technosoft.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-left">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-red-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">EIP-1193 & EIP-6963 Auto-Discovery</h4>
                <p className="text-xs text-slate-400">Automated provider resolution</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside">
              <li>Detects BridgeKey via dedicated window.bridgekey and multi-provider announcements.</li>
              <li>Seamless fallback to MetaMask with coexistence collision handling.</li>
              <li>Extension reload detection with 1-click page recovery.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-red-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Automated Network Management</h4>
                <p className="text-xs text-slate-400">1-click testnet & mainnet setup</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside">
              <li>Executes wallet_addEthereumChain with verified Chain ID 91562037.</li>
              <li>Pre-configures official block explorers (testnet.mstscan.com and mstscan.com).</li>
              <li>Real-time native tMSTC and MSTC balance display inside the dApp.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 7: Key Features
    {
      id: "features",
      badge: "KEY CAPABILITIES",
      title: "Core Functionalities & Platform Workflows",
      subtitle: "A complete decentralized ecosystem spanning issuance, ownership, verification, and trading.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center space-x-2 text-red-400">
              <Award className="h-4 w-4" />
              <span className="font-bold text-sm text-white">Institutional Issuance Portal</span>
            </div>
            <p className="text-xs text-slate-400">
              Dedicated interfaces for authorized institutions: Universities issue tamper-proof degrees, auditors mint carbon batches, and registrars register cadastral titles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Leaf className="h-4 w-4" />
              <span className="font-bold text-sm text-white">Proof-of-Offset Burning Engine</span>
            </div>
            <p className="text-xs text-slate-400">
              Enterprises permanently burn carbon credit tokens on-chain to offset emissions, instantaneously generating an immutable, non-transferable Soulbound receipt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <Lock className="h-4 w-4" />
              <span className="font-bold text-sm text-white">Mortgage & Lien Encumbrance Lock</span>
            </div>
            <p className="text-xs text-slate-400">
              Registrars can place and lift legal liens on real estate deeds. Encumbered properties cannot be transferred, protecting lenders and buyers against fraud.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm text-white">Decentralized MSTC Marketplace</span>
            </div>
            <p className="text-xs text-slate-400">
              List and trade unencumbered land titles and carbon credits atomically. Escrow payments and settlements execute natively in MSTC.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 8: Smart Contracts & Verification
    {
      id: "contracts",
      badge: "VERIFIED PROTOCOL",
      title: "Smart Contracts & Security Architecture",
      subtitle: "7 modular, tested contracts forming the decentralized settlement spine.",
      content: (
        <div className="space-y-4 mt-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">1. RBAC REGISTRY</span>
              <span className="text-white font-bold">AuthorityRegistry.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">2. SOULBOUND DEGREES</span>
              <span className="text-white font-bold">AcademicDegreeCertificate.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">3. CARBON BATCHES</span>
              <span className="text-white font-bold">CarbonCreditBatch.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">4. OFFSET RECEIPTS</span>
              <span className="text-white font-bold">CarbonRetirementReceipt.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">5. LAND TITLES</span>
              <span className="text-white font-bold">LandOwnershipTitle.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0x5FC8d32690cc91D4c39d9d3abcBD16989F875707</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
              <span className="text-slate-400 block text-[10px]">6. MARKETPLACE</span>
              <span className="text-white font-bold">UniversalMarketplace.sol</span>
              <span className="text-red-400 block text-[11px] truncate">0xa513E6E4b8f2a923D98304ec87F64353C4D5C853</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">Automated Test Suite: 13/13 Hardhat Unit Tests Passing</span>
            </div>
            <span className="font-mono text-emerald-400">100% Core Coverage</span>
          </div>
        </div>
      ),
    },

    // SLIDE 9: Target Market & Business Model
    {
      id: "market",
      badge: "MARKET IMPACT",
      title: "Market Opportunity & Economic Model",
      subtitle: "Capitalizing on the multi-trillion dollar Real-World Asset (RWA) tokenization revolution.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <span className="text-2xl font-black text-white font-mono">$16 Trillion</span>
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Projected RWA Market (2030)</p>
            <p className="text-xs text-slate-400">
              Institutional tokenization is expanding rapidly across real estate, carbon credits, and certified legal credentials.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <span className="text-2xl font-black text-white font-mono">$50 Billion+</span>
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Voluntary Carbon Market</p>
            <p className="text-xs text-slate-400">
              Corporate ESG mandates necessitate audited on-chain retirement receipts with zero double-counting risks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <span className="text-2xl font-black text-white font-mono">Sustainable Model</span>
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Protocol Monetization</p>
            <p className="text-xs text-slate-400">
              Small protocol fee on marketplace volume, institutional authority onboarding, and premium IPFS document pinning.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 10: Roadmap
    {
      id: "roadmap",
      badge: "THE FUTURE",
      title: "Strategic Protocol Roadmap",
      subtitle: "From hackathon MVP to enterprise production on MST Blockchain Mainnet.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-left">
          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/40">
            <span className="text-[10px] font-mono text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/10">
              PHASE 1 (COMPLETED)
            </span>
            <h4 className="text-sm font-bold text-white mt-3">MVP & Testnet</h4>
            <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
              <li>Deploy all 7 smart contracts</li>
              <li>BridgeKey & MetaMask integration</li>
              <li>Pinata IPFS document pipeline</li>
              <li>CI/CD GitHub Actions pipeline</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-white/5">
              PHASE 2 (Q1 2027)
            </span>
            <h4 className="text-sm font-bold text-white mt-3">Mainnet & Audits</h4>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 list-disc list-inside">
              <li>Comprehensive smart contract audit</li>
              <li>MST Mainnet production deployment</li>
              <li>University pilot partnerships</li>
              <li>Auditor identity verification KYC</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-white/5">
              PHASE 3 (Q2 2027)
            </span>
            <h4 className="text-sm font-bold text-white mt-3">IoT & Sensor Feeds</h4>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 list-disc list-inside">
              <li>IoT oracle feeds for real-time carbon data</li>
              <li>Satellite GIS parcel boundary mapping</li>
              <li>Automated compliance reporting</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-white/5">
              PHASE 4 (Q3 2027)
            </span>
            <h4 className="text-sm font-bold text-white mt-3">RWA DeFi Collateral</h4>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 list-disc list-inside">
              <li>Borrowing MSTC against unencumbered land titles</li>
              <li>Carbon credit yield pools</li>
              <li>Institutional cross-chain bridges</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 11: Summary & Submission Links
    {
      id: "summary",
      badge: "SUBMISSION RECAP",
      title: "Universal Multi-Asset Management System",
      subtitle: "Empowering institutional trust, compliance, and liquidity on MST Blockchain.",
      content: (
        <div className="space-y-6 mt-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Globe className="h-4 w-4 text-red-400" />
                <span>Live Verification Links</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">LIVE DAPP URL:</span>
                  <a
                    href="https://mst-multi-asset-hub.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline"
                  >
                    https://mst-multi-asset-hub.vercel.app
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">GITHUB REPOSITORY:</span>
                  <a
                    href="https://github.com/pranavpatil0666-ai/mst-multi-asset-management"
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline"
                  >
                    github.com/pranavpatil0666-ai/mst-multi-asset-management
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Building className="h-4 w-4 text-emerald-400" />
                <span>Team & Contact Details</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-300">
                  <strong className="text-white">Team Name:</strong> MST Alpha Innovators
                </p>
                <p className="text-slate-300">
                  <strong className="text-white">Team Leader:</strong> Pranav Patil
                </p>
                <p className="text-slate-300">
                  <strong className="text-white">Email:</strong> pranavpatil0666@gmail.com
                </p>
                <p className="text-slate-300">
                  <strong className="text-white">Network:</strong> MST Testnet (Chain ID 91562037)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/40 flex items-center justify-between">
            <span className="text-xs text-slate-300">
              Built natively for the <strong>MST Blockchain Hackathon</strong> • Production Ready
            </span>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 hover:brightness-110 transition flex items-center space-x-1.5"
            >
              <span>Launch dApp</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (viewMode === "deck") {
        if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
          e.preventDefault();
          setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
          e.preventDefault();
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, slides.length]);

  function handlePrint() {
    window.print();
  }

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#07060a] text-white flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Header Controls (Hidden during print) */}
      <header className="print:hidden border-b border-white/10 bg-[#0e0c14]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition text-xs font-semibold mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to dApp</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>MST Multi-Asset Hub Presentation</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="bg-white/5 rounded-xl p-1 border border-white/10 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setViewMode("deck")}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === "deck" ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Slide Mode
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === "all" ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              All Slides
            </button>
          </div>

          {/* Download Pre-rendered PDF */}
          <a
            href="/MST_Multi_Asset_Management_Presentation.pdf"
            download="MST_Multi_Asset_Management_Presentation.pdf"
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-red-600/30"
            title="Download Official 11-Slide PDF Presentation"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </a>

          {/* Export / Print to PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition hidden sm:flex"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-red-400" />
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
        {viewMode === "deck" ? (
          // DECK VIEW (1 SLIDE AT A TIME)
          <div className="w-full max-w-5xl bg-gradient-to-b from-[#13101c] to-[#0a0812] border border-red-500/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-red-950/40 relative overflow-hidden flex flex-col justify-between min-h-[580px]">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Slide Meta Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                  {slide.badge}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>

              {/* Slide Header */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Dynamic Content */}
              {slide.content}
            </div>

            {/* Bottom Deck Controls (Hidden in print) */}
            <div className="print:hidden pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              {/* Indicator dots */}
              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[50%] py-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? "w-6 bg-red-500" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentSlide === 0}
                  onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Previous slide (Left Arrow)"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentSlide === slides.length - 1}
                  onClick={() => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1))}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-red-600/30"
                  title="Next slide (Right Arrow or Space)"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ALL SLIDES VIEW (SCROLLABLE & PRINT READY)
          <div className="w-full max-w-5xl space-y-12">
            {slides.map((s, index) => (
              <div
                key={s.id}
                className="slide-page bg-gradient-to-b from-[#13101c] to-[#0a0812] border border-red-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden break-after-page min-h-[500px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                      {s.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Slide {index + 1} of {slides.length}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {s.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                    {s.subtitle}
                  </p>

                  {s.content}
                </div>

                <div className="pt-6 mt-8 border-t border-white/5 flex justify-between text-[10px] font-mono text-slate-500">
                  <span>MST Multi-Asset Hub // Masterstroke Technosoft</span>
                  <span>Slide {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="print:hidden border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
        <span>Tip: Use Left/Right Arrow keys to navigate slides</span>
        <span className="mt-2 sm:mt-0 font-mono text-slate-400">
          Click <strong>&quot;Save as PDF&quot;</strong> in the top bar to generate your submission PDF
        </span>
      </footer>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #07060a !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .break-after-page {
            page-break-after: always;
            break-after: page;
            min-height: 95vh;
          }
          header, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
