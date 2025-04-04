import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

// Handle GET request to fetch users with pagination
export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie');

    if (!cookies) {
      return NextResponse.json(
        { message: 'No authentication cookies found. Please log in.' },
        { status: 401 } // Unauthorized
      );
    }
    
    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Make the API call to the backend with pagination parameters
    const response = await axios.get('https://localhost:7036/api/admin/get-all', {
      headers: {
        Cookie: cookies,
      },
      withCredentials: true,
      httpsAgent: agent,
    });
    return NextResponse.json({
    Moderators: response.data
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching adminss from backend:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
