import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import { spawn } from "child_process";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd()));

// Configure email transporter
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const geminiApiKey = process.env.GEMINI_API_KEY;
const deepseekApiKey = process.env.DEESEEK_API_KEY;
const openrouterApiKey = process.env.OPENROUTER_API_KEY;

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

// Endpoint for sending authentication codes (Registration & Password recovery)
app.post("/api/send-code", async (req, res) => {
  const { email, nick, code, type, lang } = req.body;

  if (!email || !nick || !code || !type) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  const isRu = (lang === "RU");
  let subject = "";
  let htmlContent = "";

  if (type === "register") {
    subject = isRu ? "F-Mine | Подтверждение регистрации" : "F-Mine | Registration confirmation";
    htmlContent = isRu ? `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Добро пожаловать в F-Mine, ${nick}!</h2>
        <p>Для подтверждения вашего адреса электронной почты и завершения регистрации используйте код ниже:</p>
        <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; color: #4a47d1;">
          ${code}
        </div>
        <p>Этот код действителен в течение 10 минут.</p>
        <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
      </div>
    ` : `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to F-Mine, ${nick}!</h2>
        <p>To verify your email address and complete registration, please use the code below:</p>
        <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; color: #4a47d1;">
          ${code}
        </div>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `;
  } else if (type === "reset") {
    subject = isRu ? "F-Mine | Сброс пароля" : "F-Mine | Password reset";
    htmlContent = isRu ? `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Восстановление пароля F-Mine для ${nick}</h2>
        <p>Мы получили запрос на изменение пароля для вашего аккаунта. Используйте этот код безопасности:</p>
        <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; color: #4a47d1;">
          ${code}
        </div>
        <p>Этот код действителен в течение 10 минут.</p>
        <p>Если вы не запрашивали сброс пароля, немедленно проверьте настройки безопасности вашего аккаунта.</p>
      </div>
    ` : `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>F-Mine Password Recovery for ${nick}</h2>
        <p>We received a request to change the password for your account. Please use this security code:</p>
        <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; color: #4a47d1;">
          ${code}
        </div>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request a password reset, please secure your account immediately.</p>
      </div>
    `;
  }

  // If credentials are not set or contain default placeholders, log code locally to help development/testing and respond success.
  const isPlaceholder = !process.env.SMTP_USER || 
                        !process.env.SMTP_PASS || 
                        process.env.SMTP_USER === "your-email@gmail.com" || 
                        process.env.SMTP_PASS === "your-app-password" ||
                        process.env.SMTP_USER.trim() === "" || 
                        process.env.SMTP_PASS.trim() === "";

  if (isPlaceholder) {
    console.log(`[SMTP Not Configured] Code for ${nick} (${email}): ${code}`);
    return res.json({ ok: true, message: "Code simulated (check server console logs)" });
  }

  try {
    await mailTransporter.sendMail({
      from: process.env.SMTP_FROM || `"F-Mine Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
});

// Endpoint for secure OpenRouter chat streaming proxy (supporting both SSE stream and standard JSON)
app.post("/api/chat-stream", async (req, res) => {
  try {
    const { model, messages, stream, temperature, max_tokens } = req.body;
    
    // Determine which API key to use:
    // If the client provided their own key in Authorization header, use it.
    // Otherwise, use the one from our environment.
    let apiKey = process.env.OPENROUTER_API_KEY;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const userKey = authHeader.substring(7).trim();
      if (userKey && userKey !== "undefined" && userKey !== "null" && userKey !== "") {
        apiKey = userKey;
      }
    }

    if (!apiKey) {
      return res.status(400).json({ 
        error: { 
          message: "OpenRouter API key is missing. Add OPENROUTER_API_KEY to your server's .env file or enter one in the settings." 
        } 
      });
    }

    const openrouterUrl = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://f-mine.app",
      "X-Title": "F-Mine Bot Proxy"
    };

    const body = {
      model: model || "openrouter/free",
      messages: messages,
      stream: !!stream
    };
    if (temperature !== undefined) body.temperature = temperature;
    if (max_tokens !== undefined) body.max_tokens = max_tokens;

    if (stream) {
      // Set up Server-Sent Events headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const response = await fetch(openrouterUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status}`;
        console.error("OpenRouter stream error:", errMsg);
        res.write(`data: ${JSON.stringify({ error: { message: errMsg } })}\n\n`);
        return res.end();
      }

      // Read from fetch response body stream and write to express response stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
      res.end();
    } else {
      // Normal JSON response
      const response = await fetch(openrouterUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      res.json(data);
    }
  } catch (err) {
    console.error("Error in /api/chat-stream:", err);
    res.status(500).json({ error: { message: err.message || "Internal Server Error" } });
  }
});

app.all("/api/tts", (req, res) => {
  const text = req.method === "POST" ? req.body.text : req.query.text;
  const voice = (req.method === "POST" ? req.body.voice : req.query.voice) || "ru-RU-DmitryNeural";
  const rate = (req.method === "POST" ? req.body.rate : req.query.rate) || "+0%";

  if (!text) {
    return res.status(400).send("Text is required");
  }

  res.setHeader("Content-Type", "audio/mpeg");

  const pyProcess = spawn("python", ["tts.py", text, voice, rate]);

  pyProcess.stdout.pipe(res);

  pyProcess.stderr.on("data", (data) => {
    console.error(`TTS spawn error: ${data.toString()}`);
  });

  pyProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`TTS process exited with code ${code}`);
      if (!res.headersSent) {
        res.status(500).send("TTS generation failed");
      }
    }
  });
});

