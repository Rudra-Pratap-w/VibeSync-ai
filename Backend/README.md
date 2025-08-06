# Bollywood Mood Playlist Backend

A Node.js Express backend that generates Bollywood playlists based on user mood using Spotify Web API and Google Gemini AI for mood classification.

## 🚀 Features

- **Mood Classification**: Uses Google Gemini AI to analyze user text and determine mood
- **Spotify Integration**: Searches for Bollywood playlists based on detected mood
- **Clean Architecture**: Organized code structure with separation of concerns
- **Error Handling**: Comprehensive error handling and validation
- **Health Checks**: Built-in health monitoring endpoint

## 📁 Project Structure

```
Backend/
├── server.js              # Main entry point
├── app.js                 # Express app configuration
├── routes/
│   └── playlist.js        # Playlist-related routes
├── services/
│   ├── spotify.js         # Spotify API service
│   └── gemini.js          # Google Gemini AI service
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- Spotify Developer Account
- Google AI Studio Account

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - `SPOTIFY_CLIENT_ID`: From [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - `SPOTIFY_CLIENT_SECRET`: From Spotify Developer Dashboard
   - `GEMINI_API_KEY`: From [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### GET `/playlist/:mood`
Get playlists for a specific mood.

**Parameters:**
- `mood` (string): The mood to search for
- `limit` (query, optional): Number of playlists (default: 6, max: 50)

**Example:**
```bash
curl http://localhost:3000/playlist/romantic?limit=10
```

### POST `/generate-playlist`
Generate playlists based on user text input.

**Body:**
```json
{
  "text": "I'm feeling very happy today and want to dance",
  "limit": 10
}
```

**Response:**
```json
{
  "userText": "I'm feeling very happy today and want to dance",
  "mood": "happy",
  "count": 10,
  "playlists": [...]
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "spotify": true,
    "gemini": true
  }
}
```

## 🏗️ Architecture

### Services Layer
- **SpotifyService**: Handles Spotify API authentication and playlist searches
- **GeminiService**: Manages Google Gemini AI for mood classification

### Routes Layer
- **Playlist Routes**: RESTful endpoints for playlist operations
- **Validation Middleware**: Request validation and sanitization

### Features
- **Token Management**: Automatic Spotify token refresh
- **Error Handling**: Graceful error responses with proper HTTP status codes
- **Input Validation**: Request validation and sanitization
- **Mood Validation**: Ensures consistent mood classification

## 🔧 Development

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with auto-reload

### Adding New Features
1. Create services in `services/` directory
2. Add routes in `routes/` directory
3. Import routes in `server.js`

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

Common status codes:
- `400`: Bad Request (validation errors)
- `500`: Internal Server Error (API failures)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Spotify application client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify application client secret | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `PORT` | Server port number | No (default: 3000) |

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation

## 📄 License

MIT License