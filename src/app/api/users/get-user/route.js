import axios from "axios";
import https from "https";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();

    // Ensure 'UserId' is in the body, otherwise return an error
    if (!body.UserId) {
      return NextResponse.json(
        { message: "Missing UserId" },
        { status: 400 }
      );
    }

    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
      // Make the API call to get user details from the backend service
      const response = await axios.post(
        "https://localhost:7036/api/user/get-user-details",
        { SearchQuery: body.UserId },
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.get("cookie"), // Pass cookies for authentication
          },
          withCredentials: true,  // Include cookies in the request
          httpsAgent: agent, // For local development, bypass SSL certificate verification
        }
      );

      // Return the user data if found
      return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
      // If the user isn't found, return an empty object instead of an error
      if (error.response?.status === 404) {
        console.warn("User not found, returning empty object.");
        return NextResponse.json({}, { status: 200 }); // Return an empty object if no user found
      }

      // For other errors, throw the error to be handled by the outer try-catch
      throw error;
    }
  } catch (error) {
    console.error("Error in API call:", error);
    // Return a generic error message if something went wrong
    return NextResponse.json(
      { message: "Failed to fetch the user", error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
