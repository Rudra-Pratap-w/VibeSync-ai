import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = "";
    this.tokenFetchedAt = Date.now();
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Spotify credentials not found in environment variables");
    }
    
    // Initialize token on service creation
    this.getToken();
  }

  async getToken() {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64"),
          },
        }
      );
      
      this.accessToken = response.data.access_token;
      this.tokenFetchedAt = Date.now();
      console.log("✅ Spotify token fetched successfully");
      
      return this.accessToken;
    } catch (error) {
      console.error(
        "❌ Error fetching Spotify token:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async ensureTokenValid() {
    // Refresh token if it's older than 55 minutes (tokens last 1 hour)
    if (!this.accessToken || Date.now() - this.tokenFetchedAt > 55 * 60 * 1000) {
      await this.getToken();
    }
  }

  async searchPlaylists(query, limit = 10) {
    await this.ensureTokenValid();

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          q: `${query} bollywood`,
          type: "playlist",
          limit: limit,
        },
      });

      return response.data.playlists.items;
    } catch (error) {
      console.error(
        "❌ Spotify search error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  }

  async getPlaylistsByMood(mood, limit = 10) {
    return this.searchPlaylists(mood, limit);
  }
}

// Export singleton instance
export const spotifyService = new SpotifyService();