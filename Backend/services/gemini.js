import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async getMoodFromText(userInput) {
    try {
      const prompt = `You are a mood classifier for a music app. 
Given a user text, return a single-word mood like "romantic", "happy", "sad", "energetic", "peaceful", "chill", "upbeat", "melancholic", "excited", "relaxed", etc.
Only reply with one word. No punctuation. Here's the text: "${userInput}"`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const mood = response.text().trim().toLowerCase();
      
      console.log(`🎭 Detected mood: "${mood}" from input: "${userInput}"`);
      return mood;
    } catch (error) {
      console.error("❌ Error classifying mood with Gemini:", error);
      // Fallback to a default mood if AI fails
      return "happy";
    }
  }

  async validateMood(mood) {
    // List of valid moods to ensure consistency
    const validMoods = [
      "happy", "sad", "romantic", "energetic", "peaceful", "chill", 
      "upbeat", "melancholic", "excited", "relaxed", "party", "calm",
      "emotional", "nostalgic", "motivational", "soothing"
    ];
    
    return validMoods.includes(mood.toLowerCase()) ? mood.toLowerCase() : "happy";
  }
}

// Export singleton instance
export const geminiService = new GeminiService();