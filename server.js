import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from 'url';
import { createRequire } from "module";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { Chess } = require("chess.js");

/** Apply a Lichess UCI move (e2e4 / e7e8q) or SAN string to a Chess instance. */
function applyPuzzleMove(game, m) {
  if (!m || typeof m !== 'string') return null;
  const s = m.trim();
  if (/^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(s)) {
    const move = { from: s.slice(0, 2), to: s.slice(2, 4) };
    if (s.length === 5) move.promotion = s[4].toLowerCase();
    const r = game.move(move);
    if (r) return r;
  }
  try { return game.move(s); } catch (e) { return null; }
}

function isUciMoveList(moves) {
  return Array.isArray(moves) && moves.length > 0 &&
    moves.every(m => /^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(String(m).trim()));
}

/**
 * Lichess UCI DB: FEN side-to-move plays moves[0] (opponent); solver is the other color.
 * SAN / player-to-move lists: FEN side-to-move is already the solver (moves[0] is theirs).
 */
function puzzleSolverColor(fen, moves) {
  const turn = new Chess(fen).turn();
  if (isUciMoveList(moves)) return turn === 'w' ? 'b' : 'w';
  return turn;
}

try { dotenv.config({ path: path.join(__dirname, '.env') }); } catch {}

const app = express();

