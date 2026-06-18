import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload limits high enough to handle raw base64 images from cropper
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API upload route for storing cropped images directly on backend disk in `/public/images`
  app.post("/api/upload", async (req, res) => {
    try {
      const { base64, type, id, index, url } = req.body;

      if (!base64 && !url) {
        return res.status(400).json({ error: "Missing required parameters: base64/url, type, id" });
      }

      let buffer: Buffer;

      if (base64) {
        // Extract binary representation safely from Base64 Data URL
        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ error: "Invalid base64 string format. Must be a valid Data URL" });
        }
        buffer = Buffer.from(matches[2], "base64");
      } else {
        // Fetch from external URL
        console.log(`[STORAGE] Remote fetch triggered for direct download: ${url}`);
        const fetchResponse = await fetch(url);
        if (!fetchResponse.ok) {
          return res.status(400).json({ error: `Failed to fetch image from URL: ${fetchResponse.statusText}` });
        }
        const arrayBuffer = await fetchResponse.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
      
      // Determine destination directories and file naming standards
      let relativeFolder = "";
      let filename = "";

      if (type === "avatar") {
        relativeFolder = "images/avatars";
        filename = `${id}.png`;
      } else if (type === "work" || type === "portfolio") {
        relativeFolder = "images/artists";
        filename = `${id}-portfolio-${index || 1}.png`;
      } else if (type === "style-bg" || type === "style_hero") {
        relativeFolder = "images/styles";
        filename = `${id}-bg-${index || 1}.png`;
      } else if (type === "style" || type === "style_proj") {
        relativeFolder = "images/styles";
        filename = `${id}-${index || 1}.png`;
      } else if (type === "sitemedia") {
        relativeFolder = "images/layout";
        filename = `site-media-${id}.png`;
      } else if (type === "booking_ref" || type === "booking") {
        relativeFolder = "images/bookings";
        filename = `${id}-ref-${index || 1}.png`;
      } else if (type === "contact") {
        relativeFolder = "images/contact";
        filename = `${id}.png`;
      } else if (type === "video") {
        relativeFolder = "videos";
        let ext = "mp4";
        if (base64) {
          const mimeMatches = base64.match(/^data:([A-Za-z-+\/]+);base64,/);
          if (mimeMatches) {
            const mime = mimeMatches[1].split("/")[1];
            if (mime) ext = mime;
          }
        } else if (url) {
          const urlClean = url.split("?")[0];
          const urlExt = urlClean.split(".").pop();
          if (urlExt && ["mp4", "webm", "ogg", "mov", "avi"].includes(urlExt.toLowerCase())) {
            ext = urlExt.toLowerCase();
          }
        }
        filename = `${id}-showcase-${index || 1}.${ext}`;
      } else {
        return res.status(400).json({ error: `Unsupported upload type: ${type}` });
      }

      const rootDir = process.cwd();
      const publicPath = path.join(rootDir, "public", relativeFolder);
      const distPath = path.join(rootDir, "dist", relativeFolder);

      // Programmatically structure directories inside /public
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }

      // Write representation to source workspace so assets are persistent
      const publicFilePath = path.join(publicPath, filename);
      fs.writeFileSync(publicFilePath, buffer);
      console.log(`[STORAGE] Dynamic image successfully stored physically inside workspace: ${publicFilePath}`);

      // Simultaneously write replication inside /dist for immediate deployment delivery
      const distRoot = path.join(rootDir, "dist");
      if (fs.existsSync(distRoot)) {
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
        const distFilePath = path.join(distPath, filename);
        fs.writeFileSync(distFilePath, buffer);
        console.log(`[STORAGE] Compiled replica updated dynamically: ${distFilePath}`);
      }

      const finalUrl = `/${relativeFolder}/${filename}`;
      return res.json({ success: true, url: finalUrl });
    } catch (err: any) {
      console.error("[STORAGE] Encountered system error during write execution:", err);
      return res.status(500).json({ error: err.message || "Failed to finalize local file storage" });
    }
  });

  // API notification route for sending emails to gangatattooatlanta@gmail.com on any form submission
  app.post("/api/notify", async (req, res) => {
    try {
      const { type, payload } = req.body;
      if (!type || !payload) {
        return res.status(400).json({ error: "Missing type or payload" });
      }

      const adminEmail = "gangatattooatlanta@gmail.com";
      let subject = "";
      let text = "";

      if (type === "booking") {
        subject = `🚨 NEW ATLANTA INK BOOKING [${payload.id || "NEW"}] - ${payload.clientName}`;
        text = `Ganga Tattoo Atlanta - New Ink Booking Request\n\n` +
          `===========================================\n` +
          `CLIENT INFORMATION:\n` +
          `------------------\n` +
          `Name: ${payload.clientName}\n` +
          `Email: ${payload.clientEmail}\n` +
          `Phone: ${payload.clientPhone}\n` +
          `Instagram: ${payload.clientInstagram || "Not Provided"}\n` +
          `Urgency: ${payload.urgency || "standard"}\n\n` +
          `BESPOKE PROJECT SPECIFICATIONS:\n` +
          `------------------------------\n` +
          `Requested Artist Name: ${payload.artistName || "Any Resident Master"}\n` +
          `Selected Date: ${payload.date || "Not Selected"}\n` +
          `Time Slot Window: ${payload.timeSlot || "Not Selected"}\n` +
          `Placement Spot: ${payload.placement || "Not specified"}\n` +
          `Project Style: ${payload.style || "Not specified"}\n` +
          `Estimated Scale: ${payload.estimatedSizeInches || "0"} inches\n\n` +
          `CONCEPT DESCRIPTION & SPEC SUMMARY:\n` +
          `----------------------------------\n` +
          `${payload.description || "No description provided."}\n\n` +
          `ADDITIONAL NOTES:\n` +
          `-----------------\n` +
          `${payload.notes || "None"}\n\n` +
          `REFERENCE IMAGES DISPATCHED:\n` +
          `----------------------------\n` +
          `${(payload.referenceImages || []).map((imgUrl: string, idx: number) => `Reference #${idx + 1}: ${imgUrl}`).join("\n") || "No images attached."}\n` +
          `===========================================\n`;
      } else if (type === "contact") {
        subject = `✉️ NEW CLIENT CONTACT INQUIRY - ${payload.name}`;
        text = `Ganga Tattoo Atlanta - New Contact Inquiry\n\n` +
          `===========================================\n` +
          `CLIENT DETAILS:\n` +
          `--------------\n` +
          `Name: ${payload.name}\n` +
          `Email: ${payload.email}\n` +
          `Phone: ${payload.phone || "Not Provided"}\n` +
          `Inquiry Topic/Subject: ${payload.subject || "No Subject"}\n\n` +
          `MESSAGE DETAIL:\n` +
          `--------------\n` +
          `${payload.message || "No message provided."}\n` +
          `===========================================\n`;
      } else if (type === "artist_application") {
        subject = `👑 GANGA ROSTER: ARTIST APPLICATION - ${payload.name}`;
        text = `Ganga Tattoo Atlanta - Elite Artist Application\n\n` +
          `===========================================\n` +
          `APPLICANT INFORMATION:\n` +
          `----------------------\n` +
          `Artist Full Name: ${payload.name}\n` +
          `Email Address: ${payload.email}\n` +
          `Instagram Handle: ${payload.instagram || "Not Provided"}\n` +
          `Professional Experience: ${payload.experienceYears || "0"} Years\n` +
          `Style Specialty Focus: ${payload.specialty || "Not specified"}\n\n` +
          `PORTFOLIO STATEMENT & COVER INQUIRY:\n` +
          `------------------------------------\n` +
          `${payload.message || "No portfolio statement provided."}\n` +
          `===========================================\n`;
      } else {
        return res.status(400).json({ error: `Unsupported notification type: ${type}` });
      }

      const formspreeUrl = "https://formspree.io/f/xjgddyqq";
      const formspreePayload: Record<string, any> = {
        _subject: subject,
        type: type,
        message: text,
      };

      // Also copy all payload key-values over so Formspree native fields list them out clearly
      if (payload && typeof payload === "object") {
        Object.entries(payload).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            formspreePayload[k] = v.join(", ");
          } else if (typeof v === "object" && v !== null) {
            formspreePayload[k] = JSON.stringify(v);
          } else {
            formspreePayload[k] = v;
          }
        });
      }

      try {
        const response = await fetch(formspreeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formspreePayload)
        });

        if (!response.ok) {
          throw new Error(`Formspree status code error: ${response.status}`);
        }

        console.log(`[NOTIFY] Notification successfully sent to Formspree: ${subject}`);
        return res.json({ success: true, message: "Notification dispatched successfully to Formspree." });
      } catch (mailErr: any) {
        console.error("================== FORMSPREE DELIVERY FAILURE =================");
        console.error(`ERROR: ${mailErr.message}`);
        console.error("------------------ FALLBACK CONSOLE NOTIFICATION -----------------");
        console.error(`SUBJECT: ${subject}`);
        console.error(`BODY:\n${text}`);
        console.error("==================================================================");

        // Return a successful response but with a warning, so client-side flow progresses smoothly
        return res.json({
          success: true,
          warning: "Formspree submission failure. Fallback message logged.",
          errorDetails: mailErr.message
        });
      }
    } catch (err: any) {
      console.error("[NOTIFY] Error dispatching email notification wrapper:", err);
      return res.status(500).json({ error: err.message || "Notification email delivery fail" });
    }
  });

  // Serve static assets in production, otherwise mount vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use(express.static(path.join(process.cwd(), "public")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server successfully initialized on http://0.0.0.0:${PORT}`);
  });
}

startServer();
