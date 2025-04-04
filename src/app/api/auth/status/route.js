import axios from "axios";
import https from "https";

export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie');

    if (!cookies) {
      return new Response(
        JSON.stringify({ isAuthenticated: false, errorMessage: 'No authentication cookies found.' }),
        { status: 401 }
      );
    }

    const response = await axios.get("https://localhost:7036/api/auth/status", {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    console.log("Response from backend:", response.data);


    return new Response(
      JSON.stringify({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API route:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({ isAuthenticated: false, errorMessage: "Failed to check authentication." }),
      { status: 500 }
    );
  }
}
