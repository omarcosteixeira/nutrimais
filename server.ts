import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

// Simple in-memory queue for webhook events to pass them to the client
const webhookEvents: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Check Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Webhook for WhatsApp
  // Expected body: { "phone": "123456789", "message": "SIM", "appointmentId": "xyz" }
  // WhatsApp APIs like Twilio/Meta typically send specific payloads, we simulate it here:
  app.post("/api/webhook/whatsapp", (req, res) => {
    console.log("Recebendo Webhook do WhatsApp:", req.body);
    const body = req.body;
    
    // In a real scenario, you parse the incoming WhatsApp payload (e.g., from Twilio or Meta Graph)
    // Here we'll simulate extracting the message body and the sender's phone
    
    // Simulate parsing
    const messageText = body?.message || body?.text || body?.Body || "";
    const sender = body?.phone || body?.From || "";
    const appointmentId = body?.appointmentId || "";
    
    if (messageText.trim().toUpperCase() === "SIM") {
      webhookEvents.push({
        type: "APPOINTMENT_CONFIRMED",
        phone: sender,
        appointmentId: appointmentId,
        timestamp: new Date().toISOString()
      });
      console.log("Consulta confirmada via Webhook!");
    } else {
        webhookEvents.push({
            type: "MESSAGE_RECEIVED",
            phone: sender,
            text: messageText,
            timestamp: new Date().toISOString()
        })
    }

    res.status(200).send("OK");
  });

  // Endpoint for the React client to poll for new events
  app.get("/api/webhook/events", (req, res) => {
    const events = [...webhookEvents];
    webhookEvents.length = 0; // Clear after sending
    res.json(events);
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
