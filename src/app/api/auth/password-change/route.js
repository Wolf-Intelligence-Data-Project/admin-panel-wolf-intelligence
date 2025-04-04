import axios from 'axios';
import https from 'https'; // Import https to create the agent
import cookie from 'cookie';

export async function PATCH(req) {
    try {
      const { newPassword } = await req.json(); // Parse the incoming JSON body
      
      // Get the cookie string and manually parse it
      const cookies = req.headers.get('cookie');
      const emailForPasswordChange = cookies
        ? cookies.split(';').find(cookie => cookie.trim().startsWith('emailForPasswordChange='))
            ?.split('=')[1] // Get the value of the emailForPasswordChange cookie
        : null;
  
      if (!emailForPasswordChange) {
        return new Response(
          JSON.stringify({ error: "Email not found. Please log in again." }),
          { status: 400 }
        );
      }
  
      // Configure Axios to ignore SSL certificate errors (for local development only)
      const agent = new https.Agent({
        rejectUnauthorized: false,  // Disable SSL verification
      });
      console.log("Email:", emailForPasswordChange);
      console.log("New Password:", newPassword);
      
      // Forward the login data to your actual authentication API
      const response = await axios.patch('https://localhost:7036/api/auth/password-change', 
        { AdminId: emailForPasswordChange, Password: newPassword }, {
            headers: { 'Content-Type': 'application/json' },
        httpsAgent: agent
      });
  
      if (response.data.success) {
        // Password change successful, delete the HttpOnly cookie
        const cookieHeader = `emailForPasswordChange=; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=None; Path=/; Max-Age=0; Expires=${new Date(0).toUTCString()}`;
  
        return new Response(
          JSON.stringify({ success: true, message: "Password changed successfully." }),
          {
            status: 200,
            headers: {
              'Set-Cookie': cookieHeader,  // This deletes the cookie by setting it to expire
            },
          }
        );
      } else {
        console.error("Error from backend:", response.data.errorMessage);
        return new Response(
          JSON.stringify({ success: false, errorMessage: response.data.errorMessage }),
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Error in API route:", error);
      return new Response(
        JSON.stringify({ success: false, errorMessage: 'An error occurred during password change.' }),
        { status: 500 }
      );
    }
  }
  
