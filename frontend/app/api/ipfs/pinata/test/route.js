import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const jwt = (body.jwt || request.headers.get("x-pinata-jwt") || process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT || "").trim().replace(/^Bearer\s+/i, "");

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: "No Pinata JWT provided. Please enter your Pinata API JWT token." },
        { status: 400 }
      );
    }

    // 1. Test basic authentication
    const authRes = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!authRes.ok) {
      const errText = await authRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Pinata authentication failed (${authRes.status}): ${errText || "Invalid credentials"}`,
        },
        { status: authRes.status }
      );
    }

    // 2. Check if key has pinning scopes
    const scopeCheck = await fetch("https://api.pinata.cloud/data/userPinnedDataTotal", {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!scopeCheck.ok) {
      const scopeText = await scopeCheck.text();
      if (scopeText.includes("NO_SCOPES_FOUND") || scopeCheck.status === 403) {
        return NextResponse.json({
          success: true,
          authenticated: true,
          hasPinningScope: false,
          message: "Authenticated with Pinata, but this key is missing 'Admin' / Pinning permissions (NO_SCOPES_FOUND). When generating a new key on pinata.cloud/keys, enable 'Admin' or toggle 'pinFileToIPFS'.",
        });
      }
    }

    const data = await authRes.json();
    return NextResponse.json({
      success: true,
      authenticated: true,
      hasPinningScope: true,
      message: data.message || "Connected to Pinata IPFS Cloud with full Pinning permissions!",
    });
  } catch (err) {
    console.error("Pinata Test Auth Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to reach Pinata API" },
      { status: 500 }
    );
  }
}