// Chess Game State Store (in-memory)
const chessGames = new Map();
const chessClients = new Map(); // gameId -> Set of res objects

function broadcastToGame(gameId, data) {
  const clients = chessClients.get(gameId);
  if (clients) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      try {
        client.write(message);
      } catch (err) {
        console.error("Failed to write to chess client:", err);
      }
    }
  }
}

// Clean up stale games (older than 2 hours)
setInterval(() => {
  const now = Date.now();
  for (const [gameId, game] of chessGames.entries()) {
    if (now - game.lastActive > 2 * 60 * 60 * 1000) {
      chessGames.delete(gameId);
      const clients = chessClients.get(gameId);
      if (clients) {
        for (const client of clients) {
          try { client.end(); } catch {}
        }
        chessClients.delete(gameId);
      }
      console.log(`[Chess] Cleaned up stale game ${gameId}`);
    }
  }
}, 15 * 60 * 1000);

app.post("/api/chess/create", (req, res) => {
  const { creator, mode, botDifficulty, botColor, creatorColor } = req.body;
  if (!creator) {
    return res.status(400).json({ ok: false, error: "Creator nickname is required" });
  }

  const gameId = "CH-" + Math.floor(1000 + Math.random() * 9000);
  
  let playerWhite = null;
  let playerBlack = null;
  let assignedColor = "white";

  if (mode === "bot") {
    let finalBotColor = botColor || "black";
    if (finalBotColor === "random") {
      finalBotColor = Math.random() < 0.5 ? "white" : "black";
    }
    if (finalBotColor === "white") {
      playerWhite = "Bot";
      playerBlack = creator;
      assignedColor = "black";
    } else {
      playerWhite = creator;
      playerBlack = "Bot";
      assignedColor = "white";
    }
  } else {
    // Multiplayer
    let chosenColor = creatorColor || "white";
    if (chosenColor === "random") {
      chosenColor = Math.random() < 0.5 ? "white" : "black";
    }
    if (chosenColor === "black") {
      playerBlack = creator;
      assignedColor = "black";
    } else {
      playerWhite = creator;
      assignedColor = "white";
    }
  }

  const game = {
    id: gameId,
    status: mode === "bot" ? "playing" : "waiting",
    mode: mode || "multiplayer",
    playerWhite,
    playerBlack,
    turn: "white",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moves: [],
    chat: [],
    botDifficulty: botDifficulty || "medium",
    lastActive: Date.now()
  };

  chessGames.set(gameId, game);
  res.json({ ok: true, gameId, color: assignedColor });
});

// Ping endpoint — keeps Render server awake
app.get("/api/chess/ping", (req, res) => {
  res.json({ ok: true, status: "awake" });
});

