// F-Mine Chess Arena Logic Controller

// --- STATE MANAGEMENT ---
let game = null;
let mode = 'bot'; // 'bot' or 'multiplayer'
let playerColor = 'white'; // 'white' or 'black'
let selectedSquare = null;
let possibleMoves = [];
let activeGameId = null;
let sseSource = null;
let botDifficulty = 'medium';
let botColor = 'black';
let isPersonalityActive = true;
let pendingPromotionMove = null;
let capturedPieces = { white: [], black: [] };

// Analysis Mode State
let isAnalysisMode = false;
let analysisMoves = []; // Array of { fen, move, score, classification, bestMove }
let currentAnalysisIndex = -1; // -1 means start position, 0 means move 1, etc.
let isAnalyzing = false;

// Time Control & Clocks State
let timeControl = 'infinite'; // 'infinite', '3', '5', '10', '15+10'
let selectedTime = 'infinite';
let whiteTime = 0; // in seconds
let blackTime = 0; // in seconds
let timeIncrement = 0; // in seconds
let timerInterval = null;

let currentSkin = localStorage.getItem("fmine_chess_skin") || "neon";
let isVoiceMuted = localStorage.getItem("fmine_chess_voice_muted") === "true";
let currentTtsAudio = null;

const userNick = localStorage.getItem("currentUser") || "Player";

// Helper: convert our 'white'/'black' to chess.js 'w'/'b'
function pc() {
  return playerColor === 'white' ? 'w' : 'b';
}

// --- TRANSLATION DICTIONARY ---
let LANG = (localStorage.getItem("fmine_lang") || "ru").toLowerCase();

const T = {
  ru: {
    title: "Шахматная Арена",
    sub: "Испытай свои силы против искусственного интеллекта или сразись с другом в реальном времени",
    modeNameBot: "Битва с ботом",
    modeDescBot: "Одиночная игра",
    modeNameMulti: "Сетевая дуэль",
    modeDescMulti: "Игра с друзьями",
    lblJoinRoom: "Войти по коду комнаты",
    btnStart: "▶ Начать бой",
    btnCreate: "🔑 Создать приватный бой",
    btnJoin: "⚔️ Войти",
    lblDiff: "Сложность бота",
    lblCol: "Ваш цвет",
    lblTimeControl: "Контроль времени",
    opening: "Дебют",
    lblPers: "Личность бота (ИИ комментатор)",
    btnOn: "Включен",
    btnOff: "Выключен",
    easy: "Новичок",
    medium: "Мастер",
    hard: "Гроссмейстер",
    white: "Белые",
    black: "Черные",
    random: "Случайный",
    turnWhite: "Ход: Белые",
    turnBlack: "Ход: Черные",
    drawOffer: "🤝 Предложить ничью",
    resign: "🏳 Сдаться",
    chatTab: "💬 Чат",
    movesTab: "📝 Ходы",
    chatPlaceholder: "Введите сообщение...",
    alertCopy: "Код скопирован в буфер обмена!",
    copied: "Скопировано!",
    connecting: "Подключение...",
    waitingOpponent: "Ожидание оппонента...",
    roomCode: "Код: ",
    noGame: "Игра не найдена",
    fullGame: "Игра уже заполнена",
    exit: "Выйти",
    rematch: "Сыграть ещё",
    drawDeclined: "Оппонент отклонил предложение ничьей.",
    drawAgreed: "Ничья по обоюдному согласию!",
    resigned: "вы сдались. Оппонент победил!",
    opponentResigned: "Оппонент сдался. Вы победили!",
    checkmate: "Мат. Игра окончена!",
    drawStalemate: "Ничья (пат)!",
    drawRepetition: "Ничья (трехкратное повторение)!",
    drawMaterial: "Ничья (недостаточно фигур)!",
    draw50Moves: "Ничья (правило 50 ходов)!",
    botThink: "Бот думает...",
    botName: "Бот",
    opponent: "Оппонент",
    btnGameOverAnalysis: "🔍 Анализ",
    accuracy: "🎯 Точность",
    category: "Категория",
    coachSummary: "Итог тренера",
    explainBtn: "💡 Объяснить этот ход",
    exitAnalysis: "↩️ Выйти из анализа",
    brilliant: "Блестящий ход",
    best: "Лучший ход",
    excellent: "Отличный ход",
    good: "Хороший ход",
    book: "Теория",
    inaccuracy: "Неточность",
    mistake: "Ошибка",
    blunder: "Зевок",
    noMoveSelected: "Ход не выбран",
    coachCommentaryText: "Выберите ход для просмотра детального анализа и лучшего продолжения.",
    lblYourRating: "Ваш сетевой рейтинг:",
    lblQuickMatch: "Поиск случайного соперника онлайн",
    btnQuickMatch: "🌍 Найти игру (Быстрый старт)",
    modeNamePuzzle: "Решать задачи",
    modeDescPuzzle: "Тактические задачи",
    lblPuzzleLevel: "Уровень сложности",
    btnStartPuzzle: "🧩 Начать решение",
    puzzleTask: "Задача",
    puzzleSolved: "Решено!",
    puzzleWrong: "Неверно!",
    puzzleHint: "💡 Подсказка",
    puzzleSolution: "👁 Решение",
    puzzleNext: "➡ Следующая",
    puzzleExit: "✕ Выйти",
    puzzleComplete: "🎉 Задача решена!",
    puzzleLevelDone: "🏆 Уровень пройден!",
    puzzleMoveWhite: "Ход белых",
    puzzleMoveBlack: "Ход черных",
    puzzleYourMove: "Ваш ход!",
    puzzleRating: "Ваш рейтинг:",
    lvl1: "Начинающий",
    lvl2: "Любитель",
    lvl3: "Игрок",
    lvl4: "Мастер",
    lvl5: "Эксперт",
    lvl6: "Гроссмейстер"
  },
  en: {
    title: "Chess Arena",
    sub: "Test your skills against AI or duel with a friend in real-time",
    modeNameBot: "Play vs Bot",
    modeDescBot: "Single player",
    modeNameMulti: "Online Duel",
    modeDescMulti: "Play with friends",
    lblJoinRoom: "Join by room code",
    btnStart: "▶ Start Match",
    btnCreate: "🔑 Create Private Match",
    btnJoin: "⚔️ Join",
    lblDiff: "Bot Difficulty",
    lblCol: "Your Color",
    lblTimeControl: "Time Control",
    opening: "Opening",
    lblPers: "Bot Personality (AI Commentator)",
    btnOn: "Enabled",
    btnOff: "Disabled",
    easy: "Beginner",
    medium: "Master",
    hard: "Grandmaster",
    white: "White",
    black: "Black",
    random: "Random",
    turnWhite: "Turn: White",
    turnBlack: "Turn: Black",
    drawOffer: "🤝 Offer Draw",
    resign: "🏳 Resign",
    chatTab: "💬 Chat",
    movesTab: "📝 Moves",
    chatPlaceholder: "Type a message...",
    alertCopy: "Code copied to clipboard!",
    copied: "Copied!",
    connecting: "Connecting...",
    waitingOpponent: "Waiting for opponent...",
    roomCode: "Code: ",
    noGame: "Game not found",
    fullGame: "Game already full",
    exit: "Exit",
    rematch: "Play Again",
    drawDeclined: "Opponent declined the draw offer.",
    drawAgreed: "Draw by mutual agreement!",
    resigned: "You resigned. Opponent wins!",
    opponentResigned: "Opponent resigned. You win!",
    checkmate: "Checkmate. Game over!",
    drawStalemate: "Draw (stalemate)!",
    drawRepetition: "Draw (threefold repetition)!",
    drawMaterial: "Draw (insufficient material)!",
    draw50Moves: "Draw (50-move rule)!",
    botThink: "Bot is thinking...",
    botName: "Bot",
    opponent: "Opponent",
    btnGameOverAnalysis: "🔍 Analyze",
    accuracy: "🎯 Accuracy",
    category: "Category",
    coachSummary: "Coach Summary",
    explainBtn: "💡 Explain this move",
    exitAnalysis: "↩️ Exit Analysis",
    brilliant: "Brilliant",
    best: "Best Move",
    excellent: "Excellent",
    good: "Good",
    book: "Book Move",
    inaccuracy: "Inaccuracy",
    mistake: "Mistake",
    blunder: "Blunder",
    noMoveSelected: "No move selected",
    coachCommentaryText: "Select a move to view detailed analysis and the best continuation.",
    lblYourRating: "Your online rating:",
    lblQuickMatch: "Find random opponent online",
    btnQuickMatch: "🌍 Find Match (Quick Start)",
    modeNamePuzzle: "Solve Puzzles",
    modeDescPuzzle: "Tactical puzzles",
    lblPuzzleLevel: "Difficulty Level",
    btnStartPuzzle: "🧩 Start Solving",
    puzzleTask: "Puzzle",
    puzzleSolved: "Correct!",
    puzzleWrong: "Wrong!",
    puzzleHint: "💡 Hint",
    puzzleSolution: "👁 Solution",
    puzzleNext: "➡ Next",
    puzzleExit: "✕ Exit",
    puzzleComplete: "🎉 Puzzle Solved!",
    puzzleLevelDone: "🏆 Level Complete!",
    puzzleMoveWhite: "White to move",
    puzzleMoveBlack: "Black to move",
    puzzleYourMove: "Your move!",
    puzzleRating: "Your rating:",
    lvl1: "Beginner",
    lvl2: "Amateur",
    lvl3: "Player",
    lvl4: "Master",
    lvl5: "Expert",
    lvl6: "Grandmaster"
  }
};

function t(key) {
  return T[LANG]?.[key] || T.ru[key] || key;
}

// --- LIGHT/DARK THEME SYSTEM ---
window.toggleTheme = function() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("fmine_theme", isLight ? "light" : "dark");
  showToast(isLight ? "☀ Светлая тема" : "🌙 Темная тема");
};

// Initialize Theme
if (localStorage.getItem("fmine_theme") === "light") {
  document.body.classList.add("light");
}

// --- SOUND SYNTHESIZER (WEB AUDIO API) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function synthTone(freq, type, duration, delay = 0) {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch (err) {
    console.error("Audio synth error:", err);
  }
}

function playMoveSound() {
  synthTone(800, 'triangle', 0.08);
}

function playCaptureSound() {
  synthTone(400, 'sawtooth', 0.12);
  synthTone(250, 'sawtooth', 0.1, 0.03);
}

function playCheckSound() {
  synthTone(520, 'sine', 0.2);
  synthTone(550, 'sine', 0.2, 0.02);
}

function playGameOverSound() {
  synthTone(440, 'sine', 0.25);
  synthTone(349, 'sine', 0.25, 0.1);
  synthTone(261, 'sine', 0.4, 0.2);
}

// --- CHESS PIECE SVG DRAWINGS ---
const PIECE_SVGS = {
  wp: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83.33-1.41 1.15-1.41 2.12 0 1.24 1.01 2.25 2.25 2.25h6.5c1.24 0 2.25-1.01 2.25-2.25 0-.97-.58-1.79-1.41-2.12C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  wn: `<svg viewBox="0 0 45 45"><path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14.5,22 15.5,22 C 16.5,22 17,22.5 17,23 C 17,23.5 15.5,25 15,26 C 14.5,27 15,29 17,28 C 19,27 21,26 22,26 C 23,26 25,27 25,29 C 25,31 23,31 22,31 C 21,31 20,30.5 20,30.5 C 20,30.5 18,33 22,33 C 26,33 27.5,31 27.5,29 C 27.5,27 26.5,25 25.5,24 C 24.5,23 25.5,20 26.5,19 C 27.5,18 29.5,18 29.5,18 C 29.5,18 29.5,16 28,14 C 26.5,12 24,10 22,10 z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" transform="matrix(0.861785,0.507278,-0.507278,0.861785,25.6664,-4.177)" fill="#000"/></svg>`,
  wb: `<svg viewBox="0 0 45 45"><path d="M9 36c3.39 0 7.66-.69 11.77-2.3 4-1.6 7.5-3.85 9.73-6.5a8.72 8.72 0 0 0 1.5-5.2c0-3-1.66-5.83-4.22-7.85-2.55-2.02-6-3.15-9.28-3.15s-6.73 1.13-9.28 3.15C6.66 16.17 5 19 5 22a8.72 8.72 0 0 0 1.5 5.2c2.22 2.65 5.73 4.9 9.73 6.5C20.34 35.31 24.61 36 28 36H9z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><circle cx="22.5" cy="5" r="2.5" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M17.5 18h10M22.5 13v10" stroke="#000" stroke-width="1.5"/></svg>`,
  wr: `<svg viewBox="0 0 45 45"><path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.5-4l1.5-12h14l1.5 12h-17zm-1.5-12h20v-5H11v5zm0-5h4v-3h-4v3zm8 0h4v-3h-4v3zm8 0h4v-3h-4v3z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  wq: `<svg viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm33 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM22.5 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM12 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm21 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M9 37h27v-3H9v3zm3.5-3l3-18 7 9 7-9 3 18h-20z"/></g></svg>`,
  wk: `<svg viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"><path d="M8.5 36.5h28v-3h-28v3zm4-3l2.5-16.5h20l2.5 16.5h-25z"/><path d="M11.5 17c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7zm22 0c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7z"/><path d="M22.5 5v14M15.5 12h14" stroke="#000" stroke-width="1.5"/></g></svg>`,
  
  bp: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83.33-1.41 1.15-1.41 2.12 0 1.24 1.01 2.25 2.25 2.25h6.5c1.24 0 2.25-1.01 2.25-2.25 0-.97-.58-1.79-1.41-2.12C28.06 24.84 29 23.03 29 21c0-2.03-.94-3.84-2.41-5.03.83-.33 1.41-1.15 1.41-2.12 0-1.24-1.01-2.25-2.25-2.25h-6.5z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  bn: `<svg viewBox="0 0 45 45"><path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14.5,22 15.5,22 C 16.5,22 17,22.5 17,23 C 17,23.5 15.5,25 15,26 C 14.5,27 15,29 17,28 C 19,27 21,26 22,26 C 23,26 25,27 25,29 C 25,31 23,31 22,31 C 21,31 20,30.5 20,30.5 C 20,30.5 18,33 22,33 C 26,33 27.5,31 27.5,29 C 27.5,27 26.5,25 25.5,24 C 24.5,23 25.5,20 26.5,19 C 27.5,18 29.5,18 29.5,18 C 29.5,18 29.5,16 28,14 C 26.5,12 24,10 22,10 z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" transform="matrix(0.861785,0.507278,-0.507278,0.861785,25.6664,-4.177)" fill="#fff"/></svg>`,
  bb: `<svg viewBox="0 0 45 45"><path d="M9 36c3.39 0 7.66-.69 11.77-2.3 4-1.6 7.5-3.85 9.73-6.5a8.72 8.72 0 0 0 1.5-5.2c0-3-1.66-5.83-4.22-7.85-2.55-2.02-6-3.15-9.28-3.15s-6.73 1.13-9.28 3.15C6.66 16.17 5 19 5 22a8.72 8.72 0 0 0 1.5 5.2c2.22 2.65 5.73 4.9 9.73 6.5C20.34 35.31 24.61 36 28 36H9z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><circle cx="22.5" cy="5" r="2.5" fill="#000" stroke="#fff" stroke-width="1.5"/><path d="M17.5 18h10M22.5 13v10" stroke="#fff" stroke-width="1.5"/></svg>`,
  br: `<svg viewBox="0 0 45 45"><path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.5-4l1.5-12h14l1.5 12h-17zm-1.5-12h20v-5H11v5zm0-5h4v-3h-4v3zm8 0h4v-3h-4v3zm8 0h4v-3h-4v3z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  bq: `<svg viewBox="0 0 45 45"><g fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm33 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM22.5 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM12 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm21 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M9 37h27v-3H9v3zm3.5-3l3-18 7 9 7-9 3 18h-20z"/></g></svg>`,
  bk: `<svg viewBox="0 0 45 45"><g fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"><path d="M8.5 36.5h28v-3h-28v3zm4-3l2.5-16.5h20l2.5 16.5h-25z"/><path d="M11.5 17c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7zm22 0c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7z"/><path d="M22.5 5v14M15.5 12h14" stroke="#fff" stroke-width="1.5"/></g></svg>`
};

// --- MULTILINGUAL TRANSLATION APPLIER ---
window.setLang = function(lang) {
  LANG = lang.toLowerCase();
  localStorage.setItem("fmine_lang", LANG);
  document.getElementById("langRuBtn").classList.toggle("active", LANG === "ru");
  document.getElementById("langEnBtn").classList.toggle("active", LANG === "en");
  
  applyTranslations();
};

