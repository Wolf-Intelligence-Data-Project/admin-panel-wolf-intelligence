import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server'; // Import NextResponse to use it for returning responses

export async function GET(req) {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification for local dev only
    });

    const response = await axios.get('https://localhost:7036/api/product/sold-count', {
      withCredentials: true,
      httpsAgent: agent,
    });

    if (response.data) {
      return NextResponse.json({ SoldProducts: response.data.soldProducts }, { status: 200 });
    } else {
      return NextResponse.json({ errorMessage: 'Failed to fetch sold product count' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching sold product count:', error);
    return NextResponse.json({ errorMessage: 'An error occurred while fetching sold product count' }, { status: 500 });
  }
}
