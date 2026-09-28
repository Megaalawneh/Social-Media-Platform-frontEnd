const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrl =
  configuredApiUrl ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL must be configured when building the production frontend.",
  );
}

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");
