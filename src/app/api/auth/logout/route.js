import axios from "axios";
import https from "https";

export async function DELETE(req) {
  try {
    const cookies = req.headers.get("cookie"); // ✅ Get cookies from request

    const response = await axios.delete("https://localhost:7036/api/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies, // ✅ Forward cookies explicitly
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // ❌ Remove this in production
      }),
    });

    if (response.status !== 200) {
      throw new Error(response.data?.message || "Logout failed.");
    }

    console.log("✅ User successfully logged out.");

    // Clear the cookie
    return new Response(
      JSON.stringify({ success: true, message: "Successfully logged out." }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `AccessToken=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0; Expires=${new Date(0).toUTCString()}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Logout Error:", error.response?.data || error.message);

    return new Response(
      JSON.stringify({ success: false, message: "An error occurred during logout." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
