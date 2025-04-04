import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

// Handle GET request to fetch users with pagination
export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie');
    const url = new URL(req.url);
    const pageNumber = parseInt(url.searchParams.get('pageNumber') || '1', 10);  // Default to 1 if not specified
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);     // Default to 10 if not specified

    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Make the API call to the backend with pagination parameters
    const response = await axios.get('https://localhost:7036/api/order/get-all', {
        params: { pageNumber, pageSize },
        headers: { Cookie: cookies },
        withCredentials: true,
        httpsAgent: agent,
      });
      
      // Return the data with proper pagination info
      return NextResponse.json({
        Orders: response.data.orders,
      }, { status: 200 });
      
      

  } catch (error) {
    console.error('Error fetching orders from backend:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
