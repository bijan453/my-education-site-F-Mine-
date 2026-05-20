const APP_STATE = {
  currentGrade: 7,
  activeTopic: null,
  xp: 0,
  streak: 0,
  lastLogin: null,
  completed: [],
  exAnswers: []
};

// ------------------------------------------------------------------------------------------------ //
// 1. DYNAMIC DATA GENERATION ENGINE
// ------------------------------------------------------------------------------------------------ //
const GRADES = [7, 8, 9, 10];
const IMG_QUERIES = ['school', 'study', 'education', 'book', 'learning', 'university', 'science', 'nature', 'technology', 'success', 'future', 'work'];

const VOCAB_TIERS = {
  7: {
    subjects: ['I', 'You', 'He', 'She', 'We', 'They', 'The boy', 'The girl', 'My friend'],
    verbs1: ['play', 'read', 'run', 'eat', 'jump', 'watch', 'sleep', 'go', 'study'],
    verbs2: ['played', 'read', 'ran', 'ate', 'jumped', 'watched', 'slept', 'went', 'studied'],
    verbs3: ['played', 'read', 'run', 'eaten', 'jumped', 'watched', 'slept', 'gone', 'studied'],
    objects: ['a book', 'football', 'an apple', 'a movie', 'to school', 'music'],
    time: ['every day', 'yesterday', 'tomorrow', 'now', 'often', 'never']
  },
  8: {
    subjects: ['The student', 'The teacher', 'My parents', 'The team', 'Our class'],
    verbs1: ['explore', 'achieve', 'solve', 'discover', 'build', 'create', 'learn', 'travel'],
    verbs2: ['explored', 'achieved', 'solved', 'discovered', 'built', 'created', 'learned', 'traveled'],
    verbs3: ['explored', 'achieved', 'solved', 'discovered', 'built', 'created', 'learned', 'traveled'],
    objects: ['a new planet', 'the mystery', 'a project', 'the global issue', 'the history'],
    time: ['recently', 'in 2020', 'next month', 'at the moment', 'usually', 'seldom']
  },
  9: {
    subjects: ['The scientist', 'The researcher', 'The government', 'The committee', 'Experts'],
    verbs1: ['analyze', 'determine', 'investigate', 'develop', 'invent', 'organize'],
    verbs2: ['analyzed', 'determined', 'investigated', 'developed', 'invented', 'organized'],
    verbs3: ['analyzed', 'determined', 'investigated', 'developed', 'invented', 'organized'],
    objects: ['the statistics', 'the new theory', 'a complex algorithm', 'the crisis'],
    time: ['currently', 'over the past decade', 'in the near future', 'frequently', 'rarely']
  },
  10: {
    subjects: ['Society', 'Humanity', 'The infrastructure', 'The phenomenon', 'Authorities'],
    verbs1: ['facilitate', 'comprehend', 'evaluate', 'sustain', 'implement', 'transform'],
    verbs2: ['facilitated', 'comprehended', 'evaluated', 'sustained', 'implemented', 'transformed'],
    verbs3: ['facilitated', 'comprehended', 'evaluated', 'sustained', 'implemented', 'transformed'],
    objects: ['the global economy', 'sustainable development', 'psychological aspects', 'policies'],
    time: ['in the modern era', 'historically', 'post-haste', 'consistently', 'inevitably']
  }
};

