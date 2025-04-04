import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

// Handle POST request to add moderator
export async function POST(req) {
  try {
    const cookies = req.headers.get('cookie');
    const newModerator = await req.json(); // Extract the moderator data from the request body

    if (!cookies) {
        return NextResponse.json(
          { message: 'No authentication cookies found. Please log in.' },
          { status: 401 } // Unauthorized
        );
      }
    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false, // Bypass SSL verification for self-signed certificates
    });

    // Make the POST request to the backend API with the moderator data
    const response = await axios.post(
      'https://localhost:7036/api/admin/add-mod', 
      newModerator, // Send the moderator data directly
      {
        headers: {
          Cookie: cookies, // Pass the cookies for session tracking
        },
        withCredentials: true,
        httpsAgent: agent, // Set the custom HTTPS agent to bypass SSL verification
      }
    );

    // Return the response data as JSON
    return NextResponse.json({
      Moderators: response.data, // Assuming the response contains the list of moderators
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching adminss from backend:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
