// File: frontend/app/api/ipfs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

export async function POST(request: NextRequest) {
  // Sabse pehle environment variables ko check karo
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;

  // Agar keys nahi hain, to saaf error do
  if (!apiKey || !apiSecret) {
    console.error("🔴 Pinata API Key or Secret is missing in .env.local file");
    return NextResponse.json({ message: "Server configuration error: Missing Pinata credentials." }, { status: 500 });
  }

  const pinata = new pinataSDK({ pinataApiKey: apiKey, pinataSecretApiKey: apiSecret });

  try {
    const body = await request.json();
    
    console.log("✅ Received request body for IPFS upload:", body);

    const options = {
      pinataMetadata: {
        name: `OracleBet Market - ${new Date().toISOString()}`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const result = await pinata.pinJSONToIPFS(body, options as any);
    
    console.log("✅ IPFS upload successful! Result:", result);

    return NextResponse.json({ ipfsHash: result.IpfsHash }, { status: 200 });

  } catch (error: any) {
    console.error("🔴 IPFS Upload Error:", error);
    // Pinata ke error ko aache se dikhao
    const errorMessage = error.response?.data?.error || error.message || "An unknown error occurred";
    return NextResponse.json({ message: 'Error uploading to IPFS', error: errorMessage }, { status: 500 });
  }
}