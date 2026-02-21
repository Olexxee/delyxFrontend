import axios from "axios";
import { spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_PORT = 5000;
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  console.error("⚠️  BACKEND_URL not set in .env");
  process.exit(1);
}

console.log("Starting OutRay tunnel...");

const tunnelProcess = spawn("outray.cmd", [String(FRONTEND_PORT)], {
  shell: true,
});

tunnelProcess.stdout.on("data", async (data) => {
  const output = data.toString();
  console.log("Tunnel output:", output);

  const match = output.match(/https:\/\/[^\s]+/);
  if (match) {
    const frontendURL = match[0];
    console.log(`✅ Tunnel started at ${frontendURL}`);

    try {
      await axios.post(`${BACKEND_URL}/api/v1/config/update-frontend-url`, {
        frontendURL,
      });
      console.log("✅ Backend updated with frontend tunnel URL");
    } catch (err) {
      console.error("❌ Failed to update backend:", err.message);
    }
  }
});

tunnelProcess.stderr.on("data", (data) => {
  console.error("Tunnel error:", data.toString());
});

tunnelProcess.on("exit", (code) => {
  console.log("Tunnel exited with code:", code);
});