app.post("/api/chess/join", (req, res) => {
  const { gameId, player } = req.body;
  if (!gameId || !player) {
    return res.status(400).json({ ok: false, error: "Game ID and player nickname are required" });
  }

  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  if (game.status !== "waiting" || (game.playerWhite !== null && game.playerBlack !== null)) {
    return res.status(400).json({ ok: false, error: "Game is already full or started" });
  }

  if (game.playerWhite === player || game.playerBlack === player) {
    return res.status(400).json({ ok: false, error: "Cannot play against yourself" });
  }

  let assignedColor = "black";
  if (game.playerWhite === null) {
    game.playerWhite = player;
    assignedColor = "white";
  } else {
    game.playerBlack = player;
    assignedColor = "black";
  }

  game.status = "playing";
  game.lastActive = Date.now();

  res.json({ ok: true, gameId, color: assignedColor });
  
  // Broadcast update to the creator
  broadcastToGame(gameId, { type: "update", game });
});

app.get("/api/chess/status/:gameId", (req, res) => {
  const { gameId } = req.params;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.json({ ok: false, error: "Game not found" });
  }
  res.json({ ok: true, status: game.status, playerWhite: game.playerWhite, playerBlack: game.playerBlack });
});

app.post("/api/chess/resign", (req, res) => {
  const { gameId, player } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  if (game.status !== "playing") {
    return res.status(400).json({ ok: false, error: "Game is not in progress" });
  }

  game.status = "over";
  const loser = player;
  const winner = (player === game.playerWhite) ? game.playerBlack : game.playerWhite;
  
  const msg = { sender: "system", text: `${loser} resigned. ${winner} wins!`, timestamp: Date.now() };
  game.chat.push(msg);
  game.lastActive = Date.now();

  res.json({ ok: true });
  broadcastToGame(gameId, { type: "resigned", winner, loser, message: msg });
});

app.post("/api/chess/draw-offer", (req, res) => {
  const { gameId, player } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  if (game.status !== "playing") {
    return res.status(400).json({ ok: false, error: "Game is not in progress" });
  }

  game.lastActive = Date.now();
  res.json({ ok: true });
  broadcastToGame(gameId, { type: "draw_offer", sender: player });
});

app.post("/api/chess/draw-response", (req, res) => {
  const { gameId, player, accept } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  if (game.status !== "playing") {
    return res.status(400).json({ ok: false, error: "Game is not in progress" });
  }

  game.lastActive = Date.now();

  if (accept) {
    game.status = "over";
    const msg = { sender: "system", text: `Draw by mutual agreement.`, timestamp: Date.now() };
    game.chat.push(msg);
    res.json({ ok: true });
    broadcastToGame(gameId, { type: "draw_agreed", message: msg });
  } else {
    res.json({ ok: true });
    broadcastToGame(gameId, { type: "draw_declined", player });
  }
});

app.post("/api/chess/move", (req, res) => {
  const { gameId, fen, move } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  game.fen = fen;
  if (move) {
    game.moves.push(move);
  }
  // Determine turn from FEN
  game.turn = fen.split(" ")[1] === "b" ? "black" : "white";
  game.lastActive = Date.now();

  res.json({ ok: true });
  broadcastToGame(gameId, { type: "update", game });
});

app.post("/api/chess/chat", (req, res) => {
  const { gameId, sender, text } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  const msg = { sender, text, timestamp: Date.now() };
  game.chat.push(msg);
  game.lastActive = Date.now();

  res.json({ ok: true });
  broadcastToGame(gameId, { type: "chat", message: msg });
});

app.get("/api/chess/stream/:gameId", (req, res) => {
  const { gameId } = req.params;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).send("Game not found");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (!chessClients.has(gameId)) {
    chessClients.set(gameId, new Set());
  }
  chessClients.get(gameId).add(res);

  // Send initial state immediately
  res.write(`data: ${JSON.stringify({ type: "init", game })}\n\n`);

  req.on("close", () => {
    const clients = chessClients.get(gameId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        chessClients.delete(gameId);
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});