const GRAMMAR_TEMPLATES = [
  { id: 'pres_simp', title: 'Present Simple', desc: 'Routines and facts', rule: 'Used for regular actions or permanent states.\nForm: Subject + V1(s/es).' },
  { id: 'pres_cont', title: 'Present Continuous', desc: 'Actions happening now', rule: 'Used for actions happening exactly now or around now.\nForm: am/is/are + V-ing.' },
  { id: 'pres_perf', title: 'Present Perfect', desc: 'Past actions with present results', rule: 'Connects the past to the present. Time is not specified.\nForm: have/has + V3.' },
  { id: 'past_simp', title: 'Past Simple', desc: 'Completed actions in the past', rule: 'Used for completed actions at a specific time in the past.\nForm: V2 (or -ed).' },
  { id: 'past_cont', title: 'Past Continuous', desc: 'Actions in progress in the past', rule: 'Describes a background action or an action in progress.\nForm: was/were + V-ing.' },
  { id: 'fut_simp', title: 'Future Simple', desc: 'Predictions and promises', rule: 'Used for spontaneous decisions or future facts.\nForm: will + V1.' },
  { id: 'modals_abil', title: 'Modals: Ability', desc: 'Can, Could, Be able to', rule: 'Expresses physical or mental ability.\nPresent: can. Past: could.' },
  { id: 'modals_obl', title: 'Modals: Obligation', desc: 'Must, Have to, Should', rule: 'Must = strong personal obligation. Have to = external rule. Should = advice.' },
  { id: 'passive_pres', title: 'Passive Voice (Present)', desc: 'Focus on the action', rule: 'Used when the doer is unknown or unimportant.\nForm: am/is/are + V3.' },
  { id: 'conditionals_0', title: 'Zero Conditional', desc: 'General truths', rule: 'For scientific facts and guarantees.\nForm: If + Pres. Simple, Pres. Simple.' },
  { id: 'conditionals_1', title: 'First Conditional', desc: 'Real future possibilities', rule: 'For highly probable future scenarios.\nForm: If + Pres. Simple, will + V1.' },
  { id: 'imperative', title: 'Imperatives', desc: 'Commands and requests', rule: 'Used to give orders or advice. Starts with a base verb.\nForm: V1.' },
  { id: 'gerund_inf', title: 'Gerunds & Infinitives', desc: 'Verbs acting as nouns', rule: 'Some verbs are followed by -ing (enjoy), others by to (decide).' },
  { id: 'rel_clauses', title: 'Relative Clauses', desc: 'Who, Which, Where', rule: 'Used to add information about a noun without starting a new sentence.' },
  { id: 'articles', title: 'Articles (A/An/The)', desc: 'Definite and Indefinite', rule: 'A/an for non-specific singular. The for specific things. Zero article for general plural.' },
  { id: 'prepositions', title: 'Prepositions of Time', desc: 'In, On, At', rule: 'At = exact time. On = days. In = months/years/parts of day.' },
  { id: 'comparatives', title: 'Comparatives', desc: 'Comparing two things', rule: 'Short adjectives: +er. Long adjectives: more + adj.' },
  { id: 'superlatives', title: 'Superlatives', desc: 'The highest degree', rule: 'Short adjectives: the + -est. Long adjectives: the most + adj.' },
  { id: 'quantifiers', title: 'Quantifiers', desc: 'Much, Many, Some, Any', rule: 'Many = countable. Much = uncountable. Some for positive, Any for negative.' },
  { id: 'reported_spe', title: 'Reported Speech', desc: 'Telling what someone said', rule: 'Shift tenses one step back into the past when reporting.' },
  { id: 'used_to', title: 'Used to', desc: 'Past habits', rule: 'Used for past habits or states that are no longer true.\nForm: used to + V1.' },
  { id: 'pres_perf_c', title: 'Present Perfect Cont.', desc: 'Focus on duration', rule: 'An action started in the past and continues to the present.\nForm: have/has been + V-ing.' },
  { id: 'past_perf', title: 'Past Perfect', desc: 'Past of the past', rule: 'An action that happened before another past action.\nForm: had + V3.' },
  { id: 'fut_cont', title: 'Future Continuous', desc: 'Action in progress in the future', rule: 'An action that will be ongoing at a specific future time.\nForm: will be + V-ing.' },
  { id: 'conditionals_2', title: 'Second Conditional', desc: 'Unreal present/future', rule: 'Imaginary or unlikely situations.\nForm: If + Past Simple, would + V1.' },
  { id: 'conditionals_3', title: 'Third Conditional', desc: 'Unreal past', rule: 'Regrets about the past.\nForm: If + Past Perfect, would have + V3.' },
  { id: 'phrasal_verbs', title: 'Phrasal Verbs', desc: 'Verb + Preposition', rule: 'A verb combined with an adverb or preposition that changes its meaning.' }
];

let TOPIC_DB = {}; // Stores all 108 topics

