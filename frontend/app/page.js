"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Settings,
  Tag,
  Loader2,
  Cpu,
  Layers,
  Globe,
  Zap,
  Code2,
  BookOpen,
  ChevronRight,
  Database,
  Check,
  UploadCloud,
  Cloud,
  Key,
  Crown,
  User,
  UserCheck,
  Shield,
  ShieldAlert,
  Menu,
  X,
  Copy,
} from "lucide-react";
import {
  MST_NETWORKS,
  CONTRACT_ADDRESSES,
  AUTHORITY_REGISTRY_ABI,
  DEGREE_ABI,
  CARBON_BATCH_ABI,
  CARBON_RECEIPT_ABI,
  LAND_TITLE_ABI,
  ASSET_MANAGER_ABI,
  MARKETPLACE_ABI,
} from "../lib/contracts";
import {
  BrowserProvider,
  Contract,
  formatEther,
  parseEther,
  keccak256,
  toUtf8Bytes,
} from "ethers";
import IPFSUploader from "../components/IPFSUploader";
import TechnicalBackground from "../components/TechnicalBackground";
import WalletConnectModal from "../components/WalletConnectModal";
import {
  detectBridgeKey,
  getBridgeKeyProvider,
  detectMetaMask,
  getMetaMaskProvider,
  BRIDGEKEY_CONFIG,
} from "../lib/bridgekey";
import {
  getIPFSGatewayUrl,
  formatIPFSDisplay,
  getPinataConfig,
  savePinataConfig,
  testPinataAuth,
} from "../lib/ipfs";

