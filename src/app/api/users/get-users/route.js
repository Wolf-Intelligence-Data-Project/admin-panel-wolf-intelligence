import axios from "axios";
import https from "https";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    if (!body.SearchQuery) {
      return NextResponse.json(
        { message: "Missing search query" },
        { status: 400 }
      );
    }

    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
      // Make the API call to the backend
      const response = await axios.post(
        "https://localhost:7036/api/user/get-users",
        { SearchQuery: body.SearchQuery },
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.get("cookie"),
          },
          withCredentials: true,
          httpsAgent: agent,
        }
      );

      return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("User not found, returning empty array.");
        return NextResponse.json([], { status: 200 }); // ✅ Return an empty array instead of error
      }

      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error in API call:", error);
    return NextResponse.json(
      { message: "Failed to fetch the user", error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
