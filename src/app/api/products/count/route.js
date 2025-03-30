import axios from 'axios';
import https from 'https'; 
import { NextResponse } from 'next/server'; 

// Handle GET (fetch product counts)
export async function GET(req) {
  try {
    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification (for local dev only)
    });

    // Make the API call to the backend
    const response = await axios.get('https://localhost:7036/api/product/count', {
      withCredentials: true, // Include credentials if needed
      httpsAgent: agent,     // Use the agent to handle SSL issues in local dev
    });

    console.log("Backend response:", response.data);

    // Check if the response contains data
    if (response.data) {
      const { totalProductsCount, unsoldProductsCount, soldProductsCount } = response.data;
      
      // Calculate percentages with one decimal place
      const unsoldPercentage = totalProductsCount > 0 
          ? parseFloat(((unsoldProductsCount / totalProductsCount) * 100)) 
          : 0;

      const soldPercentage = totalProductsCount > 0 
          ? parseFloat(((soldProductsCount / totalProductsCount) * 100)) 
          : 0;  
      return NextResponse.json(
        {
          totalProductsCount,
          unsoldProductsCount,
          unsoldPercentage,
          soldProductsCount,
          soldPercentage,
        }, 
        { status: 200 }
      );
    } else {
      console.error("Unexpected backend response:", response.data);
      return NextResponse.json({ errorMessage: 'Failed to fetch product counts' }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching product counts:", error);
    return NextResponse.json({ errorMessage: 'An error occurred while fetching product counts' }, { status: 500 });
  }
}