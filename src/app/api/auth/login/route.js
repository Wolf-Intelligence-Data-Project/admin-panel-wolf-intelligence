import axios from 'axios';
import https from 'https'; // Import https to create the agent

// Handle POST (login)
export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Parse the incoming JSON body
    console.log("Received data:", { email, password });

    // Configure Axios to ignore SSL certificate errors (for local development only)
    const agent = new https.Agent({
      rejectUnauthorized: false,  // Disable SSL verification
    });

    // Forward the login data to your actual authentication API
    const response = await axios.post('https://localhost:7036/api/auth/login', { email, password }, {
      withCredentials: true, 
      httpsAgent: agent
    });

    console.log("Backend response:", response.data);  // Log the backend response data

    if (response.data.success) {
      // JWT token
      const jwtToken = response.data.jwt;  // Ensure this is properly set and not undefined

      if (!jwtToken) {
        throw new Error('JWT Token is missing');
      }

      // Manually set the cookie header without `cookie` library
      const cookieHeader = `AccessToken=${jwtToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=None; Path=/; Max-Age=3600; Expires=${new Date(Date.now() + 60 * 60 * 1000).toUTCString()}`;

      // Set the JWT token in an HTTP-only cookie using the manual header
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            'Set-Cookie': cookieHeader,
          },
        }
      );
    } else {
      console.error("Error from backend:", response.data.errorMessage);  // Log the error message from backend
      return new Response(
        JSON.stringify({ success: false, errorMessage: response.data.errorMessage }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);  // Log the actual error
    return new Response(
      JSON.stringify({ success: false, errorMessage: 'An error occurred during login.' }),
      { status: 500 }
    );
  }
}