function applyTranslations() {
  document.title = "F-Mine | " + t("title");
  document.getElementById("setupTitle").textContent = t("title");
  document.getElementById("setupSub").textContent = t("sub");
  
  document.getElementById("modeNameBot").textContent = t("modeNameBot");
  document.getElementById("modeDescBot").textContent = t("modeDescBot");
  document.getElementById("modeNameMulti").textContent = t("modeNameMulti");
  document.getElementById("modeDescMulti").textContent = t("modeDescMulti");
  
  const modeNamePuzzle = document.getElementById("modeNamePuzzle");
  if (modeNamePuzzle) modeNamePuzzle.textContent = t("modeNamePuzzle");
  const modeDescPuzzle = document.getElementById("modeDescPuzzle");
  if (modeDescPuzzle) modeDescPuzzle.textContent = t("modeDescPuzzle");
  
  document.getElementById("lblDifficulty").textContent = t("lblDiff");
  document.getElementById("optDiffEasy").textContent = t("easy");
  document.getElementById("optDiffMed").textContent = t("medium");
  document.getElementById("optDiffHard").textContent = t("hard");
  
  document.getElementById("lblColor").textContent = t("lblCol");
  document.getElementById("optColWhite").textContent = t("white");
  document.getElementById("optColRand").textContent = t("random");
  document.getElementById("optColBlack").textContent = t("black");

  const boardSkinEl = document.getElementById("lblBoardSkin");
  if (boardSkinEl) boardSkinEl.textContent = LANG === "ru" ? "Оформление (Скин)" : "Board Theme / Skin";
  const multiColorEl = document.getElementById("lblMultiColor");
  if (multiColorEl) multiColorEl.textContent = LANG === "ru" ? "Ваш цвет в дуэли" : "Your Color in Duel";
  const colWhiteMulti = document.getElementById("optColMultiWhite");
  if (colWhiteMulti) colWhiteMulti.textContent = t("white");
  const colRandMulti = document.getElementById("optColMultiRand");
  if (colRandMulti) colRandMulti.textContent = t("random");
  const colBlackMulti = document.getElementById("optColMultiBlack");
  if (colBlackMulti) colBlackMulti.textContent = t("black");

  const timeControlEl = document.getElementById("lblTimeControl");
  if (timeControlEl) timeControlEl.textContent = t("lblTimeControl");
  const timeInfiniteEl = document.getElementById("optTimeInfinite");
  if (timeInfiniteEl) timeInfiniteEl.textContent = LANG === "ru" ? "Без лимита" : "No Time";
  const time3El = document.getElementById("optTime3");
  if (time3El) time3El.textContent = LANG === "ru" ? "3 мин" : "3 Min";
  const time5El = document.getElementById("optTime5");
  if (time5El) time5El.textContent = LANG === "ru" ? "5 мин" : "5 Min";
  const time10El = document.getElementById("optTime10");
  if (time10El) time10El.textContent = LANG === "ru" ? "10 мин" : "10 Min";
  const time15El = document.getElementById("optTime15");
  if (time15El) time15El.textContent = LANG === "ru" ? "15 + 10" : "15 + 10";
  
  document.getElementById("lblBotPersonality").textContent = t("lblPers");
  document.getElementById("optPersOn").textContent = t("btnOn");
  document.getElementById("optPersOff").textContent = t("btnOff");
  
  document.getElementById("btnStartBot").textContent = t("btnStart");
  document.getElementById("btnCreateRoom").textContent = t("btnCreate");
  document.getElementById("lblCreateRoom").textContent = t("btnCreate");
  document.getElementById("lblJoinRoom").textContent = t("lblJoinRoom");
  document.getElementById("roomCodeInput").placeholder = LANG === "ru" ? "Код комнаты, напр: CH-5683" : "Room code, e.g. CH-5683";
  document.getElementById("btnJoinRoom").textContent = t("btnJoin");

  // Localized Rating & Matchmaking Labels
  const yourRatingEl = document.getElementById("lblYourRating");
  if (yourRatingEl) yourRatingEl.textContent = t("lblYourRating");
  const ratingBadge = document.getElementById("userRatingBadge");
  if (ratingBadge) {
    const r = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
    ratingBadge.textContent = getTitleAndRatingStr(r);
  }
  const quickMatchEl = document.getElementById("lblQuickMatch");
  if (quickMatchEl) quickMatchEl.textContent = t("lblQuickMatch");
  const btnQuickMatch = document.getElementById("btnQuickMatch");
  if (btnQuickMatch) btnQuickMatch.textContent = t("btnQuickMatch");
  
  document.getElementById("backLobbyBtn").textContent = LANG === "ru" ? "⬅ Лобби" : "⬅ Lobby";
  
  document.getElementById("tabMovesBtn").textContent = t("movesTab");
  document.getElementById("tabChatBtn").textContent = t("chatTab");
  
  document.getElementById("chatInput").placeholder = t("chatPlaceholder");
  document.getElementById("btnOfferDraw").textContent = t("drawOffer");
  document.getElementById("btnResign").textContent = t("resign");
  
  document.getElementById("promoTitle").textContent = LANG === "ru" ? "Выбор превращения" : "Pawn Promotion";
  document.getElementById("promoDesc").textContent = LANG === "ru" ? "Выберите фигуру, в которую превратится ваша пешка:" : "Select the piece to promote your pawn to:";
  
  document.getElementById("btnGameOverExit").textContent = t("exit");
  document.getElementById("btnGameOverRematch").textContent = t("rematch");
  
  const btnAnalysis = document.getElementById("btnGameOverAnalysis");
  if (btnAnalysis) btnAnalysis.textContent = t("btnGameOverAnalysis") || "🔍 Анализ";
  
  const lblAnalysisAccuracy = document.getElementById("lblAnalysisAccuracy");
  if (lblAnalysisAccuracy) lblAnalysisAccuracy.textContent = t("accuracy");
  
  const lblAnalysisCategory = document.getElementById("lblAnalysisCategory");
  if (lblAnalysisCategory) lblAnalysisCategory.textContent = t("category");
  
  const coachNameTitle = document.getElementById("coachNameTitle");
  if (coachNameTitle) coachNameTitle.textContent = LANG === 'ru' ? "ИИ Тренер" : "AI Coach";
  
  const coachSubTitle = document.getElementById("coachSubTitle");
  if (coachSubTitle) coachSubTitle.textContent = LANG === 'ru' ? "Анализ партии" : "Game Review";
  
  const btnExplainMove = document.getElementById("btnExplainMove");
  if (btnExplainMove) btnExplainMove.textContent = t("explainBtn");
  
  const btnExitAnalysis = document.getElementById("btnExitAnalysis");
  if (btnExitAnalysis) btnExitAnalysis.textContent = t("exitAnalysis");
  
  const tabAnalysisBtn = document.getElementById("tabAnalysisBtn");
  if (tabAnalysisBtn) tabAnalysisBtn.textContent = LANG === 'ru' ? "🔍 Анализ" : "🔍 Analysis";
  
  const loadingTitle = document.getElementById("analysisLoadingTitle");
  if (loadingTitle) loadingTitle.textContent = LANG === 'ru' ? "Анализ партии..." : "Analyzing game...";
  
  const loadingDesc = document.getElementById("analysisLoadingDesc");
  if (loadingDesc) loadingDesc.textContent = LANG === 'ru' ? "ИИ сканирует ходы на наличие блестящих решений и зевков." : "AI is scanning moves for brilliant ideas and blunders.";

  const lblPuzzleLevel = document.getElementById("lblPuzzleLevel");
  if (lblPuzzleLevel) lblPuzzleLevel.textContent = t("lblPuzzleLevel");

  for (let i = 1; i <= 6; i++) {
    const lvlNameEl = document.getElementById(`lvlName${i}`);
    if (lvlNameEl) lvlNameEl.textContent = t(`lvl${i}`);
  }

  const lblPuzzleRating = document.getElementById("lblPuzzleRating");
  if (lblPuzzleRating) lblPuzzleRating.textContent = t("puzzleRating");

  const btnStartPuzzle = document.getElementById("btnStartPuzzle");
  if (btnStartPuzzle) btnStartPuzzle.textContent = t("btnStartPuzzle");

  const btnPuzzleHint = document.getElementById("btnPuzzleHint");
  if (btnPuzzleHint) btnPuzzleHint.textContent = t("puzzleHint");

  const btnPuzzleSolution = document.getElementById("btnPuzzleSolution");
  if (btnPuzzleSolution) btnPuzzleSolution.textContent = t("puzzleSolution");

  const btnPuzzleNext = document.getElementById("btnPuzzleNext");
  if (btnPuzzleNext) btnPuzzleNext.textContent = t("puzzleNext");

  const btnPuzzleExit = document.getElementById("btnPuzzleExit");
  if (btnPuzzleExit) btnPuzzleExit.textContent = t("puzzleExit");

  const btnPuzzleCompleteNext = document.getElementById("btnPuzzleCompleteNext");
  if (btnPuzzleCompleteNext) btnPuzzleCompleteNext.textContent = t("puzzleNext");

  const btnPuzzleCompleteExit = document.getElementById("btnPuzzleCompleteExit");
  if (btnPuzzleCompleteExit) btnPuzzleCompleteExit.textContent = t("puzzleExit");

  updateTurnIndicator();
  renderMovesLog();
}

// --- SETUP SCREEN TRIGGERS ---
window.selectMode = function(m) {
  mode = m;
  document.getElementById("btnModeBot").classList.toggle("active", m === "bot");
  document.getElementById("btnModeMulti").classList.toggle("active", m === "multiplayer");
  const puzzleBtn = document.getElementById("btnModePuzzle");
  if (puzzleBtn) puzzleBtn.classList.toggle("active", m === "puzzle");
  
  document.getElementById("panelBot").classList.toggle("active", m === "bot");
  document.getElementById("panelMulti").classList.toggle("active", m === "multiplayer");
  const panelPuzzle = document.getElementById("panelPuzzle");
  if (panelPuzzle) panelPuzzle.classList.toggle("active", m === "puzzle");
  
  // Update puzzle level progress when switching to puzzle mode
  if (m === "puzzle") {
    updatePuzzleLevelProgress();
  }
};

window.selectDiff = function(diff) {
  botDifficulty = diff;
  document.getElementById("optDiffEasy").classList.toggle("active", diff === "easy");
  document.getElementById("optDiffMed").classList.toggle("active", diff === "medium");
  document.getElementById("optDiffHard").classList.toggle("active", diff === "hard");
};

// selectedPlayerColor stores what color the PLAYER wants to play as
let selectedPlayerColor = 'white';
window.selectColor = function(col) {
  selectedPlayerColor = col;
  const ids = ["White", "Rand", "Black"];
  const valMap = { White: "white", Rand: "random", Black: "black" };
  
  ids.forEach(id => {
    const val = valMap[id];
    const botBtn = document.getElementById(`optCol${id}`);
    const multiBtn = document.getElementById(`optColMulti${id}`);
    if (botBtn) botBtn.classList.toggle("active", val === col);
    if (multiBtn) multiBtn.classList.toggle("active", val === col);
  });
};

window.togglePersonality = function(active) {
  isPersonalityActive = active;
  document.getElementById("optPersOn").classList.toggle("active", active);
  document.getElementById("optPersOff").classList.toggle("active", !active);
};

// --- CHAT WIDGET SWITCHING ---
window.switchSideTab = function(tab) {
  const tabMoves = document.getElementById("tabMovesBtn");
  const tabChat = document.getElementById("tabChatBtn");
  const tabAnalysis = document.getElementById("tabAnalysisBtn");
  
  if (tabMoves) tabMoves.classList.toggle("active", tab === "moves");
  if (tabChat) tabChat.classList.toggle("active", tab === "chat");
  if (tabAnalysis) tabAnalysis.classList.toggle("active", tab === "analysis");
  
  const panelMoves = document.getElementById("panelMoves");
  const panelChat = document.getElementById("panelChat");
  const panelAnalysis = document.getElementById("panelAnalysis");
  
  if (panelMoves) panelMoves.classList.toggle("active", tab === "moves");
  if (panelChat) panelChat.classList.toggle("active", tab === "chat");
  if (panelAnalysis) panelAnalysis.classList.toggle("active", tab === "analysis");
};

// --- SERVER HTTP HELPER ---
const SERVER_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || !window.location.protocol.startsWith('http'))
  ? 'http://localhost:3000'
  : 'https://my-education-site-f-mine.onrender.com';

// Wake up the Render server silently when the page loads
fetch(`${SERVER_URL}/api/chess/ping`).catch(() => {});

// Simple timeout using Promise.race
function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(
      typeof LANG !== 'undefined' && LANG === 'ru'
        ? 'Сервер не отвечает. Попробуй ещё раз.'
        : 'Server not responding. Try again.'
    )), ms)
  );
  return Promise.race([promise, timer]);
}

async function apiCall(endpoint, body = {}) {
  // Use GET for create/join/matchmake to avoid CORS preflight; POST for everything else
  const useGet = endpoint === 'create' || endpoint === 'join' || endpoint === 'matchmake';
  try {
    let fetchPromise;
    if (useGet) {
      const params = new URLSearchParams(body).toString();
      fetchPromise = fetch(`${SERVER_URL}/api/chess/${endpoint}?${params}`);
    } else {
      fetchPromise = fetch(`${SERVER_URL}/api/chess/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    }
    const res = await withTimeout(fetchPromise, 20000);
    const data = await res.json();
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || 'Server error');
    }
    return data;
  } catch (err) {
    showToast(`\u274c ${err.message}`);
    throw err;
  }
}



// --- NOTIFICATION TOASTS ---
function showToast(msg) {
  let tDiv = document.getElementById("toast");
  if (!tDiv) {
    tDiv = document.createElement("div");
    tDiv.id = "toast";
    // Apply default/fallback CSS styles to the dynamically created toast
    tDiv.style.position = "fixed";
    tDiv.style.bottom = "24px";
    tDiv.style.left = "50%";
    tDiv.style.transform = "translateX(-50%) translateY(20px)";
    tDiv.style.background = "rgba(7, 9, 19, .95)";
    tDiv.style.border = "1px solid rgba(167, 139, 250, .25)";
    tDiv.style.padding = "12px 24px";
    tDiv.style.borderRadius = "99px";
    tDiv.style.fontSize = "13px";
    tDiv.style.fontWeight = "700";
    tDiv.style.color = "#f3f6ff";
    tDiv.style.boxShadow = "0 10px 30px rgba(0,0,0,.5)";
    tDiv.style.opacity = "0";
    tDiv.style.pointerEvents = "none";
    tDiv.style.transition = "transform .25s ease, opacity .25s ease";
    tDiv.style.zIndex = "10000";
    document.body.appendChild(tDiv);
  }
  
  // Force a reflow to make sure transition plays nicely
  tDiv.offsetHeight;
  
  tDiv.textContent = msg;
  tDiv.classList.add("show");
  tDiv.style.opacity = "1";
  tDiv.style.transform = "translateX(-50%) translateY(0)";
  
  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }
  
  window.toastTimeout = setTimeout(() => {
    tDiv.classList.remove("show");
    tDiv.style.opacity = "0";
    tDiv.style.transform = "translateX(-50%) translateY(20px)";
  }, 3000);
}

// --- GAME INITIATIONS ---
window.startGame = function() {
  mode = "bot";
  game = new Chess();
  clearActiveGameStorage(); // Clear active multiplayer game state
  
  // playerColor = what color the human plays as
  let chosenColor = selectedPlayerColor;
  if (chosenColor === "random") {
    chosenColor = Math.random() < 0.5 ? "white" : "black";
  }
  playerColor = chosenColor;
  botColor = playerColor === 'white' ? 'black' : 'white';
  
  // Set names
  const rating = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
  document.getElementById("playerName").textContent = `${userNick} ${getTitleAndRatingStr(rating)}`;
  document.getElementById("opponentName").textContent = `${t("botName")} (${t(botDifficulty)})`;
  
  // Update colors on layout cards
  const playerDot = document.getElementById("playerColorDot");
  const opponentDot = document.getElementById("opponentColorDot");
  playerDot.className = `player-color-dot ${playerColor}`;
  opponentDot.className = `player-color-dot ${playerColor === 'white' ? 'black' : 'white'}`;
  
  // Load local score record for bot play
  renderBotScoreHistory();

  // Hide settings, show arena
  document.getElementById("setupView").style.display = "none";
  document.getElementById("arenaView").classList.add("active");
  document.getElementById("btnGameOverRematch").classList.remove("hidden");
  
  setupSSE(null); // No SSE for bot mode
  
  // Initialize Clocks, Eval Bar, and Opening Detector
  initTimeClocks(selectedTime);
  updateLiveEvalBar();
  updateOpeningName();
  
  renderBoard();
  updateTurnIndicator();
  addChatMessage("system", LANG === 'ru' ? "Игра началась против ИИ." : "Match started against AI.");
  
  if (playerColor === 'black') {
    // Bot goes first as White
    triggerBotMove();
  }
  
  // Start countdown ticking
  startClockTicking();
};

window.restartBotGame = function() {
  document.getElementById("gameOverModal").classList.remove("active");
  startGame();
};

window.createRoom = async function() {
  const btn = document.getElementById('btnCreateRoom');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = LANG === 'ru' ? '⏳ Пробуждение сервера (до 1 мин)...' : '⏳ Waking server (up to 1 min)...'; }

  try {
    // Ping server first to wake it up (Render Free Tier cold start can take 40-60s)
    await withTimeout(fetch(`${SERVER_URL}/api/chess/ping`), 75000);

    const myRating = localStorage.getItem("fmine_chess_rating") || "1200";

    if (btn) btn.textContent = LANG === 'ru' ? '⏳ Создаём комнату...' : '⏳ Creating room...';
    const data = await apiCall('create', { creator: userNick, mode: 'multiplayer', creatorColor: selectedPlayerColor, timeControl: selectedTime, creatorRating: myRating });
    activeGameId = data.gameId;
    playerColor = data.color;

    localStorage.setItem('fmine_active_chess_game', activeGameId);
    localStorage.setItem('fmine_active_chess_color', playerColor);

    document.getElementById('playerName').textContent = `${userNick} ${getTitleAndRatingStr(parseInt(myRating))}`;
    document.getElementById('opponentName').textContent = t('waitingOpponent');

    const playerDot = document.getElementById('playerColorDot');
    const opponentDot = document.getElementById('opponentColorDot');
    playerDot.className = `player-color-dot ${playerColor}`;
    opponentDot.className = `player-color-dot ${playerColor === 'white' ? 'black' : 'white'}`;

    document.getElementById('btnGameOverRematch').classList.add('hidden');
    document.getElementById('roomCodeBadge').classList.remove('hidden');
    document.getElementById('roomCodeBadge').textContent = `${t('roomCode')}${activeGameId}`;

    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${activeGameId}`;
    try { await navigator.clipboard.writeText(inviteLink); } catch {}
    showToast(LANG === 'ru'
      ? '\u2705 \u041a\u043e\u043c\u043d\u0430\u0442\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0430! \u0421\u0441\u044b\u043b\u043a\u0430 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430 \u2014 \u043e\u0442\u043f\u0440\u0430\u0432\u044c \u0434\u0440\u0443\u0433\u0443!'
      : '\u2705 Room created! Invite link copied \u2014 share with friend!');

    document.getElementById('setupView').style.display = 'none';
    document.getElementById('arenaView').classList.add('active');

    setupSSE(activeGameId);
  } catch (err) {
    console.error(err);
    showToast(LANG === 'ru'
      ? '\u274c \u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043a\u043e\u043c\u043d\u0430\u0442\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437.'
      : '\u274c Could not create room. Try again.');
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
};

window.joinRoom = async function() {
  const code = document.getElementById("roomCodeInput").value.trim().toUpperCase();
  if (!code) {
    showToast(LANG === 'ru' ? "Введите код комнаты" : "Enter room code");
    return;
  }

  const btn = document.getElementById('btnJoinRoom');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = LANG === 'ru' ? '⏳...' : '⏳...'; }
  
  try {
    const myRating = localStorage.getItem("fmine_chess_rating") || "1200";
    const data = await apiCall("join", { gameId: code, player: userNick, playerRating: myRating });
    activeGameId = data.gameId;
    playerColor = data.color;
    
    localStorage.setItem("fmine_active_chess_game", activeGameId);
    localStorage.setItem("fmine_active_chess_color", playerColor);

    document.getElementById("playerName").textContent = `${userNick} ${getTitleAndRatingStr(parseInt(myRating))}`;
    
    const playerDot = document.getElementById("playerColorDot");
    const opponentDot = document.getElementById("opponentColorDot");
    playerDot.className = `player-color-dot ${playerColor}`;
    opponentDot.className = `player-color-dot ${playerColor === 'white' ? 'black' : 'white'}`;
    
    document.getElementById("btnGameOverRematch").classList.add("hidden");
    document.getElementById("roomCodeBadge").classList.remove("hidden");
    document.getElementById("roomCodeBadge").textContent = `${t("roomCode")}${activeGameId}`;
    
    document.getElementById("setupView").style.display = "none";
    document.getElementById("arenaView").classList.add("active");
    
    setupSSE(activeGameId);
  } catch (err) {
    console.error(err);
    if (btn) { btn.disabled = false; btn.textContent = origText; }
    // err.message already shown by apiCall via showToast
    // Extra hint if game not found
    if (err.message && (err.message.includes('not found') || err.message.includes('не найд'))) {
      setTimeout(() => showToast(
        LANG === 'ru'
          ? '💡 Подсказка: Попроси друга создать комнату заново и скинуть новую ссылку'
          : '💡 Tip: Ask your friend to create a new room and share the fresh link'
      ), 2500);
    }
  }
};

window.copyRoomCode = function() {
  if (activeGameId) {
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${activeGameId}`;
    navigator.clipboard.writeText(inviteLink);
    showToast(LANG === 'ru' ? "Ссылка-приглашение скопирована!" : "Invite link copied to clipboard!");
  }
};

// --- REAL-TIME MULTIPLAYER SYNCER (SSE) ---
let sseReconnectAttempts = 0;
let sseReconnectTimer = null;
let waitingPollInterval = null;

function cleanupSSE() {
  if (sseSource) {
    sseSource.close();
    sseSource = null;
  }
  if (sseReconnectTimer) {
    clearTimeout(sseReconnectTimer);
    sseReconnectTimer = null;
  }
  if (waitingPollInterval) {
    clearInterval(waitingPollInterval);
    waitingPollInterval = null;
  }
  sseReconnectAttempts = 0;
}

function setupSSE(gameId) {
  cleanupSSE();
  
  if (!gameId) return;

  function handleSSEMessage(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === "init") {
      // Successfully connected — reset reconnect counter
      sseReconnectAttempts = 0;
      
      game = new Chess();
      if (data.game.moves && data.game.moves.length > 0) {
        for (const m of data.game.moves) {
          game.move({ from: m.from, to: m.to, promotion: m.promotion });
        }
      } else {
        game = new Chess(data.game.fen);
      }
      loadGameSnapshot(data.game);
      
      // If game is now playing and we had a waiting poll, stop it
      if (data.game.status === "playing" && waitingPollInterval) {
        clearInterval(waitingPollInterval);
        waitingPollInterval = null;
      }
      
      // Start polling fallback if we're still waiting for an opponent
      if (data.game.status === "waiting" && !waitingPollInterval) {
        startWaitingPoll(gameId);
      }
    } else if (data.type === "update") {
      sseReconnectAttempts = 0;
      
      const oldFen = game.fen();
      game = new Chess();
      if (data.game.moves && data.game.moves.length > 0) {
        for (const m of data.game.moves) {
          game.move({ from: m.from, to: m.to, promotion: m.promotion });
        }
      } else {
        game = new Chess(data.game.fen);
      }
      
      loadGameSnapshot(data.game);
      
      // Stop waiting poll if game started
      if (data.game.status === "playing" && waitingPollInterval) {
        clearInterval(waitingPollInterval);
        waitingPollInterval = null;
      }
      
      if (oldFen !== data.game.fen) {
        // Play sounds based on last move
        if (data.game.moves.length > 0) {
          const lastMove = data.game.moves[data.game.moves.length - 1];
          if (lastMove.san && lastMove.san.includes("+")) {
            playCheckSound();
          } else if (lastMove.san && lastMove.san.includes("x")) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
        } else {
          playMoveSound();
        }
      }
    } else if (data.type === "chat") {
      appendChatMessage(data.message);
    } else if (data.type === "draw_offer") {
      if (data.sender !== userNick) {
        showDrawOfferPrompt(data.sender);
      }
    } else if (data.type === "draw_declined") {
      if (data.player !== userNick) {
        showToast(LANG === 'ru' ? "Оппонент отклонил ничью." : "Opponent declined the draw offer.");
      }
    } else if (data.type === "draw_agreed") {
      playGameOverSound();
      document.getElementById("gameOverTitle").textContent = t("drawAgreed");
      document.getElementById("gameOverDesc").textContent = LANG === 'ru' ? "Ничья по обоюдному согласию." : "Draw by mutual agreement.";
      document.getElementById("gameOverModal").classList.add("active");
      clearActiveGameStorage();
      updateRatingMultiplayer('draw');
    } else if (data.type === "resigned") {
      playGameOverSound();
      document.getElementById("gameOverTitle").textContent = LANG === 'ru' ? "Игра завершена!" : "Game Over!";
      document.getElementById("gameOverDesc").textContent = data.winner === userNick ? 
        (LANG === 'ru' ? "Оппонент сдался. Вы победили!" : "Opponent resigned. You win!") :
        (LANG === 'ru' ? "Вы сдались. Оппонент победил!" : "You resigned. Opponent wins!");
      document.getElementById("gameOverModal").classList.add("active");
      clearActiveGameStorage();
      updateRatingMultiplayer(data.winner === userNick ? 'win' : 'loss');
    }
  }

  function connectSSE() {
    if (sseSource) {
      sseSource.close();
      sseSource = null;
    }
    
    sseSource = new EventSource(`${SERVER_URL}/api/chess/stream/${gameId}`);
    sseSource.onmessage = handleSSEMessage;
    
    sseSource.onopen = function() {
      console.log("[SSE] Connected to game stream:", gameId);
      sseReconnectAttempts = 0;
    };
    
    sseSource.onerror = function() {
      console.error("[SSE] Connection lost. Reconnecting...");
      if (sseSource) {
        sseSource.close();
        sseSource = null;
      }
      
      if (sseReconnectAttempts < 15) {
        const delay = Math.min(1000 * Math.pow(1.5, sseReconnectAttempts), 30000);
        sseReconnectAttempts++;
        console.log(`[SSE] Reconnect attempt ${sseReconnectAttempts} in ${Math.round(delay)}ms`);
        sseReconnectTimer = setTimeout(connectSSE, delay);
      } else {
        console.error("[SSE] Max reconnect attempts reached.");
        showToast(LANG === 'ru' ? "Соединение потеряно. Обновите страницу." : "Connection lost. Please refresh.");
      }
    };
  }

  connectSSE();
}

// Polling fallback: checks game status while waiting for opponent
// This catches the case where SSE misses the opponent-join broadcast
function startWaitingPoll(gameId) {
  if (waitingPollInterval) clearInterval(waitingPollInterval);
  
  waitingPollInterval = setInterval(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chess/status/${gameId}`);
      const data = await res.json();
      if (data.ok && data.status === "playing") {
        // Opponent joined but SSE missed it — reconnect SSE to get fresh state
        console.log("[Poll] Opponent joined! Reconnecting SSE...");
        clearInterval(waitingPollInterval);
        waitingPollInterval = null;
        // Force SSE reconnect to get full game state with opponent info
        sseReconnectAttempts = 0;
        if (sseSource) {
          sseSource.close();
          sseSource = null;
        }
        setupSSE(gameId);
      }
    } catch (e) {
      // Silently ignore poll errors
    }
  }, 5000);
}

