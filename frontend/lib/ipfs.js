/**
 * IPFS Utilities for MST Multi-Asset Management System
 * Handles IPFS CID parsing, gateway URL formatting, and file/JSON pinning.
 */

// Public IPFS Gateways (fallback order)
export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
];

/**
 * Converts an ipfs:// URI or raw CID into a browser-accessible HTTP gateway URL.
 * @param {string} uri - e.g. "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" or raw CID
 * @param {number} gatewayIndex - gateway index to use
 * @returns {string} - "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
 */
export function getIPFSGatewayUrl(uri, gatewayIndex = 0) {
  if (!uri) return "";
  let cleanCID = uri.trim();
  if (cleanCID.startsWith("ipfs://")) {
    cleanCID = cleanCID.replace("ipfs://", "");
  }
  if (cleanCID.startsWith("https://") || cleanCID.startsWith("http://")) {
    return cleanCID;
  }
  const gateway = IPFS_GATEWAYS[gatewayIndex] || IPFS_GATEWAYS[0];
  return `${gateway}${cleanCID}`;
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
 * Uploads a file to IPFS via the internal Next.js API route.
 * @param {File} file 
 * @param {string} assetType - "CREDENTIAL" | "LAND_DEED" | "CARBON_AUDIT"
 * @returns {Promise<{ cid: string, ipfsUri: string, gatewayUrl: string, fileName: string, size: number }>}
 */
export async function uploadFileToIPFS(file, assetType = "GENERAL") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assetType", assetType);

  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `IPFS upload failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Uploads structured metadata JSON directly to IPFS.
 * @param {object} metadata 
 * @param {string} fileName 
 * @returns {Promise<{ cid: string, ipfsUri: string, gatewayUrl: string }>}
 */
export async function uploadJSONToIPFS(metadata, fileName = "metadata.json") {
  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata, fileName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `IPFS metadata pinning failed with status ${response.status}`);
  }

  return await response.json();
}
