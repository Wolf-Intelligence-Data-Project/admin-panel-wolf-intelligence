import axios from 'axios';
import https from 'https';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("Received data:", { email, password });

    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification for local development
    });

    // Forward the login data to the authentication API
    const response = await axios.post('https://localhost:7036/api/auth/login', { email, password }, {
      httpsAgent: agent,
      validateStatus: () => true, // Always resolve response, even for 400/401
    });

    console.log("Backend response:", response.data);

    // Log the role explicitly
    if (response.data.role) {
      console.log("User role received from backend:", response.data.role);
    } else {
      console.warn("No role received from backend.");
    }

    // If the backend includes an HttpOnly cookie in the response, forward it directly to the client
    if (response.headers['set-cookie']) {
      const { message, role } = response.data; // Destructure to get role

      return new Response(
        JSON.stringify({
          success: true,
          message: message || 'Login successful.',
          role: role,  // Send the role to the client
        }),
        {
          status: 200,
          headers: {
            'Set-Cookie': response.headers['set-cookie'], // Forward the HttpOnly cookie directly from backend
          },
        }
      );
    }

    // Handle cases where the backend fails or returns an error
    console.error("Error from backend:", response.data.errorMessage);
    return new Response(
      JSON.stringify({ success: false, errorMessage: response.data.errorMessage }),
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({ success: false, errorMessage: 'An error occurred during login.' }),
      { status: 500 }
    );
  }
}
