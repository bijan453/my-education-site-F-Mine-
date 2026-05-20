import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd()));

const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const geminiApiKey = process.env.GEMINI_API_KEY;
const deepseekApiKey = process.env.DEESEEK_API_KEY;

const defaultSystemPrompt = `Ты дружелюбный научный бот. Отвечай по-русски или по-английски в том же языке, что и пользователь. Объясняй просто и понятно. Если вопрос про биологию, физику, химию или учебу — отвечай как хороший учитель.`;

async function callGemini(systemPrompt, userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callDeepSeek(systemPrompt, userMessage) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${deepseekApiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `DeepSeek HTTP ${res.status}`);
  return data.choices?.[0]?.message?.content || "";
}

async function callOpenAI(systemPrompt, userMessage) {
  const response = await openaiClient.responses.create({
    model: "gpt-5.4",
    input: [
      { role: "developer", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });
  return response.output_text || "";
}

app.post("/api/chat", async (req, res) => {
  try {
    const systemPrompt = req.body.systemPrompt || defaultSystemPrompt;
    let userMessage = typeof req.body.userMessage === "string" ? req.body.userMessage : "";

    if (!userMessage && Array.isArray(req.body.messages)) {
      const userMsg = req.body.messages.find((m) => m.role === "user" && m.content);
      if (userMsg) userMessage = userMsg.content;
    }

    if (!userMessage) {
      throw new Error("No user message provided.");
    }

    let reply = "";
    if (openaiClient) {
      reply = await callOpenAI(systemPrompt, userMessage);
    } else if (geminiApiKey) {
      reply = await callGemini(systemPrompt, userMessage);
    } else if (deepseekApiKey) {
      reply = await callDeepSeek(systemPrompt, userMessage);
    } else {
      throw new Error("No API key configured on server.");
    }

    res.json({ reply: reply || "Пустой ответ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Ошибка сервера" });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});