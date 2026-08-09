import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body size limit for video and high-res image uploads
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Ensure public/uploads folder exists on Google Cloud hosting
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploaded files statically at /uploads
  app.use("/uploads", express.static(uploadsDir));

  // API Endpoint to upload videos and photos directly to Google Cloud hosting
  app.post("/api/upload-media", (req, res) => {
    try {
      const { fileData, fileName, mimeType } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "No file data provided" });
      }

      // Extract base64 payload
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let detectedExt = "mp4";

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
        const typeStr = matches[1];
        if (typeStr.includes("image/jpeg") || typeStr.includes("image/jpg")) detectedExt = "jpg";
        else if (typeStr.includes("image/png")) detectedExt = "png";
        else if (typeStr.includes("image/webp")) detectedExt = "webp";
        else if (typeStr.includes("image/gif")) detectedExt = "gif";
        else if (typeStr.includes("video/webm")) detectedExt = "webm";
        else if (typeStr.includes("video/ogg")) detectedExt = "ogv";
        else if (typeStr.includes("video/quicktime")) detectedExt = "mov";
        else if (typeStr.includes("video/mp4")) detectedExt = "mp4";
      } else {
        const rawBase64 = fileData.replace(/^data:[^;]+;base64,/, "");
        buffer = Buffer.from(rawBase64, "base64");
      }

      const cleanName = (fileName || "media")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 30);
      const uniqueFileName = `${Date.now()}_${cleanName}.${detectedExt}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;
      console.log(`Saved media file to Google Cloud hosting: ${publicUrl} (${buffer.length} bytes)`);

      return res.json({
        success: true,
        url: publicUrl,
        fileName: uniqueFileName,
        size: buffer.length
      });
    } catch (err: any) {
      console.error("Error uploading media to server:", err);
      return res.status(500).json({ error: err?.message || "Failed to upload file to server" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", host: "Google Cloud Run" });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
