/**
 * BridgeKey Wallet Integration Utilities
 * Native Non-Custodial Multi-Chain Wallet for MST Blockchain
 * Official Website: https://bridgekey.io
 * Developed by Masterstroke Technosoft
 */

export const BRIDGEKEY_CONFIG = {
  name: "BridgeKey Wallet",
  shortName: "BridgeKey",
  tagline: "The Official Native Wallet for MST Blockchain",
  developer: "Masterstroke Technosoft",
  officialUrl: "https://bridgekey.io",
  chromeStoreUrl: "https://chromewebstore.google.com/detail/bridgekey/nphkmbemjllglfkgnhkccogbphljgepm", // Chrome Web Store
  chromeStoreSearchUrl: "https://chromewebstore.google.com/search/BridgeKey",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.masterstroke.bridgekey",
  rdns: "io.bridgekey",
  iconSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><defs><linearGradient id="bkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff3b3b"/><stop offset="50%" stop-color="%23e52e2e"/><stop offset="100%" stop-color="%239D1C1F"/></linearGradient></defs><rect width="40" height="40" rx="10" fill="%230c0a0e"/><rect x="1" y="1" width="38" height="38" rx="9" fill="none" stroke="url(%23bkGrad)" stroke-width="1.5"/><path d="M12 28V12h8a6 6 0 0 1 0 12H12zm4-8h4a2 2 0 1 0 0-4h-4v4zm9 4l4 4h4l-4.5-4.5" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27" cy="15" r="3" fill="%23e52e2e"/></svg>`,
};

/**
 * Detects whether the BridgeKey Wallet extension is installed in the current browser.
 * Checks:
 * 1. window.bridgekey (Dedicated provider)
 * 2. window.ethereum.isBridgeKey
 * 3. Multiple injected providers list (window.ethereum.providers)
 * 4. EIP-6963 announced providers
 */
export function detectBridgeKey(eip6963Providers = []) {
  if (typeof window === "undefined") return false;

  // 1. Dedicated window.bridgekey
  if (typeof window.bridgekey !== "undefined") {
    return true;
  }

  // 2. window.ethereum.isBridgeKey flag
  if (
    window.ethereum &&
    (window.ethereum.isBridgeKey === true ||
      window.ethereum.isBridgekey === true ||
      window.ethereum.bridgekey === true)
  ) {
    return true;
  }

  // 3. EIP-5749 / Multi-injected window.ethereum.providers
  if (window.ethereum && Array.isArray(window.ethereum.providers)) {
    const hasBk = window.ethereum.providers.some(
      (p) => p.isBridgeKey === true || p.isBridgekey === true || p.bridgekey === true
    );
    if (hasBk) return true;
  }

  // 4. EIP-6963 announced providers
  if (Array.isArray(eip6963Providers)) {
    const hasEipBk = eip6963Providers.some((item) => {
      const name = item?.info?.name?.toLowerCase() || "";
      const rdns = item?.info?.rdns?.toLowerCase() || "";
      return name.includes("bridgekey") || rdns.includes("bridgekey");
    });
    if (hasEipBk) return true;
  }

  // 5. If window.ethereum exists in browser, permit connection attempt
  if (typeof window.ethereum !== "undefined") {
    return true;
  }

  return false;
}

/**
 * Resolves the underlying EIP-1193 provider specifically for BridgeKey Wallet.
 */
export function getBridgeKeyProvider(eip6963Providers = []) {
  if (typeof window === "undefined") return null;

  if (typeof window.bridgekey !== "undefined") {
    return window.bridgekey;
  }

  if (
    window.ethereum &&
    (window.ethereum.isBridgeKey === true ||
      window.ethereum.isBridgekey === true ||
      window.ethereum.bridgekey === true)
  ) {
    return window.ethereum;
  }

  if (window.ethereum && Array.isArray(window.ethereum.providers)) {
    const bk = window.ethereum.providers.find(
      (p) => p.isBridgeKey === true || p.isBridgekey === true || p.bridgekey === true
    );
    if (bk) return bk;
  }

  if (Array.isArray(eip6963Providers)) {
    const eipBk = eip6963Providers.find((item) => {
      const name = item?.info?.name?.toLowerCase() || "";
      const rdns = item?.info?.rdns?.toLowerCase() || "";
      return name.includes("bridgekey") || rdns.includes("bridgekey");
    });
    if (eipBk?.provider) return eipBk.provider;
  }

  // Fallback: window.ethereum (BridgeKey injects as window.ethereum in Chromium/Brave)
  return window.ethereum || null;
}

/**
 * Detects whether MetaMask or generic EVM injected wallet is available.
 */
export function detectMetaMask(eip6963Providers = []) {
  if (typeof window === "undefined") return false;

  if (window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isBridgeKey) {
    return true;
  }

  if (window.ethereum && Array.isArray(window.ethereum.providers)) {
    const hasMm = window.ethereum.providers.some(
      (p) => p.isMetaMask === true && !p.isBridgeKey
    );
    if (hasMm) return true;
  }

  if (Array.isArray(eip6963Providers)) {
    const hasEipMm = eip6963Providers.some((item) => {
      const name = item?.info?.name?.toLowerCase() || "";
      const rdns = item?.info?.rdns?.toLowerCase() || "";
      return name.includes("metamask") || rdns.includes("metamask");
    });
    if (hasEipMm) return true;
  }

  return typeof window.ethereum !== "undefined";
}

/**
 * Resolves the underlying EIP-1193 provider for MetaMask.
 */
export function getMetaMaskProvider(eip6963Providers = []) {
  if (typeof window === "undefined") return null;

  if (window.ethereum && Array.isArray(window.ethereum.providers)) {
    const mm = window.ethereum.providers.find(
      (p) => p.isMetaMask === true && !p.isBridgeKey
    );
    if (mm) return mm;
  }

  if (Array.isArray(eip6963Providers)) {
    const eipMm = eip6963Providers.find((item) => {
      const name = item?.info?.name?.toLowerCase() || "";
      const rdns = item?.info?.rdns?.toLowerCase() || "";
      return name.includes("metamask") || rdns.includes("metamask");
    });
    if (eipMm?.provider) return eipMm.provider;
  }

  return window.ethereum || null;
}
