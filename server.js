import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// ============================================
// 🔒 CORS CONFIGURATION - ALLOW CREDENTIALS
// ============================================
const isDevelopment = process.env.NODE_ENV !== "production";

const allowedOrigins = [
  "https://sportsarena-frontend-livid.vercel.app", // apna production domain yahan daalein
];

app.use(cors({
  origin: (origin, callback) => {
    // Development: allow all localhost origins
    if (isDevelopment && origin && origin.includes('localhost')) {
      callback(null, true);
    }
    // Allow requests with no origin (mobile apps, curl requests, etc.)
    else if (!origin) {
      callback(null, true);
    }
    // Production: check against whitelist
    else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    }
    else {
      console.log('CORS Blocked Origin:', origin);
      callback(null, false); // Silently reject instead of error
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ============================================
// 🔒 SECURITY HEADERS - PROFESSIONAL CONFIGURATION
// ============================================
app.use(helmet({
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
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  frameguard: {
    action: "deny",
  },
  noSniff: true,
  dnsPrefetchControl: {
    allow: false,
  },
  ieNoOpen: true,
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },
  hidePoweredBy: true,
  expectCt: {
    maxAge: 86400,
    enforce: true,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: {
    policy: "same-origin",
  },
  originAgentCluster: true,
}));

// Additional Security Headers (Manual)
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
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

app.get("/", (req, res) => res.send("Server is running"));

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`✅ Server running securely on port ${PORT}`));
};

startServer();

export default app;