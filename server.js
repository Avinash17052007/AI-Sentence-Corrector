require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ONLINE",
        service: "AI Sentence Corrector API"
    });
});

app.post("/api/correct", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Please enter a sentence."
            });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: process.env.OPENROUTER_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an English grammar correction assistant. Correct grammar, spelling, punctuation, and sentence structure. Return only the corrected sentence."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const corrected =
            response.data.choices?.[0]?.message?.content?.trim();

        if (!corrected) {
            return res.status(500).json({
                error: "No correction received from AI."
            });
        }

        res.json({
            original: text,
            corrected: corrected
        });

    } catch (error) {
        console.error(
            "OpenRouter Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "AI correction failed."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});