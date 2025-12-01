import { randomUUID } from "crypto"; // Node 18+ built-in

export const setCookies = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    };
    
    return res.cookie("authToken", token, cookieOptions);
};

export const clearCookies = (res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
};

// Common cookie options
const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

//   Set authentication cookie (JWT / session token)
export const setAuthCookie = (res, token) => {
  const cookieOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("authToken", token, cookieOptions);
};
//  Clear authentication cookie
export const clearAuthCookie = (res) => {
  res.clearCookie("authToken", baseCookieOptions);
};
/**
 * Set anonymous user cookie (used before login / for analytics)
 * Only stores a random UUID, no personal data.
 */
export const setAnonymousCookie = (res, existingAnonId) => {
  const anonId = existingAnonId || randomUUID();
  const cookieOptions = {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res.cookie("anonId", anonId, cookieOptions);
  return anonId;
};


//  Set user consent cookie
//  Stores whether the user accepted cookies or not
export const setConsentCookie = (res, consent = { essential: true, analytics: false }) => {
  const cookieOptions = {
    ...baseCookieOptions,
    maxAge: 180 * 24 * 60 * 60 * 1000, // 6 months
  };

  // Store as JSON string
  res.cookie("userConsent", JSON.stringify(consent), {
    ...cookieOptions,
    httpOnly: false, // front-end needs access
  });
};

//  Clear all cookies (for logout or revoke consent)
export const clearAllCookies = (res) => {
  ["authToken", "anonId", "userConsent"].forEach((cookie) =>
    res.clearCookie(cookie, baseCookieOptions)
  );
};