// Explicit CORS — allow GitHub Pages and any other origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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
      // Fallback: try Groq → OpenRouter (same pattern as /api/chat-stream)
      const groqApiKey = process.env.GROQ_API_KEY;
      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      let groqErr = null;
      if (groqApiKey) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqApiKey}` },
            body: JSON.stringify({
              model: "mixtral-8x7b-32768",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
              ],
              temperature: 0.3,
              max_tokens: 1024
            })
          });
          const groqData = await groqRes.json();
          if (groqRes.ok) {
            reply = groqData.choices?.[0]?.message?.content || "";
          } else {
            groqErr = new Error(groqData.error?.message || `Groq HTTP ${groqRes.status}`);
          }
        } catch (e) { groqErr = e; }
      }
      if (!reply && openrouterApiKey) {
        try {
          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openrouterApiKey}`,
              "HTTP-Referer": "https://f-mine.app",
              "X-Title": "F-Mine Bot Proxy"
            },
            body: JSON.stringify({
              model: "openrouter/free",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
              ],
              temperature: 0.3,
              max_tokens: 1024
            })
          });
          const orData = await orRes.json();
          if (orRes.ok) {
            reply = orData.choices?.[0]?.message?.content || "";
          }
        } catch (e) { /* both failed */ }
      }
      if (!reply) throw new Error(groqErr ? `Groq: ${groqErr.message}` : "No API key configured on server.");
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
    
    // If the client provided their own key in Authorization header, use it.
    // Otherwise, use the keys from our environment.
    let userApiKey = "";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const userKey = authHeader.substring(7).trim();
      if (userKey && userKey !== "undefined" && userKey !== "null" && userKey !== "") {
        userApiKey = userKey;
      }
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const openrouterApiKey = userApiKey || process.env.OPENROUTER_API_KEY;

    async function _tryGroq() {
      if (!groqApiKey) throw new Error("GROQ_API_KEY not configured on server");
      const groqModel = "mixtral-8x7b-32768";
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: groqModel,
          messages: messages,
          temperature: temperature || 0.3,
          stream: false,
          max_tokens: max_tokens || 4096
        })
      });
      const data = await response.json();
      if (!response.ok) {
        const errMsg = data.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }
      return data;
    }

    async function _tryOpenRouter() {
      if (!openrouterApiKey) throw new Error("OpenRouter API key is missing. Add OPENROUTER_API_KEY to your server's .env file or enter one in the settings.");
      const url = "https://openrouter.ai/api/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openrouterApiKey}`,
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
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errMsg = errorData.error?.message || `HTTP ${response.status}`;
          console.error("OpenRouter stream error:", errMsg);
          res.write(`data: ${JSON.stringify({ error: { message: errMsg } })}\n\n`);
          return res.end();
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
        res.end();
      } else {
        const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
      }
    }

    if (stream) {
      await _tryOpenRouter();
    } else {
      // Non-streaming: try Groq first, fall back to OpenRouter
      try {
        const data = await _tryGroq();
        return res.json(data);
      } catch (groqErr) {
        console.warn("Groq failed, trying OpenRouter:", groqErr.message);
        await _tryOpenRouter();
      }
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

let matchmakingQueue = [];

app.get("/api/chess/create", (req, res) => {
  const { creator, mode, botDifficulty, botColor, creatorColor, timeControl, creatorRating } = req.query;
  if (!creator) {
    return res.status(400).json({ ok: false, error: "Creator nickname is required" });
  }

  const gameId = "CH-" + Math.floor(1000 + Math.random() * 9000);
  
  let playerWhite = null;
  let playerBlack = null;
  let assignedColor = "white";
  let playerWhiteRating = 1200;
  let playerBlackRating = 1200;
  const ratingVal = parseInt(creatorRating || "1200");

  if (mode === "bot") {
    let finalBotColor = botColor || "black";
    if (finalBotColor === "random") {
      finalBotColor = Math.random() < 0.5 ? "white" : "black";
    }
    if (finalBotColor === "white") {
      playerWhite = "Bot";
      playerBlack = creator;
      assignedColor = "black";
      playerBlackRating = ratingVal;
    } else {
      playerWhite = creator;
      playerBlack = "Bot";
      assignedColor = "white";
      playerWhiteRating = ratingVal;
    }
  } else {
    let chosenColor = creatorColor || "white";
    if (chosenColor === "random") {
      chosenColor = Math.random() < 0.5 ? "white" : "black";
    }
    if (chosenColor === "black") {
      playerBlack = creator;
      assignedColor = "black";
      playerBlackRating = ratingVal;
    } else {
      playerWhite = creator;
      assignedColor = "white";
      playerWhiteRating = ratingVal;
    }
  }

  const game = {
    id: gameId,
    status: mode === "bot" ? "playing" : "waiting",
    mode: mode || "multiplayer",
    playerWhite,
    playerBlack,
    playerWhiteRating,
    playerBlackRating,
    turn: "white",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moves: [],
    chat: [],
    botDifficulty: botDifficulty || "medium",
    timeControl: timeControl || "infinite",
    clocks: null,
    lastActive: Date.now()
  };

  chessGames.set(gameId, game);
  res.json({ ok: true, gameId, color: assignedColor });
});

// Ping endpoint — keeps Render server awake
app.get("/api/chess/ping", (req, res) => {
  res.json({ ok: true, status: "awake" });
});

app.get("/api/chess/join", (req, res) => {
  const { gameId, player, playerRating } = req.query;
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

  const ratingVal = parseInt(playerRating || "1200");
  let assignedColor = "black";
  if (game.playerWhite === null) {
    game.playerWhite = player;
    game.playerWhiteRating = ratingVal;
    assignedColor = "white";
  } else {
    game.playerBlack = player;
    game.playerBlackRating = ratingVal;
    assignedColor = "black";
  }

  game.status = "playing";
  game.lastActive = Date.now();

  res.json({ ok: true, gameId, color: assignedColor });
  
  // Broadcast update to the creator
  broadcastToGame(gameId, { type: "update", game });
});

app.get("/api/chess/matchmake", (req, res) => {
  const { player, timeControl, playerRating, clientId } = req.query;
  if (!player) {
    return res.status(400).json({ ok: false, error: "Player name is required" });
  }

  // Prune stale games in queue
  matchmakingQueue = matchmakingQueue.filter(item => {
    const g = chessGames.get(item.gameId);
    return g && g.status === "waiting";
  });

  const ratingVal = parseInt(playerRating || "1200");

  // Find game with matching time control and different client ID
  const matchIndex = matchmakingQueue.findIndex(item => item.timeControl === (timeControl || "infinite") && item.creatorClientId !== clientId);

  if (matchIndex !== -1) {
    const match = matchmakingQueue[matchIndex];
    matchmakingQueue.splice(matchIndex, 1); // Remove from queue

    const game = chessGames.get(match.gameId);
    
    // Join as opponent
    let color;
    if (game.playerWhite === null) {
      game.playerWhite = player;
      game.playerWhiteRating = ratingVal;
      color = "white";
    } else {
      game.playerBlack = player;
      game.playerBlackRating = ratingVal;
      color = "black";
    }
    game.status = "playing";
    game.lastActive = Date.now();

    res.json({ ok: true, gameId: match.gameId, color: color });
    
    // Broadcast "init" to start game for both
    broadcastToGame(match.gameId, { type: "init", game });
  } else {
    // Create new room and add to queue
    const gameId = "CH-" + Math.floor(1000 + Math.random() * 9000);
    const creatorColor = Math.random() < 0.5 ? "white" : "black";
    
    const game = {
      id: gameId,
      playerWhite: creatorColor === "white" ? player : null,
      playerBlack: creatorColor === "black" ? player : null,
      playerWhiteRating: creatorColor === "white" ? ratingVal : 1200,
      playerBlackRating: creatorColor === "black" ? ratingVal : 1200,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      moves: [],
      chat: [],
      status: "waiting",
      timeControl: timeControl || "infinite",
      clocks: null,
      turn: "white",
      lastActive: Date.now()
    };
    
    chessGames.set(gameId, game);
    
    matchmakingQueue.push({ gameId, timeControl: game.timeControl, creatorColor, creatorClientId: clientId });
    
    res.json({ ok: true, gameId: gameId, color: creatorColor });
  }
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
  const { gameId, fen, move, clocks } = req.body;
  const game = chessGames.get(gameId);
  if (!game) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }

  game.fen = fen;
  if (move) {
    game.moves.push(move);
  }
  if (clocks) {
    game.clocks = clocks;
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
        const game = chessGames.get(gameId);
        if (game && game.status === "waiting") {
          matchmakingQueue = matchmakingQueue.filter(item => item.gameId !== gameId);
          chessGames.delete(gameId);
        }
      }
    }
  });
});