function initEngine() {
  GRADES.forEach(grade => {
    TOPIC_DB[grade] = [];
    const voc = VOCAB_TIERS[grade];
    
    // Generate exactly 27 topics per grade
    GRAMMAR_TEMPLATES.forEach((template, idx) => {
      let tObj = {
        id: `G${grade}-${idx}`,
        grade: grade,
        title: template.title,
        desc: template.desc,
        img: `https://picsum.photos/400/300?random=${grade}${idx}`,
        theory: `<b>Level ${grade} Explanation:</b><br><br>${template.rule}<br><br>As a Grade ${grade} student, you should master using this with complex vocabulary.`,
        examples: [],
        exercises: []
      };
      
      // Generate 3 random examples
      for(let e=0; e<3; e++) {
        let s = voc.subjects[e % voc.subjects.length];
        let v1 = voc.verbs1[e % voc.verbs1.length];
        let o = voc.objects[e % voc.objects.length];
        tObj.examples.push({
          en: `${s} ${v1} ${o}.`,
          desc: `Example usage of ${template.title}`
        });
      }
      
      // Generate 10 interactive exercises using procedural logic
      for(let ex=0; ex<10; ex++) {
        let sub = voc.subjects[ex % voc.subjects.length];
        let v1 = voc.verbs1[ex % voc.verbs1.length];
        let obj = voc.objects[(ex+1) % voc.objects.length];
        let t = voc.time[ex % voc.time.length];
        
        let qText = `${sub} _____ ${obj} ${t}.`;
        
        // Procedurally generating distractors
        let corr = v1;
        let d1 = v1 + "ing";
        let d2 = v1 + "s";
        let d3 = "to " + v1;
        
        if (template.id === 'past_simp') { corr = voc.verbs2[ex % voc.verbs2.length]; }
        if (template.id === 'pres_perf') { corr = "have " + voc.verbs3[ex % voc.verbs3.length]; d1 = "has " + v1; }
        
        let optsOpts = [corr, d1, d2, d3];
        // Shuffle opts
        optsOpts.sort(() => Math.random() - 0.5);
        let ansIdx = optsOpts.indexOf(corr);
        
        tObj.exercises.push({
          q: qText,
          opts: optsOpts,
          ans: ansIdx
        });
      }
      
      TOPIC_DB[grade].push(tObj);
    });
  });
}

// ------------------------------------------------------------------------------------------------ //
// 2. STATE MANAGEMENT & LOCAL STORAGE
// ------------------------------------------------------------------------------------------------ //
function loadData() {
  const data = localStorage.getItem('engl_app_state');
  if(data) {
    const pData = JSON.parse(data);
    APP_STATE.currentGrade = pData.currentGrade || 7;
    APP_STATE.xp = pData.xp || 0;
    APP_STATE.streak = pData.streak || 0;
    APP_STATE.lastLogin = pData.lastLogin || null;
    APP_STATE.completed = pData.completed || [];
  }
  checkStreak();
  updateUIStats();
}

function saveData() {
  localStorage.setItem('engl_app_state', JSON.stringify(APP_STATE));
  updateUIStats();
}

function checkStreak() {
  const today = new Date().toDateString();
  if (APP_STATE.lastLogin !== today) {
    if (APP_STATE.lastLogin === new Date(Date.now() - 86400000).toDateString()) {
      APP_STATE.streak++;
    } else if (APP_STATE.lastLogin !== null) {
      APP_STATE.streak = 1; // reset broken streak
    } else {
      APP_STATE.streak = 1;
    }
    APP_STATE.lastLogin = today;
    saveData();
  }
}

function updateUIStats() {
  const s = document.getElementById('streakBadge');
  const xp = document.getElementById('totalXpBadge');
  if(s) s.textContent = `🔥 ${APP_STATE.streak}`;
  if(xp) xp.textContent = `⭐ ${APP_STATE.xp} XP`;
}