function loadGameSnapshot(srvGame) {
  // Update player names with rating/title
  const myRating = playerColor === 'white' ? srvGame.playerWhiteRating : srvGame.playerBlackRating;
  const oppRating = playerColor === 'white' ? srvGame.playerBlackRating : srvGame.playerWhiteRating;
  const oppName = playerColor === 'white' ? srvGame.playerBlack : srvGame.playerWhite;

  const myRatingStr = getTitleAndRatingStr(myRating || 1200);
  const oppRatingStr = getTitleAndRatingStr(oppRating || 1200);

  document.getElementById("playerName").textContent = `${userNick} ${myRatingStr}`;
  document.getElementById("opponentName").textContent = oppName
    ? `${oppName} ${oppRatingStr}`
    : t("waitingOpponent");
  
  renderBoard();
  updateTurnIndicator();
  renderMovesLog();
  recalculateCapturedPieces();
  
  // Clear chat and reload
  const chatMsgs = document.getElementById("chatMsgs");
  chatMsgs.innerHTML = "";
  srvGame.chat.forEach(msg => appendChatMessage(msg));
  
  // Verify rules outcome
  checkRulesGameStatus();

  // Load clock settings and state from server
  if (srvGame.timeControl && srvGame.timeControl !== "infinite") {
    timeControl = srvGame.timeControl;
    if (timeControl === "15+10") {
      timeIncrement = 10;
    } else {
      timeIncrement = 0;
    }
    
    if (srvGame.clocks) {
      whiteTime = srvGame.clocks.whiteTime;
      blackTime = srvGame.clocks.blackTime;
    } else {
      initTimeClocks(timeControl);
    }
    
    const myTimer = document.getElementById("playerTimer");
    const oppTimer = document.getElementById("opponentTimer");
    if (myTimer) myTimer.classList.remove("hidden");
    if (oppTimer) oppTimer.classList.remove("hidden");
    
    updateClocksUI();
    
    if (srvGame.status === "playing") {
      startClockTicking();
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  } else {
    timeControl = "infinite";
    const myTimer = document.getElementById("playerTimer");
    const oppTimer = document.getElementById("opponentTimer");
    if (myTimer) myTimer.classList.add("hidden");
    if (oppTimer) oppTimer.classList.add("hidden");
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  // Update live evaluation bar and opening detector
  updateLiveEvalBar();
  updateOpeningName();
}

// --- RENDER BOARD & DRAW VECTOR GRAPHICS ---
function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  
  const inCheck = game.in_check();
  let checkedKingSquare = null;
  if (inCheck) {
    // Find the king of the active color in check
    const activeColor = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sqName = getSquareName(f, r);
        const p = game.get(sqName);
        if (p && p.type === 'k' && p.color === activeColor) {
          checkedKingSquare = sqName;
          break;
        }
      }
      if (checkedKingSquare) break;
    }
  }

  // Find last move squares for highlighting
  let lastMoveFrom = null;
  let lastMoveTo = null;
  if (isAnalysisMode && currentAnalysisIndex >= 0) {
    const am = analysisMoves[currentAnalysisIndex];
    if (am && am.move) {
      lastMoveFrom = am.move.from;
      lastMoveTo = am.move.to;
    }
  } else {
    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const lm = history[history.length - 1];
      lastMoveFrom = lm.from;
      lastMoveTo = lm.to;
    }
  }
  
  // Draw file/rank squares (White views 1-8, Black views 8-1)
  const isWhite = (playerColor === 'white');
  
  for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
    const r = isWhite ? (7 - rowIdx) : rowIdx; // 7 to 0 for White, 0 to 7 for Black
    
    for (let colIdx = 0; colIdx < 8; colIdx++) {
      const f = isWhite ? colIdx : (7 - colIdx); // 0 to 7 for White, 7 to 0 for Black
      
      const sqName = getSquareName(f, r);
      const piece = game.get(sqName);
      
      const sqEl = document.createElement("div");
      sqEl.className = `square ${(r + f) % 2 === 0 ? 'dark-square' : 'light-square'}`;
      sqEl.dataset.square = sqName;
      
      // Selected highlight
      if (selectedSquare === sqName) {
        sqEl.classList.add("selected");
      }
      
      // Check highlight
      if (checkedKingSquare === sqName) {
        sqEl.classList.add("in-check");
      }
      
      // Last move highlight
      if (sqName === lastMoveFrom || sqName === lastMoveTo) {
        sqEl.classList.add("last-move");
      }
      
      // Add coordinate labels at corners
      if (isWhite) {
        if (f === 0) {
          const lbl = document.createElement("span");
          lbl.className = "coords-rank";
          lbl.textContent = r + 1;
          sqEl.appendChild(lbl);
        }
        if (r === 0) {
          const lbl = document.createElement("span");
          lbl.className = "coords-file";
          lbl.textContent = String.fromCharCode(97 + f);
          sqEl.appendChild(lbl);
        }
      } else {
        if (f === 7) {
          const lbl = document.createElement("span");
          lbl.className = "coords-rank";
          lbl.textContent = r + 1;
          sqEl.appendChild(lbl);
        }
        if (r === 7) {
          const lbl = document.createElement("span");
          lbl.className = "coords-file";
          lbl.textContent = String.fromCharCode(97 + f);
          sqEl.appendChild(lbl);
        }
      }
      
      // Render Move Hints (dots or circles)
      if (possibleMoves.includes(sqName)) {
        const hint = document.createElement("div");
        hint.className = piece ? "ring-hint" : "dot-hint";
        sqEl.appendChild(hint);
      }
      
      // Render Move Quality Badge on Board in Analysis Mode
      if (isAnalysisMode && currentAnalysisIndex >= 0 && sqName === lastMoveTo) {
        const am = analysisMoves[currentAnalysisIndex];
        if (am && am.classification) {
          const badgeEl = document.createElement("div");
          badgeEl.className = `square-badge ${am.classification}`;
          const symbols = { brilliant: '🌟', best: '👑', excellent: '✨', good: '👍', book: '📖', inaccuracy: '❓', mistake: '⚠️', blunder: '❌' };
          badgeEl.textContent = symbols[am.classification] || '';
          badgeEl.title = t(am.classification);
          sqEl.appendChild(badgeEl);
        }
      }
      
      // Render Piece graphic
      if (piece) {
        const pieceKey = `${piece.color}${piece.type}`;
        const pEl = document.createElement("div");
        pEl.className = "piece";
        pEl.draggable = !isAnalysisMode && (piece.color === pc()) && (game.turn() === pc());
        pEl.innerHTML = getPieceSvg(pieceKey, currentSkin);
        
        // Drag-and-Drop Event Handlers
        pEl.ondragstart = (e) => {
          if (isAnalysisMode) {
            e.preventDefault();
            return;
          }
          if (mode === 'multiplayer' && game.turn() !== pc()) {
            e.preventDefault();
            return;
          }
          if (mode === 'bot' && game.turn() !== pc()) {
            e.preventDefault();
            return;
          }
          
          pEl.classList.add("dragging");
          selectedSquare = sqName;
          possibleMoves = game.moves({ square: sqName, verbose: true }).map(m => m.to);
          renderBoard();
          e.dataTransfer.setData("text/plain", sqName);
        };
        pEl.ondragend = () => {
          pEl.classList.remove("dragging");
        };
        
        sqEl.appendChild(pEl);
      }
      
      // Click Handlers (alternative to drag-and-drop)
      sqEl.onclick = () => {
        if (isAnalysisMode) return;
        handleSquareClick(sqName);
      };
      
      // Allow Drop
      sqEl.ondragover = (e) => {
        e.preventDefault();
      };
      sqEl.ondrop = (e) => {
        e.preventDefault();
        const fromSq = e.dataTransfer.getData("text/plain");
        if (fromSq && fromSq !== sqName) {
          attemptMove(fromSq, sqName);
        }
      };
      
      boardEl.appendChild(sqEl);
    }
  }
}

function getSquareName(file, rank) {
  return `${String.fromCharCode(97 + file)}${rank + 1}`;
}

// --- CLICK MOVEMENT CONTROLLER ---
function handleSquareClick(sqName) {
  if (mode === 'multiplayer' && game.turn() !== pc()) return;
  if (mode === 'bot' && game.turn() !== pc()) return;

  const piece = game.get(sqName);
  
  if (selectedSquare === null) {
    // Select first square (must be player's piece)
    if (piece && piece.color === pc()) {
      selectedSquare = sqName;
      possibleMoves = game.moves({ square: sqName, verbose: true }).map(m => m.to);
      renderBoard();
    }
  } else {
    // Square already selected
    if (possibleMoves.includes(sqName)) {
      // Execute move
      attemptMove(selectedSquare, sqName);
    } else {
      // Select different square
      if (piece && piece.color === pc()) {
        selectedSquare = sqName;
        possibleMoves = game.moves({ square: sqName, verbose: true }).map(m => m.to);
      } else {
        selectedSquare = null;
        possibleMoves = [];
      }
      renderBoard();
    }
  }
}

// --- ATTEMPT AND VALIDATE MOVES ---
async function attemptMove(from, to) {
  const moves = game.moves({ square: from, verbose: true });
  const matched = moves.find(m => m.to === to);
  
  if (!matched) return;
  
  // Check for pawn promotion
  if (matched.flags.includes('p')) {
    pendingPromotionMove = { from, to };
    document.getElementById("promotionModal").classList.add("active");
    return;
  }
  
  executeBoardMove(from, to);
}

window.promoteTo = function(pieceCode) {
  document.getElementById("promotionModal").classList.remove("active");
  if (pendingPromotionMove) {
    executeBoardMove(pendingPromotionMove.from, pendingPromotionMove.to, pieceCode);
    pendingPromotionMove = null;
  }
};

async function executeBoardMove(from, to, promotion = undefined) {
  if (mode === 'puzzle') {
    handlePuzzleMove(from, to, promotion);
    selectedSquare = null;
    possibleMoves = [];
    return;
  }
  const isCapture = game.get(to) !== null || (game.get(from) && game.get(from).type === 'p' && from[0] !== to[0] && game.get(to) === null);
  
  // Make the move in chess.js rules engine
  const moveObj = game.move({ from, to, promotion: promotion });
  
  if (!moveObj) return;
  
  selectedSquare = null;
  possibleMoves = [];
  
  // Play sounds
  if (game.in_check()) {
    playCheckSound();
  } else if (isCapture) {
    playCaptureSound();
  } else {
    playMoveSound();
  }
  
  renderBoard();
  updateTurnIndicator();
  renderMovesLog();
  recalculateCapturedPieces();
  
  const isGameOver = checkRulesGameStatus();
  
  // Clocks, Eval Bar, and Opening Detector updates
  if (timeControl !== "infinite") {
    // game.turn() represents the next side to move.
    // If the next turn is 'b', then 'w' (White) just moved.
    // If the next turn is 'w', then 'b' (Black) just moved.
    if (game.turn() === 'b') {
      whiteTime += timeIncrement;
    } else {
      blackTime += timeIncrement;
    }
    updateClocksUI();
  }
  
  updateLiveEvalBar();
  updateOpeningName();
  startClockTicking();
  
  if (mode === "bot") {
    if (!isGameOver) {
      triggerBotMove();
    }
  } else {
    // Sync with Multiplayer Node Server
    try {
      await apiCall("move", {
        gameId: activeGameId,
        fen: game.fen(),
        move: { from, to, promotion, san: moveObj.san },
        clocks: { whiteTime, blackTime }
      });
    } catch {}
  }
}

// --- AI BOT LOGIC (MINIMAX WITH ALPHA-BETA) ---
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Piece-Square tables for positioning evaluation
const PST_PAWN = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];
const PST_KNIGHT = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];
const PST_BISHOP = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];
const PST_ROOK = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];
const PST_QUEEN = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  5,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];
const PST_KING_MIDDLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

function evaluateBoard(board) {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece) {
        const val = PIECE_VALUES[piece.type];
        let pSqScore = 0;
        
        const indexRow = piece.color === 'w' ? r : (7 - r);
        const indexCol = piece.color === 'w' ? f : (7 - f);
        
        switch (piece.type) {
          case 'p': pSqScore = PST_PAWN[indexRow][indexCol]; break;
          case 'n': pSqScore = PST_KNIGHT[indexRow][indexCol]; break;
          case 'b': pSqScore = PST_BISHOP[indexRow][indexCol]; break;
          case 'r': pSqScore = PST_ROOK[indexRow][indexCol]; break;
          case 'q': pSqScore = PST_QUEEN[indexRow][indexCol]; break;
          case 'k': pSqScore = PST_KING_MIDDLE[indexRow][indexCol]; break;
        }
        
        const pieceVal = val + pSqScore;
        score += piece.color === 'w' ? pieceVal : -pieceVal;
      }
    }
  }
  return score;
}