export default function Home() {
  const [activeTab, setActiveTab] = useState("landing"); // 'landing' | 'portfolio' | 'institution' | 'marketplace'
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPinataModal, setShowPinataModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState("bridgekey"); // 'bridgekey' | 'metamask'
  const [eip6963Providers, setEip6963Providers] = useState([]);

  // EIP-6963 Multi-Injected Wallet Discovery
  useEffect(() => {
    function handleEIP6963Announce(event) {
      if (!event.detail) return;
      setEip6963Providers((prev) => {
        if (prev.some((p) => p.info.uuid === event.detail.info.uuid)) return prev;
        return [...prev, event.detail];
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("eip6963:announceProvider", handleEIP6963Announce);
      window.dispatchEvent(new Event("eip6963:requestProvider"));

      const savedWallet = localStorage.getItem("mst_preferred_wallet");
      if (savedWallet) {
        setWalletType(savedWallet);
      }

      return () => {
        window.removeEventListener("eip6963:announceProvider", handleEIP6963Announce);
      };
    }
  }, []);

  function copyWalletAddress() {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 1500);
  }

  // Pinata Cloud IPFS Configuration State
  const [pinataJwtInput, setPinataJwtInput] = useState("");
  const [pinataGatewayInput, setPinataGatewayInput] = useState("gateway.pinata.cloud");
  const [pinataConfigured, setPinataConfigured] = useState(false);
  const [pinataTesting, setPinataTesting] = useState(false);
  const [pinataTestResult, setPinataTestResult] = useState(null);

  // Load Pinata config from client storage on mount
  useEffect(() => {
    const cfg = getPinataConfig();
    if (cfg.jwt) {
      setPinataJwtInput(cfg.jwt);
      setPinataConfigured(true);
    }
    if (cfg.gateway) {
      setPinataGatewayInput(cfg.gateway);
    }
  }, []);

  async function handleTestPinata() {
    if (!pinataJwtInput.trim()) {
      setPinataTestResult({ success: false, msg: "Please enter a Pinata JWT token to test." });
      return;
    }
    try {
      setPinataTesting(true);
      setPinataTestResult(null);
      const res = await testPinataAuth(pinataJwtInput);
      if (res.success) {
        setPinataTestResult({ success: true, msg: res.message || "Connected to Pinata API successfully!" });
        setPinataConfigured(true);
      } else {
        setPinataTestResult({ success: false, msg: res.error || "Pinata authentication failed." });
      }
    } catch (e) {
      setPinataTestResult({ success: false, msg: e.message || "Failed to test Pinata connection." });
    } finally {
      setPinataTesting(false);
    }
  }

  function handleSavePinata() {
    savePinataConfig({ jwt: pinataJwtInput, gateway: pinataGatewayInput });
    setPinataConfigured(!!pinataJwtInput.trim());
    setStatusMsg(pinataJwtInput.trim() ? "Pinata IPFS Cloud configured successfully!" : "Pinata config cleared.");
    setPinataTestResult(null);
    setTimeout(() => setShowPinataModal(false), 800);
  }

  // Editable Contract Addresses
  const [addresses, setAddresses] = useState(CONTRACT_ADDRESSES);

  // REAL ON-CHAIN ASSET STATES (Zero Simulation)
  const [degrees, setDegrees] = useState([]);
  const [landParcels, setLandParcels] = useState([]);
  const [carbonCredits, setCarbonCredits] = useState([]);
  const [retirementReceipts, setRetirementReceipts] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]);

  // Form states
  const [degreeForm, setDegreeForm] = useState({
    student: "",
    studentName: "",
    studentId: "",
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
    tonnes: "100",
    auditReportIpfsUri: "",
  });

  const [retireForm, setRetireForm] = useState({
    tokenId: "",
    tonnes: "",
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

  const [encumbranceForm, setEncumbranceForm] = useState({
    tokenId: "",
    isEncumbered: true,
    reason: "",
  });

  const [listForm, setListForm] = useState({
    assetType: "ERC721",
    tokenId: "",
    amount: "1",
    priceInMSTC: "",
  });

  // Role-Based Access Control (RBAC) States
  const [userRoles, setUserRoles] = useState({
    isAdmin: false,
    isUniversity: false,
    isCarbonAuditor: false,
    isLandRegistrar: false,
  });
  const [authoritiesList, setAuthoritiesList] = useState([]);
  const [authorityForm, setAuthorityForm] = useState({
    address: "",
    role: "UNIVERSITY_ROLE", // "UNIVERSITY_ROLE" | "CARBON_AUDITOR_ROLE" | "LAND_REGISTRAR_ROLE" | "DEFAULT_ADMIN_ROLE"
    name: "",
    jurisdiction: "",
    officialWebsite: "",
    registrationId: "",
  });

  // Resolves active Web3 EIP-1193 Provider (BridgeKey Wallet or MetaMask)
  const getRawWalletProvider = useCallback(
    (targetType) => {
      const type = targetType || walletType || "bridgekey";
      if (type === "bridgekey") {
        return getBridgeKeyProvider(eip6963Providers);
      }
      if (type === "metamask") {
        return getMetaMaskProvider(eip6963Providers);
      }
      return (
        getBridgeKeyProvider(eip6963Providers) ||
        getMetaMaskProvider(eip6963Providers) ||
        (typeof window !== "undefined" ? window.ethereum : null)
      );
    },
    [walletType, eip6963Providers]
  );

  // Helper to get BrowserProvider and Signer
  const getProviderAndSigner = useCallback(async () => {
    const raw = getRawWalletProvider();
    if (!raw) {
      throw new Error("No Web3 wallet found. Please install BridgeKey Wallet (Official MST Native Wallet) or MetaMask.");
    }
    const provider = new BrowserProvider(raw);
    const signer = await provider.getSigner();
    return { provider, signer };
  }, [getRawWalletProvider]);

  // Fetch REAL Live Data from MST Blockchain
  const fetchOnChainData = useCallback(async (currentAccount, provider) => {
    if (!currentAccount || !provider) return;
    try {
      setLoading(true);
      // Ethers imported top-level

      const bal = await provider.getBalance(currentAccount);
      setBalance(formatEther(bal));

      // 0. Fetch User Roles & Registered Authorities (RBAC)
      try {
        const authorityContract = new Contract(addresses.AuthorityRegistry, AUTHORITY_REGISTRY_ABI, provider);
        const adminRole = "0x0000000000000000000000000000000000000000000000000000000000000000";
        const [univRole, auditorRole, registrarRole] = await Promise.all([
          authorityContract.UNIVERSITY_ROLE().catch(() => null),
          authorityContract.CARBON_AUDITOR_ROLE().catch(() => null),
          authorityContract.LAND_REGISTRAR_ROLE().catch(() => null),
        ]);

        const [isAdmin, isUniv, isAuditor, isRegistrar] = await Promise.all([
          authorityContract.hasRole(adminRole, currentAccount).catch(() => false),
          univRole ? authorityContract.isAuthorized(currentAccount, univRole).catch(() => false) : false,
          auditorRole ? authorityContract.isAuthorized(currentAccount, auditorRole).catch(() => false) : false,
          registrarRole ? authorityContract.isAuthorized(currentAccount, registrarRole).catch(() => false) : false,
        ]);

        setUserRoles({
          isAdmin,
          isUniversity: isUniv,
          isCarbonAuditor: isAuditor,
          isLandRegistrar: isRegistrar,
        });

        // Load all registered institutional authorities
        try {
          const authAddresses = await authorityContract.getAllAuthorities().catch(() => []);
          const list = [];
          for (const addr of authAddresses) {
            try {
              const profile = await authorityContract.getAuthorityProfile(addr);
              let roleTitle = "Authority";
              if (univRole && await authorityContract.hasRole(univRole, addr).catch(() => false)) roleTitle = "University Authority";
              else if (auditorRole && await authorityContract.hasRole(auditorRole, addr).catch(() => false)) roleTitle = "Carbon Auditor";
              else if (registrarRole && await authorityContract.hasRole(registrarRole, addr).catch(() => false)) roleTitle = "Land Registrar";

              list.push({
                address: addr,
                name: profile.name,
                jurisdiction: profile.jurisdiction,
                officialWebsite: profile.officialWebsite,
                registrationId: profile.registrationId,
                isActive: profile.isActive,
                registeredAt: new Date(Number(profile.registeredAt) * 1000).toLocaleDateString(),
                roleTitle,
              });
            } catch (e) {
              console.error(`Error loading profile for ${addr}:`, e);
            }
          }
          setAuthoritiesList(list);
        } catch (e) {
          console.warn("Could not load all authorities:", e);
        }
      } catch (err) {
        console.warn("Authority/Role fetch error:", err);
      }

      // 1. Fetch Degrees
      try {
        const degreeContract = new Contract(addresses.AcademicDegreeCertificate, DEGREE_ABI, provider);
        const degreeIds = await degreeContract.getStudentDegrees(currentAccount);
        const fetchedDegrees = [];
        for (const id of degreeIds) {
          try {
            const [isValid, record, transcriptUri] = await degreeContract.verifyDegree(id);
            fetchedDegrees.push({
              tokenId: Number(id),
              degreeName: record.degreeName,
              student: record.student,
              university: record.issuingUniversity,
              isRevoked: record.isRevoked,
              isValid,
              transcriptUri,
              issuedAt: new Date(Number(record.issuedAt) * 1000).toLocaleDateString(),
            });
          } catch (e) {
            console.error(`Error loading degree ${id}:`, e);
          }
        }
        setDegrees(fetchedDegrees);
      } catch (err) {
        setDegrees([]);
      }

      // 2. Fetch Land Titles
      try {
        const landContract = new Contract(addresses.LandOwnershipTitle, LAND_TITLE_ABI, provider);
        const landIds = await landContract.getOwnerParcels(currentAccount);
        const fetchedLand = [];
        for (const id of landIds) {
          try {
            const currentOwner = await landContract.ownerOf(id);
            if (currentOwner.toLowerCase() === currentAccount.toLowerCase()) {
              const parcel = await landContract.getLandParcel(id);
              let encReason = "";
              if (parcel.isEncumbered) {
                encReason = await landContract.getEncumbranceReason(id);
              }
              const deedDocUri = await landContract.tokenURI(id).catch(() => "");
              fetchedLand.push({
                tokenId: Number(id),
                parcelIdentifier: parcel.parcelIdentifier,
                jurisdiction: parcel.jurisdiction,
                areaSquareMeters: Number(parcel.areaSquareMeters),
                deedRegistryHash: parcel.deedRegistryHash,
                legalRegistrar: parcel.legalRegistrar,
                isEncumbered: parcel.isEncumbered,
                encumbranceReason: encReason,
                deedDocUri,
                registeredAt: new Date(Number(parcel.registeredAt) * 1000).toLocaleDateString(),
              });
            }
          } catch (e) {
            console.error(`Error loading land ${id}:`, e);
          }
        }
        setLandParcels(fetchedLand);
      } catch (err) {
        setLandParcels([]);
      }

      // 3. Fetch Carbon Retirement Receipts
      try {
        const receiptContract = new Contract(addresses.CarbonRetirementReceipt, CARBON_RECEIPT_ABI, provider);
        const receiptIds = await receiptContract.getCertificatesOf(currentAccount);
        const fetchedReceipts = [];
        for (const certId of receiptIds) {
          try {
            const cert = await receiptContract.getCertificate(certId);
            fetchedReceipts.push({
              certificateId: Number(cert.certificateId),
              beneficiaryName: cert.beneficiaryName,
              retirementReason: cert.retirementReason,
              batchTokenId: Number(cert.batchTokenId),
              projectId: cert.projectId,
              vintageYear: Number(cert.vintageYear),
              tonnesRetired: Number(cert.tonnesRetired),
              retiredAt: new Date(Number(cert.retiredAt) * 1000).toLocaleDateString(),
            });
          } catch (e) {
            console.error(`Error loading receipt ${certId}:`, e);
          }
        }
        setRetirementReceipts(fetchedReceipts);
      } catch (err) {
        setRetirementReceipts([]);
      }

      // 4. Fetch Marketplace Listings
      try {
        const marketplaceContract = new Contract(addresses.UniversalMarketplace, MARKETPLACE_ABI, provider);
        const fetchedListings = [];
        for (let i = 1; i <= 20; i++) {
          try {
            const listing = await marketplaceContract.getListing(i);
            if (listing.isActive) {
              fetchedListings.push({
                listingId: Number(listing.listingId),
                seller: listing.seller,
                tokenAddress: listing.tokenAddress,
                tokenId: Number(listing.tokenId),
                amount: Number(listing.amount),
                priceMSTC: formatEther(listing.pricePerUnitInMSTC),
                standard: listing.standard === 0 ? "ERC721" : "ERC1155",
              });
            }
          } catch {
            break;
          }
        }
        setMarketplaceListings(fetchedListings);
      } catch (err) {
        setMarketplaceListings([]);
      }
    } catch (err) {
      console.error("fetchOnChainData error:", err);
    } finally {
      setLoading(false);
    }
  }, [addresses]);

  // Connect with specific wallet (BridgeKey or MetaMask)
  async function connectWithWallet(selectedType = "bridgekey") {
    try {
      setLoading(true);
      setShowWalletModal(false);

      const targetType = selectedType || "bridgekey";
      setWalletType(targetType);
      if (typeof window !== "undefined") {
        localStorage.setItem("mst_preferred_wallet", targetType);
      }

      const raw = getRawWalletProvider(targetType);
      if (!raw) {
        setShowWalletModal(true);
        setStatusMsg(
          targetType === "bridgekey"
            ? "BridgeKey Wallet not detected. Please install the BridgeKey extension."
            : "MetaMask not detected. Please install MetaMask."
        );
        setLoading(false);
        return;
      }

      const browserProvider = new BrowserProvider(raw);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();

      const userAddr = accounts[0];
      setAccount(userAddr);
      setChainId(Number(network.chainId));

      const label = targetType === "bridgekey" ? "BridgeKey Wallet (Native MST)" : "MetaMask";
      setStatusMsg(`Connected with ${label}!`);

      // If chainId is not MST, prompt user to add/switch to MST Testnet (Chain ID 4545)
      const currentChainNum = Number(network.chainId);
      if (
        currentChainNum !== MST_NETWORKS.testnet.chainIdDecimal &&
        currentChainNum !== MST_NETWORKS.mainnet.chainIdDecimal
      ) {
        await switchNetwork("testnet", raw);
      }

      await fetchOnChainData(userAddr, browserProvider);
    } catch (err) {
      console.error(err);
      setStatusMsg("Connection error: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  }

  // Generic connect action (opens selector modal)
  function connectWallet() {
    setShowWalletModal(true);
  }

  // Disconnect active wallet session
  function disconnectWallet() {
    setAccount("");
    setBalance("0");
    setChainId(null);
    setUserRoles({
      isAdmin: false,
      isUniversity: false,
      isCarbonAuditor: false,
      isLandRegistrar: false,
    });
    setDegrees([]);
    setLandParcels([]);
    setCarbonCredits([]);
    setRetirementReceipts([]);
    setShowWalletModal(false);
    setStatusMsg("Wallet disconnected.");
    if (typeof window !== "undefined") {
      localStorage.removeItem("mst_preferred_wallet");
    }
  }

  // Network Switcher for active provider
  async function switchNetwork(networkKey, explicitProvider = null) {
    const raw = explicitProvider || getRawWalletProvider();
    if (!raw) return;
    const netConfig = MST_NETWORKS[networkKey];
    try {
      await raw.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: netConfig.chainId }],
      });
      setStatusMsg(`Switched to ${netConfig.chainName}!`);
    } catch (switchError) {
      if (
        switchError.code === 4902 ||
        switchError.message?.includes("Unrecognized chain") ||
        switchError.message?.includes("wallet_addEthereumChain")
      ) {
        try {
          await raw.request({
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
          setStatusMsg(`Added and switched to ${netConfig.chainName}!`);
        } catch (addError) {
          setStatusMsg("Failed to add network: " + addError.message);
        }
      } else {
        setStatusMsg("Failed to switch network: " + switchError.message);
      }
    }
  }

  // Real On-Chain Action: Issue Degree
  async function handleRealIssueDegree(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const studentIdHash = keccak256(toUtf8Bytes(degreeForm.studentId || "MST-STUDENT"));
      const degreeContract = new Contract(addresses.AcademicDegreeCertificate, DEGREE_ABI, signer);

      setStatusMsg("Submitting degree issuance to MST Blockchain... Please confirm in your wallet.");
      const tx = await degreeContract.issueDegree({
        student: degreeForm.student,
        studentName: degreeForm.studentName,
        studentIdHash,
        degreeName: degreeForm.degreeName,
        major: degreeForm.major,
        graduationDate: degreeForm.graduationDate,
        transcriptIpfsUri: degreeForm.transcriptIpfsUri || "ipfs://QmEmpty",
      });

      setStatusMsg(`Tx broadcast: ${tx.hash.slice(0, 14)}... Awaiting block confirmation...`);
      await tx.wait();

      setStatusMsg(`Success! Soulbound Degree issued on MST Chain.`);
      setDegreeForm({ student: "", studentName: "", studentId: "", degreeName: "", major: "", graduationDate: "", transcriptIpfsUri: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Transaction Reverted: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Mint Carbon Credit Batch
  async function handleRealMintCarbonBatch(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const carbonContract = new Contract(addresses.CarbonCreditBatch, CARBON_BATCH_ABI, signer);

      setStatusMsg("Broadcasting Carbon Credit Batch Creation... Confirm in wallet.");
      const tx = await carbonContract.createAndMintBatch({
        recipient: carbonForm.recipient,
        projectId: carbonForm.projectId,
        standard: carbonForm.standard,
        methodology: carbonForm.methodology,
        vintageYear: Number(carbonForm.vintageYear),
        countryCode: carbonForm.countryCode,
        tonnes: Number(carbonForm.tonnes),
        auditReportIpfsUri: carbonForm.auditReportIpfsUri || "ipfs://QmAudit",
      });

      setStatusMsg(`Tx submitted: ${tx.hash.slice(0, 14)}... Awaiting confirmation...`);
      await tx.wait();

      setStatusMsg(`Success! Carbon Credit Batch minted on MST Chain.`);
      setCarbonForm({ recipient: "", projectId: "", standard: "Verra VCS", methodology: "VM0007", vintageYear: "2025", countryCode: "IND", tonnes: "100", auditReportIpfsUri: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Transaction Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Retire / Burn Carbon Credits
  async function handleRealRetireCredits(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const carbonContract = new Contract(addresses.CarbonCreditBatch, CARBON_BATCH_ABI, signer);

      setStatusMsg("Retiring carbon credits on-chain... Confirm in wallet.");
      const tx = await carbonContract.retireCredits(
        Number(retireForm.tokenId),
        Number(retireForm.tonnes),
        account,
        retireForm.beneficiaryName,
        retireForm.reason
      );

      setStatusMsg(`Tx submitted: ${tx.hash.slice(0, 14)}... Burning credits on-chain...`);
      await tx.wait();

      setStatusMsg(`Offset Completed! Credits burned on MST Chain & Soulbound Receipt minted.`);
      setRetireForm({ tokenId: "", tonnes: "", beneficiaryName: "", reason: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Retirement Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Register Land Parcel
  async function handleRealRegisterLand(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const landContract = new Contract(addresses.LandOwnershipTitle, LAND_TITLE_ABI, signer);

      setStatusMsg("Registering Cadastral Land Title on-chain... Confirm in wallet.");
      const tx = await landContract.registerLand({
        owner: landForm.owner,
        parcelIdentifier: landForm.parcelIdentifier,
        jurisdiction: landForm.jurisdiction,
        coordinatesPolygon: landForm.coordinatesPolygon || "ipfs://QmCoordinates",
        areaSquareMeters: Number(landForm.areaSquareMeters),
        deedRegistryHash: landForm.deedRegistryHash || "0xDeedHash",
        deedDocumentIpfsUri: landForm.deedDocumentIpfsUri || "ipfs://QmDeedDoc",
      });

      setStatusMsg(`Tx submitted: ${tx.hash.slice(0, 14)}... Waiting for confirmation...`);
      await tx.wait();

      setStatusMsg(`Success! Cadastral Land Title registered on MST Chain.`);
      setLandForm({ owner: "", parcelIdentifier: "", jurisdiction: "", coordinatesPolygon: "", areaSquareMeters: "", deedRegistryHash: "", deedDocumentIpfsUri: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Land Registration Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: List on Marketplace
  async function handleRealListItem(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const marketplaceContract = new Contract(addresses.UniversalMarketplace, MARKETPLACE_ABI, signer);
      const priceWei = parseEther(listForm.priceInMSTC);

      if (listForm.assetType === "ERC721") {
        const landContract = new Contract(addresses.LandOwnershipTitle, LAND_TITLE_ABI, signer);
        setStatusMsg("Step 1/2: Approving Marketplace for Land Title... Confirm in wallet.");
        const approveTx = await landContract.approve(addresses.UniversalMarketplace, Number(listForm.tokenId));
        await approveTx.wait();

        setStatusMsg("Step 2/2: Creating Marketplace Escrow Listing...");
        const listTx = await marketplaceContract.listERC721(addresses.LandOwnershipTitle, Number(listForm.tokenId), priceWei);
        await listTx.wait();
      } else {
        const carbonContract = new Contract(addresses.CarbonCreditBatch, CARBON_BATCH_ABI, signer);
        setStatusMsg("Step 1/2: Approving Marketplace for Carbon Credits... Confirm in wallet.");
        const approveTx = await carbonContract.setApprovalForAll(addresses.UniversalMarketplace, true);
        await approveTx.wait();

        setStatusMsg("Step 2/2: Creating Marketplace Escrow Listing...");
        const listTx = await marketplaceContract.listERC1155(
          addresses.CarbonCreditBatch,
          Number(listForm.tokenId),
          Number(listForm.amount),
          priceWei
        );
        await listTx.wait();
      }

      setStatusMsg("Listing created on-chain in Universal Marketplace!");
      setListForm({ assetType: "ERC721", tokenId: "", amount: "1", priceInMSTC: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Listing Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Buy from Marketplace
  async function handleRealBuyItem(listing) {
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const marketplaceContract = new Contract(addresses.UniversalMarketplace, MARKETPLACE_ABI, signer);
      const priceWei = parseEther(listing.priceMSTC);
      const totalCost = priceWei * BigInt(listing.amount);

      setStatusMsg(`Initiating on-chain purchase of ${listing.amount} unit(s)... Please confirm in wallet.`);
      const tx = await marketplaceContract.buyItem(listing.listingId, listing.amount, { value: totalCost });

      setStatusMsg(`Purchase broadcast: ${tx.hash.slice(0, 14)}... Escrow settling...`);
      await tx.wait();

      setStatusMsg(`Trade confirmed on-chain! Asset transferred to your wallet.`);
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Purchase Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Register Authority (Admin Only)
  async function handleRegisterAuthority(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      setStatusMsg("Submitting Authority Registration to MST Blockchain...");
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const authorityContract = new Contract(addresses.AuthorityRegistry, AUTHORITY_REGISTRY_ABI, signer);

      let roleBytes;
      if (authorityForm.role === "UNIVERSITY_ROLE") {
        roleBytes = await authorityContract.UNIVERSITY_ROLE();
      } else if (authorityForm.role === "CARBON_AUDITOR_ROLE") {
        roleBytes = await authorityContract.CARBON_AUDITOR_ROLE();
      } else if (authorityForm.role === "LAND_REGISTRAR_ROLE") {
        roleBytes = await authorityContract.LAND_REGISTRAR_ROLE();
      } else {
        roleBytes = "0x0000000000000000000000000000000000000000000000000000000000000000";
      }

      const tx = await authorityContract.registerAuthority(
        authorityForm.address.trim(),
        roleBytes,
        authorityForm.name.trim(),
        authorityForm.jurisdiction.trim(),
        authorityForm.officialWebsite.trim() || "https://mstblockchain.com",
        authorityForm.registrationId.trim()
      );
      setStatusMsg("Mining authority registration: " + tx.hash.slice(0, 14) + "...");
      await tx.wait();

      setStatusMsg("Successfully registered institutional authority on MST Chain!");
      setAuthorityForm({
        address: "",
        role: "UNIVERSITY_ROLE",
        name: "",
        jurisdiction: "",
        officialWebsite: "",
        registrationId: "",
      });
      await fetchOnChainData(account, provider);
    } catch (err) {
      console.error(err);
      setStatusMsg("Registration Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Real On-Chain Action: Toggle Authority Status (Admin Only)
  async function handleToggleAuthorityStatus(authorityAddr, currentActive) {
    try {
      setTxLoading(true);
      setStatusMsg(`${currentActive ? "Deactivating" : "Activating"} authority ${authorityAddr.slice(0, 8)}...`);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const authorityContract = new Contract(addresses.AuthorityRegistry, AUTHORITY_REGISTRY_ABI, signer);
      const tx = await authorityContract.setAuthorityStatus(authorityAddr, !currentActive);
      await tx.wait();

      setStatusMsg(`Authority status updated to ${!currentActive ? "Active" : "Inactive"}!`);
      await fetchOnChainData(account, provider);
    } catch (err) {
      console.error(err);
      setStatusMsg("Status update failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Pre-fill quick demo self-registration
  function handleQuickAssignSelf(roleName) {
    if (!account) return;
    setAuthorityForm({
      address: account,
      role: roleName,
      name: roleName === "UNIVERSITY_ROLE" ? "MST Technological University" : roleName === "CARBON_AUDITOR_ROLE" ? "Global EcoVerifier Labs" : "Department of Land Cadastre",
      jurisdiction: "Singapore / Global",
      officialWebsite: "https://mstblockchain.com",
      registrationId: `MST-AUTH-${Date.now().toString().slice(-4)}`,
    });
    setStatusMsg(`Pre-filled registration form for your connected address.`);
  }

  // Real On-Chain Action: Set Land Encumbrance / Lien (Registrar Only)
  async function handleRealSetEncumbrance(e) {
    e.preventDefault();
    try {
      setTxLoading(true);
      const { provider, signer } = await getProviderAndSigner();
      // Ethers imported top-level

      const landContract = new Contract(addresses.LandOwnershipTitle, LAND_TITLE_ABI, signer);
      setStatusMsg("Updating land parcel encumbrance lien status... Confirm in wallet.");
      const tx = await landContract.setEncumbrance(
        Number(encumbranceForm.tokenId),
        encumbranceForm.isEncumbered,
        encumbranceForm.reason || "Lien active on cadastral title"
      );
      await tx.wait();

      setStatusMsg("Cadastral Encumbrance updated successfully!");
      setEncumbranceForm({ tokenId: "", isEncumbered: true, reason: "" });
      await fetchOnChainData(account, provider);
    } catch (err) {
      setStatusMsg("Encumbrance Update Failed: " + (err.reason || err.message));
    } finally {
      setTxLoading(false);
    }
  }

  // Auto-connect and load if provider is available
  useEffect(() => {
    const raw = getRawWalletProvider();
    if (raw && typeof raw.on === "function") {
      const handleAccounts = (accs) => {
        if (accs.length > 0) {
          setAccount(accs[0]);
          getProviderAndSigner().then(({ provider }) => fetchOnChainData(accs[0], provider));
        } else {
          disconnectWallet();
        }
      };
      const handleChain = () => window.location.reload();

      raw.on("accountsChanged", handleAccounts);
      raw.on("chainChanged", handleChain);

      return () => {
        if (typeof raw.removeListener === "function") {
          raw.removeListener("accountsChanged", handleAccounts);
          raw.removeListener("chainChanged", handleChain);
        }
      };
    }
  }, [getRawWalletProvider, getProviderAndSigner, fetchOnChainData]);

  return (
    <div className="relative min-h-screen bg-[#08080c] text-slate-100 overflow-x-hidden font-sans">
      {/* Interactive Technical Blockchain Canvas & Radar Background */}
      <TechnicalBackground />

      {/* Background Ambient Glow Orbs */}
      <div className="ambient-orb w-[650px] h-[650px] bg-red-600/12 -top-40 -left-40" />
      <div className="ambient-orb w-[600px] h-[600px] bg-[#28276B]/20 top-96 -right-40" />
      <div className="ambient-orb w-[550px] h-[550px] bg-red-700/10 bottom-20 left-1/3" />
      <div className="ambient-orb w-[450px] h-[450px] bg-[#9D1C1F]/15 top-1/2 left-10" />

      {/* Top Luxury Glass Navigation Bar / Head Panel */}
      <header className="sticky top-0 z-50 border-b border-red-500/20 bg-[#0c0a0e]/90 backdrop-blur-3xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all duration-300">
        {/* Top ambient highlight line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo & Title with 3D Holographic Sheen */}
          <button
            onClick={() => {
              setActiveTab("landing");
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3.5 text-left group/brand shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#9D1C1F] via-[#e52e2e] to-[#ff4d4d] rounded-2xl opacity-60 blur-[3px] group-hover/brand:opacity-100 group-hover/brand:blur-[6px] transition-all duration-300" />
              <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-[#1c1218] via-[#0d090d] to-[#150a0f] border border-red-500/30 flex items-center justify-center font-black text-base tracking-wider shadow-inner group-hover/brand:scale-105 transition-transform duration-300">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">M</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff5252] to-[#e52e2e] drop-shadow-[0_0_8px_rgba(229,46,46,0.6)]">S</span>
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">T</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-black text-base tracking-tight text-white uppercase font-sans">
                  MST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b3b] via-[#e52e2e] to-[#ff7a7a]">BLOCKCHAIN</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-[9px] font-extrabold tracking-wider bg-red-500/15 text-red-300 border border-red-500/35 px-2.5 py-0.5 rounded-full uppercase shadow-[0_0_12px_rgba(229,46,46,0.25)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Asset Hub</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                <span>Universal Multi-Asset Platform</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-red-400/90 font-mono text-[9px] hidden sm:inline">EVM L1</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links (Pill Dock) */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.4)] gap-1">
            {[
              { id: "landing", label: "Overview", icon: Globe },
              { id: "portfolio", label: "Portfolio", icon: Layers },
              { id: "institution", label: "Issuance", icon: Building2 },
              { id: "marketplace", label: "Marketplace", icon: Store, badge: "MSTC" },
              { id: "admin", label: "Roles & Admin", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#e52e2e] via-[#ff3b3b] to-[#b91c1c] text-white shadow-[0_0_18px_rgba(229,46,46,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Connected Wallet */}
          <div className="flex items-center space-x-2.5">
            {/* Pinata IPFS Status Button */}
            <button
              onClick={() => setShowPinataModal(!showPinataModal)}
              title="Pinata IPFS Cloud Settings"
              className={`relative group px-3 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-200 border ${
                pinataConfigured
                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-red-500/30 hover:text-white"
              }`}
            >
              <UploadCloud className={`h-3.5 w-3.5 ${pinataConfigured ? "text-cyan-400 group-hover:scale-110" : "text-slate-400"} transition-transform`} />
              <span className="hidden xl:inline font-semibold">IPFS</span>
              <span className="relative flex h-2 w-2">
                {pinataConfigured && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${pinataConfigured ? "bg-cyan-400" : "bg-amber-400"}`}></span>
              </span>
            </button>

            {/* Contract Settings Gear */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              title="Contract Addresses"
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 group"
            >
              <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300 text-slate-400 group-hover:text-red-400" />
            </button>

            {/* Wallet Section */}
            {account ? (
              <div className="flex items-center space-x-2">
                {/* Account & MSTC Balance Dual Capsule */}
                <div className="flex items-center rounded-2xl p-1 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <button
                    onClick={() => setShowWalletModal(true)}
                    title="Click to view wallet details & switch network"
                    className="flex items-center space-x-2 px-2.5 py-1.5 text-xs hover:text-white transition group/acc"
                  >
                    {/* Wallet provider mini badge */}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex items-center space-x-1 ${
                        walletType === "bridgekey"
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      <span>{walletType === "bridgekey" ? "BridgeKey" : "MetaMask"}</span>
                    </span>

                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm shadow-emerald-500"></span>
                    </div>
                    <span className="font-mono text-slate-200 font-semibold group-hover/acc:text-white">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </button>

                  <button
                    onClick={copyWalletAddress}
                    title="Copy Address"
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5"
                  >
                    {copiedAddress ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>

                  <div className="bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 text-[#ff4d4d] shadow-[0_0_12px_rgba(229,46,46,0.2)]">
                    <Flame className="h-3.5 w-3.5 text-[#ff3b3b]" />
                    <span>{parseFloat(balance).toFixed(2)} MSTC</span>
                  </div>
                </div>

                {/* Role Privilege Badge */}
                <div
                  onClick={() => setActiveTab("admin")}
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 border shadow-md ${
                    userRoles.isAdmin
                      ? "bg-purple-500/15 text-purple-200 border-purple-500/40 hover:bg-purple-500/25 shadow-purple-500/10"
                      : userRoles.isUniversity
                      ? "bg-indigo-500/15 text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/25 shadow-indigo-500/10"
                      : userRoles.isCarbonAuditor
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/25 shadow-emerald-500/10"
                      : userRoles.isLandRegistrar
                      ? "bg-sky-500/15 text-sky-200 border-sky-500/40 hover:bg-sky-500/25 shadow-sky-500/10"
                      : "bg-white/[0.04] text-slate-300 border-white/10 hover:border-red-500/30 hover:text-white"
                  }`}
                  title="Your Active Protocol Role (Click to manage)"
                >
                  {userRoles.isAdmin ? (
                    <>
                      <Crown className="h-3.5 w-3.5 text-purple-400" />
                      <span>Admin</span>
                    </>
                  ) : userRoles.isUniversity ? (
                    <>
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                      <span>University</span>
                    </>
                  ) : userRoles.isCarbonAuditor ? (
                    <>
                      <Trees className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Auditor</span>
                    </>
                  ) : userRoles.isLandRegistrar ? (
                    <>
                      <MapPin className="h-3.5 w-3.5 text-sky-400" />
                      <span>Registrar</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>User</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="relative group overflow-hidden rounded-xl p-[1px] font-bold text-xs transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(229,46,46,0.35)] hover:shadow-[0_0_30px_rgba(229,46,46,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff3b3b] via-[#e52e2e] to-[#9D1C1F] group-hover:opacity-100 transition-opacity" />
                <div className="relative px-4 py-2.5 rounded-[11px] bg-gradient-to-r from-[#e52e2e] to-[#b91c1c] text-white flex items-center space-x-2">
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <Wallet className="h-3.5 w-3.5 text-white group-hover:scale-110 transition-transform" />
                  )}
                  <span className="tracking-wide">{loading ? "Connecting..." : "Connect MST Wallet"}</span>
                </div>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-red-500/30 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-red-400" /> : <Menu className="h-5 w-5 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Bottom Glowing Accent Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ff3b3b]/40 to-transparent" />

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-red-500/20 bg-[#0c0a0e]/95 backdrop-blur-3xl px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {[
              { id: "landing", label: "Overview", icon: Globe },
              { id: "portfolio", label: "My Portfolio", icon: Layers },
              { id: "institution", label: "Issuance Portal", icon: Building2 },
              { id: "marketplace", label: "Marketplace", icon: Store, badge: "MSTC" },
              { id: "admin", label: "Roles & Admin", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#e52e2e] to-[#b91c1c] text-white shadow-lg shadow-red-600/30"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-md font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Contract Settings Drawer */}
      {showConfig && (
        <div className="relative z-40 max-w-7xl mx-auto px-6 pt-4">
          <div className="glass-panel p-5 rounded-2xl border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Settings className="h-4 w-4 text-emerald-400" />
                <span>On-Chain Target Smart Contract Addresses</span>
              </h3>
              <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {Object.keys(addresses).map((key) => (
                <div key={key}>
                  <label className="text-slate-400 block mb-1 text-[11px] font-mono">{key}</label>
                  <input
                    type="text"
                    value={addresses[key]}
                    onChange={(e) => setAddresses({ ...addresses, [key]: e.target.value })}
                    className="glass-input w-full rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pinata IPFS Cloud Settings Drawer */}
      {showPinataModal && (
        <div className="relative z-40 max-w-7xl mx-auto px-6 pt-4">
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl space-y-4 shadow-2xl shadow-cyan-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Pinata IPFS Cloud Storage Settings</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      pinataConfigured
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    }`}>
                      {pinataConfigured ? "Connected" : "Configuration Needed"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pins degree transcripts, cadastral deed surveys, and carbon audits permanently to IPFS via Pinata.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPinataModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg glass-pill transition"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="text-slate-300 block mb-1.5 font-medium flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Key className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Pinata JWT API Token</span>
                  </span>
                  <a
                    href="https://app.pinata.cloud/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Get Free Key on Pinata.cloud</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={pinataJwtInput}
                  placeholder="Paste your Pinata JWT (eyJhbGciOi...)"
                  onChange={(e) => setPinataJwtInput(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-200 font-mono text-xs placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Saved securely in your browser session or set as PINATA_JWT in server environment.
                </p>
              </div>

              <div>
                <label className="text-slate-300 block mb-1.5 font-medium flex items-center space-x-1.5">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Pinata Gateway Domain</span>
                </label>
                <input
                  type="text"
                  value={pinataGatewayInput}
                  placeholder="gateway.pinata.cloud or your-subdomain.mypinata.cloud"
                  onChange={(e) => setPinataGatewayInput(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-200 font-mono text-xs placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Default: gateway.pinata.cloud (or your custom Pinata dedicated gateway).
                </p>
              </div>
            </div>

            {pinataTestResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  pinataTestResult.success
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                }`}
              >
                {pinataTestResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                )}
                <span>{pinataTestResult.msg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/[0.06] gap-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span className={`h-2 w-2 rounded-full ${pinataConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                <span className="truncate">https://{pinataGatewayInput || "gateway.pinata.cloud"}/ipfs/</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={handleTestPinata}
                  disabled={pinataTesting}
                  className="glass-pill hover:bg-white/10 text-cyan-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  {pinataTesting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Test Pinata Auth</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSavePinata}
                  className="mst-btn-primary px-4 py-1.5 text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/30"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Pinata Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {statusMsg && (
        <div className="relative z-40 max-w-7xl mx-auto px-6 pt-4">
          <div className="glass-panel border-red-500/30 bg-red-950/40 text-red-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-lg shadow-red-950/50">
            <div className="flex items-center space-x-2.5">
              {txLoading ? (
                <Loader2 className="h-4 w-4 text-red-400 animate-spin shrink-0" />
              ) : (
                <Sparkles className="h-4 w-4 text-red-400 shrink-0" />
              )}
              <span className="font-medium">{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg("")} className="text-slate-400 hover:text-white text-sm ml-4">✕</button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌟 LANDING PAGE: PROJECT OVERVIEW & INFORMATION */}
      {/* ======================================================== */}
      {activeTab === "landing" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
          {/* Hero Section */}
          <section className="text-center max-w-5xl mx-auto space-y-6 pt-6">
            {/* Live Ecosystem Pill */}
            <div className="inline-flex items-center space-x-2.5 glass-pill px-4 py-1.5 rounded-full text-xs font-medium text-slate-200 border border-red-500/30 shadow-lg shadow-red-600/10">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e52e2e]"></span>
              </span>
              <span className="text-[#ff3b3b] font-bold uppercase tracking-wider text-[11px]">MST Blockchain</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">Enterprise EVM Layer 1 Infrastructure</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] font-sans">
              Universal Multi-Asset <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b3b] via-[#e52e2e] to-slate-100">
                Management System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
              An enterprise-grade decentralized platform uniting <strong className="text-white font-semibold">Soulbound Academic Credentials</strong>, <strong className="text-white font-semibold">Certified Carbon Offsets</strong>, and <strong className="text-white font-semibold">Cadastral Land Titles</strong> with native marketplace liquidity on the high-throughput <strong className="text-white font-semibold">MST Blockchain (EVM L1)</strong>.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {account ? (
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className="w-full sm:w-auto mst-btn-primary px-8 py-3.5 text-sm flex items-center justify-center space-x-2"
                >
                  <span>Launch My Portfolio</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full sm:w-auto mst-btn-primary px-8 py-3.5 text-sm flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect MST Wallet</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("marketplace")}
                className="w-full sm:w-auto glass-pill hover:border-red-500/40 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-sm transition flex items-center justify-center space-x-2"
              >
                <Store className="h-4 w-4 text-[#ff3b3b]" />
                <span>Explore MSTC Marketplace</span>
              </button>
            </div>

            {/* Key Metric Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
              <div className="glass-card p-5 rounded-2xl border-white/10 hover:border-red-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Throughput</span>
                <span className="text-2xl font-black text-white mt-1 block">4,000+ TPS</span>
                <span className="text-xs text-red-400 mt-1 block font-semibold">PoSA Consensus</span>
              </div>
              <div className="glass-card p-5 rounded-2xl border-white/10 hover:border-red-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Block Time</span>
                <span className="text-2xl font-black text-white mt-1 block">~3 Seconds</span>
                <span className="text-xs text-red-400 mt-1 block font-semibold">Instant Finality</span>
              </div>
              <div className="glass-card p-5 rounded-2xl border-white/10 hover:border-red-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Native Coin</span>
                <span className="text-2xl font-black text-white mt-1 block">MSTC</span>
                <span className="text-xs text-red-400 mt-1 block font-semibold">Gas & Settlement</span>
              </div>
              <div className="glass-card p-5 rounded-2xl border-white/10 hover:border-red-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Architecture</span>
                <span className="text-2xl font-black text-white mt-1 block">EVM L1</span>
                <span className="text-xs text-red-400 mt-1 block font-semibold">Solidity 0.8.24</span>
              </div>
            </div>
          </section>

          {/* Official BridgeKey Wallet Showcase */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border-red-500/30 bg-gradient-to-r from-[#170c12]/90 via-[#0e0a12]/90 to-[#12080e]/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-red-950/40">
            <div className="flex items-center space-x-5">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#9D1C1F] via-[#e52e2e] to-[#ff4d4d] p-[2px] shadow-xl shadow-red-600/30 shrink-0">
                <div className="h-full w-full rounded-[14px] bg-[#0c0a0e] flex items-center justify-center font-black text-2xl text-white">
                  <span className="text-white">B</span>
                  <span className="text-[#ff3b3b]">K</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
                    BridgeKey Wallet Integration
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full">
                    ⭐ Official Native MST
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Built natively for the MST Blockchain ecosystem by Masterstroke Technosoft. Manage Soulbound Degrees, Cadastral Deeds, and Carbon Offsets with zero-configuration network switching across 95+ EVM chains.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  if (detectBridgeKey(eip6963Providers)) {
                    connectWithWallet("bridgekey");
                  } else {
                    setShowWalletModal(true);
                  }
                }}
                className="w-full md:w-auto mst-btn-primary px-5 py-2.5 text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30"
              >
                <Wallet className="h-4 w-4" />
                <span>{detectBridgeKey(eip6963Providers) ? "Connect BridgeKey" : "Get BridgeKey Wallet"}</span>
              </button>
              <a
                href="https://bridgekey.io"
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1"
              >
                <span>bridgekey.io</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Section: 4 Core Asset Classes */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Architected for Heterogeneous Real-World Assets
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Different asset classes require tailored token standards, legal permissioning, and transferability mechanics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset 1: Degrees */}
              <div className="glass-card rounded-2xl p-7 space-y-4 relative overflow-hidden group">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="glass-pill text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded">ERC-5192 / Soulbound</span>
                  <span className="text-[10px] text-slate-400">Non-Transferable</span>
                </div>
                <h3 className="text-lg font-bold text-white">Academic Degree Certificates</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Permanently bound to the recipient's wallet address. Issued exclusively by accredited universities registered in the AuthorityRegistry. Tamper-proof, verifiable via public RPC, with on-chain revocation support.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Zero transferability (anti-fraud)</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>IPFS encrypted transcript hash</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Institutional university signature</span></li>
                </ul>
              </div>

              {/* Asset 2: Carbon Credits */}
              <div className="glass-card rounded-2xl p-7 space-y-4 relative overflow-hidden group">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Trees className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="glass-pill text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded">ERC-1155 Multi-Token</span>
                  <span className="text-[10px] text-slate-400">Tradeable & Retirable</span>
                </div>
                <h3 className="text-lg font-bold text-white">Carbon Credits & Proof of Impact</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semi-fungible tokens representing certified metric tonnes of CO2e across specific projects and vintages. Developers can trade fractions, and enterprises can permanently retire (burn) credits to mint non-transferable Proof-of-Offset receipts.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Verra VCS & Gold Standard verified</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>On-chain burn mechanism (anti double-count)</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Soulbound Proof-of-Offset certificate</span></li>
                </ul>
              </div>

              {/* Asset 3: Land Ownership */}
              <div className="glass-card rounded-2xl p-7 space-y-4 relative overflow-hidden group">
                <div className="h-12 w-12 rounded-2xl bg-sky-500/15 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="glass-pill text-[10px] font-mono text-sky-300 px-2 py-0.5 rounded">ERC-721 Deed NFT</span>
                  <span className="text-[10px] text-slate-400">Lien Guard Protected</span>
                </div>
                <h3 className="text-lg font-bold text-white">Cadastral Land Titles & Property</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unique 1-of-1 digital property deeds tied to official government cadastral survey numbers, GIS polygon boundaries, and deed registry documents. Registrars can place active mortgage liens that programmatically lock transfers.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Official municipal registrar notarization</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Encumbrance & mortgage lock flag</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Atomic marketplace settlement in MSTC</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: How It Works Lifecycle */}
          <section className="glass-panel rounded-3xl p-8 md:p-12 border-white/10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">End-to-End Workflow</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">How the MST Protocol Operates</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center">1</div>
                <h4 className="font-bold text-white text-sm">Institutional Notarization</h4>
                <p className="text-slate-400">
                  Universities, carbon auditors, and municipal land registrars are granted specialized cryptographic roles in <code>AuthorityRegistry.sol</code>.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-black flex items-center justify-center">2</div>
                <h4 className="font-bold text-white text-sm">Smart Contract Minting</h4>
                <p className="text-slate-400">
                  Authorities mint digital assets directly to user wallets, anchoring document hashes and IPFS metadata on the MST Blockchain.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center">3</div>
                <h4 className="font-bold text-white text-sm">Escrow & Marketplace</h4>
                <p className="text-slate-400">
                  Transferable assets (land titles, carbon credits) can be listed on <code>UniversalMarketplace.sol</code> and settled in native MSTC coin with 1% fee.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center">4</div>
                <h4 className="font-bold text-white text-sm">Retirement & Audit</h4>
                <p className="text-slate-400">
                  Corporations offset carbon footprints by burning tokens to mint Soulbound certificates, guaranteeing zero double-spending.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Network Specifications */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Network Architecture</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">MST Blockchain Network Parameters</h2>
              </div>
              <div className="flex space-x-2 text-xs">
                <button
                  onClick={() => switchNetwork("testnet")}
                  className="glass-pill px-4 py-2 rounded-xl text-red-300 border-red-500/40 hover:bg-red-500/20 transition font-semibold"
                >
                  Add Testnet to Wallet
                </button>
                <button
                  onClick={() => switchNetwork("mainnet")}
                  className="glass-pill px-4 py-2 rounded-xl text-red-300 border-red-500/40 hover:bg-red-500/20 transition font-semibold"
                >
                  Add Mainnet to Wallet
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Testnet Card */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">MST Testnet</h3>
                  <span className="glass-pill px-2.5 py-0.5 rounded text-red-400 border border-red-500/20 font-mono">Chain ID: 4545</span>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">RPC Endpoint:</span>
                    <span className="font-mono text-red-400">https://testnetrpc.mstblockchain.com</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">Currency Symbol:</span>
                    <span className="font-bold text-white">tMSTC</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">Block Explorer:</span>
                    <a href="https://testnet.mstscan.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1">
                      <span>testnet.mstscan.com</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Mainnet Card */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">MST Mainnet</h3>
                  <span className="glass-pill px-2.5 py-0.5 rounded text-red-400 border border-red-500/20 font-mono">Chain ID: 4646 (0x1226)</span>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">RPC Endpoint:</span>
                    <span className="font-mono text-red-400">https://mariorpc.mstblockchain.com</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">Currency Symbol:</span>
                    <span className="font-bold text-white">MSTC</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-slate-400">Block Explorer:</span>
                    <a href="https://mstscan.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1">
                      <span>mstscan.com</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Launch Bottom Banner */}
          <section className="glass-panel rounded-3xl p-8 text-center space-y-4 border-red-500/25 bg-gradient-to-br from-[#9D1C1F]/25 via-[#0c0a0e]/95 to-[#28276B]/20">
            <h3 className="text-2xl font-extrabold text-white">Ready to interact with real on-chain assets?</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Enter the dApp to issue verified academic credentials, manage cadastral real estate titles, or buy and retire certified carbon credits.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("portfolio")}
                className="mst-btn-primary px-8 py-3 text-xs"
              >
                Enter dApp Dashboard
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-12 border-t border-red-500/15 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#9D1C1F] to-[#e52e2e] flex items-center justify-center font-black text-white text-xs shadow-md shadow-red-600/30">
                MST
              </div>
              <span className="font-semibold text-slate-300">MST Multi-Asset Hub</span>
              <span className="text-slate-500">• Powered by MST Blockchain & Masterstroke Technosoft</span>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <a href="https://bridgekey.io" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1 font-medium text-red-300">
                <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                <span>BridgeKey Wallet</span>
              </a>
              <a href="https://mstblockchain.com" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1">
                <Globe className="h-3.5 w-3.5 text-red-400" />
                <span>mstblockchain.com</span>
              </a>
              <a href="https://mstscan.com" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1">
                <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                <span>mstscan.com</span>
              </a>
              <a href="https://masterstroke.academy" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1">
                <BookOpen className="h-3.5 w-3.5 text-red-400" />
                <span>MasterStroke Academy</span>
              </a>
              <a href="https://proofeasy.io" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
                <span>ProofEasy.io</span>
              </a>
              <a href="https://github.com/pranavpatil0666-ai/mst-multi-asset-management" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center space-x-1">
                <Code2 className="h-3.5 w-3.5 text-red-400" />
                <span>GitHub</span>
              </a>
            </div>
          </footer>
        </main>
      )}

      {/* ======================================================== */}
      {/* 📊 TAB 1: MY ON-CHAIN PORTFOLIO */}
      {/* ======================================================== */}
      {activeTab === "portfolio" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-10">
          {!account ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <Wallet className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Connect Wallet to Read On-Chain Assets</h2>
              <p className="text-xs text-slate-300">
                This dashboard queries directly from the MST Blockchain state machine. Connect your Web3 wallet (<strong className="text-white">BridgeKey Wallet</strong> or MetaMask) to view your verified degrees, land titles, and carbon credits.
              </p>
              <button
                onClick={() => setShowWalletModal(true)}
                className="mst-btn-primary px-6 py-3 text-xs flex items-center justify-center space-x-2 mx-auto shadow-lg shadow-red-600/30"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect BridgeKey / Web3 Wallet</span>
              </button>
            </div>
          ) : (
            <>
              {/* Portfolio Top Header Banner */}
              <div className="glass-panel rounded-2xl p-6 border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    <span>Decentralized Asset Aggregator</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    My On-Chain Portfolio
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time verification of degrees, land titles, carbon credits, and MSTC balance directly from MST Blockchain.
                  </p>
                </div>
                <div className="flex items-center space-x-2 glass-pill px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MST Blockchain Synced</span>
                </div>
              </div>

              {/* Overview Stat Counters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degrees Owned</span>
                    <GraduationCap className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mt-3">{degrees.length}</h2>
                  <p className="text-xs text-indigo-300/80 mt-2">Soulbound ERC-5192</p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Land Titles Owned</span>
                    <MapPin className="h-5 w-5 text-sky-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mt-3">{landParcels.length}</h2>
                  <p className="text-xs text-sky-400/80 mt-2">Cadastral ERC-721 Deeds</p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offset Certificates</span>
                    <Flame className="h-5 w-5 text-amber-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mt-3">{retirementReceipts.length}</h2>
                  <p className="text-xs text-amber-400/80 mt-2">Permanent Proofs</p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MSTC Gas Balance</span>
                    <Wallet className="h-5 w-5 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#ff3b3b] mt-3">{parseFloat(balance).toFixed(3)}</h2>
                  <p className="text-xs text-slate-400 mt-2">MST Native Coin</p>
                </div>
              </div>

              {/* Degrees Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Verified Academic Degrees</h3>
                  </div>
                  <span className="glass-pill text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">Soulbound ERC-5192</span>
                </div>

                {degrees.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center text-xs text-slate-400">
                    No academic degree certificates found for address <span className="font-mono text-slate-300">{account}</span>.
                    Issue one using an authorized university account in the Institutional Portal.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {degrees.map((deg) => (
                      <div key={deg.tokenId} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-5 right-5 flex items-center space-x-1.5 glass-pill px-3 py-1 rounded-full text-xs text-amber-300">
                          <Lock className="h-3.5 w-3.5 text-amber-400" />
                          <span className="font-semibold">Soulbound</span>
                        </div>

                        <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Issuer: {deg.university.slice(0, 10)}...</span>
                        <h4 className="text-lg font-bold text-white mt-1.5">{deg.degreeName}</h4>

                        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block">Token ID:</span>
                            <p className="font-bold text-slate-100 mt-1">#{deg.tokenId}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Issue Date:</span>
                            <p className="font-bold text-slate-100 mt-1">{deg.issuedAt}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                          <span className="text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{deg.isRevoked ? "Revoked by University" : "Verified on MST Chain"}</span>
                          </span>
                          {deg.transcriptUri && (
                            <a
                              href={getIPFSGatewayUrl(deg.transcriptUri)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-white flex items-center space-x-1 text-[11px] transition font-medium"
                            >
                              <span>View IPFS Transcript</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Land Parcels Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-sky-400" />
                    <h3 className="text-lg font-bold text-white">Cadastral Land Titles & Deeds</h3>
                  </div>
                  <span className="glass-pill text-sky-300 text-xs px-3 py-1 rounded-full font-medium">ERC-721 Property Deeds</span>
                </div>

                {landParcels.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center text-xs text-slate-400">
                    No registered land titles owned by <span className="font-mono text-slate-300">{account}</span>.
                    Authorized land registrars can notarize and register deeds in the Institutional Portal.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {landParcels.map((parcel) => (
                      <div key={parcel.tokenId} className="glass-card rounded-2xl p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="glass-pill font-mono text-xs px-2.5 py-0.5 rounded-md text-slate-300">
                              Token #{parcel.tokenId}
                            </span>
                            <h4 className="text-base font-bold text-white mt-2.5">{parcel.parcelIdentifier}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{parcel.jurisdiction}</p>
                          </div>

                          {parcel.isEncumbered ? (
                            <div className="flex items-center space-x-1.5 glass-pill border-rose-500/40 bg-rose-950/40 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold">
                              <Lock className="h-3.5 w-3.5 text-rose-400" />
                              <span>Lien / Encumbered</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1.5 glass-pill border-emerald-500/40 bg-emerald-950/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                              <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Free Title</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block">Area:</span>
                            <p className="font-bold text-slate-100 mt-1">{parcel.areaSquareMeters} m²</p>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Registered:</span>
                            <p className="font-bold text-slate-100 mt-1">{parcel.registeredAt}</p>
                          </div>
                        </div>

                        {parcel.isEncumbered && (
                          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-300 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                            <span>{parcel.encumbranceReason || "Lien active on title"}</span>
                          </div>
                        )}

                        {parcel.deedDocUri && (
                          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[11px]">IPFS Cadastral Record:</span>
                            <a
                              href={getIPFSGatewayUrl(parcel.deedDocUri)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-white flex items-center space-x-1 text-[11px] transition font-medium"
                            >
                              <span>View Deed on IPFS</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Carbon Offset Proofs */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Flame className="h-5 w-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Permanent Proof-of-Offset Receipts</h3>
                  </div>
                  <span className="glass-pill text-amber-300 text-xs px-3 py-1 rounded-full font-medium">Soulbound Impact Certificates</span>
                </div>

                {retirementReceipts.length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center text-xs text-slate-400">
                    No carbon offset certificates issued to this address. Use the Offset form in the Institutional Portal to burn carbon credits and mint on-chain proof.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {retirementReceipts.map((rcpt) => (
                      <div key={rcpt.certificateId} className="glass-card rounded-2xl p-5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">Receipt #{rcpt.certificateId}</span>
                          <span className="text-amber-400 font-extrabold text-sm">-{rcpt.tonnesRetired} Tonnes CO2e</span>
                        </div>
                        <p className="text-slate-300 mt-2 font-medium">Beneficiary: {rcpt.beneficiaryName}</p>
                        <p className="text-slate-400 mt-1">{rcpt.retirementReason} (Batch #{rcpt.batchTokenId})</p>
                        <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-500">
                          Date: {rcpt.retiredAt}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* 🏛️ TAB 2: INSTITUTIONAL ISSUANCE PORTAL */}
      {/* ======================================================== */}
      {activeTab === "institution" && (
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-8">
          <div className="glass-panel rounded-2xl p-6 border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">
                <Building2 className="h-3.5 w-3.5 text-red-500" />
                <span>Authorized Authorities • Cryptographic Minting</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Institutional Issuance Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Decentralized minting and lifecycle governance for verified academic degrees, certified carbon batches, and cadastral land deeds.
              </p>
            </div>
            <div className="glass-pill px-3.5 py-2 rounded-xl text-xs text-slate-300">
              Consensus: <span className="text-red-400 font-bold">PoSA • EVM L1</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Credential Minting */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-indigo-400 font-bold text-base">
                <GraduationCap className="h-5 w-5" />
                <h4>Issue Degree (Authorized University)</h4>
              </div>

              <form onSubmit={handleRealIssueDegree} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Student Wallet Address</label>
                  <input
                    type="text"
                    value={degreeForm.student}
                    onChange={(e) => setDegreeForm({ ...degreeForm, student: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={degreeForm.studentName}
                    onChange={(e) => setDegreeForm({ ...degreeForm, studentName: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="Student Name"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Degree Title</label>
                  <input
                    type="text"
                    value={degreeForm.degreeName}
                    onChange={(e) => setDegreeForm({ ...degreeForm, degreeName: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="B.S. in Computer Science"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Major / Discipline</label>
                    <input
                      type="text"
                      value={degreeForm.major}
                      onChange={(e) => setDegreeForm({ ...degreeForm, major: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="Engineering"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Graduation Date</label>
                    <input
                      type="text"
                      value={degreeForm.graduationDate}
                      onChange={(e) => setDegreeForm({ ...degreeForm, graduationDate: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="2026-06-15"
                    />
                  </div>
                </div>

                <IPFSUploader
                  label="Student Diploma & Transcript Document"
                  assetType="CREDENTIAL"
                  value={degreeForm.transcriptIpfsUri}
                  onChange={(uri) => setDegreeForm({ ...degreeForm, transcriptIpfsUri: uri })}
                  accept=".pdf,.png,.jpg,.jpeg,.json"
                />

                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {txLoading ? "Broadcasting to MST..." : "Broadcast Issue Degree Transaction"}
                </button>
              </form>
            </div>

            {/* Land Registry Notarization */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-sky-400 font-bold text-base">
                <MapPin className="h-5 w-5" />
                <h4>Register Land Parcel (Land Registrar)</h4>
              </div>

              <form onSubmit={handleRealRegisterLand} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Owner Wallet Address</label>
                  <input
                    type="text"
                    value={landForm.owner}
                    onChange={(e) => setLandForm({ ...landForm, owner: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Cadastral Survey / Lot Number</label>
                  <input
                    type="text"
                    value={landForm.parcelIdentifier}
                    onChange={(e) => setLandForm({ ...landForm, parcelIdentifier: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="PARCEL-MST-2026-01"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Jurisdiction / Location</label>
                  <input
                    type="text"
                    value={landForm.jurisdiction}
                    onChange={(e) => setLandForm({ ...landForm, jurisdiction: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="Singapore Financial District"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Area (m²)</label>
                    <input
                      type="number"
                      value={landForm.areaSquareMeters}
                      onChange={(e) => setLandForm({ ...landForm, areaSquareMeters: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Deed Doc Hash</label>
                    <input
                      type="text"
                      value={landForm.deedRegistryHash}
                      onChange={(e) => setLandForm({ ...landForm, deedRegistryHash: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white font-mono"
                      placeholder="0x..."
                    />
                  </div>
                </div>

                <IPFSUploader
                  label="Official Deed Registry Document & Cadastral Survey (PDF)"
                  assetType="LAND_DEED"
                  value={landForm.deedDocumentIpfsUri}
                  onChange={(uri) => setLandForm({ ...landForm, deedDocumentIpfsUri: uri })}
                  accept=".pdf,.png,.jpg,.jpeg,.json"
                />

                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {txLoading ? "Broadcasting to MST..." : "Broadcast Register Land Transaction"}
                </button>
              </form>
            </div>

            {/* Carbon Credit Batch Creation */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-emerald-400 font-bold text-base">
                <Trees className="h-5 w-5" />
                <h4>Mint Carbon Batch (Certified Auditor)</h4>
              </div>

              <form onSubmit={handleRealMintCarbonBatch} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Recipient Address (Project Developer)</label>
                  <input
                    type="text"
                    value={carbonForm.recipient}
                    onChange={(e) => setCarbonForm({ ...carbonForm, recipient: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Project Identifier</label>
                  <input
                    type="text"
                    value={carbonForm.projectId}
                    onChange={(e) => setCarbonForm({ ...carbonForm, projectId: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="VCS-2104 (Amazon Project)"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Vintage Year</label>
                    <input
                      type="number"
                      value={carbonForm.vintageYear}
                      onChange={(e) => setCarbonForm({ ...carbonForm, vintageYear: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Metric Tonnes</label>
                    <input
                      type="number"
                      value={carbonForm.tonnes}
                      onChange={(e) => setCarbonForm({ ...carbonForm, tonnes: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="1000"
                      required
                    />
                  </div>
                </div>

                <IPFSUploader
                  label="Third-Party Verification Audit Report (PDF)"
                  assetType="CARBON_AUDIT"
                  value={carbonForm.auditReportIpfsUri}
                  onChange={(uri) => setCarbonForm({ ...carbonForm, auditReportIpfsUri: uri })}
                  accept=".pdf,.png,.jpg,.jpeg,.json"
                />

                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full mt-2 mst-btn-primary py-3 text-xs shadow-md shadow-red-600/30 disabled:opacity-50"
                >
                  {txLoading ? "Broadcasting to MST..." : "Broadcast Mint Batch Transaction"}
                </button>
              </form>
            </div>

            {/* Carbon Credit Offset / Burn */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2.5 text-amber-400 font-bold text-base">
                <Flame className="h-5 w-5" />
                <h4>Retire Credits & Mint Offset Proof</h4>
              </div>

              <form onSubmit={handleRealRetireCredits} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Batch Token ID</label>
                    <input
                      type="number"
                      value={retireForm.tokenId}
                      onChange={(e) => setRetireForm({ ...retireForm, tokenId: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Tonnes to Burn</label>
                    <input
                      type="number"
                      value={retireForm.tonnes}
                      onChange={(e) => setRetireForm({ ...retireForm, tonnes: e.target.value })}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Beneficiary Organization</label>
                  <input
                    type="text"
                    value={retireForm.beneficiaryName}
                    onChange={(e) => setRetireForm({ ...retireForm, beneficiaryName: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="Acme Global Corp"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Offset Purpose</label>
                  <input
                    type="text"
                    value={retireForm.reason}
                    onChange={(e) => setRetireForm({ ...retireForm, reason: e.target.value })}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                    placeholder="Scope 1 Emissions 2026"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {txLoading ? "Broadcasting to MST..." : "Burn Credits & Mint Proof"}
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 🛒 TAB 3: MARKETPLACE & ESCROW */}
      {/* ======================================================== */}
      {activeTab === "marketplace" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">
                <Store className="h-3.5 w-3.5 text-red-500" />
                <span>Decentralized Escrow & Liquidity</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Universal Asset Marketplace
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Decentralized peer-to-peer exchange and non-custodial escrow for transferable real-world assets settled in native MSTC.
              </p>
            </div>

            <div className="glass-pill text-xs px-4 py-2 rounded-xl text-slate-300">
              Protocol Fee: <span className="text-red-400 font-bold">1.0%</span> | Settlement: <span className="text-[#ff3b3b] font-bold">MSTC Coin</span>
            </div>
          </div>

          {/* List an Asset Form */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Tag className="h-4 w-4 text-emerald-400" />
              <span>List Your Owned Asset on Marketplace</span>
            </h4>
            <form onSubmit={handleRealListItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Asset Standard</label>
                <select
                  value={listForm.assetType}
                  onChange={(e) => setListForm({ ...listForm, assetType: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                >
                  <option value="ERC721" className="bg-slate-900">Land Title (ERC-721)</option>
                  <option value="ERC1155" className="bg-slate-900">Carbon Credits (ERC-1155)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Token ID</label>
                <input
                  type="number"
                  value={listForm.tokenId}
                  onChange={(e) => setListForm({ ...listForm, tokenId: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  placeholder="1"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Amount</label>
                <input
                  type="number"
                  value={listForm.amount}
                  onChange={(e) => setListForm({ ...listForm, amount: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  placeholder="1"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Price per Unit (MSTC)</label>
                <input
                  type="text"
                  value={listForm.priceInMSTC}
                  onChange={(e) => setListForm({ ...listForm, priceInMSTC: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  placeholder="10.0"
                  required
                />
              </div>
              <div className="md:col-span-4 text-right">
                <button
                  type="submit"
                  disabled={txLoading}
                  className="mst-btn-primary px-6 py-2.5 text-xs shadow-md shadow-red-600/30 disabled:opacity-50"
                >
                  {txLoading ? "Broadcasting..." : "Create On-Chain Listing"}
                </button>
              </div>
            </form>
          </div>

          {/* Active Listings Display */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Active On-Chain Listings</h4>
            {marketplaceListings.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-xs text-slate-400">
                No active listings currently detected on UniversalMarketplace.sol. Use the form above to list your unencumbered land titles or carbon credits for sale in MSTC.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {marketplaceListings.map((listing) => (
                  <div key={listing.listingId} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="glass-pill text-xs text-emerald-300 border-emerald-500/30 px-3 py-1 rounded-lg font-semibold">
                          Listing #{listing.listingId}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Standard: {listing.standard}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white mt-4">
                        Token #{listing.tokenId} ({listing.standard === "ERC721" ? "Land Title" : "Carbon Batch"})
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5">
                        Amount Available: <span className="font-semibold text-slate-200">{listing.amount}</span>
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">Seller: {listing.seller.slice(0, 10)}...</p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Unit Price:</span>
                        <p className="text-2xl font-black text-[#ff3b3b] mt-0.5">
                          {listing.priceMSTC} <span className="text-xs font-normal text-slate-400">MSTC</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleRealBuyItem(listing)}
                        disabled={txLoading}
                        className="mst-btn-primary px-6 py-2.5 text-xs shadow-md shadow-red-600/30 active:scale-95 disabled:opacity-50"
                      >
                        {txLoading ? "Processing..." : "Buy with MSTC"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 👑 TAB 4: ROLES & ADMIN GOVERNANCE PORTAL */}
      {/* ======================================================== */}
      {activeTab === "admin" && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Header Banner */}
          <div className="glass-panel rounded-3xl p-8 border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-950 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Role-Based Access Control (RBAC) Governance</span>
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                  Institutional Authority & User Permissions
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
                  Enforces strict institutional privilege separation on MST Blockchain. Only accredited universities can issue degrees, certified eco-auditors can mint carbon batches, and municipal registrars can notarize cadastral deeds.
                </p>
              </div>

              {/* Connected Wallet Privilege Pill */}
              <div className="p-4 rounded-2xl glass-card border-white/10 shrink-0 text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Your Wallet Privilege</span>
                <div className="flex items-center space-x-2 mt-1 justify-end">
                  {userRoles.isAdmin ? (
                    <span className="text-sm font-black text-purple-300 flex items-center space-x-1.5">
                      <Crown className="h-4 w-4 text-purple-400" />
                      <span>Protocol Admin (Superuser)</span>
                    </span>
                  ) : userRoles.isUniversity ? (
                    <span className="text-sm font-black text-indigo-300 flex items-center space-x-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      <span>Accredited University</span>
                    </span>
                  ) : userRoles.isCarbonAuditor ? (
                    <span className="text-sm font-black text-emerald-300 flex items-center space-x-1.5">
                      <Trees className="h-4 w-4 text-emerald-400" />
                      <span>Certified Carbon Auditor</span>
                    </span>
                  ) : userRoles.isLandRegistrar ? (
                    <span className="text-sm font-black text-sky-300 flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-sky-400" />
                      <span>Cadastral Land Registrar</span>
                    </span>
                  ) : (
                    <span className="text-sm font-black text-slate-300 flex items-center space-x-1.5">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Citizen / Standard User</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                  {account ? `${account.slice(0, 10)}...${account.slice(-6)}` : "No Wallet Connected"}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Role Permission Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Protocol Admin */}
            <div className={`glass-card p-5 rounded-2xl space-y-3 border ${
              userRoles.isAdmin ? "border-purple-500/50 bg-purple-950/15" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Crown className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  userRoles.isAdmin ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-white/[0.04] text-slate-500 border-white/10"
                }`}>
                  {userRoles.isAdmin ? "Active on You" : "Not Granted"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Protocol Admin</h4>
                <p className="text-[11px] text-slate-400 mt-1">DEFAULT_ADMIN_ROLE</p>
              </div>
              <ul className="text-slate-300 space-y-1.5 text-[11px] pt-2 border-t border-white/[0.06]">
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-purple-400" /><span>Register new authorities</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-purple-400" /><span>Activate / Deactivate roles</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-purple-400" /><span>Set protocol parameters</span></li>
              </ul>
            </div>

            {/* University */}
            <div className={`glass-card p-5 rounded-2xl space-y-3 border ${
              userRoles.isUniversity ? "border-indigo-500/50 bg-indigo-950/15" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  userRoles.isUniversity ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : "bg-white/[0.04] text-slate-500 border-white/10"
                }`}>
                  {userRoles.isUniversity ? "Active on You" : "Not Granted"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">University Authority</h4>
                <p className="text-[11px] text-slate-400 mt-1">UNIVERSITY_ROLE</p>
              </div>
              <ul className="text-slate-300 space-y-1.5 text-[11px] pt-2 border-t border-white/[0.06]">
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-indigo-400" /><span>Issue Soulbound degrees</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-indigo-400" /><span>Revoke fraudulent degrees</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-indigo-400" /><span>Upload IPFS transcript scans</span></li>
              </ul>
            </div>

            {/* Carbon Auditor */}
            <div className={`glass-card p-5 rounded-2xl space-y-3 border ${
              userRoles.isCarbonAuditor ? "border-emerald-500/50 bg-emerald-950/15" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trees className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  userRoles.isCarbonAuditor ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/[0.04] text-slate-500 border-white/10"
                }`}>
                  {userRoles.isCarbonAuditor ? "Active on You" : "Not Granted"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Carbon Auditor</h4>
                <p className="text-[11px] text-slate-400 mt-1">CARBON_AUDITOR_ROLE</p>
              </div>
              <ul className="text-slate-300 space-y-1.5 text-[11px] pt-2 border-t border-white/[0.06]">
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-400" /><span>Mint batch credit batches</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-400" /><span>Attach third-party audit reports</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-400" /><span>Verify methodology & vintage</span></li>
              </ul>
            </div>

            {/* Land Registrar */}
            <div className={`glass-card p-5 rounded-2xl space-y-3 border ${
              userRoles.isLandRegistrar ? "border-sky-500/50 bg-sky-950/15" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  userRoles.isLandRegistrar ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "bg-white/[0.04] text-slate-500 border-white/10"
                }`}>
                  {userRoles.isLandRegistrar ? "Active on You" : "Not Granted"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Cadastral Registrar</h4>
                <p className="text-[11px] text-slate-400 mt-1">LAND_REGISTRAR_ROLE</p>
              </div>
              <ul className="text-slate-300 space-y-1.5 text-[11px] pt-2 border-t border-white/[0.06]">
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-sky-400" /><span>Register cadastral property deeds</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-sky-400" /><span>Place & release mortgage liens</span></li>
                <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-sky-400" /><span>Lock transfers on encumbered land</span></li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form: Register Authority On-Chain */}
            <div className="lg:col-span-1 glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-purple-400" />
                  <span>Register Authority</span>
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  userRoles.isAdmin ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                }`}>
                  {userRoles.isAdmin ? "Admin Access Ready" : "Admin Permission Required"}
                </span>
              </div>

              {!userRoles.isAdmin && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    Only wallets holding <code>DEFAULT_ADMIN_ROLE</code> can submit this transaction on-chain. Standard users can test role pre-fill or view registered institutions.
                  </span>
                </div>
              )}

              {/* Quick Fill for Testing */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Testnet Quick Pre-fill (Connected Wallet):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickAssignSelf("UNIVERSITY_ROLE")}
                    className="text-[10px] px-2 py-1 rounded-lg glass-pill hover:bg-white/10 text-indigo-300 border border-indigo-500/20 transition"
                  >
                    + As University
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAssignSelf("CARBON_AUDITOR_ROLE")}
                    className="text-[10px] px-2 py-1 rounded-lg glass-pill hover:bg-white/10 text-emerald-300 border border-emerald-500/20 transition"
                  >
                    + As Auditor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAssignSelf("LAND_REGISTRAR_ROLE")}
                    className="text-[10px] px-2 py-1 rounded-lg glass-pill hover:bg-white/10 text-sky-300 border border-sky-500/20 transition"
                  >
                    + As Registrar
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegisterAuthority} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Authority Wallet Address</label>
                  <input
                    type="text"
                    value={authorityForm.address}
                    onChange={(e) => setAuthorityForm({ ...authorityForm, address: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white font-mono text-xs"
                    placeholder="0x..."
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Institutional Role</label>
                  <select
                    value={authorityForm.role}
                    onChange={(e) => setAuthorityForm({ ...authorityForm, role: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white text-xs bg-slate-900"
                  >
                    <option value="UNIVERSITY_ROLE">UNIVERSITY_ROLE (Issue Academic Degrees)</option>
                    <option value="CARBON_AUDITOR_ROLE">CARBON_AUDITOR_ROLE (Mint & Verify Carbon Credits)</option>
                    <option value="LAND_REGISTRAR_ROLE">LAND_REGISTRAR_ROLE (Cadastral Land & Liens)</option>
                    <option value="DEFAULT_ADMIN_ROLE">DEFAULT_ADMIN_ROLE (Protocol Admin Privileges)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Institution Legal Name</label>
                  <input
                    type="text"
                    value={authorityForm.name}
                    onChange={(e) => setAuthorityForm({ ...authorityForm, name: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white"
                    placeholder="e.g. Stanford University / National Cadastre"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Jurisdiction</label>
                    <input
                      type="text"
                      value={authorityForm.jurisdiction}
                      onChange={(e) => setAuthorityForm({ ...authorityForm, jurisdiction: e.target.value })}
                      className="glass-input w-full rounded-xl px-3 py-2 text-white"
                      placeholder="e.g. Singapore"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Registration ID</label>
                    <input
                      type="text"
                      value={authorityForm.registrationId}
                      onChange={(e) => setAuthorityForm({ ...authorityForm, registrationId: e.target.value })}
                      className="glass-input w-full rounded-xl px-3 py-2 text-white"
                      placeholder="e.g. REG-UNIV-001"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Official Website</label>
                  <input
                    type="url"
                    value={authorityForm.officialWebsite}
                    onChange={(e) => setAuthorityForm({ ...authorityForm, officialWebsite: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white"
                    placeholder="https://..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-purple-500/20 disabled:opacity-50 mt-2"
                >
                  {txLoading ? "Broadcasting to MST Blockchain..." : "Register Authority On-Chain"}
                </button>
              </form>
            </div>

            {/* List: Registered Authorities Directory */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                    <span>Registered Institutional Authorities On-Chain</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live records verified in <code>AuthorityRegistry.sol</code> on MST Chain.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const { provider } = await getProviderAndSigner();
                    await fetchOnChainData(account, provider);
                  }}
                  className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-300 text-xs flex items-center space-x-1.5 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {authoritiesList.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center text-xs text-slate-400">
                  No institutional authorities loaded from the live contract yet. Register your first authority using the form or connect an authorized wallet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {authoritiesList.map((auth, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                            auth.roleTitle.includes("University")
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                              : auth.roleTitle.includes("Carbon")
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                          }`}>
                            {auth.roleTitle}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            auth.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                          }`}>
                            {auth.isActive ? "● Active" : "○ Inactive"}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white">{auth.name}</h4>
                        <div className="space-y-1 text-xs text-slate-400">
                          <p><span className="text-slate-500">Jurisdiction:</span> {auth.jurisdiction}</p>
                          <p><span className="text-slate-500">Registration ID:</span> <span className="font-mono text-slate-300">{auth.registrationId}</span></p>
                          <p className="truncate"><span className="text-slate-500">Address:</span> <span className="font-mono text-[11px] text-slate-300">{auth.address}</span></p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        {auth.officialWebsite ? (
                          <a
                            href={auth.officialWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-white flex items-center space-x-1 text-[11px] transition font-medium"
                          >
                            <span>Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : <span />}

                        {userRoles.isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleToggleAuthorityStatus(auth.address, auth.isActive)}
                            disabled={txLoading}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                              auth.isActive
                                ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                                : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                            }`}
                          >
                            {auth.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Wallet Connect & Account Management Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        isBridgeKeyDetected={detectBridgeKey(eip6963Providers)}
        isMetaMaskDetected={detectMetaMask(eip6963Providers)}
        onSelectWallet={connectWithWallet}
        activeAccount={account}
        activeWalletType={walletType}
        balance={balance}
        chainId={chainId}
        onDisconnect={disconnectWallet}
        onSwitchNetwork={switchNetwork}
        loading={loading}
      />
    </div>
  );
}
