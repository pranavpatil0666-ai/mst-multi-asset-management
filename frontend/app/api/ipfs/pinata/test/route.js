import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const jwt = body.jwt || request.headers.get("x-pinata-jwt") || process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: "No Pinata JWT provided. Please enter your Pinata API JWT token." },
        { status: 400 }
      );
    }

    const cleanJwt = jwt.trim().replace(/^Bearer\s+/i, "");

    const pinataRes = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanJwt}`,
      },
    });

    if (!pinataRes.ok) {
      const errText = await pinataRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Pinata authentication failed (${pinataRes.status}): ${errText || "Unauthorized token"}`,
        },
        { status: pinataRes.status }
      );
    }

    const data = await pinataRes.json();
    return NextResponse.json({
      success: true,
      message: data.message || "Connected to Pinata IPFS Cloud successfully!",
    });
  } catch (err) {
    console.error("Pinata Test Auth Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to reach Pinata API" },
      { status: 500 }
    );
  }
}