// Alpha-Beta Minimax search
function minimax(depth, gameInstance, alpha, beta, isMaximizing) {
  if (depth === 0 || gameInstance.game_over()) {
    return evaluateBoard(gameInstance.board());
  }

  const moves = gameInstance.moves({ verbose: true });
  // Move ordering: put captures first to optimize alpha-beta cuts
  moves.sort((a, b) => {
    const aVal = a.captured ? PIECE_VALUES[a.captured] : 0;
    const bVal = b.captured ? PIECE_VALUES[b.captured] : 0;
    return bVal - aVal;
  });

  if (isMaximizing) {
    let maxVal = -Infinity;
    for (const move of moves) {
      gameInstance.move(move);
      const val = minimax(depth - 1, gameInstance, alpha, beta, false);
      gameInstance.undo();
      maxVal = Math.max(maxVal, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break; // Cutoff
    }
    return maxVal;
  } else {
    let minVal = Infinity;
    for (const move of moves) {
      gameInstance.move(move);
      const val = minimax(depth - 1, gameInstance, alpha, beta, true);
      gameInstance.undo();
      minVal = Math.min(minVal, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break; // Cutoff
    }
    return minVal;
  }
}

function selectBestMove(diff) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const botIsWhite = (playerColor === 'black');

  // EASY DIFFICULTY: Random moves or basic capture check
  if (diff === 'easy') {
    // 50% chance of random capture if available
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.5) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // MEDIUM/HARD DIFFICULTY: Minimax Search
  const depth = diff === 'medium' ? 3 : 4;
  let bestMove = null;
  let bestVal = botIsWhite ? -Infinity : Infinity;

  // Ordering captures first
  moves.sort((a, b) => {
    const aVal = a.captured ? PIECE_VALUES[a.captured] : 0;
    const bVal = b.captured ? PIECE_VALUES[b.captured] : 0;
    return bVal - aVal;
  });

  for (const move of moves) {
    game.move(move);
    const scoreVal = minimax(depth - 1, game, -Infinity, Infinity, !botIsWhite);
    game.undo();

    if (botIsWhite) {
      if (scoreVal > bestVal) {
        bestVal = scoreVal;
        bestMove = move;
      }
    } else {
      if (scoreVal < bestVal) {
        bestVal = scoreVal;
        bestMove = move;
      }
    }
  }

  // Fallback to random if search fails (e.g. edge cases)
  return bestMove || moves[Math.floor(Math.random() * moves.length)];
}

function triggerBotMove() {
  document.getElementById("turnIndicator").textContent = t("botThink");
  
  // Simulated thinking delay (300-800ms)
  setTimeout(() => {
    const bestMove = selectBestMove(botDifficulty);
    if (bestMove) {
      const isCapture = bestMove.captured !== undefined;
      const san = game.move(bestMove).san;
      
      // Play sounds
      if (game.in_check()) {
        playCheckSound();
      } else if (isCapture) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
      
      renderBoard();
      updateTurnIndicator();
      renderMovesLog();
      recalculateCapturedPieces();
      
      // Bot Commentary Trigger
      if (isPersonalityActive) {
        generateBotCommentary(bestMove, san);
      }
      
      checkRulesGameStatus();
      
      // Clocks, Eval Bar, and Opening Detector updates for Bot move
      if (timeControl !== "infinite") {
        if (game.turn() === 'w') {
          blackTime += timeIncrement;
        } else {
          whiteTime += timeIncrement;
        }
        updateClocksUI();
      }
      
      updateLiveEvalBar();
      updateOpeningName();
      startClockTicking();
    }
  }, Math.floor(300 + Math.random() * 500));
}

// --- BOT AI COMMENTARY PERSONALITY ---
const COMMENTARY_POOL = {
  ru: {
    opening: [
      "Хороший дебют. Посмотрим, насколько прочна твоя теория.",
      "Классическое начало! Интересно, какой план ты выберешь.",
      "Развитие фигур — ключ к победе."
    ],
    check: [
      "Шах! Твой король в опасности.",
      "Внимательнее! Королю объявлен шах.",
      "Опасный ход, защищай своего короля!"
    ],
    capture: [
      "Твоя фигура пала в бою!",
      "Отличный размен для меня.",
      "Забираю фигуру! Будь внимательнее."
    ],
    lost: [
      "Ой! Кажется, я потерял ценную фигуру.",
      "Хитрый ход! Мои фигуры отступают.",
      "Твой размен сработал. Молодчина."
    ],
    winning: [
      "Моя позиция выглядит очень прочной.",
      "Кажется, ты совершил небольшую оплошность.",
      "Мой перевес растет. Защищайся!"
    ],
    losing: [
      "У тебя отличная атака! Мне приходится несладко.",
      "Хорошая тактика! Я совершил ошибку.",
      "Оборона пробита. Придется проявить изобретательность."
    ]
  },
  en: {
    opening: [
      "A classic opening! Let's see how well you know the theory.",
      "Developing pieces early. Good strategy.",
      "An interesting start to our match!"
    ],
    check: [
      "Check! Your King must move.",
      "Be careful, I've checked your King.",
      "A critical check! How will you escape?"
    ],
    capture: [
      "I captured your piece! Keep your guard up.",
      "A nice material gain for me.",
      "A clean trade. Let's keep going."
    ],
    lost: [
      "Ah! I lost a piece. Well played.",
      "A sneaky move! I did not foresee this loss.",
      "Nice play, you trapped my piece."
    ],
    winning: [
      "My advantage is growing. Can you turn it around?",
      "You are in a difficult spot now.",
      "My pieces are controling the board!"
    ],
    losing: [
      "Excellent attack! I am struggling to defend.",
      "You have a very strong position. Impressive.",
      "A blunder on my part! You are playing extremely well."
    ]
  }
};

function generateBotCommentary(move, san) {
  const pool = COMMENTARY_POOL[LANG] || COMMENTARY_POOL.ru;
  let text = "";
  
  const moveCount = Math.floor(game.history().length / 2);
  const evaluation = evaluateBoard(game.board());
  const botIsWhite = (playerColor === 'black');
  
  if (moveCount <= 3) {
    text = pool.opening[Math.floor(Math.random() * pool.opening.length)];
  } else if (san.includes("#") || san.includes("+")) {
    text = pool.check[Math.floor(Math.random() * pool.check.length)];
  } else if (move.captured) {
    text = pool.capture[Math.floor(Math.random() * pool.capture.length)];
  } else {
    // Positional evaluation
    const margin = evaluation * (botIsWhite ? 1 : -1);
    if (margin > 300) {
      text = pool.winning[Math.floor(Math.random() * pool.winning.length)];
    } else if (margin < -300) {
      text = pool.losing[Math.floor(Math.random() * pool.losing.length)];
    }
  }
  
  if (text) {
    addChatMessage(t("botName"), text);
    speakText(text);
  }
}

// --- SCORE HISTORY RECORD (LOCAL STORAGE) ---
function getBotRecordKey() {
  return `fmine_chess_bot_${botDifficulty}`;
}

function renderBotScoreHistory() {
  const key = getBotRecordKey();
  const record = JSON.parse(localStorage.getItem(key) || '{"w":0,"l":0,"d":0}');
  document.getElementById("playerRecord").textContent = `(W: ${record.w} | L: ${record.l} | D: ${record.d})`;
}

function updateBotScoreRecord(outcome) {
  const key = getBotRecordKey();
  const record = JSON.parse(localStorage.getItem(key) || '{"w":0,"l":0,"d":0}');
  if (outcome === 'win') record.w++;
  if (outcome === 'loss') record.l++;
  if (outcome === 'draw') record.d++;
  localStorage.setItem(key, JSON.stringify(record));
  renderBotScoreHistory();
}

// --- RULE ENFORCEMENT & OUTCOME DISPLAYS ---
function checkRulesGameStatus() {
  let isGameOver = false;
  let title = "";
  let desc = "";
  let outcome = ""; // 'win', 'loss', 'draw'
  
  if (game.in_checkmate()) {
    isGameOver = true;
    const loser = game.turn(); // The player whose turn it is is mated
    const winnerColor = loser === 'w' ? 'black' : 'white';
    
    title = t("checkmate");
    desc = winnerColor === 'white' ? 
      (LANG === 'ru' ? "Белые победили матом." : "White wins by checkmate.") : 
      (LANG === 'ru' ? "Черные победили матом." : "Black wins by checkmate.");
      
    outcome = playerColor === winnerColor ? 'win' : 'loss';
  } else if (game.in_draw()) {
    isGameOver = true;
    outcome = 'draw';
    
    if (game.in_stalemate()) {
      title = t("drawStalemate");
      desc = LANG === 'ru' ? "Королю некуда ходить, шах не объявлен." : "King has no moves, no check is active.";
    } else if (game.in_threefold_repetition()) {
      title = t("drawRepetition");
      desc = LANG === 'ru' ? "Повторение ходов трижды." : "The same board position occurred three times.";
    } else if (game.insufficient_material()) {
      title = t("drawMaterial");
      desc = LANG === 'ru' ? "Недостаточно фигур для мата." : "Insufficient pieces on board to mate.";
    } else {
      title = t("draw50Moves");
      desc = LANG === 'ru' ? "50 ходов сделано без движения пешек или взятий." : "50 moves made without pawn push or captures.";
    }
  }
  
  if (isGameOver) {
    playGameOverSound();
    
    document.getElementById("gameOverTitle").textContent = title;
    document.getElementById("gameOverDesc").textContent = desc;
    document.getElementById("gameOverModal").classList.add("active");
    
    // Save record if bot mode
    if (mode === "bot") {
      updateBotScoreRecord(outcome);
    } else {
      clearActiveGameStorage();
      updateRatingMultiplayer(outcome);
    }
  }
  
  return isGameOver;
}

// --- ACTION BAR COMMANDS ---
window.offerDraw = async function() {
  if (game.game_over()) return;
  
  if (mode === 'bot') {
    // Bot evaluation of draw: accept if evaluation is extremely close to equal (-120 to 120)
    const score = evaluateBoard(game.board());
    if (Math.abs(score) <= 120) {
      showToast(t("drawAgreed"));
      playGameOverSound();
      document.getElementById("gameOverTitle").textContent = t("drawAgreed");
      document.getElementById("gameOverDesc").textContent = LANG === 'ru' ? "Ничья по согласию сторон." : "Draw by mutual agreement.";
      document.getElementById("gameOverModal").classList.add("active");
      updateBotScoreRecord('draw');
    } else {
      showToast(t("drawDeclined"));
    }
  } else {
    try {
      await apiCall("draw-offer", {
        gameId: activeGameId,
        player: userNick
      });
      showToast(LANG === 'ru' ? "Предложение ничьей отправлено." : "Draw offer sent.");
    } catch {}
  }
};

window.resignGame = async function() {
  if (game.game_over()) return;
  
  if (mode === 'bot') {
    playGameOverSound();
    document.getElementById("gameOverTitle").textContent = LANG === 'ru' ? "Поражение" : "Defeat";
    document.getElementById("gameOverDesc").textContent = t("resigned");
    document.getElementById("gameOverModal").classList.add("active");
    updateBotScoreRecord('loss');
  } else {
    try {
      await apiCall("resign", {
        gameId: activeGameId,
        player: userNick
      });
    } catch {}
  }
};

window.closeGameOverAndExit = function() {
  document.getElementById("gameOverModal").classList.remove("active");
  exitGameView();
};

function exitGameView() {
  if (sseSource) {
    sseSource.close();
    sseSource = null;
  }
  
  document.getElementById("arenaView").classList.remove("active");
  document.getElementById("roomCodeBadge").classList.add("hidden");
  document.getElementById("setupView").style.display = "block";
  activeGameId = null;
}

// --- MOVE HISTORY PANEL RENDERING ---
function renderMovesLog() {
  if (!game) return; // Guard: game not started yet
  const listEl = document.getElementById("movesList");
  if (!listEl) return;
  listEl.innerHTML = "";
  
  const history = game.history({ verbose: true });
  
  for (let i = 0; i < history.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const moveW = history[i];
    const moveB = history[i + 1];
    
    const numEl = document.createElement("div");
    numEl.className = "move-num";
    numEl.textContent = `${moveNum}.`;
    listEl.appendChild(numEl);
    
    const wEl = document.createElement("div");
    wEl.className = "move-cell";
    wEl.textContent = moveW.san;
    wEl.onclick = () => showHistoricalMove(i);
    listEl.appendChild(wEl);
    
    if (moveB) {
      const bEl = document.createElement("div");
      bEl.className = "move-cell";
      bEl.textContent = moveB.san;
      bEl.onclick = () => showHistoricalMove(i + 1);
      listEl.appendChild(bEl);
    } else {
      listEl.appendChild(document.createElement("div"));
    }
  }
  
  // Highlight the current log row
  const logCells = listEl.querySelectorAll(".move-cell");
  if (logCells.length > 0) {
    logCells[logCells.length - 1].classList.add("current");
  }
  
  // Auto-scroll moves tab
  listEl.scrollTop = listEl.scrollHeight;
}

function showHistoricalMove(index) {
  // Can expand to let players review previous moves on board.
  // Kept simple for standard gameplay flow.
}

// --- TURN INDICATOR APPLIER ---
function updateTurnIndicator() {
  if (!game) return; // Guard: game not started yet
  const turnInd = document.getElementById("turnIndicator");
  if (!turnInd) return;
  const turn = game.turn();
  
  if (turn === 'w') {
    turnInd.textContent = t("turnWhite");
    turnInd.style.color = "";
  } else {
    turnInd.textContent = t("turnBlack");
    turnInd.style.color = document.body.classList.contains("light") ? "#171329" : "var(--text2)";
  }
}

// --- TAKEN PIECES RECALCULATOR ---
function recalculateCapturedPieces() {
  const initial = {
    p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
  };
  
  const current = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  };
  
  // Count remaining
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece) {
        current[piece.color][piece.type]++;
      }
    }
  }
  
  // Renders captured icons: White captures Black pieces, Black captures White pieces
  const mapSymbols = {
    p: '♟', n: '♞', b: '♝', r: '♜', q: '♛'
  };
  
  const playerCapEl = document.getElementById("playerCaptured");
  const opponentCapEl = document.getElementById("opponentCaptured");
  
  let playerCapturedStr = "";
  let opponentCapturedStr = "";
  
  const pColor = playerColor[0]; // 'w' or 'b'
  const oColor = playerColor === 'white' ? 'b' : 'w';
  
  // Player captures (Opponent's dead pieces)
  for (const type of ['p', 'n', 'b', 'r', 'q']) {
    const diff = initial[type] - current[oColor][type];
    if (diff > 0) {
      playerCapturedStr += mapSymbols[type].repeat(diff);
    }
  }
  
  // Opponent captures (Player's dead pieces)
  for (const type of ['p', 'n', 'b', 'r', 'q']) {
    const diff = initial[type] - current[pColor][type];
    if (diff > 0) {
      opponentCapturedStr += mapSymbols[type].repeat(diff);
    }
  }
  
  playerCapEl.textContent = playerCapturedStr;
  opponentCapEl.textContent = opponentCapturedStr;
}

// --- CHAT SYSTEM MODULE ---
window.sendChat = async function() {
  const inp = document.getElementById("chatInput");
  const text = inp.value.trim();
  if (!text) return;
  
  inp.value = "";
  
  if (mode === 'bot') {
    // Local message append
    appendChatMessage({ sender: userNick, text, timestamp: Date.now() });
    
    // AI Bot replies in chat using standard rule statements or funny remarks
    if (isPersonalityActive) {
      setTimeout(() => {
        const responses = LANG === 'ru' ? 
          ["Интересная мысль! Но давай сосредоточимся на шахматах.", "Твой ход говорит громче слов.", "Ты хорошо держишься!", "Хм... мне нужно крепко задуматься над моим ходом."] :
          ["Interesting point! Let's focus on the board though.", "Your moves speak louder than words.", "You are holding up well!", "Hmm... I need to think carefully about my next action."];
        appendChatMessage({
          sender: t("botName"),
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: Date.now()
        });
      }, 600);
    }
  } else {
    // Send to multiplayer SSE room
    try {
      await apiCall("chat", { gameId: activeGameId, sender: userNick, text });
    } catch {}
  }
};

function addChatMessage(sender, text) {
  // Utilized for system/local notes
  appendChatMessage({ sender, text, timestamp: Date.now() });
}

function appendChatMessage(msg) {
  const box = document.getElementById("chatMsgs");
  
  const msgEl = document.createElement("div");
  
  if (msg.sender === "system") {
    msgEl.className = "msg system";
    msgEl.textContent = msg.text;
  } else {
    const isMe = msg.sender === userNick;
    const isBot = msg.sender === t("botName");
    
    msgEl.className = `msg ${isMe ? 'me' : (isBot ? 'bot' : 'opponent')}`;
    
    const headerEl = document.createElement("div");
    headerEl.className = "msg-header";
    
    const senderEl = document.createElement("div");
    senderEl.className = "msg-sender";
    senderEl.textContent = msg.sender;
    headerEl.appendChild(senderEl);
    
    if (isBot) {
      const speakerBtn = document.createElement("button");
      speakerBtn.className = "msg-tts-btn";
      speakerBtn.textContent = "🔊";
      speakerBtn.title = LANG === 'ru' ? "Озвучить" : "Speak";
      speakerBtn.onclick = () => {
        const temp = isVoiceMuted;
        isVoiceMuted = false;
        speakText(msg.text);
        isVoiceMuted = temp;
      };
      headerEl.appendChild(speakerBtn);
    }
    
    msgEl.appendChild(headerEl);
    
    // (Resignation client checks are handled cleanly via SSE specific events now)
    
    const textEl = document.createElement("div");
    textEl.textContent = msg.text;
    msgEl.appendChild(textEl);
  }
  
  box.appendChild(msgEl);
  box.scrollTop = box.scrollHeight; // Auto-scroll
}

// --- PREMIUM GEOMETRIC SVGS FOR MODERN SKINS ---
function getSleekGeometricSvg(pieceKey, skin) {
  const isWhite = pieceKey.startsWith('w');
  const type = pieceKey[1];

  let fillCol, strokeCol, filterAttr, accentCol;
  if (skin === 'neon') {
    fillCol    = isWhite ? 'rgba(0,243,255,0.08)'   : 'rgba(255,0,127,0.08)';
    strokeCol  = isWhite ? '#00f3ff'                : '#ff007f';
    accentCol  = isWhite ? 'rgba(0,243,255,0.55)'   : 'rgba(255,0,127,0.55)';
    filterAttr = isWhite ? 'filter="url(#neon-glow-cyan)"' : 'filter="url(#neon-glow-magenta)"';
  } else {
    fillCol    = isWhite ? 'url(#glass-white-grad)' : 'url(#glass-black-grad)';
    strokeCol  = isWhite ? '#fbbf24'                : '#94a3b8';
    accentCol  = isWhite ? 'rgba(251,191,36,0.7)'   : 'rgba(148,163,184,0.7)';
    filterAttr = 'filter="drop-shadow(0 3px 7px rgba(0,0,0,0.5))"';
  }

  const sw   = 'stroke-width="1.6"';
  const sw2  = 'stroke-width="1.1"';
  const lj   = 'stroke-linejoin="round" stroke-linecap="round"';
  const base = `fill="${fillCol}" stroke="${strokeCol}" ${sw} ${lj} ${filterAttr}`;
  const line = `fill="none" stroke="${accentCol}" ${sw2} ${lj}`;
  const dot  = `fill="${strokeCol}"`;

  let paths = '';

  if (type === 'p') {
    paths = `
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83.33-1.41 1.15-1.41 2.12 0 1.24 1.01 2.25 2.25 2.25h6.5c1.24 0 2.25-1.01 2.25-2.25 0-.97-.58-1.79-1.41-2.12C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" ${base}/>
      <rect x="12" y="31.5" width="21" height="2.75" rx="1.4" ${base}/>
    `;
  } else if (type === 'r') {
    paths = `
      <path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.5-4 1.5-13h14l1.5 13h-17z" ${base}/>
      <path d="M11 14h23v-5H11v5zm0-5h4V6h-4v3zm8 0h4V6h-4v3zm8 0h4V6h-4v3z" ${base}/>
      <line x1="14" y1="29.5" x2="31" y2="29.5" ${line}/>
      <line x1="14" y1="26.5" x2="31" y2="26.5" ${line}/>
    `;
  } else if (type === 'n') {
    paths = `
      <path d="M22 10c0 0-3 1-6 5s-3 8-3 8 1.5-1 2.5-1 1.5.5 1.5 1-.5 1.5-1 2.5-1.5 2 0 3 3-1 4-2 2 0 3 2-.5 2.5-1.5 2.5-.5 0-1 .5-1 .5-2 3.5 0 3.5 4 3.5 5.5-2 5.5-4S29 25.5 28 24.5 29 21.5 30 19.5s2.5-1 2.5-1-.5-2-2-4S24 10 22 10z" ${base}/>
      <path d="M9.5 25.5A.5.5 0 1 1 8.5 25.5.5.5 0 0 1 9.5 25.5z" transform="matrix(.866.5-.5.866 9.7-5.2)" ${dot}/>
      <rect x="10" y="35" width="25" height="3" rx="1.5" ${base}/>
    `;
  } else if (type === 'b') {
    paths = `
      <path d="M15 32C15 24 29 24 29 32" ${base}/>
      <path d="M22.5 10 C26 15 27 20 27 26.5 C27 30 18 30 18 26.5 C18 20 19 15 22.5 10z" ${base}/>
      <circle cx="22.5" cy="8.5" r="2" ${base}/>
      <line x1="19" y1="17.5" x2="26" y2="24.5" ${line}/>
      <line x1="26" y1="17.5" x2="19" y2="24.5" ${line}/>
      <rect x="11" y="32" width="23" height="3" rx="1.5" ${base}/>
    `;
  } else if (type === 'q') {
    paths = `
      <circle cx="6"    cy="12" r="2.75" ${base}/>
      <circle cx="14"   cy="9"  r="2.75" ${base}/>
      <circle cx="22.5" cy="8"  r="2.75" ${base}/>
      <circle cx="31"   cy="9"  r="2.75" ${base}/>
      <circle cx="39"   cy="12" r="2.75" ${base}/>
      <path d="M9 26c8.5-1.5 21-1.5 27 0L38.5 13.5 31 25l-5.5-7.5L22.5 11.5 19.5 17.5 14 25 6.5 13.5z" ${base}/>
      <path d="M9 26c0 2 1.5 2 2.5 4S12.5 31 12 33.5c-1.5 1-1.5 3-1.5 3 7 2 17 2 24 0 0 0 0-2-1.5-3-.5-2.5-.5-2 .5-3.5s2.5-2 2.5-4c-8.5-1.5-19-1.5-27 0z" ${base}/>
      <line x1="11" y1="38.5" x2="34" y2="38.5" ${line}/>
      <line x1="9"  y1="26"   x2="36" y2="26"   ${line}/>
    `;
  } else if (type === 'k') {
    paths = `
      <path d="M22.5 11.63V6" stroke="${strokeCol}" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="20" y1="8" x2="25" y2="8" stroke="${strokeCol}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M22.5 25C22.5 25 27 17.5 25.5 14.5S22.5 12 22.5 12s-3 .5-4.5 3.5S22.5 25 22.5 25z" ${base}/>
      <path d="M12.5 37c5.5 3.5 14.5 3.5 20 0V30s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4l-.5 3.5-.5-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5z" ${base}/>
      <line x1="12.5" y1="30"   x2="32.5" y2="30"   ${line}/>
      <line x1="12.5" y1="33.5" x2="32.5" y2="33.5" ${line}/>
      <line x1="12.5" y1="37"   x2="32.5" y2="37"   ${line}/>
    `;
  }

  return `<svg viewBox="0 0 45 45" width="100%" height="100%">${paths}</svg>`;
}

