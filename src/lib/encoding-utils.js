/**
 * Safely encodes a string to base64, handling Unicode characters
 * This fixes the "Error generating share link: Failed to execute 'btoa' on 'Window':
 * The string to be encoded contains characters outside of the Latin1 range." error
 */
export const encodeToBase64 = (data) => {
  try {
    // First encode the string as URI component to handle Unicode characters
    const encodedData = encodeURIComponent(data);
    // Then convert to a format that btoa can handle
    const btoaFriendly = unescape(encodedData);
    // Finally, encode to base64
    return btoa(btoaFriendly);
  } catch (error) {
    console.error("Error encoding to base64:", error);
    throw new Error("Failed to encode data to base64");
  }
};

/**
 * Decodes a base64 string, handling Unicode characters
 */
export const decodeFromBase64 = (base64) => {
  try {
    // Decode from base64
    const decoded = atob(base64);
    // Convert from btoa format
    const escapedData = escape(decoded);
    // Finally, decode URI component
    return decodeURIComponent(escapedData);
  } catch (error) {
    console.error("Error decoding from base64:", error);
    throw new Error("Failed to decode data from base64");
  }
};
