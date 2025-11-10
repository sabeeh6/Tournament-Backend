import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/tournamentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ============================================
// 🔒 SECURITY HEADERS - PROFESSIONAL CONFIGURATION
// ============================================
app.use(helmet({
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://www.google-analytics.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
    },
  },

  // HTTP Strict Transport Security - Forces HTTPS
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Referrer Policy - Controls referrer information
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },

  // X-Frame-Options - Prevents clickjacking
  frameguard: {
    action: "deny",
  },

  // X-Content-Type-Options - Prevents MIME sniffing
  noSniff: true,

  // X-DNS-Prefetch-Control - Controls DNS prefetching
  dnsPrefetchControl: {
    allow: false,
  },

  // X-Download-Options - Prevents IE from executing downloads
  ieNoOpen: true,

  // X-Permitted-Cross-Domain-Policies - Restricts Adobe Flash/PDF
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // Expect-CT - Certificate Transparency
  expectCt: {
    maxAge: 86400, // 24 hours
    enforce: true,
  },

  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false, // Set to true if needed

  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: {
    policy: "same-origin",
  },

  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: {
    policy: "same-origin",
  },

  // Origin-Agent-Cluster
  originAgentCluster: true,
}));

// Additional Security Headers (Manual)
app.use((req, res, next) => {
  // Remove fingerprinting headers
  res.removeHeader("X-Powered-By");
  
  // Permissions Policy (formerly Feature Policy)
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );
  
  next();
});

const PORT = process.env.PORT || 3009;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/TournamentApp";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

app.use("/api", router);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`✅ Server running securely on port ${PORT}`));
};
app.get("/", (req, res) => res.send("Server is running"));


startServer()

export default app;