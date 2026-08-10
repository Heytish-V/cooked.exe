/**
 * gifFetcher.js — Centralized GIF API wrapper
 *
 * Supports Giphy (default) and Tenor (via VITE_TENOR_API_KEY env var).
 * Returns a single GIF URL or null on failure.
 */

// Giphy public beta key (rate-limited but functional)
const GIPHY_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';

/**
 * Fetch a reaction GIF for the given search term.
 *
 * @param {string} searchTerm — GIF search query
 * @param {number} limit — max results to pick from (default 8)
 * @returns {Promise<string|null>} — GIF URL or null
 */
export async function fetchReactionGif(searchTerm, limit = 8) {
  try {
    const tenorKey = import.meta.env.VITE_TENOR_API_KEY;
    let endpoint;
    let isTenor = false;

    if (tenorKey) {
      isTenor = true;
      endpoint =
        `https://tenor.googleapis.com/v2/search` +
        `?q=${encodeURIComponent(searchTerm)}` +
        `&key=${tenorKey}` +
        `&client_key=how_cooked_am_i` +
        `&limit=${limit}` +
        `&media_filter=gif`;
    } else {
      endpoint =
        `https://api.giphy.com/v1/gifs/search` +
        `?api_key=${GIPHY_KEY}` +
        `&q=${encodeURIComponent(searchTerm)}` +
        `&limit=${limit}` +
        `&rating=pg-13`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) return null;

    const data = await response.json();
    const results = data.results || data.data || [];
    if (results.length === 0) return null;

    // Pick a random result for variety
    const pick = results[Math.floor(Math.random() * results.length)];

    if (isTenor) {
      return (
        pick?.media_formats?.tinygif?.url ||
        pick?.media_formats?.gif?.url ||
        null
      );
    }

    // Giphy: use fixed_height for good quality at reasonable size
    return (
      pick?.images?.fixed_height?.url ||
      pick?.images?.downsized_medium?.url ||
      pick?.images?.original?.url ||
      null
    );
  } catch (e) {
    console.warn('GIF fetch failed:', e);
    return null;
  }
}
