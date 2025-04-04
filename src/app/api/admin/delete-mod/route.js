import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

// Handle DELETE request to remove a moderator
export async function DELETE(req) {
  try {
    const cookies = req.headers.get('cookie');
    const { adminId } = await req.json(); // Extract adminId from the body

    // If there are no cookies, return an error response without sending the request
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

    // Send the DELETE request to your backend API
    const response = await axios.delete(
      'https://localhost:7036/api/admin/delete-mod',
      {
        headers: {
          Cookie: cookies, // Pass the cookies for session tracking
        },
        withCredentials: true,
        httpsAgent: agent, // Set the custom HTTPS agent to bypass SSL verification
        data: { adminId }, // Send adminId in the request body
      }
    );

    // Return the updated list of moderators (assuming response contains that)
    return NextResponse.json(
      { message: 'Moderator har tagits bort.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting moderator:', error);
    return NextResponse.json(
      { message: 'Failed to delete moderator', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
