import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export async function POST(req, res) {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ errorMessage: 'No file uploaded or file is empty' });
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Prepare Axios request with credentials
    const response = await axios.post('https://localhost:7036/api/product/import-excel', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      withCredentials: true,  // Include credentials (such as cookies)
    });

    if (response.data) {
      return res.status(200).json({ message: 'Products imported successfully.' });
    } else {
      return res.status(500).json({ errorMessage: 'Failed to import products from Excel.' });
    }
  } catch (error) {
    console.error('Error importing products:', error);
    return res.status(500).json({ errorMessage: 'An error occurred while importing products.' });
  }
}
