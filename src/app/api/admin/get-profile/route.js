import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

// Handle GET request to fetch profile
export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie');

    if (!cookies) {
      console.warn("No cookies found.");
      return NextResponse.json(
        { message: 'No authentication cookies found. Please log in.' },
        { status: 401 }
      );
    }

    // Bypass SSL verification for localhost development
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    console.log("Sending request to backend...");

    const response = await axios.get(
      'https://localhost:7036/api/profile/get-profile',
      {
        headers: {
          Cookie: cookies,
        },
        withCredentials: true,
        httpsAgent: agent,
      }
    );

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", response.data);

    return NextResponse.json(
      {
        Moderator: response.data,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching profile from backend:", error.message);

    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }

    return NextResponse.json(
      {
        message: 'Failed to fetch users',
        error: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
