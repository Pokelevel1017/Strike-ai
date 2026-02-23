import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Strike AI Backend is running!");
});

// GET /chat (just for testing)
app.get("/chat", (req, res) => {
  res.send("⚠️ This endpoint only accepts POST requests with a message.");
});

// POST /chat (main AI endpoint)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ reply: "Please send a message." });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: userMessage }
      ]
    });

    // Send AI response
    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    // Handle quota exceeded / 429
    if (error.response?.status === 429) {
      console.error("⚠️ OpenAI quota exceeded:", error.message);
      res.status(429).json({
        reply: "⚠️ AI is temporarily unavailable because the usage quota has been exceeded. Please try again later."
      });
    } else {
      // Other errors
      console.error("OpenAI API error:", error.response?.data || error.message || error);
      res.status(500).json({
        reply: "❌ AI encountered an error. Please try again."
      });
    }
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Strike AI server running on port ${PORT}`);
});
