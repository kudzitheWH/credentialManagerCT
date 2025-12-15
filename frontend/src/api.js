// src/api.js
// Unified API request helper – ensures all requests hit backend correctly
// and send JSON data consistently.

export async function apiRequest(path, options = {}) {
  const baseUrl = "http://localhost:5000"; // backend origin
  const fullUrl = path.startsWith("http")
    ? path
    : `${baseUrl}${path}`; // support both absolute and relative paths

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  // Ensure body is properly stringified if provided as an object
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  console.log("Sending request:", fullUrl, config); // helpful debug line

  const response = await fetch(fullUrl, config);

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = data.msg || data.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  console.log("Response:", data);
  return data;
}
