"use client";

import React, { useState } from "react";
import {
  Wallet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  ChevronRight,
  Zap,
  Globe,
  Flame,
  Copy,
  Check,
  Power,
  RefreshCw,
  Layers,
  ArrowRight,
} from "lucide-react";
import { BRIDGEKEY_CONFIG } from "../lib/bridgekey";
import { MST_NETWORKS } from "../lib/contracts";

export default function WalletConnectModal({
  isOpen,
  onClose,
  isBridgeKeyDetected,
  isMetaMaskDetected,
  onSelectWallet,
  activeAccount,
  activeWalletType,
  balance,
  chainId,
  onDisconnect,
  onSwitchNetwork,
  loading,
}) {
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  if (!isOpen) return null;

  function copyAddress() {
    if (!activeAccount) return;
    navigator.clipboard.writeText(activeAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isTestnet = chainId === MST_NETWORKS.testnet.chainIdDecimal;
  const isMainnet = chainId === MST_NETWORKS.mainnet.chainIdDecimal;
  const isCorrectMST = isTestnet || isMainnet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg glass-panel rounded-3xl border border-red-500/25 bg-[#0e0c14]/95 p-6 md:p-8 shadow-2xl shadow-red-950/50 space-y-6 overflow-hidden">
        {/* Subtle Ambient Top Radial Glow */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>MST Blockchain Gateway</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {activeAccount ? "Connected Wallet" : "Connect Web3 Wallet"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeAccount
                ? "Manage your active session and on-chain network configuration."
                : "Select your wallet to interact with the Universal Multi-Asset Platform."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl glass-pill transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* ======================================================== */}
        {/* 1. STATE: ALREADY CONNECTED */}
        {/* ======================================================== */}
        {activeAccount ? (
          <div className="space-y-4">
            {/* Active Provider Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#9D1C1F] via-[#e52e2e] to-[#ff3b3b] p-[1px] flex items-center justify-center shadow-lg shadow-red-600/20">
                    <div className="h-full w-full rounded-[11px] bg-[#0c0a0e] flex items-center justify-center font-bold text-xs text-white">
                      {activeWalletType === "bridgekey" ? "BK" : "MM"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-white">
                        {activeWalletType === "bridgekey" ? "BridgeKey Wallet" : "MetaMask"}
                      </span>
                      {activeWalletType === "bridgekey" && (
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.2 rounded-full">
                          Official
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active Session</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    MST Balance
                  </span>
                  <span className="text-sm font-black text-[#ff4d4d] flex items-center space-x-1">
                    <Flame className="h-3.5 w-3.5 text-[#ff3b3b]" />
                    <span>{parseFloat(balance || "0").toFixed(3)} MSTC</span>
                  </span>
                </div>
              </div>

              {/* Monospace Address with Copy */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                <span className="text-slate-300 truncate max-w-[260px]">{activeAccount}</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5 shrink-0"
                  title="Copy full address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400 font-sans">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-sans">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Network Verification & Switcher */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Globe className="h-3.5 w-3.5 text-red-400" />
                  <span>MST Blockchain Network</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isCorrectMST
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {isTestnet
                    ? "MST Testnet (Chain 4545)"
                    : isMainnet
                    ? "MST Mainnet (Chain 4646)"
                    : `Unsupported Chain (${chainId})`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onSwitchNetwork("testnet")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                    isTestnet
                      ? "bg-red-500/20 text-white border-red-500/50 shadow-md shadow-red-600/20"
                      : "glass-pill text-slate-300 hover:text-white"
                  }`}
                >
                  <span>Switch Testnet</span>
                </button>
                <button
                  onClick={() => onSwitchNetwork("mainnet")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                    isMainnet
                      ? "bg-red-500/20 text-white border-red-500/50 shadow-md shadow-red-600/20"
                      : "glass-pill text-slate-300 hover:text-white"
                  }`}
                >
                  <span>Switch Mainnet</span>
                </button>
              </div>
            </div>

            {/* Action Buttons: Disconnect / Change Wallet */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`${
                  isTestnet
                    ? MST_NETWORKS.testnet.blockExplorerUrls[0]
                    : MST_NETWORKS.mainnet.blockExplorerUrls[0]
                }/address/${activeAccount}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-400 hover:underline flex items-center space-x-1"
              >
                <span>View on MST Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                onClick={onDisconnect}
                className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center space-x-1.5 transition"
              >
                <Power className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. STATE: SELECT WALLET (DISCONNECTED) */
          /* ======================================================== */
          <div className="space-y-4">
            {/* OPTION 1: BridgeKey Wallet (FEATURED & OFFICIAL) */}
            <div
              onClick={() => {
                if (isBridgeKeyDetected) {
                  onSelectWallet("bridgekey");
                } else {
                  setShowInstallGuide(true);
                }
              }}
              className="relative group p-4 rounded-2xl border border-red-500/35 bg-gradient-to-r from-red-950/25 via-[#160d13] to-[#0f0b12] hover:border-red-500/70 cursor-pointer transition-all duration-300 shadow-lg shadow-red-950/40 hover:shadow-red-600/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  {/* Holographic BK Logo */}
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#9D1C1F] via-[#e52e2e] to-[#ff4d4d] p-[1.5px] shadow-lg shadow-red-600/30 shrink-0 group-hover:scale-105 transition-transform">
                    <div className="h-full w-full rounded-[14px] bg-[#0c0a0e] flex items-center justify-center font-black text-sm text-white">
                      <span className="text-white">B</span>
                      <span className="text-[#ff3b3b]">K</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-base text-white tracking-tight">
                        BridgeKey Wallet
                      </h4>
                      <span className="text-[10px] font-extrabold tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full uppercase shadow-sm">
                        ⭐ Official Native MST
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Native MST Blockchain gateway by Masterstroke Technosoft. Supports 95+ EVM chains.
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 text-right pt-1">
                  {isBridgeKeyDetected ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Detected</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                      <Download className="h-3 w-3" />
                      <span>Install</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-features pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06] text-[10px] font-medium text-slate-400">
                <span className="bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">Instant MST Setup</span>
                <span className="bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">Non-Custodial</span>
                <span className="bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">Biometrics & Hardware</span>
                <span className="text-red-400 ml-auto font-bold flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
                  <span>Connect</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* OPTION 2: MetaMask & General EVM Wallet */}
            <div
              onClick={() => onSelectWallet("metamask")}
              className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                    🦊
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">MetaMask / EVM Browser Wallet</h4>
                      <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Injected
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Standard EVM browser extension provider.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isMetaMaskDetected ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Not Installed</span>
                  )}
                </div>
              </div>
            </div>

            {/* BridgeKey Download & Guidance Drawer */}
            {showInstallGuide && !isBridgeKeyDetected && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900/80 to-[#0e0c14] border border-red-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-red-400" />
                    <span className="font-extrabold text-xs text-white">
                      Install BridgeKey Extension to Continue
                    </span>
                  </div>
                  <button
                    onClick={() => setShowInstallGuide(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  BridgeKey is the dedicated gateway for the MST Blockchain. Install it in seconds from the Chrome Web Store or download the mobile app:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={BRIDGEKEY_CONFIG.chromeStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mst-btn-primary px-3 py-2 text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/30"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Chrome Extension</span>
                  </a>

                  <a
                    href={BRIDGEKEY_CONFIG.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-pill px-3 py-2 text-xs flex items-center justify-center space-x-1.5 text-slate-200 hover:text-white"
                  >
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Visit bridgekey.io</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Already installed?</span>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-red-400 hover:underline font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Refresh Detection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Note */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Non-Custodial • 100% On-Chain</span>
          </span>
          <a
            href="https://mstblockchain.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-red-400 transition flex items-center space-x-1"
          >
            <span>Official MST Network</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
