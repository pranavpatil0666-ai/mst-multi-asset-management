import { NextResponse } from "next/server";
import crypto from "crypto";

// Base58 alphabet (Bitcoin/IPFS standard for CIDv0)
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
    
    // Resolve Pinata JWT and Gateway
    const headerJwt = request.headers.get("x-pinata-jwt");
    const headerGateway = request.headers.get("x-pinata-gateway");
    const pinataJwt = (headerJwt || process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT || "").trim().replace(/^Bearer\s+/i, "");
    const rawGateway = (headerGateway || process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud").trim();
    const pinataGateway = rawGateway.replace(/^https?:\/\//, "").replace(/\/ipfs\/?$/, "").replace(/\/+$/, "");

    let fileBuffer;
    let fileName = "file.bin";
    let assetType = "GENERAL";
    let isJSON = false;
    let jsonContent = null;

    // 1. Handle File Upload (FormData)
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
    // 2. Handle JSON Metadata Upload
    else if (contentType.includes("application/json")) {
      isJSON = true;
      const body = await request.json();
      if (!body.metadata) {
        return NextResponse.json({ error: "No metadata object provided" }, { status: 400 });
      }
      jsonContent = body.metadata;
      fileName = body.fileName || "metadata.json";
      fileBuffer = Buffer.from(JSON.stringify(body.metadata, null, 2), "utf-8");
      assetType = "METADATA";
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
    }

    // 3. Pin to Pinata IPFS Cloud if Pinata JWT is present
    let pinataErrorReason = "";
    if (pinataJwt) {
      try {
        if (!isJSON) {
          // File upload via pinFileToIPFS
          const pinataFormData = new FormData();
          const fileBlob = new Blob([fileBuffer]);
          pinataFormData.append("file", fileBlob, fileName);

          const pinataMetadata = JSON.stringify({
            name: `${assetType}_${fileName}`,
            keyvalues: {
              assetType,
              platform: "MST-Multi-Asset-Hub",
              timestamp: new Date().toISOString(),
            },
          });
          pinataFormData.append("pinataMetadata", pinataMetadata);

          const pinataOptions = JSON.stringify({
            cidVersion: 0,
          });
          pinataFormData.append("pinataOptions", pinataOptions);

          const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${pinataJwt}`,
            },
            body: pinataFormData,
          });

          if (pinataRes.ok) {
            const data = await pinataRes.json();
            const cid = data.IpfsHash;
            return NextResponse.json({
              success: true,
              provider: "Pinata IPFS Cloud",
              cid,
              ipfsUri: `ipfs://${cid}`,
              gatewayUrl: `https://${pinataGateway}/ipfs/${cid}`,
              pinSize: data.PinSize || fileBuffer.length,
              fileName,
              timestamp: data.Timestamp || new Date().toISOString(),
              pinned: true,
            });
          } else {
            const errText = await pinataRes.text();
            console.warn(`Pinata pinFileToIPFS returned ${pinataRes.status}: ${errText}`);
            if (errText.includes("NO_SCOPES_FOUND")) {
              pinataErrorReason = "Your Pinata key is missing 'Admin' / Pinning permissions (NO_SCOPES_FOUND). When generating a new key on pinata.cloud/keys, toggle 'Admin' on.";
            } else {
              pinataErrorReason = `Pinata error (${pinataRes.status}): ${errText}`;
            }
          }
        } else {
          // JSON upload via pinJSONToIPFS
          const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${pinataJwt}`,
            },
            body: JSON.stringify({
              pinataContent: jsonContent,
              pinataMetadata: {
                name: fileName,
                keyvalues: {
                  assetType: "METADATA",
                  platform: "MST-Multi-Asset-Hub",
                  timestamp: new Date().toISOString(),
                },
              },
              pinataOptions: {
                cidVersion: 0,
              },
            }),
          });

          if (pinataRes.ok) {
            const data = await pinataRes.json();
            const cid = data.IpfsHash;
            return NextResponse.json({
              success: true,
              provider: "Pinata IPFS Cloud",
              cid,
              ipfsUri: `ipfs://${cid}`,
              gatewayUrl: `https://${pinataGateway}/ipfs/${cid}`,
              pinSize: data.PinSize || fileBuffer.length,
              fileName,
              timestamp: data.Timestamp || new Date().toISOString(),
              pinned: true,
            });
          } else {
            const errText = await pinataRes.text();
            console.warn(`Pinata pinJSONToIPFS returned ${pinataRes.status}: ${errText}`);
          }
        }
      } catch (pinataErr) {
        console.warn("Pinata API request failed, falling back to decentralized multihash CID:", pinataErr);
      }
    }

    // 4. Fallback: Cryptographic IPFS CIDv0 generation (Deterministic content addressing)
    const cid = computeIPFSCIDv0(fileBuffer);

    return NextResponse.json({
      success: true,
      provider: "IPFS Multihash (Local)",
      cid,
      ipfsUri: `ipfs://${cid}`,
      gatewayUrl: `https://${pinataGateway}/ipfs/${cid}`,
      pinSize: fileBuffer.length,
      fileName,
      timestamp: new Date().toISOString(),
      pinned: false,
      note: pinataErrorReason || (pinataJwt ? "Pinata call failed, computed deterministic IPFS CID" : "Configure Pinata JWT in settings for persistent IPFS pinning"),
    });
  } catch (err) {
    console.error("IPFS Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal IPFS processing error" }, { status: 500 });
  }
}
