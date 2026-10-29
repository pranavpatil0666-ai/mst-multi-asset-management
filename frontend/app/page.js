"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Trees,
  MapPin,
  Store,
  ShieldCheck,
  Lock,
  Unlock,
  Flame,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";
import { MST_NETWORKS } from "../lib/contracts";

export default function Home() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial Real-World Demo State
  const [degrees, setDegrees] = useState([
    {
      tokenId: 1,
      degreeName: "B.S. in Blockchain Engineering & Distributed Systems",
      studentName: "Alex Sterling",
      university: "MST Technological University",
      graduationDate: "2026-06-15",
      isLocked: true,
      isRevoked: false,
      transcriptUri: "ipfs://QmDegreeTranscript2026",
    },
    {
      tokenId: 2,
      degreeName: "Master of Science in Cryptographic Protocols",
      studentName: "Elena Rostova",
      university: "Zurich Federal Institute of Technology",
      graduationDate: "2025-11-20",
      isLocked: true,
      isRevoked: false,
      transcriptUri: "ipfs://QmElenaTranscript2025",
    },
  ]);

  const [landParcels, setLandParcels] = useState([
    {
      tokenId: 1,
      parcelIdentifier: "PARCEL-MST-2026-A109",
      jurisdiction: "Singapore Marina Financial District",
      areaSquareMeters: 650,
      isEncumbered: false,
      encumbranceReason: "",
      deedDocHash: "0x89f72b9a7102c3d9a184e8b02c81729013ac",
    },
    {
      tokenId: 2,
      parcelIdentifier: "PARCEL-UK-LDN-884",
      jurisdiction: "Greater London, Canary Wharf Zone",
      areaSquareMeters: 420,
      isEncumbered: true,
      encumbranceReason: "Active Commercial Mortgage Lien (Barclays Bank)",
      deedDocHash: "0x3e1c98a0f5d72f91840134bcda091183aa",
    },
  ]);

  const [carbonCredits, setCarbonCredits] = useState([
    {
      tokenId: 1,
      projectId: "VCS-2104 (Amazon Rainforest Reforestation)",
      standard: "Verra VCS",
      vintageYear: 2024,
      balanceTonnes: 750,
      country: "Brazil",
      auditIpfs: "ipfs://QmVerraAuditReport2024",
    },
    {
      tokenId: 2,
      projectId: "GS-4902 (Solar Grid Infrastructure)",
      standard: "Gold Standard",
      vintageYear: 2025,
      balanceTonnes: 300,
      country: "India",
      auditIpfs: "ipfs://QmGoldStandardAudit",
    },
  ]);

  const [retirementReceipts, setRetirementReceipts] = useState([
    {
      certificateId: 101,
      beneficiaryName: "Nexus Logistics Global Corp",
      tonnesRetired: 250,
      projectId: "VCS-2104",
      vintageYear: 2024,
      reason: "FY2025 Scope 1 & 2 Emissions Neutrality Claim",
      retiredAt: "2026-10-20",
    },
  ]);

  const [marketplaceListings, setMarketplaceListings] = useState([
    {
      listingId: 1,
      title: "Commercial Land Parcel (PARCEL-MST-2026-A109)",
      category: "Land Title",
      type: "ERC721",
      tokenId: 1,
      amount: 1,
      priceMSTC: "45.0",
      seller: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    {
      listingId: 2,
      title: "VCS-2104 Certified Carbon Credits (Amazon Project)",
      category: "Carbon Credit",
      type: "ERC1155",
      tokenId: 1,
      amount: 500,
      priceMSTC: "0.08",
      seller: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    },
  ]);

  // Form states
  const [degreeForm, setDegreeForm] = useState({
    student: "",
    studentName: "",
    degreeName: "",
    major: "",
    graduationDate: "",
    transcriptIpfsUri: "",
  });

  const [carbonForm, setCarbonForm] = useState({
    recipient: "",
    projectId: "",
    standard: "Verra VCS",
    methodology: "VM0007",
    vintageYear: "2025",
    countryCode: "IND",
    tonnes: "500",
    auditReportIpfsUri: "",
  });

  const [retireForm, setRetireForm] = useState({
    tokenId: "1",
    tonnes: "50",
    beneficiaryName: "",
    reason: "",
  });

  const [landForm, setLandForm] = useState({
    owner: "",
    parcelIdentifier: "",
    jurisdiction: "",
    coordinatesPolygon: "",
    areaSquareMeters: "",
    deedRegistryHash: "",
    deedDocumentIpfsUri: "",
  });

  // Connect Wallet
  async function connectWallet() {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or an EVM-compatible browser wallet to connect to MST Blockchain.");
      return;
    }
    try {
      setLoading(true);
      const { BrowserProvider, formatEther } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const bal = await provider.getBalance(accounts[0]);

      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setBalance(formatEther(bal));
      setStatusMsg("Wallet connected to MST Blockchain!");
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to connect wallet: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Switch / Add MST Network
  async function switchNetwork(networkKey) {
    if (!window.ethereum) return;
    const netConfig = MST_NETWORKS[networkKey];
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: netConfig.chainId }],
      });
      setStatusMsg(`Switched to ${netConfig.chainName}!`);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: netConfig.chainId,
                chainName: netConfig.chainName,
                nativeCurrency: netConfig.nativeCurrency,
                rpcUrls: netConfig.rpcUrls,
                blockExplorerUrls: netConfig.blockExplorerUrls,
              },
            ],
          });
          setStatusMsg(`Configured and switched to ${netConfig.chainName}!`);
        } catch (addError) {
          setStatusMsg("Failed to add network: " + addError.message);
        }
      } else {
        setStatusMsg("Failed to switch network: " + switchError.message);
      }
    }
  }

  // Handle Degree Issuance
  function handleIssueDegree(e) {
    e.preventDefault();
    const newDegree = {
      tokenId: degrees.length + 1,
      degreeName: degreeForm.degreeName || "B.S. in Computer Science",
      studentName: degreeForm.studentName || "Student Recipient",
      university: "MST Accredited University",
      graduationDate: degreeForm.graduationDate || "2026",
      isLocked: true,
      isRevoked: false,
      transcriptUri: degreeForm.transcriptIpfsUri || "ipfs://QmNewTranscriptHash",
    };
    setDegrees([newDegree, ...degrees]);
    setStatusMsg(`Success: Soulbound Degree Certificate #${newDegree.tokenId} minted to recipient's wallet! Non-transferable.`);
    setDegreeForm({ student: "", studentName: "", degreeName: "", major: "", graduationDate: "", transcriptIpfsUri: "" });
  }

  // Handle Carbon Retirement
  function handleRetireCredits(e) {
    e.preventDefault();
    const tonnesNum = Number(retireForm.tonnes) || 10;
    const batch = carbonCredits.find((b) => b.tokenId === Number(retireForm.tokenId));
    if (!batch || batch.balanceTonnes < tonnesNum) {
      alert("Insufficient carbon credit balance for retirement.");
      return;
    }

    setCarbonCredits(
      carbonCredits.map((b) =>
        b.tokenId === batch.tokenId ? { ...b, balanceTonnes: b.balanceTonnes - tonnesNum } : b
      )
    );

    const newReceipt = {
      certificateId: retirementReceipts.length + 101,
      beneficiaryName: retireForm.beneficiaryName || "Enterprise Beneficiary",
      tonnesRetired: tonnesNum,
      projectId: batch.projectId,
      vintageYear: batch.vintageYear,
      reason: retireForm.reason || "Corporate Environmental Offset",
      retiredAt: new Date().toISOString().split("T")[0],
    };
    setRetirementReceipts([newReceipt, ...retirementReceipts]);
    setStatusMsg(`Success: Burned ${tonnesNum} tonnes of CO2e! Minted Soulbound Receipt #${newReceipt.certificateId}.`);
    setRetireForm({ tokenId: "1", tonnes: "50", beneficiaryName: "", reason: "" });
  }

  // Handle Land Registration
  function handleRegisterLand(e) {
    e.preventDefault();
    const newParcel = {
      tokenId: landParcels.length + 1,
      parcelIdentifier: landForm.parcelIdentifier || "PARCEL-NEW-2026",
      jurisdiction: landForm.jurisdiction || "Singapore",
      areaSquareMeters: Number(landForm.areaSquareMeters) || 500,
      isEncumbered: false,
      encumbranceReason: "",
      deedDocHash: "0x" + Math.random().toString(16).substr(2, 40),
    };
    setLandParcels([newParcel, ...landParcels]);
    setStatusMsg(`Success: Land Title #${newParcel.tokenId} registered to owner on-chain!`);
    setLandForm({ owner: "", parcelIdentifier: "", jurisdiction: "", coordinatesPolygon: "", areaSquareMeters: "", deedRegistryHash: "", deedDocumentIpfsUri: "" });
  }

  // Toggle Land Encumbrance
  function toggleEncumbrance(tokenId) {
    setLandParcels(
      landParcels.map((p) => {
        if (p.tokenId === tokenId) {
          const nextState = !p.isEncumbered;
          return {
            ...p,
            isEncumbered: nextState,
            encumbranceReason: nextState ? "Active Mortgage Lien Placed by Registrar" : "",
          };
        }
        return p;
      })
    );
  }

  // Handle Marketplace Purchase
  function handleBuyItem(listing) {
    alert(`Purchasing ${listing.title} for ${listing.priceMSTC} MSTC via atomic escrow.`);
    setMarketplaceListings(marketplaceListings.filter((l) => l.listingId !== listing.listingId));
    setStatusMsg(`Trade Completed: Purchased ${listing.title} with MSTC! Escrow delivered asset.`);
  }

  return (
    <div className="relative min-h-screen bg-[#050814] text-slate-100 overflow-x-hidden">
      {/* Dynamic Ambient Glass Glow Orbs */}
      <div className="ambient-orb w-[650px] h-[650px] bg-emerald-500/10 -top-48 -left-48" />
      <div className="ambient-orb w-[600px] h-[600px] bg-indigo-600/15 top-80 -right-48" />
      <div className="ambient-orb w-[550px] h-[550px] bg-cyan-500/10 bottom-10 left-1/3" />
      <div className="ambient-orb w-[450px] h-[450px] bg-amber-500/10 bottom-96 right-10" />

      {/* Glass Top Navigation Bar */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-white/[0.08] bg-[#090e1f]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Protocol Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full rounded-[14px] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center font-black text-emerald-400 text-lg">
                MST
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg text-white tracking-tight">MST Multi-Asset Hub</h1>
                <span className="text-[10px] font-semibold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                  RWA Layer 1
                </span>
              </div>
              <p className="text-xs text-slate-400">Heterogeneous Asset Management & Credential Protocol</p>
            </div>
          </div>

          {/* Network Switcher & Wallet */}
          <div className="flex items-center space-x-3">
            {/* Glass Network Selector */}
            <div className="hidden md:flex items-center glass-pill rounded-xl p-1 text-xs">
              <button
                onClick={() => switchNetwork("testnet")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  chainId === 4545
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                MST Testnet (4545)
              </button>
              <button
                onClick={() => switchNetwork("mainnet")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  chainId === 4646
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                MST Mainnet (4646)
              </button>
            </div>

            {/* Glass Wallet Button */}
            {account ? (
              <div className="flex items-center space-x-2 glass-pill rounded-xl px-3.5 py-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></div>
                <span className="font-mono text-slate-300">{account.slice(0, 6)}...{account.slice(-4)}</span>
                <span className="text-emerald-400 font-bold">({parseFloat(balance).toFixed(2)} MSTC)</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="group relative inline-flex items-center space-x-2 overflow-hidden rounded-xl p-[1px] font-medium text-xs shadow-lg shadow-emerald-500/15 transition active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400"></span>
                <span className="relative flex items-center space-x-1.5 rounded-[11px] bg-slate-950 px-4 py-2 text-emerald-300 transition duration-200 group-hover:bg-opacity-0 group-hover:text-slate-950 font-bold">
                  <Wallet className="h-4 w-4" />
                  <span>{loading ? "Connecting..." : "Connect MST Wallet"}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Glass Notification Toast */}
      {statusMsg && (
        <div className="relative z-40 max-w-7xl mx-auto px-6 pt-4">
          <div className="glass-panel border-emerald-500/30 bg-emerald-950/30 text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-lg shadow-emerald-950/40">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg("")} className="text-slate-400 hover:text-white text-sm ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Main Glass Navigation Tabs */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6">
        <div className="glass-panel p-1.5 rounded-2xl flex space-x-2 border-white/[0.08]">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === "portfolio"
                ? "bg-white/[0.08] text-white shadow-lg border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>My Multi-Asset Portfolio</span>
          </button>

          <button
            onClick={() => setActiveTab("institution")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === "institution"
                ? "bg-white/[0.08] text-white shadow-lg border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <Building2 className="h-4 w-4 text-indigo-400" />
            <span>Institutional Issuance Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
              activeTab === "marketplace"
                ? "bg-white/[0.08] text-white shadow-lg border border-white/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <Store className="h-4 w-4 text-cyan-400" />
            <span>MSTC RWA Marketplace</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PORTFOLIO VIEW */}
      {activeTab === "portfolio" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-10">
          {/* Glass KPI Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degrees & Diplomas</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-3">{degrees.length}</h2>
              <div className="flex items-center space-x-1.5 mt-2 text-xs text-indigo-300/80">
                <Lock className="h-3 w-3 text-amber-400" />
                <span>Soulbound ERC-5192</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Carbon Credits</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Trees className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-3">
                {carbonCredits.reduce((acc, curr) => acc + curr.balanceTonnes, 0)}{" "}
                <span className="text-sm font-normal text-slate-400">Tonnes</span>
              </h2>
              <p className="text-xs text-emerald-400/80 mt-2 font-medium">ERC-1155 Semi-Fungible</p>
            </div>

            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CO2e Retired / Burned</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Flame className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-3">
                {retirementReceipts.reduce((acc, curr) => acc + curr.tonnesRetired, 0)}{" "}
                <span className="text-sm font-normal text-slate-400">Tonnes</span>
              </h2>
              <p className="text-xs text-amber-400/80 mt-2 font-medium">Permanent Soulbound Proofs</p>
            </div>

            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Land Deeds Owned</span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-3">{landParcels.length}</h2>
              <p className="text-xs text-sky-400/80 mt-2 font-medium">Cadastral ERC-721 Deeds</p>
            </div>
          </div>

          {/* Section: Academic Degrees */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Academic Degrees & Diplomas</h3>
                  <p className="text-xs text-slate-400">Cryptographically signed credentials locked to recipient's address</p>
                </div>
              </div>
              <span className="glass-pill text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">
                Non-Transferable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {degrees.map((deg) => (
                <div key={deg.tokenId} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-5 right-5 flex items-center space-x-1.5 glass-pill px-3 py-1 rounded-full text-xs text-amber-300">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-semibold">Soulbound</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">{deg.university}</span>
                  <h4 className="text-lg font-bold text-white mt-1.5 leading-snug">{deg.degreeName}</h4>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Student Recipient:</span>
                      <p className="font-semibold text-slate-100 mt-1">{deg.studentName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Graduation Date:</span>
                      <p className="font-semibold text-slate-100 mt-1">{deg.graduationDate}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified on MST Chain</span>
                    </div>
                    <a href="#" className="flex items-center space-x-1 text-slate-400 hover:text-white transition">
                      <span>Transcript Audit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Carbon Credits & Burn Engine */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                  <Trees className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Carbon Credits & Offset Engine</h3>
                  <p className="text-xs text-slate-400">Certified metric tonnes of CO2e across projects and vintages</p>
                </div>
              </div>
              <span className="glass-pill text-emerald-300 text-xs px-3 py-1 rounded-full font-medium">
                ERC-1155 Multi-Token
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Batch Holdings List */}
              <div className="lg:col-span-2 space-y-4">
                {carbonCredits.map((batch) => (
                  <div key={batch.tokenId} className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="glass-pill text-slate-300 text-xs font-mono px-2.5 py-0.5 rounded-md">Token ID #{batch.tokenId}</span>
                        <span className="text-xs font-bold text-emerald-400">{batch.standard}</span>
                        <span className="text-xs text-slate-400">Vintage {batch.vintageYear}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-2">{batch.projectId}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Location: {batch.country}</p>
                    </div>

                    <div className="text-right flex md:flex-col justify-between items-end">
                      <div>
                        <span className="text-2xl font-black text-emerald-400">{batch.balanceTonnes}</span>
                        <span className="text-xs text-slate-400 ml-1.5">Tonnes</span>
                      </div>
                      <button
                        onClick={() => setRetireForm({ ...retireForm, tokenId: String(batch.tokenId) })}
                        className="mt-3 text-xs glass-pill hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1.5 rounded-lg font-semibold transition"
                      >
                        Retire & Offset Tonnes
                      </button>
                    </div>
                  </div>
                ))}

                {/* Permanent Offset Proofs */}
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span>Permanent Proof-of-Offset Certificates (Soulbound)</span>
                  </h4>
                  <div className="space-y-2.5">
                    {retirementReceipts.map((rcpt) => (
                      <div key={rcpt.certificateId} className="glass-card rounded-xl p-4 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">Cert #{rcpt.certificateId}</span>
                            <span className="text-slate-400">• {rcpt.beneficiaryName}</span>
                          </div>
                          <p className="text-slate-400 mt-1">{rcpt.reason} ({rcpt.projectId})</p>
                        </div>
                        <div className="text-right">
                          <span className="text-amber-400 font-extrabold text-sm">-{rcpt.tonnesRetired} Tonnes</span>
                          <p className="text-slate-500 text-[10px] mt-0.5">{rcpt.retiredAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glass Offset Engine Box */}
              <div className="glass-panel rounded-2xl p-6 h-fit border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Retire & Burn Credits</h4>
                    <p className="text-[11px] text-slate-400">Creates immutable proof of carbon neutrality</p>
                  </div>
                </div>

                <form onSubmit={handleRetireCredits} className="mt-5 space-y-3.5 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Batch Token ID</label>
                    <select
                      value={retireForm.tokenId}
                      onChange={(e) => setRetireForm({ ...retireForm, tokenId: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                    >
                      {carbonCredits.map((b) => (
                        <option key={b.tokenId} value={b.tokenId} className="bg-slate-900">
                          Token #{b.tokenId} ({b.projectId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Tonnes to Offset</label>
                    <input
                      type="number"
                      value={retireForm.tonnes}
                      onChange={(e) => setRetireForm({ ...retireForm, tonnes: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                      placeholder="e.g. 50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Beneficiary Organization</label>
                    <input
                      type="text"
                      value={retireForm.beneficiaryName}
                      onChange={(e) => setRetireForm({ ...retireForm, beneficiaryName: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                      placeholder="e.g. Acme Corporation"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Offset Purpose</label>
                    <input
                      type="text"
                      value={retireForm.reason}
                      onChange={(e) => setRetireForm({ ...retireForm, reason: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                      placeholder="e.g. Scope 1 Neutrality FY2026"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-98"
                  >
                    Burn & Mint Proof Certificate
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Section: Cadastral Land Titles */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/20 text-sky-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Cadastral Land Titles & Deeds</h3>
                  <p className="text-xs text-slate-400">On-chain deed registry with legal mortgage/lien encumbrance protection</p>
                </div>
              </div>
              <span className="glass-pill text-sky-300 text-xs px-3 py-1 rounded-full font-medium">
                ERC-721 Property Deeds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {landParcels.map((parcel) => (
                <div key={parcel.tokenId} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="glass-pill font-mono text-xs px-2.5 py-0.5 rounded-md text-slate-300">
                        Token #{parcel.tokenId}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2.5">{parcel.parcelIdentifier}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{parcel.jurisdiction}</p>
                    </div>

                    {parcel.isEncumbered ? (
                      <div className="flex items-center space-x-1.5 glass-pill border-rose-500/40 bg-rose-950/40 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        <Lock className="h-3.5 w-3.5 text-rose-400" />
                        <span>Lien / Encumbered</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 glass-pill border-emerald-500/40 bg-emerald-950/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Unencumbered / Free Title</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Surface Area:</span>
                      <p className="font-bold text-slate-100 mt-1">{parcel.areaSquareMeters} m²</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Deed Registry Hash:</span>
                      <p className="font-mono text-slate-300 mt-1 text-[11px] truncate">{parcel.deedDocHash}</p>
                    </div>
                  </div>

                  {parcel.isEncumbered && (
                    <div className="mt-3.5 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-300 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{parcel.encumbranceReason}</span>
                    </div>
                  )}

                  <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex justify-between items-center text-xs">
                    <button
                      onClick={() => toggleEncumbrance(parcel.tokenId)}
                      className="text-slate-400 hover:text-white transition flex items-center space-x-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-sky-400" />
                      <span>Toggle Lien (Registrar Simulation)</span>
                    </button>

                    <button
                      disabled={parcel.isEncumbered}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                        parcel.isEncumbered
                          ? "glass-pill text-slate-600 cursor-not-allowed border-transparent"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 shadow-md shadow-sky-500/10"
                      }`}
                    >
                      {parcel.isEncumbered ? "Transfer Blocked by Lien" : "Transfer / Trade Deed"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* TAB 2: INSTITUTIONAL ISSUANCE PORTAL */}
      {activeTab === "institution" && (
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-8">
          <div className="glass-panel rounded-2xl p-6 border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2.5">
              <Building2 className="h-5 w-5 text-emerald-400" />
              <span>Institutional Authority Registry & Asset Issuance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              On MST Blockchain, official assets are minted exclusively by accredited entities verified in the AuthorityRegistry contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Issuance Form */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-indigo-400 font-bold text-base">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h4>University Credential Minting</h4>
              </div>
              <p className="text-xs text-slate-400">Issues permanent, soulbound academic degrees to student wallets.</p>

              <form onSubmit={handleIssueDegree} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Student Wallet Address</label>
                  <input
                    type="text"
                    value={degreeForm.student}
                    onChange={(e) => setDegreeForm({ ...degreeForm, student: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Student Full Name</label>
                  <input
                    type="text"
                    value={degreeForm.studentName}
                    onChange={(e) => setDegreeForm({ ...degreeForm, studentName: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                    placeholder="Alice Chen"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Degree Title</label>
                  <input
                    type="text"
                    value={degreeForm.degreeName}
                    onChange={(e) => setDegreeForm({ ...degreeForm, degreeName: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                    placeholder="Bachelor of Science in Engineering"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Graduation Date</label>
                    <input
                      type="text"
                      value={degreeForm.graduationDate}
                      onChange={(e) => setDegreeForm({ ...degreeForm, graduationDate: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                      placeholder="2026-06-15"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Transcript IPFS Hash</label>
                    <input
                      type="text"
                      value={degreeForm.transcriptIpfsUri}
                      onChange={(e) => setDegreeForm({ ...degreeForm, transcriptIpfsUri: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white font-mono"
                      placeholder="ipfs://Qm..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20"
                >
                  Issue Soulbound Degree
                </button>
              </form>
            </div>

            {/* Land Registry Issuance Form */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-sky-400 font-bold text-base">
                <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4>Cadastral Land Title Minting</h4>
              </div>
              <p className="text-xs text-slate-400">Registers cadastral parcel titles with official government deed hash.</p>

              <form onSubmit={handleRegisterLand} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Owner Address</label>
                  <input
                    type="text"
                    value={landForm.owner}
                    onChange={(e) => setLandForm({ ...landForm, owner: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Cadastral Parcel Identifier</label>
                  <input
                    type="text"
                    value={landForm.parcelIdentifier}
                    onChange={(e) => setLandForm({ ...landForm, parcelIdentifier: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                    placeholder="PARCEL-MST-2026-X1"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Municipality / Jurisdiction</label>
                  <input
                    type="text"
                    value={landForm.jurisdiction}
                    onChange={(e) => setLandForm({ ...landForm, jurisdiction: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                    placeholder="Singapore Marina District"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Area (Square Meters)</label>
                    <input
                      type="number"
                      value={landForm.areaSquareMeters}
                      onChange={(e) => setLandForm({ ...landForm, areaSquareMeters: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Deed Hash</label>
                    <input
                      type="text"
                      value={landForm.deedRegistryHash}
                      onChange={(e) => setLandForm({ ...landForm, deedRegistryHash: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-white font-mono"
                      placeholder="0x..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-sky-500/20"
                >
                  Register Cadastral Title
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* TAB 3: MARKETPLACE & ESCROW */}
      {activeTab === "marketplace" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2.5">
                <Store className="h-5 w-5 text-emerald-400" />
                <span>MSTC RWA Marketplace & Escrow</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Atomic peer-to-peer settlement using native MSTC coin. Non-transferable credentials (degrees) are prevented from listing.
              </p>
            </div>

            <div className="glass-pill text-xs px-4 py-2 rounded-xl text-slate-300">
              Protocol Fee: <span className="text-emerald-400 font-bold">1.0%</span> | Settlement: <span className="text-emerald-400 font-bold">MSTC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {marketplaceListings.map((listing) => (
              <div key={listing.listingId} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="glass-pill text-xs text-emerald-300 border-emerald-500/30 px-3 py-1 rounded-lg font-semibold">
                      {listing.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Standard: {listing.type}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white mt-4">{listing.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Available Amount: <span className="font-semibold text-slate-200">{listing.amount} {listing.type === "ERC1155" ? "Tonnes" : "Title"}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-1">Seller: {listing.seller.slice(0, 10)}...</p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Listing Price:</span>
                    <p className="text-2xl font-black text-emerald-400 mt-0.5">
                      {listing.priceMSTC} <span className="text-xs font-normal text-slate-400">MSTC</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuyItem(listing)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Buy with MSTC
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
