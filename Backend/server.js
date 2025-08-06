import { app } from "./app.js";
import "./services/spotify.js"; // Initialize Spotify service
import "./routes/playlist.js"; // Load playlist routes
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});