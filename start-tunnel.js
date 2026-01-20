import { exec } from 'child_process';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FRONTEND_PORT = 5000; // Your React/Expo frontend port
const BACKEND_URL = process.env.BACKEND_URL; // e.g., http://localhost:5000

if (!BACKEND_URL) {
  console.error('⚠️  BACKEND_URL not set in .env');
  process.exit(1);
}

// Start OutRay tunnel
const tunnelProcess = exec(`outray ${FRONTEND_PORT}`);

tunnelProcess.stdout.on('data', async (data) => {
  const match = data.match(/https:\/\/[^\s]+\.outray\.app/);
  if (match) {
    const frontendURL = match[0];
    console.log(`✅ Tunnel started at ${frontendURL}`);

    try {
      // POST frontend URL to backend
      await axios.post(`${BACKEND_URL}/api/v1/config/update-frontend-url`, { frontendURL });
      console.log('✅ Backend updated with frontend tunnel URL');
    } catch (err) {
      console.error('❌ Failed to update backend:', err.message);
    }
  }
});

tunnelProcess.stderr.on('data', (data) => {
  console.error('Tunnel error:', data);
});
