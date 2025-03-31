import https from 'https';
import FormData from 'form-data';
import axios from 'axios';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js built-in body parser
  },
};

export async function POST(req) {
  try {
    // Read the request body as ArrayBuffer
    const buffer = Buffer.from(await req.arrayBuffer());

    // Get the boundary from the content-type header
    const boundary = req.headers.get('content-type').split('boundary=')[1];

    // Use the custom parser function
    const parts = parseMultipart(buffer, boundary);

    // Find the file in the parsed parts
    const file = parts.find(part => part.name === 'file');
    if (!file) {
      return NextResponse.json({ errorMessage: 'No file uploaded or file is empty' }, { status: 400 });
    }

    // Create a new FormData instance using the form-data package
    const formData = new FormData();
    formData.append('file', file.data, file.filename); // Use the file buffer here

    // Create an HTTPS agent to bypass SSL verification for local development
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification (for local dev only)
    });

    // Prepare the request headers with form data headers and cookies (if needed)
    const headers = {
      ...formData.getHeaders(),
      'Cookie': req.headers.get('cookie') || '', // Pass cookies (if needed)
    };

    // Send the file to another backend API for further processing using axios
    const response = await axios.post('https://localhost:7036/api/product/import-excel', formData, {
      headers: headers,
      httpsAgent: agent,  // Handle SSL issues in local dev
      withCredentials: true, // Include credentials in the request
    });

    if (response.status === 200) {
      return NextResponse.json({ message: 'Products imported successfully.' }, { status: 200 });
    } else {
      return NextResponse.json({ errorMessage: 'Failed to import products from Excel.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in file import:', error);
    return NextResponse.json({ errorMessage: 'Error processing the request.' }, { status: 500 });
  }
}

// Function to parse the multipart form data manually
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`);

  let startIndex = 0;
  let endIndex = buffer.indexOf(boundaryBuffer, startIndex);

  while (endIndex !== -1) {
    startIndex = endIndex + boundaryBuffer.length;
    endIndex = buffer.indexOf(boundaryBuffer, startIndex);

    const partBuffer = buffer.slice(startIndex, endIndex === -1 ? buffer.length : endIndex);
    
    // Find the headers and the body of the part
    const partHeadersEnd = partBuffer.indexOf('\r\n\r\n');
    const partHeaders = partBuffer.slice(0, partHeadersEnd).toString();
    const partBody = partBuffer.slice(partHeadersEnd + 4);

    // Extract name and filename from the headers (if available)
    const nameMatch = partHeaders.match(/name="([^"]+)"/);
    const filenameMatch = partHeaders.match(/filename="([^"]+)"/);

    const part = {
      name: nameMatch ? nameMatch[1] : null,
      filename: filenameMatch ? filenameMatch[1] : null,
      data: partBody,
    };

    parts.push(part);
    startIndex = endIndex + boundaryBuffer.length;
  }

  return parts;
}
