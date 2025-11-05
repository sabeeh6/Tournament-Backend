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

// ✅ Secure all requests with Helmet security headers (best practices)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"]
    }
  },
  referrerPolicy: { policy: "no-referrer-when-downgrade" },
  frameguard: { action: "deny" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true
}));

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

startServer();