function playSound(id) {
  const aud = document.getElementById(id);
  if(aud) {
    aud.currentTime = 0;
    aud.play().catch(e => console.log('Audio overlap ignored'));
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ------------------------------------------------------------------------------------------------ //
// 3. UI RENDERING
// ------------------------------------------------------------------------------------------------ //
function renderApp() {
  const appContainer = document.getElementById('app');
  
  appContainer.innerHTML = `
    <div class="sidebar">
      <div class="glass-panel">
        <div class="grade-selector">
          <h3>🎓 Select Grade</h3>
          ${GRADES.map(g => `
            <button class="grade-btn ${APP_STATE.currentGrade === g ? 'active' : ''}" onclick="setGrade(${g})">
              <div class="grade-circle">${g}</div>
              Grade ${g}
            </button>
          `).join('')}
        </div>
        <div class="sidebar-stats">
          <div class="stat-item">
            <div class="stat-item-title">Completed (Grade ${APP_STATE.currentGrade})</div>
            <div style="font-weight:700; margin-bottom:8px; font-size:14px; display:flex; justify-content:space-between">
              <span id="progCount">0 / 27</span>
              <span id="progPct">0%</span>
            </div>
            <div class="stat-bar-track"><div class="stat-bar-fill" id="progBar" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content" id="mainContent">
      <!-- Injected Hub or Lesson -->
    </div>
  `;
  
  calcProgress();
  renderHub();
}

function setGrade(g) {
  APP_STATE.currentGrade = g;
  saveData();
  playSound('snd-pop');
  renderApp(); // re-render sidebar and hub
}

function calcProgress() {
  const topicsForGrade = TOPIC_DB[APP_STATE.currentGrade];
  let compCount = 0;
  topicsForGrade.forEach(t => {
    if(APP_STATE.completed.includes(t.id)) compCount++;
  });
  const pct = Math.round((compCount / 27) * 100);
  
  const cEl = document.getElementById('progCount');
  const pEl = document.getElementById('progPct');
  const bEl = document.getElementById('progBar');
  if(cEl) cEl.textContent = `${compCount} / 27`;
  if(pEl) pEl.textContent = `${pct}%`;
  if(bEl) bEl.style.width = `${pct}%`;
}

function renderHub() {
  const m = document.getElementById('mainContent');
  const topics = TOPIC_DB[APP_STATE.currentGrade];
  
  m.innerHTML = `
    <div class="hub-header">
      <h1 class="hub-title">Grade ${APP_STATE.currentGrade} English</h1>
      <div class="hub-subtitle">27 interactive lessons dynamically tailored for your level.</div>
    </div>
    
    <div class="topics-grid">
      ${topics.map((t, idx) => {
        let isComp = APP_STATE.completed.includes(t.id);
        return `
          <div class="topic-card" onclick="openLesson('${t.id}')">
            <div class="t-img-box">
              <img src="${t.img}" class="t-img" onerror="this.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'">
              <div class="t-img-overlay"></div>
            </div>
            <div class="t-content">
              <span class="t-badge">Lesson ${idx+1}</span>
              <div class="t-title">${t.title}</div>
              <div class="t-desc">${t.desc}</div>
              ${isComp ? `<div style="margin-top:10px; color:var(--success); font-weight:700; font-size:12px; display:flex; align-items:center; gap:5px;">✅ Completed</div>` : ``}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ------------------------------------------------------------------------------------------------ //
// 4. LESSON VIEW & INTERACTIVITY
// ------------------------------------------------------------------------------------------------ //
let currentSynth = window.speechSynthesis;
let currentUtterance = null;

function openLesson(id) {
  APP_STATE.activeTopic = TOPIC_DB[APP_STATE.currentGrade].find(t => t.id === id);
  APP_STATE.exAnswers = new Array(10).fill(-1);
  
  const m = document.getElementById('mainContent');
  window.scrollTo({top:0, behavior: 'smooth'});
  playSound('snd-pop');
  
  m.innerHTML = `
    <div class="lesson-view" style="display:block;">
      <div class="lesson-topbar">
        <button class="btn-back-main" onclick="renderHub(); stopTTS();"><span style="font-size:20px;">←</span> Back to Topics</button>
      </div>
      
      <div class="lesson-hero">
        <div class="lesson-meta">Grade ${APP_STATE.currentGrade} • Grammar</div>
        <h1 class="lesson-h1">${APP_STATE.activeTopic.title}</h1>
        <button class="btn-tts" id="mainVoiceBtn" onclick="toggleMainTTS()">🔊 Listen to Theory</button>
      </div>
      
      <div class="tab-nav">
        <button class="tab-btn active">Theory & Examples</button>
      </div>
      
      <div class="theory-content">
        ${APP_STATE.activeTopic.theory}
        
        <h3>Examples to read and listen:</h3>
        ${APP_STATE.activeTopic.examples.map((ex, i) => `
          <div class="example-box">
            <div class="ex-row">
              <div class="ex-en">
                ${ex.en}
                <button class="btn-mini-tts" onclick="speakText('${ex.en.replace(/'/g, "\\'")}')">▶</button>
              </div>
              <div class="ex-ru">${ex.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="ex-block">
        <h3 style="font-size:24px; font-family:'Syne'; margin-bottom:25px;">Interactive Exercises (10)</h3>
        ${APP_STATE.activeTopic.exercises.map((ex, i) => `
          <div class="q-card" id="qCard${i}">
            <div class="q-text">${i+1}. ${ex.q}</div>
            <div class="opts-grid">
              ${ex.opts.map((opt, oid) => `
                <button class="opt-btn" id="opt_${i}_${oid}" onclick="selectAnswer(${i},${oid})">${opt}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="submit-panel">
        <button class="btn-submit" onclick="submitExercises()">Verify Answers →</button>
      </div>
      <div id="finalResult" class="final-result"></div>
      
    </div>
  `;
}

function selectAnswer(qId, optId) {
  const card = document.getElementById(`qCard${qId}`);
  if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
  
  APP_STATE.exAnswers[qId] = optId;
  playSound('snd-pop');
  
  for(let j=0; j<APP_STATE.activeTopic.exercises[qId].opts.length; j++) {
    document.getElementById(`opt_${qId}_${j}`).classList.remove('selected');
  }
  document.getElementById(`opt_${qId}_${optId}`).classList.add('selected');
}

function submitExercises() {
  if (APP_STATE.exAnswers.includes(-1)) {
    showToast("⚠️ All 10 questions must be answered!");
    return;
  }
  
  let score = 0;
  for(let i=0; i<10; i++) {
    let ans = APP_STATE.activeTopic.exercises[i].ans;
    let user = APP_STATE.exAnswers[i];
    let card = document.getElementById(`qCard${i}`);
    
    document.getElementById(`opt_${i}_${user}`).classList.remove('selected');
    
    if (ans === user) {
      score++;
      card.classList.add('correct');
      document.getElementById(`opt_${i}_${user}`).classList.add('correct');
    } else {
      card.classList.add('wrong');
      document.getElementById(`opt_${i}_${user}`).classList.add('wrong');
      document.getElementById(`opt_${i}_${ans}`).style.border = "2px dashed var(--success)";
    }
  }
  
  const res = document.getElementById('finalResult');
  res.style.display = 'block';
  
  if (score >= 8) {
    res.className = 'final-result result-success';
    res.textContent = `🎉 Amazing! You scored ${score}/10! • +100 XP`;
    playSound('snd-success');
    fireConfetti();
    
    if (!APP_STATE.completed.includes(APP_STATE.activeTopic.id)) {
      APP_STATE.completed.push(APP_STATE.activeTopic.id);
      APP_STATE.xp += 100;
      saveData();
      calcProgress();
    }
  } else {
    res.className = 'final-result result-fail';
    res.innerHTML = `Almost there! Score: ${score}/10.<br><span style="font-size:16px; font-weight:500;">Review the theory and try again to earn XP!</span>`;
    playSound('snd-wrong');
  }
  
  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
}

// ------------------------------------------------------------------------------------------------ //
// 5. TEXT-TO-SPEECH (TTS)
// ------------------------------------------------------------------------------------------------ //
function speakText(text) {
  stopTTS();
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = 'en-US';
  currentSynth.speak(ut);
}

function toggleMainTTS() {
  const btn = document.getElementById('mainVoiceBtn');
  if (currentSynth.speaking) {
    stopTTS();
    btn.classList.remove('playing');
    btn.innerHTML = '🔊 Listen to Theory';
    return;
  }
  
  let text = APP_STATE.activeTopic.title + ". " + APP_STATE.activeTopic.theory.replace(/<[^>]*>?/gm, '');
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'en-US';
  
  btn.classList.add('playing');
  btn.innerHTML = '⏹ Stop Listening';
  
  currentUtterance.onend = () => {
    btn.classList.remove('playing');
    btn.innerHTML = '🔊 Listen to Theory';
  };
  
  currentSynth.speak(currentUtterance);
}

function stopTTS() {
  if(currentSynth) currentSynth.cancel();
}

// ------------------------------------------------------------------------------------------------ //
// 6. CONFETTI ANIMATION ENGINE
// ------------------------------------------------------------------------------------------------ //
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  
  for(let i=0; i<150; i++) {
    particles.push({
      x: canvas.width / 2, y: canvas.height / 2 + 100,
      r: Math.random() * 6 + 4,
      dx: Math.random() * 20 - 10, dy: Math.random() * -20 - 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10
    });
  }
  
  let angle = 0;
  let animId = requestAnimationFrame(update);
  
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    angle += 0.05;
    
    particles.forEach(p => {
      p.tilt += 0.1;
      p.y += (Math.cos(angle + p.r) + p.r/2 + 2); // gravity
      p.x += Math.sin(angle); // drift
      
      if(p.y < canvas.height) active = true;
      
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt);
      ctx.stroke();
    });
    
    if(active) animId = requestAnimationFrame(update);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  
  setTimeout(() => cancelAnimationFrame(animId), 5000);
}

// ------------------------------------------------------------------------------------------------ //
// INIT PIPELINE
// ------------------------------------------------------------------------------------------------ //
window.onload = () => {
  initEngine();
  loadData();
  renderApp();
};