// --- CUSTOM SKIN SVGS ---
function getPieceSvg(pieceKey, skin) {
  const isWhite = pieceKey.startsWith('w');
  const type = pieceKey[1];

  if (skin === 'arcade') {
    const pixelPaths = {
      p: "M6 2h4v2H6zm-1 2h6v2H5zm1 2h4v4H6zm-2 4h10v2H4zm-1 2h12v2H3z",
      r: "M3 2h2v2H3zm4 0h2v2H7zm4 0h2v2h-2zm-8 2h10v2H3zm1 2h8v4H4zm-1 4h10v2H3zm-1 2h12v2H2z",
      n: "M6 2h5v2H6zm-2 2h8v2H4zm-1 2h7v2H3zm0 2h5v2H3zm1 2h8v2H4zm-1 2h10v2H3z",
      b: "M7 1h2v2H7zm-1 2h4v2H6zm-1 2h6v3H5zm1 3h4v4H6zm-2 4h10v2H4zm-1 2h12v2H3z",
      q: "M3 2h2v2H3zm5 0h2v2H8zm3 0h2v2h-2zm-7 2h8v2H4zm-1 2h10v2H3zm1 2h8v4H4zm-1 4h10v2H3zm-1 2h12v2H2z",
      k: "M7 1h2v2H7zm-2 2h6v2H5zm-2 2h10v2H3zm0 2h10v2H3zm1 2h8v2H4zm-1 2h10v2H3zm-1 2h12v2H2z"
    };

    const path = pixelPaths[type] || "";
    const fillCol = isWhite ? "#ffffff" : "#000000";
    const strokeCol = isWhite ? "#000000" : "#ffffff";
    return `<svg viewBox="0 0 16 16" width="100%" height="100%"><path d="${path}" fill="${fillCol}" stroke="${strokeCol}" stroke-width="0.8" stroke-linejoin="miter"/></svg>`;
  }

  if (skin === 'neon' || skin === 'glass') {
    return getSleekGeometricSvg(pieceKey, skin);
  }

  // Classic skin: premium vector look with gradients
  let svg = PIECE_SVGS[pieceKey] || "";
  if (isWhite) {
    svg = svg.replace(/fill="#fff"/g, 'fill="url(#classic-white-grad)"');
  } else {
    svg = svg.replace(/fill="#000"/g, 'fill="url(#classic-black-grad)"');
  }
  svg = svg.replace(/<svg/g, '<svg style="filter: drop-shadow(0 2.5px 4px rgba(0,0,0,0.35));"');
  return svg;
}

window.selectSkin = function(skinName) {
  currentSkin = skinName;
  localStorage.setItem("fmine_chess_skin", skinName);
  
  const skins = ['neon', 'glass', 'classic', 'arcade'];
  skins.forEach(s => {
    const btn = document.getElementById(`optSkin${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (btn) {
      btn.classList.toggle("active", s === skinName);
    }
  });

  const selectEl = document.getElementById("gameSkinSelect");
  if (selectEl) {
    selectEl.value = skinName;
  }

  const boardWrapper = document.querySelector(".chessboard-wrapper");
  if (boardWrapper) {
    skins.forEach(s => boardWrapper.classList.remove(`skin-${s}`));
    boardWrapper.classList.add(`skin-${skinName}`);
  }

  if (game) {
    renderBoard();
  }
};

// --- URL QUERY PARSER ---
function checkUrlInvite() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  if (room && room.startsWith("CH-")) {
    selectMode("multiplayer");
    const input = document.getElementById("roomCodeInput");
    if (input) {
      input.value = room;
    }
    showToast(LANG === 'ru'
      ? `🔗 Приглашение в комнату ${room} — нажми «Войти»!`
      : `🔗 Invite for room ${room} — press Join!`);
    // Clean URL so it doesn't confuse on reload
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }
}

// --- RECONNECTION CONTROLLER ---
async function checkActiveGameReconnection() {
  const savedGameId = localStorage.getItem("fmine_active_chess_game");
  const savedColor = localStorage.getItem("fmine_active_chess_color");
  
  if (savedGameId && savedColor) {
    try {
      const res = await fetch(`${SERVER_URL}/api/chess/status/${savedGameId}`);
      const data = await res.json();
      
      if (data.ok && data.status === "playing") {
        const container = document.getElementById("gameNotificationContainer");
        if (container) {
          container.innerHTML = `
            <div class="reconnect-card">
              <div style="font-weight: 700; font-size: 14px; color: var(--cyan);">
                ${LANG === 'ru' ? "Найден активный матч в процессе!" : "Active match in progress found!"}
              </div>
              <div style="font-size: 11px; color: var(--text2);">
                Комната: ${savedGameId} | Цвет: ${savedColor === 'white' ? (LANG==='ru'?'Белые':'White') : (LANG==='ru'?'Черные':'Black')}
              </div>
              <div style="display: flex; gap: 10px; margin-top: 5px;">
                <button class="btn primary" onclick="reconnectToGame('${savedGameId}', '${savedColor}')">
                  ${LANG === 'ru' ? "Присоединиться заново" : "Reconnect"}
                </button>
                <button class="btn ghost" onclick="clearActiveGameStorage()">
                  ${LANG === 'ru' ? "Сбросить" : "Discard"}
                </button>
              </div>
            </div>
          `;
        }
      } else {
        clearActiveGameStorage();
      }
    } catch (err) {
      console.error("Error checking reconnect status:", err);
    }
  }
}

window.reconnectToGame = function(gameId, color) {
  activeGameId = gameId;
  playerColor = color;
  mode = "multiplayer";
  
  document.getElementById("playerName").textContent = userNick;
  
  const playerDot = document.getElementById("playerColorDot");
  const opponentDot = document.getElementById("opponentColorDot");
  playerDot.className = `player-color-dot ${playerColor}`;
  opponentDot.className = `player-color-dot ${playerColor === 'white' ? 'black' : 'white'}`;
  
  document.getElementById("btnGameOverRematch").classList.add("hidden");
  document.getElementById("roomCodeBadge").classList.remove("hidden");
  document.getElementById("roomCodeBadge").textContent = `${t("roomCode")}${activeGameId}`;
  
  document.getElementById("setupView").style.display = "none";
  document.getElementById("arenaView").classList.add("active");
  
  document.getElementById("gameNotificationContainer").innerHTML = "";
  
  setupSSE(activeGameId);
};

window.clearActiveGameStorage = function() {
  localStorage.removeItem("fmine_active_chess_game");
  localStorage.removeItem("fmine_active_chess_color");
  const container = document.getElementById("gameNotificationContainer");
  if (container) {
    container.innerHTML = "";
  }
};

// --- VOICE (TTS) COMMENTARY ---
async function speakText(text) {
  if (isVoiceMuted) return;
  
  if (currentTtsAudio) {
    currentTtsAudio.pause();
    currentTtsAudio = null;
  }
  
  try {
    const voice = LANG === 'ru' ? 'ru-RU-DmitryNeural' : 'en-US-BrianNeural';
    const rate = '+0%';
    
    const res = await fetch(`${SERVER_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, rate })
    });
    
    if (!res.ok) throw new Error("TTS failed");
    
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    currentTtsAudio = new Audio(url);
    await currentTtsAudio.play();
  } catch (err) {
    console.error("TTS play error:", err);
  }
}

window.toggleVoiceMute = function() {
  isVoiceMuted = !isVoiceMuted;
  localStorage.setItem("fmine_chess_voice_muted", isVoiceMuted);
  const btn = document.getElementById("btnVoiceToggle");
  if (btn) {
    btn.textContent = isVoiceMuted ? "🔇" : "🔊";
  }
  showToast(isVoiceMuted ? (LANG==='ru'?'Звук ИИ выключен':'AI Voice muted') : (LANG==='ru'?'Звук ИИ включен':'AI Voice enabled'));
};

function showDrawOfferPrompt(sender) {
  const container = document.getElementById("gameNotificationContainer");
  if (container) {
    container.innerHTML = `
      <div class="draw-offer-banner">
        <div class="draw-offer-text">
          🤝 ${sender} ${LANG === 'ru' ? "предлагает ничью." : "offers a draw."}
        </div>
        <div class="draw-offer-btns">
          <button class="btn primary" onclick="respondDrawOffer(true)">${LANG === 'ru' ? "Принять" : "Accept"}</button>
          <button class="btn ghost" onclick="respondDrawOffer(false)">${LANG === 'ru' ? "Отклонить" : "Decline"}</button>
        </div>
      </div>
    `;
    playCheckSound();
  }
}

window.respondDrawOffer = async function(accept) {
  const container = document.getElementById("gameNotificationContainer");
  if (container) {
    container.innerHTML = "";
  }
  try {
    await apiCall("draw-response", {
      gameId: activeGameId,
      player: userNick,
      accept: accept
    });
  } catch {}
};

// --- INITIALIZE TRANSLATION AND STATE ON START ---
applyTranslations();
selectSkin(currentSkin);
checkUrlInvite();
checkActiveGameReconnection();

// Initialize voice mute button state
setTimeout(() => {
  const btn = document.getElementById("btnVoiceToggle");
  if (btn) {
    btn.textContent = isVoiceMuted ? "🔇" : "🔊";
  }
}, 100);

// --- CHESS REVIEW & AI ANALYSIS ENGINE ---

function getPositionEval(chessInstance) {
  if (chessInstance.game_over()) {
    if (chessInstance.in_checkmate()) {
      return chessInstance.turn() === 'b' ? 99.0 : -99.0;
    }
    return 0.0;
  }
  const clone = new Chess(chessInstance.fen());
  const score = minimax(3, clone, -Infinity, Infinity, clone.turn() === 'w');
  return score / 100;
}

function selectBestMoveForEval(chessInstance) {
  const moves = chessInstance.moves({ verbose: true });
  if (moves.length === 0) return null;
  const clone = new Chess(chessInstance.fen());
  const turn = clone.turn();
  const isWhite = (turn === 'w');
  
  let bestMove = null;
  let bestVal = isWhite ? -Infinity : Infinity;
  
  for (const move of moves) {
    clone.move(move);
    const scoreVal = minimax(3, clone, -Infinity, Infinity, !isWhite);
    clone.undo();
    
    if (isWhite) {
      if (scoreVal > bestVal) {
        bestVal = scoreVal;
        bestMove = move;
      }
    } else {
      if (scoreVal < bestVal) {
        bestVal = scoreVal;
        bestMove = move;
      }
    }
  }
  return bestMove;
}

function getMoveSan(chessInstance, moveObj) {
  const clone = new Chess(chessInstance.fen());
  const m = clone.move(moveObj);
  return m ? m.san : '';
}

window.startGameAnalysis = function() {
  const movesToAnalyze = game.history({ verbose: true });
  if (movesToAnalyze.length === 0) {
    showToast(LANG === 'ru' ? "Нет ходов для анализа!" : "No moves to analyze!");
    return;
  }

  document.getElementById("gameOverModal").classList.remove("active");
  const overlay = document.getElementById("analysisLoadingOverlay");
  if (overlay) overlay.style.display = "flex";
  
  isAnalyzing = true;
  analysisMoves = [];
  
  const total = movesToAnalyze.length;
  let i = 0;
  const tempGame = new Chess();
  
  const stats = {
    w: { brilliant: 0, best: 0, excellent: 0, good: 0, book: 0, inaccuracy: 0, mistake: 0, blunder: 0, scoreSum: 0, count: 0 },
    b: { brilliant: 0, best: 0, excellent: 0, good: 0, book: 0, inaccuracy: 0, mistake: 0, blunder: 0, scoreSum: 0, count: 0 }
  };
  
  function analyzeStep() {
    if (!isAnalyzing) return; // Guard in case of cancellation
    
    if (i >= total) {
      finishAnalysis(stats);
      return;
    }
    
    const move = movesToAnalyze[i];
    const turn = tempGame.turn();
    
    // Get evaluation before move
    const beforeEval = getPositionEval(tempGame);
    const bestMoveObj = selectBestMoveForEval(tempGame);
    const bestMoveSan = bestMoveObj ? getMoveSan(tempGame, bestMoveObj) : '';
    
    // Play the move
    tempGame.move({ from: move.from, to: move.to, promotion: move.promotion });
    const afterEval = getPositionEval(tempGame);
    
    // Calculate evaluation loss
    let evalLoss = 0;
    if (turn === 'w') {
      evalLoss = beforeEval - afterEval;
    } else {
      evalLoss = afterEval - beforeEval;
    }
    
    let classification = 'good';
    const isBookCandidate = (i < 8); // Book check (first 4 full moves)
    
    // Check for Brilliant move (sacrifice)
    let isBrilliant = false;
    if (evalLoss <= 0.15 && i >= 4) { // Only classify as brilliant after the opening
      const PIECE_VALUES_SIMPLE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };
      const oppMoves = tempGame.moves({ verbose: true });
      for (const oppMove of oppMoves) {
        if (oppMove.captured && ['b', 'n', 'r', 'q'].includes(oppMove.captured)) {
          const captureSquare = oppMove.to;
          const testGame = new Chess(tempGame.fen());
          testGame.move(oppMove);
          const responseMoves = testGame.moves({ verbose: true });
          const canRecapture = responseMoves.some(rm => rm.to === captureSquare);
          
          if (!canRecapture || PIECE_VALUES_SIMPLE[oppMove.piece] < PIECE_VALUES_SIMPLE[oppMove.captured]) {
            isBrilliant = true;
            break;
          }
        }
      }
    }

    if (isBrilliant) {
      classification = 'brilliant';
    } else if (evalLoss > 2.0) {
      classification = 'blunder';
    } else if (evalLoss > 1.0) {
      classification = 'mistake';
    } else if (evalLoss > 0.4) {
      classification = 'inaccuracy';
    } else if (isBookCandidate) {
      // Within the first 4 full moves, if not a blunder, mistake, or inaccuracy, it is theory/book
      classification = 'book';
    } else if (bestMoveObj && move.from === bestMoveObj.from && move.to === bestMoveObj.to) {
      classification = 'best';
    } else if (evalLoss <= 0.15) {
      classification = 'excellent';
    } else {
      classification = 'good';
    }
    
    stats[turn][classification]++;
    stats[turn].count++;
    
    const pointsMap = {
      brilliant: 100,
      best: 100,
      excellent: 95,
      good: 80,
      book: 100,
      inaccuracy: 60,
      mistake: 30,
      blunder: 0
    };
    stats[turn].scoreSum += pointsMap[classification];
    
    analysisMoves.push({
      fen: tempGame.fen(),
      move: move,
      score: afterEval,
      classification: classification,
      bestMoveSan: bestMoveSan,
      turn: turn
    });
    
    i++;
    const progress = Math.round((i / total) * 100);
    const progressBar = document.getElementById("analysisProgressBar");
    const progressText = document.getElementById("analysisProgressText");
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
    
    setTimeout(analyzeStep, 25);
  }
  
  analyzeStep();
};

async function finishAnalysis(stats) {
  isAnalyzing = false;
  const overlay = document.getElementById("analysisLoadingOverlay");
  if (overlay) overlay.style.display = "none";
  
  isAnalysisMode = true;
  
  // Display tab and controls
  const tabBtn = document.getElementById("tabAnalysisBtn");
  if (tabBtn) tabBtn.style.display = "inline-block";
  switchSideTab('analysis');
  
  const controls = document.getElementById("analysisControls");
  if (controls) controls.style.display = "flex";
  
  // Calculate accuracies
  const wAccuracy = stats.w.count > 0 ? Math.round(stats.w.scoreSum / stats.w.count) : 100;
  const bAccuracy = stats.b.count > 0 ? Math.round(stats.b.scoreSum / stats.b.count) : 100;
  
  const wFill = document.getElementById("accuracyFillWhite");
  const bFill = document.getElementById("accuracyFillBlack");
  if (wFill) {
    wFill.style.width = `${wAccuracy}%`;
    wFill.textContent = `W: ${wAccuracy}%`;
  }
  if (bFill) {
    bFill.style.width = `${bAccuracy}%`;
    bFill.textContent = `B: ${bAccuracy}%`;
  }
  
  // Fill stats counts
  const categories = ['Brilliant', 'Best', 'Excellent', 'Good', 'Book', 'Inaccuracy', 'Mistake', 'Blunder'];
  categories.forEach(cat => {
    const key = cat.toLowerCase();
    const wEl = document.getElementById(`summaryW${cat}`);
    const bEl = document.getElementById(`summaryB${cat}`);
    if (wEl) wEl.textContent = stats.w[key];
    if (bEl) bEl.textContent = stats.b[key];
  });
  
  // Load analysis view
  jumpToAnalysisMove(-1);
  renderAnalysisMovesList();
  
  // AI Coach Summary request
  const coachText = document.getElementById("coachText");
  if (coachText) coachText.textContent = LANG === 'ru' ? "ИИ Тренер изучает партию..." : "AI Coach is reviewing the match...";
  
  try {
    const movesListStr = analysisMoves.map((am, idx) => (idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : '') + am.move.san).join(' ');
    const prompt = `You are a supportive, wise chess coach. Write a very brief summary of this chess match (max 80 words).
    White Accuracy: ${wAccuracy}%.
    Black Accuracy: ${bAccuracy}%.
    Moves: ${movesListStr}.
    Format: Start directly with the analysis. Make sure to write in ${LANG === 'ru' ? 'Russian' : 'English'}. Be encouraging and highlight the turning point.`;

    const storedSettings = JSON.parse(localStorage.getItem('fmine_settings') || '{}');
    const userApiKey = storedSettings.apiKey || '';
    const headers = { 'Content-Type': 'application/json' };
    if (userApiKey) {
      headers['Authorization'] = `Bearer ${userApiKey}`;
    }

    const res = await fetch(`${SERVER_URL}/api/chat-stream`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        stream: false
      })
    });
    
    if (!res.ok) throw new Error("API call failed");
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    if (coachText) coachText.textContent = reply || (LANG === 'ru' ? "Не удалось получить итог." : "Failed to load summary.");
  } catch (err) {
    console.error(err);
    if (coachText) coachText.textContent = LANG === 'ru' ? "Не удалось связаться с ИИ тренером." : "Could not connect with AI Coach.";
  }
}

