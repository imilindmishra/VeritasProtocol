// File: frontend/app/api/casts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

export async function GET(request: NextRequest) {
  const neynarClient = new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY! });
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ message: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const data = await neynarClient.fetchFeed({
      feedType: 'filter',
      filterType: 'parent_url',
      parentUrl: url,
      limit: 100,
      withRecasts: false,
    });
    return NextResponse.json(data.casts, { status: 200 });
  } catch (error: any) {
    // Neynar 404 bhejta hai agar koi cast na ho
    if (error.response?.status === 404) {
      return NextResponse.json([], { status: 200 }); // Empty array bhejo
    }
    return NextResponse.json({ message: 'Error fetching casts', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const neynarClient = new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY! });
  const body = await request.json();
  const { signerUuid, text, parentUrl } = body;

  if (!signerUuid || !text || !parentUrl) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const cast = await neynarClient.publishCast({
      signerUuid,
      text,
      embeds: [{ url: parentUrl }],
    });
    return NextResponse.json(cast, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error posting cast', error: error.message }, { status: 500 });
  }
}