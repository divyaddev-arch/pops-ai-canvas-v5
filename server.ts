import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  const loginLogs: any[] = [];

  app.post("/api/log-login", (req, res) => {
    const { email, timestamp } = req.body;
    loginLogs.push({ email, timestamp, id: Date.now() });
    console.log(`Login tracked for: ${email}`);
    res.json({ success: true });
  });

  app.get("/api/login-logs", (req, res) => {
    res.json(loginLogs);
  });

  app.get("/api/homepage-json", (req, res) => {
    const filePath = path.join(__dirname, 'homepage.json');
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'homepage.json not found' });
    }
  });

  app.get("/api/ue-samples", (req, res) => {
    const samplesDir = path.join(__dirname, 'packages', 'ue-samples');
    try {
      if (!fs.existsSync(samplesDir)) {
        return res.json([]);
      }
      const files = fs.readdirSync(samplesDir);
      const samples = files
        .filter(file => file.endsWith('.txt'))
        .map(file => {
          const content = fs.readFileSync(path.join(samplesDir, file), 'utf-8');
          return { name: file, content };
        });
      res.json(samples);
    } catch (error: any) {
      console.error("Error reading samples:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/system-status", (req, res) => {
    const flagPath = path.join(process.cwd(), 'creatives', 'switching.flag');
    const isSwitching = fs.existsSync(flagPath);
    res.json({ switching: isSwitching });
  });

  app.post("/api/projects/download-and-switch", async (req, res) => {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const { exec } = await import("child_process");
    const util = await import("util");
    const execPromise = util.promisify(exec);

    try {
      console.log(`Starting download for ${projectId}...`);
      await execPromise(`npx tsx scripts/download-project.ts ${projectId}`);
      console.log(`Starting switch for ${projectId}...`);
      await execPromise(`npx tsx scripts/switch-project.ts ${projectId}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error in download-and-switch:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects/copy-and-switch", async (req, res) => {
    const { newName, fromName, details } = req.body;
    if (!newName || !fromName) {
      return res.status(400).json({ error: "New name and source name are required" });
    }

    const { exec } = await import("child_process");
    const util = await import("util");
    const execPromise = util.promisify(exec);

    try {
      console.log(`Copying project from ${fromName} to ${newName}...`);
      await execPromise(`npx tsx scripts/copy-project.ts "${newName}" "${fromName}" "${details}"`);
      console.log(`Switching to new project ${newName}...`);
      await execPromise(`npx tsx scripts/switch-project.ts "${newName}"`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error in copy-and-switch:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/clear-switching-flag", (req, res) => {
    const flagPath = path.join(process.cwd(), 'creatives', 'switching.flag');
    if (fs.existsSync(flagPath)) {
      fs.unlinkSync(flagPath);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
