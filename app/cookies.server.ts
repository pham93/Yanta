import { createCookie } from "@remix-run/node";

export const userPrefs = createCookie("yanta-app-preferences", {
  maxAge: 604_800, // 1 week
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

// Base cookie name
const COOKIE_NAME = "yanta-app-preferences";

// Utility to parse yanta-app-preferences cookies
export function parseYantaCookies(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split(";").map((e) => decodeURI(e.trim()));
  const preferences: Record<string, string | boolean | number> = {};

  // Filter and parse yanta-app-preferences cookies
  for (const cookie of cookies) {
    if (cookie.startsWith(COOKIE_NAME)) {
      const [key, value] = cookie.split("=");
      const parts = key.split("|");
      if (
        parts.length === 3 &&
        parts[0] === COOKIE_NAME &&
        parts[1] === "state"
      ) {
        // Handle state preferences (e.g., state|commentOpen=false)
        const stateKey = parts[2];
        preferences[stateKey] = JSON.parse(value);
      }
    }
  }

  return preferences;
}
