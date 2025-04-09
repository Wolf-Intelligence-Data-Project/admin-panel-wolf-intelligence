import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const cookies = req.headers.get('cookie');  // Get cookies from the request headers
    
    // Read request body as JSON
    const { query, pageNumber, pageSize } = await req.json();  // Ensure it's parsed as JSON from body

    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification for local dev
    });

    // Forward the request to the backend API
    const response = await axios.post('https://localhost:7036/api/order/search', {
      query, 
      pageNumber, 
      pageSize, // Include these directly in the body, not as params
    }, {
      headers: { Cookie: cookies },  // Forward cookies for session/authentication
      withCredentials: true,         // Ensure credentials are sent along with the request
      httpsAgent: agent,             // Use the custom HTTPS agent to avoid SSL issues
    });

    // Return the filtered orders with proper pagination info
    return NextResponse.json({
      Orders: response.data.orders,  // Assuming the response is { orders: [...], totalCount: ... }
      TotalCount: response.data.totalCount,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching orders from backend:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: error.message },
      { status: error.response?.status || 500 }  // Return appropriate error status
    );
  }
}