function renderAnalysisMovesList() {
  const listEl = document.getElementById("analysisMovesList");
  if (!listEl) return;
  listEl.innerHTML = "";
  
  for (let i = 0; i < analysisMoves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const moveW = analysisMoves[i];
    const moveB = analysisMoves[i + 1];
    
    const numEl = document.createElement("div");
    numEl.className = "move-num";
    numEl.textContent = `${moveNum}.`;
    listEl.appendChild(numEl);
    
    const wEl = document.createElement("div");
    wEl.className = "move-cell";
    if (currentAnalysisIndex === i) wEl.classList.add("current");
    
    const wSymbols = { brilliant: '🌟', best: '👑', excellent: '✨', good: '👍', book: '📖', inaccuracy: '❓', mistake: '⚠️', blunder: '❌' };
    wEl.innerHTML = `${moveW.move.san} <span class="square-badge-inline ${moveW.classification}">${wSymbols[moveW.classification]}</span>`;
    wEl.onclick = () => jumpToAnalysisMove(i);
    listEl.appendChild(wEl);
    
    if (moveB) {
      const bEl = document.createElement("div");
      bEl.className = "move-cell";
      if (currentAnalysisIndex === i + 1) bEl.classList.add("current");
      
      const bSymbols = { brilliant: '🌟', best: '👑', excellent: '✨', good: '👍', book: '📖', inaccuracy: '❓', mistake: '⚠️', blunder: '❌' };
      bEl.innerHTML = `${moveB.move.san} <span class="square-badge-inline ${moveB.classification}">${bSymbols[moveB.classification]}</span>`;
      bEl.onclick = () => jumpToAnalysisMove(i + 1);
      listEl.appendChild(bEl);
    } else {
      listEl.appendChild(document.createElement("div"));
    }
  }
}

window.jumpToAnalysisMove = function(index) {
  currentAnalysisIndex = index;
  
  let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  let score = 0.0;
  
  if (index >= 0 && index < analysisMoves.length) {
    fen = analysisMoves[index].fen;
    score = analysisMoves[index].score;
  }
  
  game = new Chess(fen);
  renderBoard();
  
  // Highlight active move in sidebar
  const cells = document.querySelectorAll("#analysisMovesList .move-cell");
  cells.forEach((cell, idx) => {
    cell.classList.toggle("current", idx === index);
  });
  
  // Auto-scroll moves list to active move
  const currentCell = document.querySelector("#analysisMovesList .move-cell.current");
  if (currentCell) {
    currentCell.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  
  updateEvalBar(score);
  renderAnalysisSelectedMoveCard();
  updateOpeningName();
};

window.stepAnalysisMove = function(dir) {
  let index = currentAnalysisIndex + dir;
  if (index < -1) index = -1;
  if (index >= analysisMoves.length) index = analysisMoves.length - 1;
  jumpToAnalysisMove(index);
};

function updateEvalBar(score) {
  const container = document.getElementById("evalBarContainer");
  const fill = document.getElementById("evalBarFill");
  const label = document.getElementById("evalBarScore");
  if (!container || !fill || !label) return;
  
  container.style.display = "block";
  
  // Clamp evaluation score between -8.0 and +8.0 pawns
  let scoreVal = score;
  if (Math.abs(scoreVal) > 90) {
    // Checkmate
    const whiteWon = scoreVal > 0;
    fill.style.top = whiteWon ? "0%" : "100%";
    label.textContent = whiteWon ? "M" : "-M";
    return;
  }
  
  let clamped = Math.max(-8.0, Math.min(8.0, scoreVal));
  // topPercent represents the size of black's area (which starts at top)
  let topPercent = 50 - (clamped / 16) * 100;
  topPercent = Math.max(5, Math.min(95, topPercent));
  
  fill.style.top = `${topPercent}%`;
  label.textContent = scoreVal > 0 ? `+${scoreVal.toFixed(1)}` : scoreVal.toFixed(1);
}

function renderAnalysisSelectedMoveCard() {
  const textEl = document.getElementById("analysisSelectedMoveText");
  const badgeEl = document.getElementById("analysisSelectedMoveBadge");
  const commentEl = document.getElementById("analysisSelectedMoveComment");
  const explainBtn = document.getElementById("btnExplainMove");
  const explainText = document.getElementById("coachMoveExplanationText");
  
  if (!textEl || !badgeEl || !commentEl) return;
  
  if (explainBtn) explainBtn.style.display = "none";
  if (explainText) explainText.style.display = "none";
  
  if (currentAnalysisIndex === -1) {
    textEl.textContent = LANG === 'ru' ? "Начальная позиция" : "Starting Position";
    badgeEl.style.display = "none";
    commentEl.textContent = LANG === 'ru' ? "Начало партии. Сделайте первый ход!" : "Game start. Make the first move!";
    return;
  }
  
  const am = analysisMoves[currentAnalysisIndex];
  const isWhite = am.turn === 'w';
  const ply = Math.floor(currentAnalysisIndex / 2) + 1;
  const moveText = `${ply}.${isWhite ? '' : '..'}${am.move.san}`;
  
  textEl.textContent = moveText;
  badgeEl.style.display = "inline-flex";
  badgeEl.className = `square-badge-inline ${am.classification}`;
  badgeEl.textContent = t(am.classification);
  
  // Custom comments for classifications
  let comment = "";
  const best = am.bestMoveSan;
  
  if (am.classification === 'book') {
    comment = LANG === 'ru' ? "Теоретический ход." : "Book move.";
  } else if (am.classification === 'best') {
    comment = LANG === 'ru' ? "Лучший ход в этой позиции!" : "The best move in this position!";
  } else if (am.classification === 'brilliant') {
    comment = LANG === 'ru' ? "Блестящий ход! Замечательная идея." : "Brilliant move! A beautiful concept.";
  } else if (am.classification === 'excellent') {
    comment = LANG === 'ru' ? "Отличный ход, удерживающий перевес." : "An excellent move that maintains your standing.";
  } else if (am.classification === 'good') {
    comment = LANG === 'ru' ? "Хороший, естественный ход." : "A good, natural move.";
  } else if (am.classification === 'inaccuracy') {
    comment = LANG === 'ru' ? `Неточность. Лучше было играть: ${best}` : `Inaccuracy. Better was: ${best}`;
  } else if (am.classification === 'mistake') {
    comment = LANG === 'ru' ? `Ошибка. Сильнее было: ${best}` : `Mistake. Stronger was: ${best}`;
  } else if (am.classification === 'blunder') {
    comment = LANG === 'ru' ? `Зевок! Вы упустили инициативу. Лучший ход: ${best}` : `Blunder! You lost the advantage. Best move: ${best}`;
  }
  
  commentEl.textContent = comment;
  
  // Show AI explanation button for mistakes and blunders
  if (explainBtn && (am.classification === 'blunder' || am.classification === 'mistake' || am.classification === 'inaccuracy')) {
    explainBtn.style.display = "block";
    explainBtn.disabled = false;
  }
}

window.explainCurrentMove = async function() {
  const explainBtn = document.getElementById("btnExplainMove");
  const explainText = document.getElementById("coachMoveExplanationText");
  if (!explainBtn || !explainText || currentAnalysisIndex < 0) return;
  
  explainBtn.disabled = true;
  explainText.style.display = "block";
  explainText.textContent = LANG === 'ru' ? "ИИ Тренер думает..." : "AI Coach is thinking...";
  
  try {
    const am = analysisMoves[currentAnalysisIndex];
    const pgnContext = getPgnUpTo(currentAnalysisIndex);
    const prompt = `You are a chess coach. Explain why playing the move "${am.move.san}" is classified as a "${am.classification}" (worse than the best move "${am.bestMoveSan}").
    PGN context: ${pgnContext}.
    Write a brief explanation (max 50 words) outlining the tactical or positional drawback. Answer in ${LANG === 'ru' ? 'Russian' : 'English'}.`;

    const storedSettings = JSON.parse(localStorage.getItem('fmine_settings') || '{}');
    const userApiKey = storedSettings.apiKey || '';
    const headers = { 'Content-Type': 'application/json' };
    if (userApiKey) {
      headers['Authorization'] = `Bearer ${userApiKey}`;
    }

    const res = await fetch(`${SERVER_URL}/api/chat-stream`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        stream: false
      })
    });
    
    if (!res.ok) throw new Error("API call failed");
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    explainText.textContent = reply || (LANG === 'ru' ? "Не удалось получить объяснение." : "Failed to load explanation.");
  } catch (err) {
    console.error(err);
    explainText.textContent = LANG === 'ru' ? "Не удалось соединиться с сервером." : "Could not connect to server.";
    explainBtn.disabled = false;
  }
};

function getPgnUpTo(index) {
  let pgn = "";
  for (let i = 0; i <= index; i++) {
    const isWhite = (i % 2 === 0);
    const moveNum = Math.floor(i / 2) + 1;
    if (isWhite) pgn += `${moveNum}. `;
    pgn += `${analysisMoves[i].move.san} `;
  }
  return pgn.trim();
}

window.exitAnalysisMode = function() {
  isAnalysisMode = false;
  
  // Hide controls and tab
  const controls = document.getElementById("analysisControls");
  if (controls) controls.style.display = "none";
  
  const evalBar = document.getElementById("evalBarContainer");
  if (evalBar) evalBar.style.display = "none";
  
  const tabBtn = document.getElementById("tabAnalysisBtn");
  if (tabBtn) tabBtn.style.display = "none";
  
  exitGameView();
};

window.copyGamePgn = function() {
  let pgn = "";
  for (let i = 0; i < analysisMoves.length; i++) {
    const isWhite = (i % 2 === 0);
    const moveNum = Math.floor(i / 2) + 1;
    if (isWhite) pgn += `${moveNum}. `;
    pgn += `${analysisMoves[i].move.san} `;
  }
  navigator.clipboard.writeText(pgn.trim());
  showToast(LANG === 'ru' ? "PGN скопирован в буфер обмена!" : "PGN copied to clipboard!");
};

// Keyboard listener for analysis navigation
window.addEventListener("keydown", (e) => {
  if (!isAnalysisMode) return;
  if (e.key === "ArrowLeft") {
    stepAnalysisMove(-1);
  } else if (e.key === "ArrowRight") {
    stepAnalysisMove(1);
  }
});

// --- TIME CONTROL SELECTOR ---
window.selectTime = function(timeVal) {
  selectedTime = timeVal;
  const ids = ["Infinite", "3", "5", "10", "15"];
  const valMap = { Infinite: "infinite", "3": "3", "5": "5", "10": "10", "15": "15+10" };
  
  ids.forEach(id => {
    const val = valMap[id];
    const btn = document.getElementById(`optTime${id}`);
    if (btn) btn.classList.toggle("active", val === timeVal);
  });
};

// --- CHESS CLOCKS LOGIC ---
function initTimeClocks(selectedTime) {
  timeControl = selectedTime;
  
  const myTimer = document.getElementById("playerTimer");
  const oppTimer = document.getElementById("opponentTimer");
  
  if (timeControl === "infinite") {
    if (myTimer) myTimer.classList.add("hidden");
    if (oppTimer) oppTimer.classList.add("hidden");
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    return;
  }
  
  if (myTimer) myTimer.classList.remove("hidden");
  if (oppTimer) oppTimer.classList.remove("hidden");
  
  let baseMinutes = 10;
  timeIncrement = 0;
  
  if (selectedTime === "3") {
    baseMinutes = 3;
  } else if (selectedTime === "5") {
    baseMinutes = 5;
  } else if (selectedTime === "10") {
    baseMinutes = 10;
  } else if (selectedTime === "15+10") {
    baseMinutes = 15;
    timeIncrement = 10;
  }
  
  whiteTime = baseMinutes * 60;
  blackTime = baseMinutes * 60;
  
  updateClocksUI();
}

