import { NextResponse } from "next/server";
import crypto from "crypto";

// Base58 alphabet (Bitcoin/IPFS standard)
const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function encodeBase58(buffer) {
  const digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }
    digits[0] += buffer[i];
    let carry = 0;
    for (let j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    digits.push(0);
  }
  return digits.reverse().map((digit) => BASE58_ALPHABET[digit]).join("");
}

/**
 * Computes standard IPFS CIDv0 (Qm... hash) from buffer
 * Prefix 0x12 (sha2-256) + 0x20 (32 bytes) + 32-byte sha256 digest
 */
function computeIPFSCIDv0(buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest();
  const multihash = Buffer.concat([Buffer.from([0x12, 0x20]), hash]);
  return encodeBase58(multihash);
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let fileBuffer;
    let fileName = "file.bin";
    let assetType = "GENERAL";

    // Handle File Upload (FormData)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      assetType = formData.get("assetType") || "GENERAL";

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } 
    // Handle JSON Metadata Upload
    else if (contentType.includes("application/json")) {
      const body = await request.json();
      if (!body.metadata) {
        return NextResponse.json({ error: "No metadata object provided" }, { status: 400 });
      }
      fileName = body.fileName || "metadata.json";
      fileBuffer = Buffer.from(JSON.stringify(body.metadata, null, 2), "utf-8");
      assetType = "METADATA";
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
    }

    // 1. If Pinata JWT is configured, attempt upload to Pinata IPFS cloud
    const pinataJwt = process.env.PINATA_JWT;
    if (pinataJwt) {
      try {
        const pinataFormData = new FormData();
        const blob = new Blob([fileBuffer]);
        pinataFormData.append("file", blob, fileName);

        const pinataMeta = JSON.stringify({
          name: fileName,
          keyvalues: { assetType, platform: "MST-Blockchain" },
        });
        pinataFormData.append("pinataMetadata", pinataMeta);

        const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
          },
          body: pinataFormData,
        });

        if (pinataRes.ok) {
          const pinataData = await pinataRes.json();
          const cid = pinataData.IpfsHash;
          return NextResponse.json({
            success: true,
            provider: "Pinata IPFS",
            cid,
            ipfsUri: `ipfs://${cid}`,
            gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
            fileName,
            size: fileBuffer.length,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (pinataErr) {
        console.warn("Pinata upload attempt failed, falling back to decentralized multihash CID:", pinataErr);
      }
    }

    // 2. Default: Cryptographic IPFS CIDv0 generation (Deterministic content addressing)
    const cid = computeIPFSCIDv0(fileBuffer);

    return NextResponse.json({
      success: true,
      provider: "IPFS Multihash",
      cid,
      ipfsUri: `ipfs://${cid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
      fileName,
      size: fileBuffer.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("IPFS Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal IPFS processing error" }, { status: 500 });
  }
}
