import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    // Extract the body from the request
    const { userId, adminNote } = await req.json(); // This will extract userId and adminNote

    if (!userId || !adminNote) {
      return NextResponse.json(
        { message: 'Missing userId or adminNote' },
        { status: 400 }
      );
    }

    // Create an HTTPS agent to bypass SSL verification for local development (if needed)
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Make the API call to the backend with userId and adminNote
    const response = await axios.patch('https://localhost:7036/api/user/update-note', {
      userId, // Send userId in the request body
      adminNote, // Send adminNote in the request body
    }, {
      headers: {
        Cookie: req.headers.get('cookie'), // Forward the cookies for authentication
      },
      withCredentials: true, // Enable credentials to be sent with the request
      httpsAgent: agent, // Use the custom HTTPS agent
    });

    console.log('Response from backend:', response.data);

    // If the request is successful, return the updated note
    if (response.status === 200) {
      return NextResponse.json({ updatedNote: response.data.updatedNote }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed to update admin note' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in API call:', error);
    return NextResponse.json(
      { message: 'Failed to update note', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