function formatTime(secs) {
  if (secs < 0) secs = 0;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateClocksUI() {
  const myTimer = document.getElementById("playerTimer");
  const oppTimer = document.getElementById("opponentTimer");
  if (!myTimer || !oppTimer) return;
  
  const myTime = (playerColor === 'white') ? whiteTime : blackTime;
  const oppTime = (playerColor === 'white') ? blackTime : whiteTime;
  
  myTimer.textContent = formatTime(myTime);
  oppTimer.textContent = formatTime(oppTime);
  
  const turn = game.turn();
  const isMyTurn = (turn === pc());
  myTimer.classList.toggle("active", isMyTurn);
  oppTimer.classList.toggle("active", !isMyTurn);
  
  myTimer.classList.toggle("low-time", myTime <= 15);
  oppTimer.classList.toggle("low-time", oppTime <= 15);
}

function playTickSound(lowTime = false) {
  if (isVoiceMuted) return;
  if (lowTime) {
    synthTone(800, 'sine', 0.05); // alarm beep
  } else {
    synthTone(250, 'sine', 0.02); // soft tick
  }
}

function startClockTicking() {
  if (timerInterval) clearInterval(timerInterval);
  if (timeControl === "infinite" || game.game_over()) return;
  
  timerInterval = setInterval(() => {
    const turn = game.turn();
    const isMyTurn = (turn === pc());
    
    let activeTime = 0;
    if (turn === 'w') {
      whiteTime--;
      activeTime = whiteTime;
      if (whiteTime <= 0) {
        whiteTime = 0;
        handleTimeout('w');
      }
    } else {
      blackTime--;
      activeTime = blackTime;
      if (blackTime <= 0) {
        blackTime = 0;
        handleTimeout('b');
      }
    }
    
    updateClocksUI();
    
    if (activeTime > 0) {
      playTickSound(activeTime <= 15);
    }
  }, 1000);
}

function handleTimeout(losingColor) {
  clearInterval(timerInterval);
  timerInterval = null;
  
  playGameOverSound();
  
  const isMe = (losingColor === pc());
  document.getElementById("gameOverTitle").textContent = LANG === 'ru' ? "Время вышло!" : "Time Out!";
  document.getElementById("gameOverDesc").textContent = isMe
    ? (LANG === 'ru' ? "У вас закончилось время. Вы проиграли!" : "You ran out of time. You lost!")
    : (LANG === 'ru' ? "У соперника закончилось время. Вы победили!" : "Opponent ran out of time. You win!");
  
  document.getElementById("gameOverModal").classList.add("active");
  clearActiveGameStorage();
  
  if (mode === "multiplayer") {
    // Notify server of timeout loss
    const opponent = playerColor === 'white' ? (document.getElementById("opponentName").textContent) : userNick;
    apiCall("resign", { gameId: activeGameId, winner: isMe ? opponent : userNick });
  }
}

// --- REAL-TIME EVALUATION BAR ---
function updateLiveEvalBar() {
  if (isAnalysisMode) return;
  const container = document.getElementById("evalBarContainer");
  if (!container) return;
  
  container.style.display = "block";
  
  setTimeout(() => {
    const scoreVal = getPositionEval(game);
    updateEvalBar(scoreVal);
  }, 50);
}

// --- CHESS OPENING DETECTOR ---
const CHESS_OPENINGS = [
  { name: { ru: "Испанская партия", en: "Ruy Lopez" }, moves: "e4 e5 Nf3 Nc6 Bb5" },
  { name: { ru: "Сицилианская защита", en: "Sicilian Defense" }, moves: "e4 c5" },
  { name: { ru: "Французская защита", en: "French Defense" }, moves: "e4 e6" },
  { name: { ru: "Защита Каро-Канн", en: "Caro-Kann Defense" }, moves: "e4 c6" },
  { name: { ru: "Скандинавская защита", en: "Scandinavian Defense" }, moves: "e4 d5" },
  { name: { ru: "Итальянская партия", en: "Italian Game" }, moves: "e4 e5 Nf3 Nc6 Bc4" },
  { name: { ru: "Ферзевый гамбит", en: "Queen's Gambit" }, moves: "d4 d5 c4" },
  { name: { ru: "Славянская защита", en: "Slav Defense" }, moves: "d4 d5 c4 c6" },
  { name: { ru: "Защита Грюнфельда", en: "Gruenfeld Defense" }, moves: "d4 Nf6 c4 g6 Nc3 d5" },
  { name: { ru: "Староиндийская защита", en: "King's Indian Defense" }, moves: "d4 Nf6 c4 g6" },
  { name: { ru: "Английское начало", en: "English Opening" }, moves: "c4" },
  { name: { ru: "Дебют Рети", en: "Reti Opening" }, moves: "Nf3" },
  { name: { ru: "Защита Алехина", en: "Alekhine's Defense" }, moves: "e4 Nf6" },
  { name: { ru: "Шотландская партия", en: "Scotch Game" }, moves: "e4 e5 Nf3 Nc6 d4" },
  { name: { ru: "Русская партия", en: "Petrov's Defense" }, moves: "e4 e5 Nf3 Nf6" }
];

function updateOpeningName() {
  const badge = document.getElementById("openingNameBadge");
  if (!badge) return;
  
  let movesStr = "";
  if (isAnalysisMode) {
    let subHistory = [];
    for (let i = 0; i <= currentAnalysisIndex; i++) {
      if (analysisMoves[i] && analysisMoves[i].move) {
        subHistory.push(analysisMoves[i].move.san);
      }
    }
    if (subHistory.length === 0) {
      badge.style.display = "none";
      return;
    }
    movesStr = subHistory.join(" ");
  } else {
    const historyMoves = game.history();
    if (historyMoves.length === 0) {
      badge.style.display = "none";
      return;
    }
    movesStr = historyMoves.join(" ");
  }
  
  let matchedOpening = null;
  let maxLen = 0;
  
  for (const opening of CHESS_OPENINGS) {
    if (movesStr.startsWith(opening.moves)) {
      if (opening.moves.length > maxLen) {
        maxLen = opening.moves.length;
        matchedOpening = opening;
      }
    }
  }
  
  if (matchedOpening) {
    badge.style.display = "block";
    const name = matchedOpening.name[LANG] || matchedOpening.name.en;
    badge.textContent = `${LANG === 'ru' ? 'Дебют' : 'Opening'}: ${name}`;
  } else {
    badge.style.display = "none";
  }
}

window.startQuickMatch = async function() {
  const btn = document.getElementById('btnQuickMatch');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = LANG === 'ru' ? '⏳ Поиск соперника...' : '⏳ Finding Opponent...'; }

  try {
    // Ping server first to wake it up (Render Free Tier cold start can take 40-60s)
    await withTimeout(fetch(`${SERVER_URL}/api/chess/ping`), 75000);

    const myRating = localStorage.getItem("fmine_chess_rating") || "1200";

    if (btn) btn.textContent = LANG === 'ru' ? '⏳ Входим в игру...' : '⏳ Entering game...';
    const data = await apiCall('matchmake', { player: userNick, timeControl: selectedTime, playerRating: myRating });
    
    activeGameId = data.gameId;
    playerColor = data.color;
    mode = "multiplayer";

    localStorage.setItem('fmine_active_chess_game', activeGameId);
    localStorage.setItem('fmine_active_chess_color', playerColor);

    // Update names
    document.getElementById('playerName').textContent = `${userNick} ${getTitleAndRatingStr(parseInt(myRating))}`;
    document.getElementById('opponentName').textContent = t('waitingOpponent');

    const playerDot = document.getElementById('playerColorDot');
    const opponentDot = document.getElementById('opponentColorDot');
    playerDot.className = `player-color-dot ${playerColor}`;
    opponentDot.className = `player-color-dot ${playerColor === 'white' ? 'black' : 'white'}`;

    document.getElementById('btnGameOverRematch').classList.add('hidden');
    
    document.getElementById('roomCodeBadge').classList.remove('hidden');
    document.getElementById('roomCodeBadge').textContent = `${t('roomCode')}${activeGameId}`;

    document.getElementById('setupView').style.display = 'none';
    document.getElementById('arenaView').classList.add('active');

    setupSSE(activeGameId);
  } catch (err) {
    console.error(err);
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
};

function getTitleAndRatingStr(rating) {
  let title = "";
  if (rating >= 2500) title = "GM ";
  else if (rating >= 2400) title = "M ";
  else if (rating >= 2200) title = "CM ";
  return `[${title}${rating}]`;
}

// ============================================================
// === CHESS PUZZLE MODE ===
// ============================================================

// --- PUZZLE STATE ---
let puzzleLevel = 1;
let currentPuzzle = null;
let puzzleMoveIndex = 0; // which move in the solution we're at
let puzzleSolved = false;
let isPuzzleMode = false;
let puzzleCurrentNum = 0; // 1-based index of current puzzle in level

const PUZZLE_ELO_REWARDS = { 1: 2, 2: 5, 3: 8, 4: 12, 5: 20, 6: 30 };

// --- PUZZLE DATABASE (120 puzzles: 20 per level) ---
// Each puzzle: { id, fen, moves: [uci...], theme: {ru, en} }
// moves: alternating player/opponent moves in UCI (e.g. "e2e4")
// First move is always the player's correct move

const CHESS_PUZZLES = {
  1: [
    // Level 1 (500-700) — Mate in 1, simple captures
    { id:"p1_01", fen:"r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", moves:["h5f7"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_02", fen:"rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3", moves:["h4e1"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_03", fen:"rnbqkbnr/ppppp2p/5p2/6pQ/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3", moves:["h5e8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_04", fen:"r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4", moves:["f3f7"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_05", fen:"rnbqk1nr/pppp1ppp/4p3/8/1bBPP3/2N5/PPP2PPP/R1BQK1NR b KQkq - 0 4", moves:["b4c3"], theme:{ru:"Выигрыш фигуры",en:"Win a piece"} },
    { id:"p1_06", fen:"6k1/5ppp/8/8/8/8/6PP/4R1K1 w - - 0 1", moves:["e1e8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_07", fen:"5rk1/ppp2ppp/8/8/8/8/PPP2PPP/3R2K1 w - - 0 1", moves:["d1d8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_08", fen:"r1bqkbnr/1ppp1ppp/p1n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", moves:["c4f7"], theme:{ru:"Выигрыш пешки с шахом",en:"Win pawn with check"} },
    { id:"p1_09", fen:"rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves:["f3e5"], theme:{ru:"Выигрыш пешки",en:"Win a pawn"} },
    { id:"p1_10", fen:"6k1/ppp2ppp/8/3r4/8/8/PPP2PPP/4R1K1 w - - 0 1", moves:["e1e8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_11", fen:"r4rk1/ppp2ppp/8/8/8/8/PPP2PPP/R4RK1 w - - 0 1", moves:["a1a8"], theme:{ru:"Размен ладей",en:"Exchange rooks"} },
    { id:"p1_12", fen:"k7/8/1K6/8/8/8/8/1R6 w - - 0 1", moves:["b1a1"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_13", fen:"4k3/8/4K3/8/8/8/8/4R3 w - - 0 1", moves:["e1e8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },  
    { id:"p1_14", fen:"r2qkbnr/ppp2ppp/2np4/4N3/2B1P1b1/8/PPPP1PPP/RNBQK2R w KQkq - 0 5", moves:["e5f7"], theme:{ru:"Вилка",en:"Fork"} },
    { id:"p1_15", fen:"1k6/ppR5/8/8/8/8/5PPP/6K1 w - - 0 1", moves:["c7b7"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_16", fen:"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", moves:["e7e5"], theme:{ru:"Лучший ответ",en:"Best response"} },
    { id:"p1_17", fen:"r3k2r/ppp2ppp/2n1bn2/2bpp1B1/4P3/2NP1N2/PPP1BPPP/R2QK2R w KQkq - 0 7", moves:["g5f6"], theme:{ru:"Выигрыш коня",en:"Win a knight"} },
    { id:"p1_18", fen:"3qk3/8/8/8/8/8/4R3/4K3 w - - 0 1", moves:["e2e8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_19", fen:"5k2/8/5K2/8/8/8/8/7R w - - 0 1", moves:["h1h8"], theme:{ru:"Мат в 1",en:"Mate in 1"} },
    { id:"p1_20", fen:"r1b1kbnr/ppppqppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves:["f3e5"], theme:{ru:"Выигрыш пешки",en:"Win a pawn"} }
  ],
  2: [
    // Level 2 (700-1000) — Forks, pins, mate in 2
    { id:"p2_01", fen:"r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", moves:["d7d5"], theme:{ru:"Центр",en:"Center control"} },
    { id:"p2_02", fen:"r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3", moves:["e5d4"], theme:{ru:"Взятие в центре",en:"Central capture"} },
    { id:"p2_03", fen:"rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2", moves:["e7e6"], theme:{ru:"Защита",en:"Defense"} },
    { id:"p2_04", fen:"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", moves:["a7a6"], theme:{ru:"Атака слона",en:"Attack the bishop"} },
    { id:"p2_05", fen:"r2qk2r/ppp2ppp/2n1bn2/2bpp3/4P3/1BN2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 7", moves:["e4d5"], theme:{ru:"Взятие в центре",en:"Central capture"} },
    { id:"p2_06", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 4", moves:["e5d4"], theme:{ru:"Размен",en:"Exchange"} },
    { id:"p2_07", fen:"2kr4/ppp2ppp/2n5/8/8/2N5/PPP2PPP/R3K2R w KQ - 0 12", moves:["a1d1"], theme:{ru:"Активация ладьи",en:"Rook activation"} },
    { id:"p2_08", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves:["d2d3"], theme:{ru:"Развитие",en:"Development"} },
    { id:"p2_09", fen:"r1bqk2r/ppp2ppp/2n2n2/3pp1B1/1b2P3/2NP1N2/PPP2PPP/R2QKB1R w KQkq - 0 6", moves:["g5f6"], theme:{ru:"Размен на коня",en:"Capture the knight"} },
    { id:"p2_10", fen:"rnb1kbnr/pppp1ppp/4p3/8/3PP2q/8/PPP2PPP/RNBQKBNR w KQkq - 1 3", moves:["g2g3"], theme:{ru:"Отбросить ферзя",en:"Push back the queen"} },
    { id:"p2_11", fen:"r1b1kb1r/ppppqppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5", moves:["d2d4"], theme:{ru:"Центр",en:"Central advance"} },
    { id:"p2_12", fen:"r3kb1r/pppq1ppp/2n1bn2/3pp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 7", moves:["c4b5"], theme:{ru:"Связка",en:"Pin"} },
    { id:"p2_13", fen:"rnb1k2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", moves:["e2e3"], theme:{ru:"Развитие",en:"Development"} },
    { id:"p2_14", fen:"r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4", moves:["b7b5"], theme:{ru:"Контратака",en:"Counterattack"} },
    { id:"p2_15", fen:"rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 3", moves:["e2e4"], theme:{ru:"Захват центра",en:"Seize the center"} },
    { id:"p2_16", fen:"rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5", moves:["f2f3"], theme:{ru:"Укрепление центра",en:"Reinforce center"} },
    { id:"p2_17", fen:"rnbq1rk1/ppp2ppp/3p1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 6", moves:["d6d5"], theme:{ru:"Прорыв в центре",en:"Central break"} },
    { id:"p2_18", fen:"r1bqk2r/ppp2ppp/2nb1n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5", moves:["e4d5"], theme:{ru:"Размен в центре",en:"Central exchange"} },
    { id:"p2_19", fen:"rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", moves:["c8f5"], theme:{ru:"Развитие слона",en:"Bishop development"} },
    { id:"p2_20", fen:"r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 3", moves:["d7d5"], theme:{ru:"Контригра",en:"Counter play"} }
  ],
  3: [
    // Level 3 (1000-1400) — Tactical combinations, mate in 2
    { id:"p3_01", fen:"r1b1r1k1/ppppqppp/2n2n2/2b5/2B1N3/5N2/PPPPQPPP/R1B1K2R w KQ - 8 7", moves:["e4f6"], theme:{ru:"Вилка конём",en:"Knight fork"} },
    { id:"p3_02", fen:"r2qk2r/pppb1ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPPB1PPP/R2Q1RK1 w kq - 0 7", moves:["c3d5"], theme:{ru:"Централизация коня",en:"Knight centralization"} },
    { id:"p3_03", fen:"r1bqkb1r/pppp1Bpp/2n2n2/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4", moves:["e8f7"], theme:{ru:"Вынужденный ход",en:"Forced move"} },
    { id:"p3_04", fen:"r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 6", moves:["c1g5"], theme:{ru:"Связка",en:"Pin"} },
    { id:"p3_05", fen:"rnb1k2r/ppppqppp/5n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5", moves:["d2d4"], theme:{ru:"Атака центра",en:"Center attack"} },
    { id:"p3_06", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 4", moves:["c1e3"], theme:{ru:"Развитие с темпом",en:"Development with tempo"} },
    { id:"p3_07", fen:"r2qk2r/ppp1bppp/2n1bn2/3p4/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 4 6", moves:["e4e5"], theme:{ru:"Пешечное наступление",en:"Pawn advance"} },
    { id:"p3_08", fen:"r1bq1rk1/ppp2ppp/2n2n2/3pp1B1/1b1PP3/2N2N2/PPP2PPP/R2QKB1R w KQ - 0 6", moves:["e4e5"], theme:{ru:"Темпоатака",en:"Tempo attack"} },
    { id:"p3_09", fen:"r2qkbnr/ppp1pppp/2n5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 2 4", moves:["c2c4"], theme:{ru:"Атака пешечной цепи",en:"Pawn chain attack"} },
    { id:"p3_10", fen:"rn1qkb1r/pbpppppp/1p3n2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 3", moves:["d4d5"], theme:{ru:"Пространство",en:"Space advantage"} },
    { id:"p3_11", fen:"rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 4 4", moves:["e2e3"], theme:{ru:"Солидная игра",en:"Solid play"} },
    { id:"p3_12", fen:"r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7", moves:["c3a4"], theme:{ru:"Атака слона",en:"Attack the bishop"} },
    { id:"p3_13", fen:"r3kb1r/pp1q1ppp/2n1pn2/2pp4/3P1Bb1/2PBPN2/PP1N1PPP/R2QK2R w KQkq - 0 8", moves:["d3c4"], theme:{ru:"Пешечное напряжение",en:"Pawn tension"} },
    { id:"p3_14", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/2PP1N2/PP3PPP/RNBQKB1R b KQkq - 0 4", moves:["d7d5"], theme:{ru:"Контрудар в центре",en:"Central counter"} },
    { id:"p3_15", fen:"r1bq1rk1/pp2ppbp/2np1np1/2p5/2P1P3/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 8", moves:["d2d4"], theme:{ru:"Прорыв",en:"Breakthrough"} },
    { id:"p3_16", fen:"rnbq1rk1/pp2ppbp/2pp1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 6", moves:["e1g1"], theme:{ru:"Рокировка",en:"Castling"} },
    { id:"p3_17", fen:"rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", moves:["d2d4"], theme:{ru:"Гамбит",en:"Gambit"} },
    { id:"p3_18", fen:"r1bqkb1r/pp3ppp/2nppn2/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 0 5", moves:["d2d4"], theme:{ru:"Открытие линий",en:"Open lines"} },
    { id:"p3_19", fen:"r2q1rk1/pppbbppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8", moves:["c4c5"], theme:{ru:"Пешечное наступление",en:"Pawn advance"} },
    { id:"p3_20", fen:"rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq - 3 4", moves:["e8g8"], theme:{ru:"Безопасность короля",en:"King safety"} }
  ],
  4: [
    // Level 4 (1400-1800) — Sacrifices, complex tactics
    { id:"p4_01", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves:["b2b4"], theme:{ru:"Гамбит Эванса",en:"Evans Gambit"} },
    { id:"p4_02", fen:"rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", moves:["e4e5"], theme:{ru:"Атака на коня",en:"Attack the knight"} },
    { id:"p4_03", fen:"r1bq1rk1/pp1pppbp/2n2np1/2p5/2P1P3/2N2N2/PP1PBPPP/R1BQ1RK1 w - - 0 7", moves:["e4e5"], theme:{ru:"Пешечная атака",en:"Pawn attack"} },
    { id:"p4_04", fen:"rnbqk2r/pp1pppbp/5np1/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 4", moves:["e2e4"], theme:{ru:"Захват центра",en:"Seize center"} },
    { id:"p4_05", fen:"r1bqkb1r/ppp2ppp/2n2n2/3pp3/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq d6 0 4", moves:["c4d5"], theme:{ru:"Размен в центре",en:"Central exchange"} },
    { id:"p4_06", fen:"r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 6", moves:["c1g5"], theme:{ru:"Связка коня",en:"Pin the knight"} },
    { id:"p4_07", fen:"rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 6", moves:["e1g1"], theme:{ru:"Рокировка",en:"Castling"} },
    { id:"p4_08", fen:"r1b1kb1r/pp2pppp/1qnp1n2/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 0 5", moves:["d2d4"], theme:{ru:"Открытие позиции",en:"Open the position"} },
    { id:"p4_09", fen:"rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 3", moves:["e2e3"], theme:{ru:"Нимцо-индийская",en:"Nimzo-Indian"} },
    { id:"p4_10", fen:"r1bq1rk1/ppppnppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 5 5", moves:["a2a3"], theme:{ru:"Пара слонов",en:"Bishop pair"} },
    { id:"p4_11", fen:"r2qkbnr/ppp2ppp/2npb3/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4", moves:["d2d4"], theme:{ru:"Атака центра",en:"Center attack"} },
    { id:"p4_12", fen:"rnbqk2r/ppppppbp/5np1/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 3", moves:["d7d5"], theme:{ru:"Грюнфельд",en:"Grünfeld"} },
    { id:"p4_13", fen:"rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR b KQkq d3 0 2", moves:["c5d4"], theme:{ru:"Взятие",en:"Capture"} },
    { id:"p4_14", fen:"r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", moves:["f1b5"], theme:{ru:"Испанская партия",en:"Ruy Lopez"} },
    { id:"p4_15", fen:"rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves:["b1c3"], theme:{ru:"Развитие коня",en:"Knight development"} },
    { id:"p4_16", fen:"r1bqk2r/ppp2ppp/2n1pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", moves:["c1g5"], theme:{ru:"Связка",en:"Pin"} },
    { id:"p4_17", fen:"rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 7", moves:["d4d5"], theme:{ru:"Закрытие центра",en:"Close the center"} },
    { id:"p4_18", fen:"rnbq1rk1/pp2ppbp/2pp1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 0 6", moves:["f1e2"], theme:{ru:"Развитие",en:"Development"} },
    { id:"p4_19", fen:"r1bqk2r/pp1pppbp/2n2np1/2p5/2PP4/2N2NP1/PP2PP1P/R1BQKB1R w KQkq - 0 5", moves:["f1g2"], theme:{ru:"Фианкетто",en:"Fianchetto"} },
    { id:"p4_20", fen:"r1bq1rk1/pppp1ppp/2n1pn2/8/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 5", moves:["f1d3"], theme:{ru:"Развитие слона",en:"Bishop development"} }
  ],
  5: [
    // Level 5 (1800-2300) — Deep combinations, positional play
    { id:"p5_01", fen:"rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2", moves:["e7e6"], theme:{ru:"Каталонское начало",en:"Catalan setup"} },
    { id:"p5_02", fen:"rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4", moves:["e8g8"], theme:{ru:"Рокировка",en:"Castling"} },
    { id:"p5_03", fen:"r1bq1rk1/pp2ppbp/2np1np1/2p5/2P1P3/2NP1NP1/PP3PBP/R1BQ1RK1 w - - 0 8", moves:["d3d4"], theme:{ru:"Прорыв в центре",en:"Central breakthrough"} },
    { id:"p5_04", fen:"rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQ - 0 5", moves:["f2f3"], theme:{ru:"Земиш",en:"Sämisch"} },
    { id:"p5_05", fen:"r1bq1rk1/pp1n1pbp/2npp1p1/2p5/2P1P3/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 8", moves:["a2a3"], theme:{ru:"Профилактика",en:"Prophylaxis"} },
    { id:"p5_06", fen:"rnbqk2r/pp1pppbp/5np1/2p5/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq d3 0 4", moves:["c5d4"], theme:{ru:"Разрушение центра",en:"Break the center"} },
    { id:"p5_07", fen:"r1bq1rk1/pppn1pbp/3ppnp1/8/2PPP3/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 8", moves:["b2b3"], theme:{ru:"Фланговая стратегия",en:"Flank strategy"} },
    { id:"p5_08", fen:"rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP2BPPP/R1BQK1NR b KQkq - 2 4", moves:["e8g8"], theme:{ru:"Безопасность",en:"King safety"} },
    { id:"p5_09", fen:"r1bq1rk1/pp2ppbp/2np1np1/2p5/2PPP3/2N2NP1/PP3PBP/R1BQ1RK1 w - - 0 8", moves:["d4d5"], theme:{ru:"Закрытие центра",en:"Close center"} },
    { id:"p5_10", fen:"rnbq1rk1/pp1pppbp/5np1/2p5/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 b - - 3 5", moves:["d7d5"], theme:{ru:"Центральный удар",en:"Central strike"} },
    { id:"p5_11", fen:"r1bq1rk1/pp2ppbp/2npp1p1/8/2PNP3/2N1BP2/PP4PP/R2QKB1R w KQ - 0 9", moves:["d1d2"], theme:{ru:"Построение батареи",en:"Battery setup"} },
    { id:"p5_12", fen:"r1bqk2r/pp1n1ppp/2n1p3/2bpP3/3P4/2P2N2/P3BPPP/RNBQK2R w KQkq - 0 7", moves:["e1g1"], theme:{ru:"Рокировка под атаку",en:"Castle into attack"} },
    { id:"p5_13", fen:"r1bq1rk1/pppp1ppp/2n1pn2/8/2PP4/P1N2N2/1P2PPPP/R1BQKB1R w KQ - 0 6", moves:["e2e3"], theme:{ru:"Солидное развитие",en:"Solid development"} },
    { id:"p5_14", fen:"r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7", moves:["e1g1"], theme:{ru:"Завершение развития",en:"Complete development"} },
    { id:"p5_15", fen:"rnbq1rk1/pp2ppbp/2pp1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 7", moves:["e2e4"], theme:{ru:"Захват центра",en:"Center control"} },
    { id:"p5_16", fen:"r1bq1rk1/pp1nppbp/2np2p1/2p5/2P1P3/2NP1NP1/PP3PBP/R1BQ1RK1 w - - 0 8", moves:["a2a4"], theme:{ru:"Фланговое расширение",en:"Flank expansion"} },
    { id:"p5_17", fen:"rnbq1rk1/pp1pppbp/5np1/2p5/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b - - 3 5", moves:["b7b6"], theme:{ru:"Еж",en:"Hedgehog"} },
    { id:"p5_18", fen:"r2q1rk1/pp1nppbp/2n1b1p1/2pp4/2P1P3/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 9", moves:["e4d5"], theme:{ru:"Разрядка напряжения",en:"Release tension"} },
    { id:"p5_19", fen:"rnbqk2r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3", moves:["d7d5"], theme:{ru:"Контрудар",en:"Counter strike"} },
    { id:"p5_20", fen:"r1bq1rk1/pppnnpbp/3pp1p1/8/2PPP3/2N1BNP1/PP3PBP/R2Q1RK1 w - - 0 9", moves:["d4d5"], theme:{ru:"Марш пешки",en:"Pawn march"} }
  ],
  6: [
    // Level 6 (2300+) — GM-level positional mastery
    { id:"p6_01", fen:"r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 0 8", moves:["e1c1"], theme:{ru:"Длинная рокировка",en:"Queenside castling"} },
    { id:"p6_02", fen:"r1bq1rk1/pppn1pbp/3ppnp1/8/2PPP3/2N2NP1/PP3PBP/R1BQ1RK1 w - - 0 8", moves:["h2h3"], theme:{ru:"Профилактика",en:"Prophylaxis"} },
    { id:"p6_03", fen:"r2q1rk1/pp1bppbp/2np1np1/2p5/2P1P3/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 8", moves:["a2a4"], theme:{ru:"Ограничение",en:"Restriction"} },
    { id:"p6_04", fen:"rnbq1rk1/pp2ppbp/2pp1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 6", moves:["e4e5"], theme:{ru:"Пешечный прорыв",en:"Pawn breakthrough"} },
    { id:"p6_05", fen:"r1bq1rk1/pp2ppbp/2npp1p1/2p5/2P1P3/2N1BNP1/PP2PPBP/R2Q1RK1 w - - 0 8", moves:["d1d2"], theme:{ru:"Батарея",en:"Battery"} },
    { id:"p6_06", fen:"rnbq1rk1/pp2ppbp/3p1np1/2p5/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 6", moves:["e2e4"], theme:{ru:"Маросци",en:"Maroczy bind"} },
    { id:"p6_07", fen:"r1bq1rk1/pp1nppbp/2np2p1/2p5/2P1P3/2N2NP1/PP1PPPBP/R1BQ1RK1 w - - 0 7", moves:["d2d3"], theme:{ru:"Гибкость",en:"Flexibility"} },
    { id:"p6_08", fen:"rnbq1rk1/pp1pppbp/5np1/2p5/2PP4/5NP1/PP2PP1P/RNBQKB1R w KQ - 0 4", moves:["f1g2"], theme:{ru:"Фианкетто",en:"Fianchetto"} },
    { id:"p6_09", fen:"r1bq1rk1/ppp1ppbp/2n2np1/3p4/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 6", moves:["c4d5"], theme:{ru:"Размен",en:"Exchange"} },
    { id:"p6_10", fen:"r1bq1rk1/pp1n1pbp/2npp1p1/2p5/2P1P3/2NP1NP1/PP3PBP/R1BQR1K1 w - - 0 9", moves:["d3d4"], theme:{ru:"Центральный удар",en:"Central strike"} },
    { id:"p6_11", fen:"r2q1rk1/pppbbppp/2n1pn2/3p4/2PP4/1PN1PN2/PB3PPP/R2QKB1R w KQ - 4 7", moves:["f1d3"], theme:{ru:"Развитие",en:"Development"} },
    { id:"p6_12", fen:"r1bq1rk1/pp3pbp/2npp1pn/2p5/2P1P3/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 8", moves:["a2a3"], theme:{ru:"Подготовка b4",en:"Prepare b4"} },
    { id:"p6_13", fen:"r1bqk2r/pp1nppbp/2np2p1/2p5/2P1P3/2N2NP1/PP1PPPBP/R1BQK2R w KQkq - 0 6", moves:["d2d4"], theme:{ru:"Прорыв",en:"Breakthrough"} },
    { id:"p6_14", fen:"r2q1rk1/pp1bppbp/2npp1p1/2p5/2P1P1n1/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 9", moves:["h2h3"], theme:{ru:"Отбросить коня",en:"Kick the knight"} },
    { id:"p6_15", fen:"rnbq1rk1/pp2ppbp/3p1np1/2pP4/2P5/2N2NP1/PP2PPBP/R1BQK2R w KQ - 0 7", moves:["e1g1"], theme:{ru:"Безопасность",en:"King safety"} },
    { id:"p6_16", fen:"r1bq1rk1/pp1nppbp/3p1np1/2p5/2PP4/2N1PNP1/PP3PBP/R1BQ1RK1 w - - 0 7", moves:["d4d5"], theme:{ru:"Пространство",en:"Space"} },
    { id:"p6_17", fen:"r1bq1rk1/pppn1pbp/3ppnp1/8/2PPP3/2N1BN2/PP2BPPP/R2Q1RK1 w - - 2 8", moves:["d4d5"], theme:{ru:"Закрытие и атака",en:"Close and attack"} },
    { id:"p6_18", fen:"r1bq1rk1/pp2ppbp/2n2np1/2pp4/2P1P3/2N2NP1/PP1PPPBP/R1BQ1RK1 w - d6 0 7", moves:["e4d5"], theme:{ru:"Захват инициативы",en:"Seize initiative"} },
    { id:"p6_19", fen:"rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves:["c2c3"], theme:{ru:"Итальянская подготовка",en:"Italian preparation"} },
    { id:"p6_20", fen:"r1bq1rk1/pp1n1ppp/2n1p3/2bpP3/3P4/P1P2N2/2B2PPP/RNBQ1RK1 w - - 0 10", moves:["b2b4"], theme:{ru:"Фланговая атака",en:"Flank attack"} }
  ]
};

// --- PUZZLE PROGRESS ---
function getPuzzleProgress() {
  try {
    return JSON.parse(localStorage.getItem("fmine_chess_puzzles_solved") || "{}");
  } catch { return {}; }
}

function savePuzzleProgress(progress) {
  localStorage.setItem("fmine_chess_puzzles_solved", JSON.stringify(progress));
}

function getSolvedForLevel(level) {
  const progress = getPuzzleProgress();
  return progress[`level${level}`] || [];
}

function markPuzzleSolved(puzzleId, level) {
  const progress = getPuzzleProgress();
  const key = `level${level}`;
  if (!progress[key]) progress[key] = [];
  if (!progress[key].includes(puzzleId)) {
    progress[key].push(puzzleId);
  }
  savePuzzleProgress(progress);
}

function updatePuzzleLevelProgress() {
  for (let i = 1; i <= 6; i++) {
    const solved = getSolvedForLevel(i);
    const el = document.getElementById(`lvlProg${i}`);
    if (el) {
      const count = solved.length;
      el.innerHTML = count >= 20
        ? `<span class="done">✅ 20/20</span>`
        : `${count}/20`;
    }
  }
  // Update puzzle rating badge
  const rating = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
  const badge = document.getElementById("puzzleRatingBadge");
  if (badge) badge.textContent = getTitleAndRatingStr(rating);
}

// --- PUZZLE LEVEL SELECTION ---
window.selectPuzzleLevel = function(level) {
  puzzleLevel = level;
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`lvl${i}`);
    if (el) el.classList.toggle("active", i === level);
  }
};

// --- START PUZZLE MODE ---
window.startPuzzleMode = function() {
  mode = "puzzle";
  isPuzzleMode = true;
  cleanupSSE();
  clearActiveGameStorage();

  // Hide setup, show arena
  document.getElementById("setupView").style.display = "none";
  document.getElementById("arenaView").classList.add("active");

  // Hide multiplayer-specific elements
  document.getElementById("roomCodeBadge").classList.add("hidden");
  document.getElementById("btnGameOverRematch").classList.add("hidden");

  // Hide sidebar multiplayer controls
  const drawBtn = document.getElementById("btnOfferDraw");
  const resignBtn = document.getElementById("btnResign");
  if (drawBtn) drawBtn.style.display = "none";
  if (resignBtn) resignBtn.style.display = "none";

  // Hide timers
  const pTimer = document.getElementById("playerTimer");
  const oTimer = document.getElementById("opponentTimer");
  if (pTimer) pTimer.classList.add("hidden");
  if (oTimer) oTimer.classList.add("hidden");

  // Show puzzle UI
  const infoBar = document.getElementById("puzzleInfoBar");
  if (infoBar) infoBar.classList.add("active");
  const controls = document.getElementById("puzzleControls");
  if (controls) controls.classList.add("active");

  // Set player names
  const rating = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
  document.getElementById("playerName").textContent = `${userNick} ${getTitleAndRatingStr(rating)}`;
  document.getElementById("opponentName").textContent = LANG === 'ru' ? `🧩 Задачи (Ур. ${puzzleLevel})` : `🧩 Puzzles (Lv. ${puzzleLevel})`;

  // Load first unsolved puzzle
  loadNextPuzzle();
};

function loadNextPuzzle() {
  const puzzles = CHESS_PUZZLES[puzzleLevel];
  if (!puzzles) return;

  const solved = getSolvedForLevel(puzzleLevel);
  const unsolved = puzzles.filter(p => !solved.includes(p.id));

  if (unsolved.length === 0) {
    // All puzzles in this level are solved!
    showPuzzleLevelComplete();
    return;
  }

  // Pick a random unsolved puzzle
  currentPuzzle = unsolved[Math.floor(Math.random() * unsolved.length)];
  puzzleMoveIndex = 0;
  puzzleSolved = false;
  puzzleCurrentNum = solved.length + 1;

  // Load position
  game = new Chess(currentPuzzle.fen);

  // Determine player color from whose turn it is
  playerColor = game.turn() === 'w' ? 'white' : 'black';
  botColor = playerColor === 'white' ? 'black' : 'white';

  // Update dots
  const playerDot = document.getElementById("playerColorDot");
  const opponentDot = document.getElementById("opponentColorDot");
  if (playerDot) playerDot.className = `player-color-dot ${playerColor}`;
  if (opponentDot) opponentDot.className = `player-color-dot ${botColor}`;

  // Update puzzle info bar
  const numText = document.getElementById("puzzleNumText");
  if (numText) numText.textContent = `${t("puzzleTask")} ${puzzleCurrentNum}/20`;
  const themeText = document.getElementById("puzzleThemeText");
  if (themeText) themeText.textContent = currentPuzzle.theme[LANG] || currentPuzzle.theme.en;
  const moveHint = document.getElementById("puzzleMoveHint");
  if (moveHint) moveHint.textContent = playerColor === 'white' ? t("puzzleMoveWhite") : t("puzzleMoveBlack");

  // Reset status
  const status = document.getElementById("puzzleStatus");
  if (status) { status.className = "puzzle-status"; status.textContent = ""; }

  // Show/hide buttons
  const nextBtn = document.getElementById("btnPuzzleNext");
  if (nextBtn) nextBtn.style.display = "none";
  const hintBtn = document.getElementById("btnPuzzleHint");
  if (hintBtn) hintBtn.style.display = "";
  const solBtn = document.getElementById("btnPuzzleSolution");
  if (solBtn) solBtn.style.display = "";

  // Render the board
  renderBoard();
  updateTurnIndicator();
}

// --- PUZZLE MOVE HANDLING ---
// Called from the main handleSquareClick when in puzzle mode
function handlePuzzleMove(from, to, promotion) {
  if (puzzleSolved || !currentPuzzle) return false;

  const expectedMove = currentPuzzle.moves[puzzleMoveIndex];
  if (!expectedMove) return false;

  const expectedFrom = expectedMove.substring(0, 2);
  const expectedTo = expectedMove.substring(2, 4);
  const expectedPromo = expectedMove.length > 4 ? expectedMove[4] : undefined;

  if (from === expectedFrom && to === expectedTo && (!expectedPromo || promotion === expectedPromo)) {
    // CORRECT MOVE!
    const moveResult = game.move({ from, to, promotion: promotion || expectedPromo });
    if (!moveResult) return false;

    puzzleMoveIndex++;
    renderBoard();
    updateTurnIndicator();
    playMoveSound();

    // Check if puzzle is complete
    if (puzzleMoveIndex >= currentPuzzle.moves.length) {
      onPuzzleSolved();
      return true;
    }

    // Auto-play opponent's response after a short delay
    setTimeout(() => {
      if (puzzleMoveIndex < currentPuzzle.moves.length) {
        const oppMove = currentPuzzle.moves[puzzleMoveIndex];
        const oppFrom = oppMove.substring(0, 2);
        const oppTo = oppMove.substring(2, 4);
        const oppPromo = oppMove.length > 4 ? oppMove[4] : undefined;

        game.move({ from: oppFrom, to: oppTo, promotion: oppPromo });
        puzzleMoveIndex++;
        renderBoard();
        updateTurnIndicator();
        playCaptureSound();

        // Check if puzzle complete after opponent move
        if (puzzleMoveIndex >= currentPuzzle.moves.length) {
          onPuzzleSolved();
        }
      }
    }, 400);

    return true;
  } else {
    // WRONG MOVE!
    const status = document.getElementById("puzzleStatus");
    if (status) {
      status.className = "puzzle-status wrong";
      status.textContent = t("puzzleWrong");
    }
    // Shake the board
    const wrapper = document.querySelector(".chessboard-wrapper");
    if (wrapper) {
      wrapper.style.animation = "none";
      wrapper.offsetHeight; // reflow
      wrapper.style.animation = "shake 0.4s ease";
      setTimeout(() => { wrapper.style.animation = ""; }, 500);
    }

    // Clear wrong status after 1.5s
    setTimeout(() => {
      if (status && !puzzleSolved) {
        status.className = "puzzle-status";
        status.textContent = "";
      }
    }, 1500);

    return false;
  }
}

function onPuzzleSolved() {
  puzzleSolved = true;

  // Show correct status
  const status = document.getElementById("puzzleStatus");
  if (status) {
    status.className = "puzzle-status correct";
    status.textContent = t("puzzleSolved");
  }

  // Mark as solved
  markPuzzleSolved(currentPuzzle.id, puzzleLevel);

  // Award ELO
  const eloReward = PUZZLE_ELO_REWARDS[puzzleLevel] || 2;
  let currentRating = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
  currentRating += eloReward;
  localStorage.setItem("fmine_chess_rating", currentRating.toString());

  // Play success sound
  playGameOverSound();

  // Show puzzle complete modal
  const title = document.getElementById("puzzleCompleteTitle");
  const desc = document.getElementById("puzzleCompleteDesc");
  if (title) title.textContent = t("puzzleComplete");
  if (desc) desc.textContent = LANG === 'ru'
    ? `Отлично! +${eloReward} ELO (Рейтинг: ${currentRating})`
    : `Excellent! +${eloReward} ELO (Rating: ${currentRating})`;

  const modal = document.getElementById("puzzleCompleteModal");
  if (modal) modal.classList.add("active");

  // Show next button, hide hint/solution
  const nextBtn = document.getElementById("btnPuzzleNext");
  if (nextBtn) nextBtn.style.display = "";
  const hintBtn = document.getElementById("btnPuzzleHint");
  if (hintBtn) hintBtn.style.display = "none";
  const solBtn = document.getElementById("btnPuzzleSolution");
  if (solBtn) solBtn.style.display = "none";

  // Update rating displays
  const ratingBadge = document.getElementById("userRatingBadge");
  if (ratingBadge) ratingBadge.textContent = getTitleAndRatingStr(currentRating);
  const puzzleBadge = document.getElementById("puzzleRatingBadge");
  if (puzzleBadge) puzzleBadge.textContent = getTitleAndRatingStr(currentRating);

  showToast(LANG === 'ru' ? `+${eloReward} ELO! Рейтинг: ${currentRating}` : `+${eloReward} ELO! Rating: ${currentRating}`);
}

function showPuzzleLevelComplete() {
  const title = document.getElementById("puzzleCompleteTitle");
  const desc = document.getElementById("puzzleCompleteDesc");
  if (title) title.textContent = t("puzzleLevelDone");
  if (desc) desc.textContent = LANG === 'ru'
    ? `Вы решили все 20 задач уровня ${puzzleLevel}! Попробуйте следующий уровень.`
    : `You solved all 20 puzzles of level ${puzzleLevel}! Try the next level.`;

  const modal = document.getElementById("puzzleCompleteModal");
  if (modal) modal.classList.add("active");
}

// --- PUZZLE UI ACTIONS ---
window.puzzleNext = function() {
  // Close modal if open
  const modal = document.getElementById("puzzleCompleteModal");
  if (modal) modal.classList.remove("active");

  loadNextPuzzle();
};

window.puzzleExit = function() {
  // Close modal if open
  const modal = document.getElementById("puzzleCompleteModal");
  if (modal) modal.classList.remove("active");

  isPuzzleMode = false;
  currentPuzzle = null;

  // Hide puzzle UI
  const infoBar = document.getElementById("puzzleInfoBar");
  if (infoBar) infoBar.classList.remove("active");
  const controls = document.getElementById("puzzleControls");
  if (controls) controls.classList.remove("active");

  // Restore sidebar buttons
  const drawBtn = document.getElementById("btnOfferDraw");
  const resignBtn = document.getElementById("btnResign");
  if (drawBtn) drawBtn.style.display = "";
  if (resignBtn) resignBtn.style.display = "";

  // Back to setup
  document.getElementById("arenaView").classList.remove("active");
  document.getElementById("setupView").style.display = "";

  // Update progress
  updatePuzzleLevelProgress();
};

window.puzzleShowHint = function() {
  if (!currentPuzzle || puzzleSolved) return;

  const move = currentPuzzle.moves[puzzleMoveIndex];
  if (!move) return;

  const from = move.substring(0, 2);

  // Highlight the source square
  const squares = document.querySelectorAll(".square");
  squares.forEach(sq => {
    if (sq.dataset.square === from) {
      sq.classList.add("selected");
      setTimeout(() => sq.classList.remove("selected"), 2000);
    }
  });

  showToast(LANG === 'ru' ? `💡 Подсказка: ходите фигурой с ${from.toUpperCase()}` : `💡 Hint: move the piece from ${from.toUpperCase()}`);
};

window.puzzleShowSolution = function() {
  if (!currentPuzzle) return;

  // Show the entire solution as a toast
  const moves = currentPuzzle.moves.join(", ");
  showToast(LANG === 'ru' ? `Решение: ${moves}` : `Solution: ${moves}`);

  // Auto-play all remaining moves
  if (!puzzleSolved) {
    let delay = 0;
    for (let i = puzzleMoveIndex; i < currentPuzzle.moves.length; i++) {
      const move = currentPuzzle.moves[i];
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      const promo = move.length > 4 ? move[4] : undefined;

      setTimeout(() => {
        game.move({ from, to, promotion: promo });
        puzzleMoveIndex = i + 1;
        renderBoard();
        updateTurnIndicator();
        playMoveSound();

        if (i === currentPuzzle.moves.length - 1) {
          // Don't award ELO for shown solutions
          puzzleSolved = true;
          const status = document.getElementById("puzzleStatus");
          if (status) {
            status.className = "puzzle-status correct";
            status.textContent = LANG === 'ru' ? "Показано" : "Shown";
          }
          // Show next button
          const nextBtn = document.getElementById("btnPuzzleNext");
          if (nextBtn) nextBtn.style.display = "";
          const hintBtn = document.getElementById("btnPuzzleHint");
          if (hintBtn) hintBtn.style.display = "none";
          const solBtn = document.getElementById("btnPuzzleSolution");
          if (solBtn) solBtn.style.display = "none";
        }
      }, delay);
      delay += 600;
    }
  }
};

// Initialize puzzle progress display on page load
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(updatePuzzleLevelProgress, 500);
});
function updateRatingMultiplayer(outcome) {
  if (mode !== "multiplayer") return;
  
  let currentRating = parseInt(localStorage.getItem("fmine_chess_rating") || "1200");
  
  let ratingChange = 0;
  if (outcome === 'win') {
    ratingChange = 20;
  } else if (outcome === 'loss') {
    ratingChange = -20;
  }
  
  if (ratingChange !== 0) {
    currentRating += ratingChange;
    if (currentRating < 0) currentRating = 0;
    localStorage.setItem("fmine_chess_rating", currentRating.toString());
    
    const changeText = ratingChange > 0 ? `+${ratingChange}` : `${ratingChange}`;
    showToast(LANG === 'ru' 
      ? `Рейтинг обновлен: ${currentRating} (${changeText})` 
      : `Rating updated: ${currentRating} (${changeText})`
    );
    
    // Update setup screen rating badge
    const ratingBadge = document.getElementById("userRatingBadge");
    if (ratingBadge) {
      ratingBadge.textContent = getTitleAndRatingStr(currentRating);
    }
    
    // Update header player name
    const playerNameEl = document.getElementById("playerName");
    if (playerNameEl) {
      playerNameEl.textContent = `${userNick} ${getTitleAndRatingStr(currentRating)}`;
    }
  }
}

