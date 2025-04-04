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
    const response = await axios.get('https://localhost:7036/api/user/get-all', {
      params: {
        pageNumber,
        pageSize,
      },
      headers: {
        Cookie: cookies,
      },
      withCredentials: true,
      httpsAgent: agent,
    });

    console.log("Fetched Users from Backend:", response.data);

   // Calculate totalPages based on the totalCount returned by the backend
    const totalCount = response.data.totalCount;
    const companyAccountsCount = response.data.companyCount;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Calculate the percentage of companies
    const companyAccountsPercentage = totalCount > 0 ? (companyAccountsCount / totalCount) * 100 : 0;
    const privateAccountsPercentage = totalCount > 0 ? 100 - companyAccountsPercentage : 0;
    const privateAccountsCount = totalCount - companyAccountsCount;
    // Return the users, total count, total pages, and company percentage

    console.log('THIS MANY COMPANIES', companyAccountsCount);
    return NextResponse.json({
    Users: response.data.users,
    TotalCount: totalCount,
    TotalPages: totalPages,
    CompanyAccountsPercentage: companyAccountsPercentage.toFixed(2), // Format to 2 decimal places
    PrivateAccountsPercentage: privateAccountsPercentage,
    CompanyAccountsCount: companyAccountsCount,
    PrivateAccountsCount: privateAccountsCount
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users from backend:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
