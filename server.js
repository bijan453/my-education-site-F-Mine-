import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "developer",
          content:
            "Ты дружелюбный научный бот. Отвечай по-русски или по-английски в том же языке, что и пользователь. Объясняй просто и понятно. Если вопрос про биологию, физику, химию или учебу — отвечай как хороший учитель.",
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    res.json({ reply: response.output_text || "Пустой ответ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Ошибка сервера" });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});