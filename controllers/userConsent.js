import { v4 as uuidv4 } from "uuid";
import UserConsent from "../model/userconsent.js";
import { setAnonymousCookie , setConsentCookie } from "../util/cookies.js";
// import { setAnonymousCookie, setConsentCookie } from "./cookieUtils.js"; // adjust path

export const createConsent = async (req, res) => {
  try {
    const { userId, consentType, isAccepted, source } = req.body;

    // 1️⃣ Handle anonymousId
    let anonymousId = req.cookies?.anonId; // use 'anonId' to match cookie utils
    
    if (!userId && !anonymousId) {
      // Generate and set anonymous cookie
      anonymousId = setAnonymousCookie(res)
    }

    // 2️⃣ Extract IP and User-Agent
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] || 
      req.socket?.remoteAddress || 
      "0.0.0.0";

    const userAgent = req.headers["user-agent"] || "Unknown";

    // 3️⃣ Validation
    if (!consentType || typeof isAccepted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "consentType and isAccepted are required fields.",
      });
    }

    // 4️⃣ Create consent record
    const consent = await UserConsent.create({
      userId: userId || null,
      anonymousId: anonymousId || null,
      consentType,
      isAccepted,
      ipAddress,
      userAgent,
      source: source || "web",
    });

    // 5️⃣ Set consent cookie for frontend access
    setConsentCookie(res, {
      essential: true,
      analytics: isAccepted, // or customize based on consentType
    });

    // 6️⃣ Response
    return res.status(201).json({
      success: true,
      data: {
        id: consent._id,
        consentType: consent.consentType,
        isAccepted: consent.isAccepted,
        source: consent.source,
        createdAt: consent.createdAt,
        anonymousId,
      },
    });
  } catch (error) {
    console.error("Consent creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getUserConsents = async (req, res) => {
  try {
    const { userId } = req.params;
    const consents = await UserConsent.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: consents });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
