/**
 * IPFS & Pinata Utilities for MST Multi-Asset Management System
 * Handles IPFS CID parsing, Pinata cloud pinning, and decentralized gateway resolution.
 */

// Public & Pinata IPFS Gateways (Pinata first)
export const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
];

const PINATA_STORAGE_KEY_JWT = "mst_pinata_jwt";
const PINATA_STORAGE_KEY_GATEWAY = "mst_pinata_gateway";

/**
 * Retrieve saved Pinata configuration from localStorage
 */
export function getPinataConfig() {
  if (typeof window === "undefined") {
    return {
      jwt: process.env.NEXT_PUBLIC_PINATA_JWT || "",
      gateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud",
    };
  }
  return {
    jwt: localStorage.getItem(PINATA_STORAGE_KEY_JWT) || process.env.NEXT_PUBLIC_PINATA_JWT || "",
    gateway: localStorage.getItem(PINATA_STORAGE_KEY_GATEWAY) || process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud",
  };
}

/**
 * Save Pinata configuration to localStorage
 */
export function savePinataConfig({ jwt, gateway }) {
  if (typeof window === "undefined") return;
  if (jwt !== undefined) {
    if (jwt) localStorage.setItem(PINATA_STORAGE_KEY_JWT, jwt.trim());
    else localStorage.removeItem(PINATA_STORAGE_KEY_JWT);
  }
  if (gateway !== undefined) {
    let clean = gateway.trim().replace(/^https?:\/\//, "").replace(/\/ipfs\/?$/, "").replace(/\/+$/, "");
    if (clean) localStorage.setItem(PINATA_STORAGE_KEY_GATEWAY, clean);
    else localStorage.removeItem(PINATA_STORAGE_KEY_GATEWAY);
  }
}

/**
 * Test Pinata Authentication
 * @param {string} jwt 
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function testPinataAuth(jwt) {
  try {
    const res = await fetch("/api/ipfs/pinata/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err.message || "Network error connecting to Pinata" };
  }
}

/**
 * Converts an ipfs:// URI or raw CID into a browser-accessible HTTP gateway URL.
 * Prioritizes Pinata Dedicated / Public gateway.
 * @param {string} uri - e.g. "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" or raw CID
 * @returns {string} - "https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
 */
export function getIPFSGatewayUrl(uri) {
  if (!uri) return "";
  let cleanCID = uri.trim();
  if (cleanCID.startsWith("ipfs://")) {
    cleanCID = cleanCID.replace("ipfs://", "");
  }
  if (cleanCID.startsWith("https://") || cleanCID.startsWith("http://")) {
    return cleanCID;
  }

  const { gateway } = getPinataConfig();
  if (gateway) {
    const cleanGw = gateway.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `https://${cleanGw}/ipfs/${cleanCID}`;
  }

  return `${IPFS_GATEWAYS[0]}${cleanCID}`;
}

/**
 * Truncates an IPFS CID or URI for clean UI display.
 * @param {string} uri 
 * @returns {string} - e.g. "ipfs://QmXo...6uco"
 */
export function formatIPFSDisplay(uri) {
  if (!uri) return "No IPFS record";
  if (uri.length <= 20) return uri;
  return `${uri.slice(0, 12)}...${uri.slice(-6)}`;
}

/**
 * Uploads a file to Pinata IPFS via internal Next.js API route.
 * @param {File} file 
 * @param {string} assetType - "CREDENTIAL" | "LAND_DEED" | "CARBON_AUDIT"
 * @returns {Promise<{ cid: string, ipfsUri: string, gatewayUrl: string, fileName: string, size: number, provider: string }>}
 */
export async function uploadFileToIPFS(file, assetType = "GENERAL") {
  const { jwt, gateway } = getPinataConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assetType", assetType);

  const headers = {};
  if (jwt) headers["x-pinata-jwt"] = jwt;
  if (gateway) headers["x-pinata-gateway"] = gateway;

  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Pinata IPFS upload failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Uploads structured metadata JSON directly to Pinata IPFS.
 * @param {object} metadata 
 * @param {string} fileName 
 * @returns {Promise<{ cid: string, ipfsUri: string, gatewayUrl: string, provider: string }>}
 */
export async function uploadJSONToIPFS(metadata, fileName = "metadata.json") {
  const { jwt, gateway } = getPinataConfig();
  const headers = {
    "Content-Type": "application/json",
  };
  if (jwt) headers["x-pinata-jwt"] = jwt;
  if (gateway) headers["x-pinata-gateway"] = gateway;

  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers,
    body: JSON.stringify({ metadata, fileName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Pinata IPFS metadata pinning failed with status ${response.status}`);
  }

  return await response.json();
}
