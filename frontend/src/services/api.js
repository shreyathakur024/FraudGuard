/**
 * FraudGuard Centralized API Client & URL Normalizer
 */

// Base URL configuration with normalization
const getApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;

  if (!rawUrl || rawUrl === "undefined") {
    // Default fallback in development
    return "http://localhost:5000/api";
  }

  // Trim whitespace and trailing slashes
  const trimmed = rawUrl.trim().replace(/\/+$/, "");

  // If the URL already ends with /api, return as is
  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  // Otherwise append /api
  return `${trimmed}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Safely parse fetch response, preventing syntax errors on HTML/text error pages
 */
export async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  let data = null;
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (response.ok) {
    if (data !== null) return data;
    return { success: true, data: null };
  }

  // If response is not ok and JSON data contains an error message
  if (data && (data.message || data.error)) {
    throw new Error(data.message || data.error);
  }

  // Handle common HTTP error codes with helpful messages
  if (response.status === 404) {
    throw new Error(
      `Endpoint not found (404). Please verify that the API server is up to date.`
    );
  }

  if (response.status === 502 || response.status === 503 || response.status === 504) {
    throw new Error(
      `Backend service is currently starting up or temporarily unavailable (${response.status}). Please wait a few seconds and try again.`
    );
  }

  if (response.status === 401) {
    throw new Error("Invalid credentials or unauthorized access.");
  }

  if (response.status === 403) {
    throw new Error("Access denied. You do not have permission for this action.");
  }

  if (response.status >= 500) {
    throw new Error(
      `Server encountered an internal error (${response.status}). Please try again later.`
    );
  }

  throw new Error(`Request failed with status ${response.status}.`);
}

/**
 * Authenticated API Fetch Helper
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("fraudguard_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let url;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    url = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    url = `${API_BASE_URL}${cleanEndpoint}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    console.error(`Network request failed for ${url}:`, netErr);
    throw new Error(
      "Unable to connect to the FraudGuard server. Please verify your internet connection and ensure the backend server is running."
    );
  }

  return parseApiResponse(response);
}

export default {
  API_BASE_URL,
  parseApiResponse,
  apiFetch,
};