app.post("/api/check-math", async (req, res) => {
  try {
    const { expression, userAnswer, expectedAnswer } = req.body;
    if (!expression || !userAnswer || !expectedAnswer) {
      return res.json({ equivalent: false, error: "Missing fields" });
    }
    const prompt = `You are a math equivalence checker. Determine if the user's answer is algebraically equivalent to the expected answer for the given expression.

Expression: ${expression}
Expected answer: ${expectedAnswer}
User's answer: ${userAnswer}

Reply with ONLY a JSON object: {"equivalent": true/false, "reason": "brief explanation"}`;

    const groqKey = process.env.GROQ_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    let reply = null;
    if (groqKey) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 200
          })
        });
        const d = await r.json();
        reply = d.choices?.[0]?.message?.content;
      } catch (e) { reply = null; }
    }
    if (!reply && openrouterKey) {
      try {
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openrouterKey}` },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-distill-llama-70b:free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 200
          })
        });
        const d = await r.json();
        reply = d.choices?.[0]?.message?.content;
      } catch (e) { reply = null; }
    }
    if (!reply) return res.json({ equivalent: false, error: "AI unavailable" });
    try {
      const parsed = JSON.parse(reply.replace(/^[^{]*/, "").replace(/[^}]*$/, ""));
      return res.json(parsed);
    } catch (e) {
      return res.json({ equivalent: false, error: "Parse failed", raw: reply });
    }
  } catch (e) {
    res.status(500).json({ equivalent: false, error: e.message });
  }
});

// ============================================================================
// CHESS PUZZLE ENGINE (NDJSON lazy-load, index ~250MB for 6M puzzles)
// ============================================================================

const PUZZLE_DB_PATH = path.join(__dirname, 'puzzles.json');

let puzzleIndex = [];       // [{id, rating, offset, lineLen, themes}] sorted by rating
let puzzleIdMap = new Map(); // id -> entry
let puzzleInMemory = new Map(); // id -> parsed puzzle object (for demo/small DBs)
let _puzzleFd = null;

const DEMO_PUZZLES = [
  '{"id":"demo1","fen":"r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4","moves":"d4 exd4 Nxd4","rating":1200,"themes":"fork"}\n',
  '{"id":"demo2","fen":"r1bqkb1r/pppp1ppp/2n5/4p3/2B1Pn2/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4","moves":"Nxe5 Nxe5 Bb5+","rating":1500,"themes":"pin"}\n',
  '{"id":"demo3","fen":"6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1","moves":"Kg7 Kh7 Kg8","rating":800,"themes":"endgame"}\n',
];

async function loadPuzzleDb() {
  try {
    if (!fs.existsSync(PUZZLE_DB_PATH) || fs.statSync(PUZZLE_DB_PATH).size === 0) {
      console.log('[puzzle-db] puzzles.json not found, downloading...');
      try {
        await downloadPuzzles(PUZZLE_DB_PATH);
      } catch (e) {
        console.error('[puzzle-db] Download failed:', e.message);
      }
    }
    if (fs.existsSync(PUZZLE_DB_PATH)) {
      const stats = fs.statSync(PUZZLE_DB_PATH);
      if (stats.size === 0) throw new Error('Empty file');
      const fd = fs.openSync(PUZZLE_DB_PATH, 'r');
      const buf = Buffer.alloc(65536);
      let filePos = 0, leftover = '';
      let cumOffset = 0;
      const entries = [];

      while (true) {
        const bytesRead = fs.readSync(fd, buf, 0, buf.length, filePos);
        if (bytesRead === 0) break;
        filePos += bytesRead;
        const chunk = leftover + buf.toString('utf8', 0, bytesRead);
        const lines = chunk.split('\n');
        leftover = lines.pop();
        for (const line of lines) {
          if (!line.trim()) { cumOffset += line.length + 1; continue; }
          try {
            const p = JSON.parse(line);
            if (p.id && typeof p.rating === 'number') {
              const entry = { id: p.id, rating: p.rating, offset: cumOffset, lineLen: line.length + 1, themes: p.themes || '' };
              entries.push(entry);
              puzzleIdMap.set(p.id, entry);
            }
          } catch {}
          cumOffset += line.length + 1;
        }
      }
      if (leftover.trim()) {
        const p = JSON.parse(leftover);
        if (p.id && typeof p.rating === 'number') {
          const entry = { id: p.id, rating: p.rating, offset: cumOffset, lineLen: leftover.length + 1, themes: p.themes || '' };
          entries.push(entry);
          puzzleIdMap.set(p.id, entry);
        }
      }
      fs.closeSync(fd);
      entries.sort((a, b) => a.rating - b.rating);
      puzzleIndex = entries;
      const mb = (entries.length * 48 / 1024 / 1024).toFixed(1);
      console.log(`Puzzle index built: ${puzzleIndex.length} puzzles, index ~${mb}MB RAM`);
    } else {
      for (const line of DEMO_PUZZLES) {
        const p = JSON.parse(line);
        const entry = { id: p.id, rating: p.rating, offset: 0, lineLen: line.length, themes: p.themes || '' };
        puzzleIndex.push(entry);
        puzzleIdMap.set(p.id, entry);
        puzzleInMemory.set(p.id, p);
      }
      puzzleIndex.sort((a, b) => a.rating - b.rating);
      console.log('Seeded 3 demo puzzles (in-memory)');
    }
  } catch (e) {
    console.error('Puzzle DB load error:', e.message);
    puzzleIndex = [];
    puzzleIdMap = new Map();
  }
}

function readPuzzleLine(entry) {
  if (puzzleInMemory.has(entry.id)) return puzzleInMemory.get(entry.id);
  if (!_puzzleFd) {
    try { _puzzleFd = fs.openSync(PUZZLE_DB_PATH, 'r'); } catch { return null; }
  }
  const buf = Buffer.alloc(entry.lineLen + 64);
  const bytes = fs.readSync(_puzzleFd, buf, 0, buf.length, entry.offset);
  const str = buf.toString('utf8', 0, bytes);
  const nl = str.indexOf('\n');
  const line = nl >= 0 ? str.slice(0, nl) : str.replace(/\n$/, '');
  return JSON.parse(line);
}

// Binary search by rating, then filter by theme
function findPuzzles(minRating, maxRating, theme) {
  let lo = 0, hi = puzzleIndex.length;
  while (lo < hi) { const m = (lo + hi) >>> 1; if (puzzleIndex[m].rating < minRating) lo = m + 1; else hi = m; }
  const start = lo;
  hi = puzzleIndex.length;
  while (lo < hi) { const m = (lo + hi) >>> 1; if (puzzleIndex[m].rating <= maxRating) lo = m + 1; else hi = m; }
  let candidates = puzzleIndex.slice(start, lo);
  if (theme) {
    const t = theme.toLowerCase();
    candidates = candidates.filter(e => e.themes.toLowerCase().split(' ').includes(t));
  }
  return candidates;
}

const DIFFICULTY_RANGES = [
  { level: 'easy',        min: 0,    max: 900   },
  { level: 'medium-easy', min: 901,  max: 1300  },
  { level: 'medium',      min: 1301, max: 1700  },
  { level: 'medium-hard',  min: 1701, max: 2100  },
  { level: 'hard',        min: 2101, max: 4000  },
];

const PUZZLE_DOWNLOAD_URL = 'https://github.com/bijan453/my-education-site-F-Mine-/releases/download/puzzles-v1/puzzles-subset.json';

function downloadPuzzles(targetPath) {
  return new Promise((resolve, reject) => {
    console.log('[puzzle-download] Starting download of puzzles.json...');
    const follow = (url) => {
      const mod = url.startsWith('https') ? https : http;
      mod.get(url, { headers: { 'User-Agent': 'puzzle-server' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log('[puzzle-download] Following redirect...');
          return follow(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        }
        const tmpPath = targetPath + '.tmp';
        const fd = fs.openSync(tmpPath, 'w');
        let downloaded = 0;
        res.on('data', (chunk) => {
          fs.writeSync(fd, chunk);
          downloaded += chunk.length;
          if (downloaded % (50 * 1024 * 1024) < chunk.length) {
            console.log(`[puzzle-download] ${(downloaded / 1e6).toFixed(0)}MB downloaded...`);
          }
        });
        res.on('end', () => {
          fs.closeSync(fd);
          fs.renameSync(tmpPath, targetPath);
          console.log(`[puzzle-download] Done! ${(downloaded / 1e6).toFixed(0)}MB saved.`);
          resolve();
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    follow(PUZZLE_DOWNLOAD_URL);
  });
}

// GET /api/puzzle/random?level=medium&theme=fork&minRating=1200&maxRating=1800
app.get('/api/puzzle/random', (req, res) => {
  let minR = parseInt(req.query.minRating);
  let maxR = parseInt(req.query.maxRating);
  const theme = req.query.theme || '';

  if (!isFinite(minR) || !isFinite(maxR)) {
    const level = req.query.level || 'medium';
    const range = DIFFICULTY_RANGES.find(r => r.level === level);
    if (!range) return res.status(400).json({ error: 'Invalid level. Use level or minRating+maxRating' });
    minR = range.min;
    maxR = range.max;
  }

  const entries = findPuzzles(minR, maxR, theme);
  if (!entries.length) return res.status(404).json({ error: 'No puzzles found' });

  for (let attempt = 0; attempt < 10; attempt++) {
    const entryR = entries[Math.floor(Math.random() * entries.length)];
    try {
      const p = readPuzzleLine(entryR);
      if (!p) continue;
      const movesArr = (p.moves || '').split(/\s+/).filter(Boolean);
      if (!movesArr.length) continue;

      const game = new Chess(p.fen);
      const lichess = isUciMoveList(movesArr);
      const solverColor = puzzleSolverColor(p.fen, movesArr);

      // Replay full line with real UCI/SAN application; skip if the solver gets mated
      let replayOk = true;
      for (const m of movesArr) {
        if (!applyPuzzleMove(game, m)) { replayOk = false; break; }
      }
      if (replayOk && game.isCheckmate() && game.turn() === solverColor) continue;

      return res.json({
        id: p.id, fen: p.fen, rating: p.rating,
        themes: (p.themes || '').split(' ').filter(Boolean),
        firstMove: lichess ? movesArr[0] : null,
        playerColor: solverColor,
        initialIndex: lichess ? 1 : 0,
        totalMoves: movesArr.length
      });
    } catch(e) { console.warn('[puzzle-random] attempt', attempt, 'failed:', e.message); continue; }
  }
  return res.status(500).json({ error: 'Failed to load puzzle' });
});

// POST /api/puzzle/move — validate a move
app.post('/api/puzzle/move', (req, res) => {
  try {
    const { puzzleId, moveIndex, userMove } = req.body || {};
    const entry = puzzleIdMap.get(puzzleId);
    if (!entry) return res.status(404).json({ error: 'Puzzle not found' });

    let row, moves, game, solverColor;
    try {
      row = readPuzzleLine(entry);
      moves = (row.moves || '').split(/\s+/).filter(Boolean);
      game = new Chess(row.fen);
      solverColor = puzzleSolverColor(row.fen, moves);
    } catch(e) { return res.status(500).json({ error: 'Failed to read puzzle' }); }

    let idx = moveIndex || 0;
    for (let i = 0; i < idx; i++) {
      if (!applyPuzzleMove(game, moves[i])) return res.status(400).json({ error: 'Invalid state' });
    }

    const result = { correct: false, completed: false };

    // If it's the opponent's turn (e.g. client still at 0), auto-play their book move
    if (idx < moves.length && game.turn() !== solverColor) {
      if (!applyPuzzleMove(game, moves[idx])) return res.status(400).json({ error: 'Invalid state' });
      idx++;
    }

    const expected = moves[idx];
    if (!expected) return res.json({ correct: true, completed: true, moveIndex: idx });

    if (userMove === expected) {
      result.correct = true;
      if (!applyPuzzleMove(game, userMove)) return res.status(500).json({ error: 'Invalid user move' });
      idx++;
      if (idx < moves.length) {
        const oppMove = moves[idx];
        if (!applyPuzzleMove(game, oppMove)) return res.status(500).json({ error: 'Invalid opponent move' });
        idx++;
        result.nextOpponentMove = oppMove;
      }
      result.completed = idx >= moves.length;
      // Extra safety: never mark complete if the solver was checkmated
      if (result.completed && game.isCheckmate() && game.turn() === solverColor) {
        result.correct = false;
        result.completed = false;
        delete result.nextOpponentMove;
      } else {
        result.moveIndex = idx;
      }
    }
    res.json(result);
  } catch(e) {
    console.error('Move handler error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/puzzle/solution?puzzleId=xxx — return ONE next move (show hint)
app.get('/api/puzzle/solution', (req, res) => {
  const { puzzleId, moveIndex } = req.query;
  const entry = puzzleIdMap.get(puzzleId);
  if (!entry) return res.status(404).json({ error: 'Puzzle not found' });
  let row, moves;
  try { row = readPuzzleLine(entry); moves = row.moves.split(' '); } catch(e) { return res.status(500).json({ error: 'Failed to read puzzle' }); }
  let idx = parseInt(moveIndex) || 0;
  if (idx < moves.length) {
    res.json({ nextMove: moves[idx], moveIndex: idx + 1 });
  } else {
    res.json({ nextMove: null, completed: true });
  }
});

// POST /api/puzzle/import-ndjson — streaming NDJSON upload (pipe puzzles.json directly)
app.post('/api/puzzle/import-ndjson', express.raw({ type: '*/*', limit: '2gb' }), (req, res) => {
  try {
    const body = req.body.toString('utf8');
    const lines = body.split('\n');
    let appended = 0;
    const fd = fs.openSync(PUZZLE_DB_PATH, 'a');
    const newEntries = [];
    try {
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const p = JSON.parse(line);
          if (p.id && p.fen && !puzzleIdMap.has(p.id)) {
            const raw = JSON.stringify({ id: p.id, fen: p.fen, moves: p.moves, rating: p.rating || 0, themes: p.themes || '' }) + '\n';
            const buf = Buffer.from(raw, 'utf8');
            const offset = fs.statSync(PUZZLE_DB_PATH).size;
            fs.writeSync(fd, buf, 0, buf.length);
            newEntries.push({ id: p.id, rating: p.rating || 0, offset, lineLen: buf.length, themes: p.themes || '' });
            puzzleIdMap.set(p.id, newEntries[newEntries.length - 1]);
            appended++;
          }
        } catch {}
      }
    } finally { fs.closeSync(fd); }
    if (newEntries.length) {
      puzzleIndex = puzzleIndex.concat(newEntries);
      puzzleIndex.sort((a, b) => a.rating - b.rating);
    }
    console.log(`[import-ndjson] imported ${appended}, total ${puzzleIdMap.size}`);
    res.json({ ok: true, imported: appended, total: puzzleIdMap.size });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/puzzle/import-batch — append NDJSON puzzles
app.post('/api/puzzle/import-batch', (req, res) => {
  const rows = req.body.puzzles;
  if (!Array.isArray(rows)) return res.status(400).json({ error: 'Expected {puzzles: [...]}' });
  let appended = 0;
  const fd = fs.openSync(PUZZLE_DB_PATH, 'a');
  const newEntries = [];
  try {
    for (const p of rows) {
      if (puzzleIdMap.has(p.id)) continue;
      const line = JSON.stringify({ id: p.id, fen: p.fen, moves: p.moves, rating: p.rating, themes: p.themes }) + '\n';
      const buf = Buffer.from(line, 'utf8');
      const offset = fs.statSync(PUZZLE_DB_PATH).size;
      fs.writeSync(fd, buf, 0, buf.length);
      const entry = { id: p.id, rating: p.rating, offset, lineLen: buf.length, themes: p.themes || '' };
      newEntries.push(entry);
      puzzleIdMap.set(p.id, entry);
      appended++;
    }
  } finally { fs.closeSync(fd); }
  if (newEntries.length) {
    puzzleIndex = puzzleIndex.concat(newEntries);
    puzzleIndex.sort((a, b) => a.rating - b.rating);
  }
  res.json({ imported: appended, total: puzzleIdMap.size });
});

// Elo update endpoint
app.post('/api/puzzle/rating', (req, res) => {
  const { currentRating, level, solved } = req.body;
  const cfg = {
    easy:        { K: 32, w: 0.3 },
    'medium-easy': { K: 32, w: 0.6 },
    medium:      { K: 32, w: 1.0 },
    'medium-hard': { K: 32, w: 1.5 },
    hard:        { K: 32, w: 2.0 },
  }[level];
  if (!cfg) return res.status(400).json({ error: 'Invalid level' });

  const expected = 1 / (1 + Math.pow(10, (1200 - currentRating) / 400));
  const actual = solved ? 1 : 0;
  let delta = Math.round(cfg.K * cfg.w * (actual - expected));
  if (!solved) {
    const pf = level === 'easy' ? 2.0 : level === 'hard' ? 0.3 : 1.0;
    delta = Math.round(delta * pf);
  }
  res.json({ newRating: Math.max(400, Math.min(3000, currentRating + delta)), delta });
});

// Free OpenRouter models — cascade when one hits rate limit
const PUZZLE_COACH_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'openai/gpt-oss-20b:free',
  'openrouter/free',
];

async function callOpenRouterCascade(messages, { temperature = 0.6, max_tokens = 350 } = {}) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    const err = new Error('OPENROUTER_API_KEY is missing in .env');
    err.code = 'NO_KEY';
    throw err;
  }
  let lastErr = null;
  for (const model of PUZZLE_COACH_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'https://fmine.local',
          'X-Title': 'F-Mine Puzzle Coach',
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await r.json().catch(() => ({}));
      
      if (data.error) {
        lastErr = new Error(data.error.message || `Error payload on ${model}`);
        console.warn('[puzzle-coach] skip error payload', model, data.error.message);
        continue;
      }
      
      if (r.status === 429 || r.status === 402 || r.status === 503) {
        lastErr = new Error((data.error && data.error.message) || `Rate limited on ${model}`);
        console.warn('[puzzle-coach] skip', model, r.status);
        continue;
      }
      if (!r.ok) {
        lastErr = new Error((data.error && data.error.message) || `HTTP ${r.status} on ${model}`);
        console.warn('[puzzle-coach] fail', model, lastErr.message);
        continue;
      }
      const text = data.choices?.[0]?.message?.content || '';
      if (!text.trim()) {
        lastErr = new Error(`Empty reply from ${model}`);
        continue;
      }
      return { text: text.trim(), model };
    } catch (e) {
      lastErr = e;
      console.warn('[puzzle-coach] error', model, e.message);
    }
  }
  throw lastErr || new Error('All free models failed');
}

// POST /api/puzzle/coach — AI trainer for puzzles (emoji style, free-model cascade)
// Clean response: strip chain-of-thought / thinking from free models
function cleanCoachReply(text) {
  if (!text) return text;
  // Remove ```<think>...</think>``` blocks
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Remove ```<thinking>...</thinking>``` blocks
  text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  // Remove ``` blocks of any kind
  text = text.replace(/```[\s\S]*?```/g, '').trim();

  // If response is long and has a preamble before emoji content, trim preamble
  const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u2702-\u27B0]/u;
  if (text.length > 200 && !text.match(/^\p{Emoji}/u)) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (emojiRe.test(lines[i]) || lines[i].startsWith('🎯') || lines[i].startsWith('💡') || lines[i].startsWith('♟') || lines[i].startsWith('🤔')) {
        const trimmed = lines.slice(i).join('\n').trim();
        if (trimmed.length > 10) return trimmed;
      }
    }
  }

  return text;
}
app.post('/api/puzzle/coach', async (req, res) => {
  try {
    const {
      mode = 'help',
      puzzleId: reqPuzzleId = '',
      fen = '',
      themes = '',
      rating: pRating = 0,
      lang: coachLang = 'en',
      userMessage = '',
      lastMove = '',
      wrongMove = '',
    } = req.body || {};

    // Look up puzzle solution from DB
    let solutionMoves = '';
    let puzzleFen = fen;
    if (reqPuzzleId) {
      const entry = puzzleIdMap.get(reqPuzzleId);
      if (entry) {
        try {
          const row = readPuzzleLine(entry);
          solutionMoves = row.moves || '';
          if (row.fen && !puzzleFen) puzzleFen = row.fen;
        } catch (e) { /* ignore read errors */ }
      }
    }

    const isRu = coachLang === 'ru';
    const solutionHint = solutionMoves
      ? `\n\nIMPORTANT: The correct solution moves for this puzzle are (UCI format): ${solutionMoves}.
The first move is white (e.g. "e2e4"), second is black's reply, etc.
Use this knowledge to guide the player. You MAY hint at squares or piece types, but never reveal the full move sequence unless mode is "explain-mistake" or the user explicitly asks.`
      : '';

    const system = `You are "F-Mine AI Trainer" — a cheerful chess puzzle coach.
Always use short sentences and friendly emojis (🎯 ♟️ 💡 🔥 ✅ 😅 👑).
Never dump long engine lines. Never spoil the full solution unless mode is "explain-mistake" or user explicitly asks for the answer.
Prefer guiding questions and ideas over giving the winning move.
Language: ${isRu ? 'Russian' : 'English'}.
Keep replies under 80 words.${solutionHint}`;

    let userPrompt = '';
    if (mode === 'greet') {
      // Client shows the fixed greeting; optional extra tip
      userPrompt = `New puzzle loaded. Themes: ${themes || 'unknown'}. Rating: ${pRating}. FEN: ${fen}.
Write ONE short motivational tip about the theme (no exact moves). Start with a relevant emoji.`;
    } else if (mode === 'idea') {
      userPrompt = `Puzzle themes: ${themes}. FEN: ${fen}. Rating ${pRating}.
Give a soft idea (what tactical motif to look for) without naming squares or the winning move. Use 🎯.`;
    } else if (mode === 'nudge') {
      userPrompt = `Player asks for a nudge. Themes: ${themes}. FEN: ${fen}. Last book progress move: ${lastMove || 'none'}.
Ask 1 guiding question + 1 tiny tip. No full solution.`;
    } else if (mode === 'explain-mistake') {
      userPrompt = `Player tried wrong move ${wrongMove || 'unknown'} in this position.
FEN: ${fen}. Themes: ${themes}.
Briefly explain why that idea fails and what to look at instead. No full solution line.`;
    } else {
      userPrompt = `Player says: ${userMessage || 'help'}
Position FEN: ${fen}. Themes: ${themes}. Rating ${pRating}.
Help them solve the puzzle like a coach. Use emojis.`;
    }

    const result = await callOpenRouterCascade([
      { role: 'system', content: system },
      { role: 'user', content: userPrompt },
    ]);
    res.json({ ok: true, reply: cleanCoachReply(result.text), model: result.model, mode });
  } catch (e) {
    console.error('Puzzle coach error:', e.message);
    const status = e.code === 'NO_KEY' ? 503 : 502;
    res.status(status).json({
      ok: false,
      error: e.message || 'Coach unavailable',
      reply: null,
    });
  }
});

