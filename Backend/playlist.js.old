// import { app } from "./app.js";
// import dotenv from "dotenv";
// import axios from "axios";

// dotenv.config();
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;

// let accessToken = "";
// const getToken = async () => {
//   const response = await axios.post(
//     "https://accounts.spotify.com/api/token",
//     new URLSearchParams({ grant_type: "client_credentials" }).toString(),
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization:
//           "Basic " +
//           Buffer.from(clientId + ":" + clientSecret).toString("base64"),
//       },
//     }
//   );
//   accessToken = response.data.access_token;
//   console.log(accessToken);
// };
// await getToken(); // Get token on server start

// app.get("/playlist/:mood", async (req, res) => {
//   const mood = req.params.mood;
//   await ensureTokenValid();
//   try {
//     const response = await axios.get(`https://api.spotify.com/v1/search`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       params: {
//         q: `${mood} bollywood`,
//         type: "playlist",
//         limit: 6,
//       },
//     });
//     res.json(response.data.playlists.items);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch playlists" });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
import { app } from "./app.js";
import dotenv from "dotenv";
import axios from "axios";
import { OpenAI } from "openai";

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let accessToken = "";
let tokenFetchedAt = Date.now();

const getToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );
    accessToken = response.data.access_token;
    tokenFetchedAt = Date.now();
    console.log("✅ Token fetched");
  } catch (error) {
    console.error(
      "❌ Error fetching token:",
      error.response?.data || error.message
    );
  }
};

const ensureTokenValid = async () => {
  if (!accessToken || Date.now() - tokenFetchedAt > 55 * 60 * 1000) {
    await getToken();
  }
};

await getToken();

app.get("/playlist/:mood", async (req, res) => {
  await ensureTokenValid();

  const mood = req.params.mood;

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: `${mood} bollywood`,
        type: "playlist",
        limit: 6,
      },
    });

    res.json(response.data.playlists.items);
  } catch (error) {
    console.error(
      "❌ Spotify error:",
      error.response?.status,
      error.response?.data
    );
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

export async function getMoodFromText(userInput) {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are a mood classifier for a music app. 
Given a user text, return a single-word mood like "romantic", "happy", "sad", "energetic", "peaceful", etc.
Only reply with one word. No punctuation. Here's the text: "${userInput}"`,
          },
        ],
      },
    ],
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const mood = rawText.trim().toLowerCase();
  return mood;
}
export async function getPlaylistsByMood(mood) {
  await ensureTokenValid();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      mood
    )}%20bollywood&type=playlist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();
  return data.playlists.items;
}
app.post("/generate-playlist", async (req, res) => {
  try {
    const userText = req.body.text;

    const mood = await getMoodFromText(userText);
    console.log("Detected mood:", mood);

    const playlists = await getPlaylistsByMood(mood);
    res.json({ mood, playlists });
  } catch (error) {
    console.error("Error generating playlist:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
console.log("Fetched token:", accessToken);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
