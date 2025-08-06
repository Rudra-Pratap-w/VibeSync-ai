import { app } from "../app.js";
import { spotifyService } from "../services/spotify.js";
import { geminiService } from "../services/gemini.js";

// Middleware for request validation
const validateTextInput = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ 
      error: "Text input is required and must be a non-empty string" 
    });
  }
  
  if (text.length > 500) {
    return res.status(400).json({ 
      error: "Text input is too long (max 500 characters)" 
    });
  }
  
  next();
};

const validateMoodParam = (req, res, next) => {
  const { mood } = req.params;
  
  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return res.status(400).json({ 
      error: "Mood parameter is required" 
    });
  }
  
  next();
};

// Routes
app.get("/playlist/:mood", validateMoodParam, async (req, res) => {
  try {
    const mood = req.params.mood.trim().toLowerCase();
    const limit = parseInt(req.query.limit) || 6;
    
    if (limit > 50) {
      return res.status(400).json({ error: "Limit cannot exceed 50" });
    }

    const playlists = await spotifyService.getPlaylistsByMood(mood, limit);
    
    res.json({
      mood,
      count: playlists.length,
      playlists
    });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    res.status(500).json({ 
      error: "Failed to fetch playlists",
      message: error.message 
    });
  }
});

app.post("/generate-playlist", validateTextInput, async (req, res) => {
  try {
    const userText = req.body.text.trim();
    const requestedLimit = parseInt(req.body.limit) || 10;
    
    if (requestedLimit > 50) {
      return res.status(400).json({ error: "Limit cannot exceed 50" });
    }

    // Get mood from user text using Gemini AI
    const detectedMood = await geminiService.getMoodFromText(userText);
    const validatedMood = await geminiService.validateMood(detectedMood);
    
    // Get playlists based on detected mood
    const playlists = await spotifyService.getPlaylistsByMood(validatedMood, requestedLimit);
    
    res.json({ 
      userText,
      mood: validatedMood,
      count: playlists.length,
      playlists 
    });
  } catch (error) {
    console.error("❌ Error generating playlist:", error);
    res.status(500).json({ 
      error: "Failed to generate playlist",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    services: {
      spotify: !!spotifyService.accessToken,
      gemini: !!geminiService.apiKey
    }
  });
});

console.log("✅ Playlist routes loaded");