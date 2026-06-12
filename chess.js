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
    coachCommentaryText: "Выберите ход для просмотра детального анализа и лучшего продолжения."
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
    coachCommentaryText: "Select a move to view detailed analysis and the best continuation."
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
  
  document.getElementById("lblBotPersonality").textContent = t("lblPers");
  document.getElementById("optPersOn").textContent = t("btnOn");
  document.getElementById("optPersOff").textContent = t("btnOff");
  
  document.getElementById("btnStartBot").textContent = t("btnStart");
  document.getElementById("btnCreateRoom").textContent = t("btnCreate");
  document.getElementById("lblCreateRoom").textContent = t("btnCreate");
  document.getElementById("lblJoinRoom").textContent = t("lblJoinRoom");
  document.getElementById("roomCodeInput").placeholder = LANG === "ru" ? "Код комнаты, напр: CH-5683" : "Room code, e.g. CH-5683";
  document.getElementById("btnJoinRoom").textContent = t("btnJoin");
  
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

  updateTurnIndicator();
  renderMovesLog();
}

// --- SETUP SCREEN TRIGGERS ---
window.selectMode = function(m) {
  mode = m;
  document.getElementById("btnModeBot").classList.toggle("active", m === "bot");
  document.getElementById("btnModeMulti").classList.toggle("active", m === "multiplayer");
  
  document.getElementById("panelBot").classList.toggle("active", m === "bot");
  document.getElementById("panelMulti").classList.toggle("active", m === "multiplayer");
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
const SERVER_URL = 'https://my-education-site-f-mine.onrender.com';

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
  // Use GET for create/join to avoid CORS preflight; POST for everything else
  const useGet = endpoint === 'create' || endpoint === 'join';
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
  document.getElementById("playerName").textContent = userNick;
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
  
  renderBoard();
  updateTurnIndicator();
  addChatMessage("system", LANG === 'ru' ? "Игра началась против ИИ." : "Match started against AI.");
  
  if (playerColor === 'black') {
    // Bot goes first as White
    triggerBotMove();
  }
};

window.restartBotGame = function() {
  document.getElementById("gameOverModal").classList.remove("active");
  startGame();
};

window.createRoom = async function() {
  const btn = document.getElementById('btnCreateRoom');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = LANG === 'ru' ? '\u23f3 \u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435...' : '\u23f3 Connecting...'; }

  try {
    // Ping server first to wake it up
    await withTimeout(fetch(`${SERVER_URL}/api/chess/ping`), 25000);

    if (btn) btn.textContent = LANG === 'ru' ? '\u23f3 \u0421\u043e\u0437\u0434\u0430\u0451\u043c \u043a\u043e\u043c\u043d\u0430\u0442\u0443...' : '\u23f3 Creating room...';
    const data = await apiCall('create', { creator: userNick, mode: 'multiplayer', creatorColor: selectedPlayerColor });
    activeGameId = data.gameId;
    playerColor = data.color;

    localStorage.setItem('fmine_active_chess_game', activeGameId);
    localStorage.setItem('fmine_active_chess_color', playerColor);

    document.getElementById('playerName').textContent = userNick;
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
    const data = await apiCall("join", { gameId: code, player: userNick });
    activeGameId = data.gameId;
    playerColor = data.color;
    
    localStorage.setItem("fmine_active_chess_game", activeGameId);
    localStorage.setItem("fmine_active_chess_color", playerColor);

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
function setupSSE(gameId) {
  if (sseSource) {
    sseSource.close();
    sseSource = null;
  }
  
  if (!gameId) return;
  
  sseSource = new EventSource(`${SERVER_URL}/api/chess/stream/${gameId}`);

  
  sseSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === "init") {
      game = new Chess();
      if (data.game.moves && data.game.moves.length > 0) {
        for (const m of data.game.moves) {
          game.move({ from: m.from, to: m.to, promotion: m.promotion });
        }
      } else {
        game = new Chess(data.game.fen);
      }
      loadGameSnapshot(data.game);
    } else if (data.type === "update") {
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
    } else if (data.type === "resigned") {
      playGameOverSound();
      document.getElementById("gameOverTitle").textContent = LANG === 'ru' ? "Игра завершена!" : "Game Over!";
      document.getElementById("gameOverDesc").textContent = data.winner === userNick ? 
        (LANG === 'ru' ? "Оппонент сдался. Вы победили!" : "Opponent resigned. You win!") :
        (LANG === 'ru' ? "Вы сдались. Оппонент победил!" : "You resigned. Opponent wins!");
      document.getElementById("gameOverModal").classList.add("active");
      clearActiveGameStorage();
    }
  };
  
  sseSource.onerror = function() {
    console.error("SSE stream connection lost.");
  };
}

function loadGameSnapshot(srvGame) {
  // Update player names
  if (playerColor === 'white') {
    document.getElementById("opponentName").textContent = srvGame.playerBlack || t("waitingOpponent");
  } else {
    document.getElementById("opponentName").textContent = srvGame.playerWhite || t("waitingOpponent");
  }
  
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
        move: { from, to, promotion, san: moveObj.san }
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
        
        // Match table based on color
        // White evaluates standard array index, Black evaluates flipped array index
        const indexRow = piece.color === 'w' ? (7 - r) : r;
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
    
    if (evalLoss > 2.0) {
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

