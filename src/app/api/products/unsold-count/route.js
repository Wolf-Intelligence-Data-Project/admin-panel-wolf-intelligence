import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server'; // Import NextResponse to use it for returning responses

export async function GET(req) {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification for local dev only
    });

    const response = await axios.get('https://localhost:7036/api/product/unsold-count', {
      withCredentials: true,
      httpsAgent: agent,
    });

    if (response.data) {
      return NextResponse.json({ UnsoldProducts: response.data.unsoldProducts }, { status: 200 });
    } else {
      return NextResponse.json({ errorMessage: 'Failed to fetch unsold product count' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching unsold product count:', error);
    return NextResponse.json({ errorMessage: 'An error occurred while fetching unsold product count' }, { status: 500 });
  }
}