// POST /api/puzzle/analyze — AI position analysis
app.post('/api/puzzle/analyze', async (req, res) => {
  try {
    const { fen, themes, lang } = req.body || {};
    if (!fen) return res.status(400).json({ ok: false, error: 'FEN required' });

    const isRu = lang === 'ru';
    const system = `You are a chess position analyst. Explain the position clearly and concisely.
Cover: material balance, king safety, key tactical ideas, and candidate moves.
${isRu ? 'Отвечай на русском.' : 'Answer in English.'}
Use bullet points. Keep under 120 words. Use chess notation.`;

    const userMsg = `Analyze this position:
FEN: ${fen}
${themes ? 'Themes: ' + themes : ''}

What are the key features? What should the player look for? Suggest 2-3 candidate moves with brief reasoning.`;

    const result = await callOpenRouterCascade([
      { role: 'system', content: system },
      { role: 'user', content: userMsg },
    ], { temperature: 0.4, max_tokens: 400 });

    res.json({ ok: true, reply: cleanCoachReply(result.text), model: result.model });
  } catch (e) {
    console.error('Analyze error:', e.message);
    res.status(502).json({ ok: false, error: e.message });
  }
});

// POST /api/trainer/analyze — Personal trainer: analyze user history and give recommendations
app.post('/api/trainer/analyze', async (req, res) => {
  try {
    const { history, rating, lang } = req.body || {};
    if (!history || !Array.isArray(history) || !history.length) {
      return res.status(400).json({ ok: false, error: 'History array required' });
    }

    const isRu = lang === 'ru';

    // Compute stats server-side
    const total = history.length;
    const solved = history.filter(h => h.solved).length;
    const failed = history.filter(h => !h.solved && !h.solutionViewed).length;
    const viewed = history.filter(h => h.solutionViewed).length;
    const avgTime = Math.round(history.reduce((s, h) => s + (h.time || 0), 0) / total);
    const bestTime = Math.min(...history.filter(h => h.solved && h.time > 0).map(h => h.time).concat([Infinity]));
    const accuracy = Math.round((solved / total) * 100);

    // Theme breakdown
    const themeStats = {};
    for (const h of history) {
      const themes = (h.themes || '').split(',').map(t => t.trim()).filter(Boolean);
      for (const th of themes) {
        if (!themeStats[th]) themeStats[th] = { total: 0, solved: 0 };
        themeStats[th].total++;
        if (h.solved) themeStats[th].solved++;
      }
    }

    const weakThemes = Object.entries(themeStats)
      .filter(([_, s]) => s.total >= 2 && (s.solved / s.total) < 0.6)
      .sort((a, b) => (a[1].solved / a[1].total) - (b[1].solved / b[1].total))
      .slice(0, 5)
      .map(([theme, s]) => `${theme}: ${s.solved}/${s.total} (${Math.round(s.solved / s.total * 100)}%)`);

    const strongThemes = Object.entries(themeStats)
      .filter(([_, s]) => s.total >= 2 && (s.solved / s.total) >= 0.7)
      .sort((a, b) => (b[1].solved / b[1].total) - (a[1].solved / a[1].total))
      .slice(0, 5)
      .map(([theme, s]) => `${theme}: ${s.solved}/${s.total} (${Math.round(s.solved / s.total * 100)}%)`);

    const system = `You are a personal chess training coach. Analyze the player's puzzle history and give personalized recommendations.
${isRu ? 'Отвечай на русском. Будь дружелюбным и мотивирующим.' : 'Answer in English. Be friendly and motivating.'}
Structure your response with:
1. Overall assessment (1-2 sentences)
2. Weak areas to focus on
3. Strengths to maintain
4. Specific training plan for the next week
5. Recommended rating range for puzzles
Keep under 200 words. Use emojis.`;

    const userMsg = `Player stats:
- Current rating: ${rating || 'unknown'}
- Total puzzles: ${total}
- Solved: ${solved} (${accuracy}% accuracy)
- Failed: ${failed}
- Viewed solution: ${viewed}
- Average solve time: ${avgTime}s
- Best solve time: ${bestTime === Infinity ? 'N/A' : bestTime + 's'}

Weak themes (low accuracy):
${weakThemes.length ? weakThemes.join('\n') : 'No data yet'}

Strong themes (high accuracy):
${strongThemes.length ? strongThemes.join('\n') : 'No data yet'}

Give me a personalized training plan.`;

    const result = await callOpenRouterCascade([
      { role: 'system', content: system },
      { role: 'user', content: userMsg },
    ], { temperature: 0.5, max_tokens: 600 });

    res.json({
      ok: true,
      reply: cleanCoachReply(result.text),
      model: result.model,
      stats: { total, solved, failed, viewed, accuracy, avgTime, bestTime: bestTime === Infinity ? 0 : bestTime, weakThemes, strongThemes, themeStats }
    });
  } catch (e) {
    console.error('Trainer analyze error:', e.message);
    res.status(502).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  loadPuzzleDb().catch(e => console.error('[puzzle-db] init error:', e.message));
});