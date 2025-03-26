import axios from "axios";
import https from "https";

export async function GET(req) {
  try {
    // Get the cookies from the incoming request (from client-side)
    const cookies = req.headers.get('cookie'); // Get the cookies from the incoming request

    // Forward the request to the ASP.NET backend with cookies
    const response = await axios.get("https://localhost:7036/api/auth/status", {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,  // Forward the cookies explicitly
      },
      withCredentials: true, // This is still needed to ensure credentials are sent properly
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // For local development only
      }),
    });

    console.log("Backend response:", response.data);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({ isAuthenticated: false, errorMessage: "Failed to check authentication." }),
      { status: 500 }
    );
  }
}
