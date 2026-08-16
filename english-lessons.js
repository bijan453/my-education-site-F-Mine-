/* ============================================================
   F-MINE · АНГЛИЙСКИЙ — УРОКИ (КНИГА)
   ============================================================ */

function factsTT(name,icon,qs){
  return {
    icon:icon,name:name,
    generate:()=>{const q=qs[randInt(0,qs.length-1)];return{q}},
    template:(q)=>({text:q.q,answer:q.a,hint:q.h,solution:`Правильно: <b>${Array.isArray(q.a)?q.a[0]:q.a}</b>.`})
  };
}

const LESSONS = {

/* ================= 7 КЛАСС ================= */

'7.1':{
  title:'To be и местоимения',
  context:'Глагол to be — «быть» — самый важный глагол английского. С него начинается всё: I am, he is, they are.',
  theory:[
    {icon:'👋',title:'Формы to be',html:`
      <div class="formula-block">I <b>am</b> · He/She/It <b>is</b> · We/You/They <b>are</b></div>
      <p>Прошедшее время: <b>was</b> (I/he/she/it) и <b>were</b> (we/you/they).</p>
      <div class="highlight-box">Сокращения: I’m, he’s, they’re, isn’t, aren’t.</div>`},
    {icon:'🧑‍🤝‍🧑',title:'Местоимения',html:`
      <p>I — я, you — ты/вы, he — он, she — она, it — оно, we — мы, they — они.</p>
      <p><b>It</b> используется для предметов, животных, погоды и времени: <i>It is cold.</i></p>`}
  ],
  examples:[
    {title:'Выбираем форму to be',steps:[
      {text:'Смотрим на подлежащее: <b>She</b> → форма <b>is</b>.',rule:'She/He/It → is'},
      {text:'Если прошедшее время → <b>was</b>.',rule:'Прошлое'},
      {text:'She is a doctor. She was at home.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'I ___ a student.',a:['am'],h:'С I только одна форма'},
      {q:'She ___ from London.',a:['is'],h:'She → is'},
      {q:'They ___ happy.',a:['are'],h:'They → are'},
      {q:'___ you a doctor?',a:['are'],h:'Вопрос с you'},
      {q:'We ___ not at home yesterday.',a:['were'],h:'Прошедшее, we'},
      {q:'It ___ my cat. (сейчас)',a:['is'],h:'It → is'}
    ])
  ]
},

'7.2':{
  title:'Present Simple',
  context:'Настоящее простое время — для привычек, фактов и расписаний: The sun rises in the east.',
  theory:[
    {icon:'☀️',title:'Правило -s',html:`
      <p>В 3-м лице ед. числа к глаголу добавляется <b>-s / -es</b>: he work<b>s</b>, she watch<b>es</b>, it go<b>es</b>.</p>
      <div class="formula-block">I/You/We/They <b>play</b> · He/She/It <b>plays</b></div>`},
    {icon:'❓',title:'Вопросы и отрицания',html:`
      <p>Помощники <b>do / does</b>: <i>Does she work? — No, she doesn’t.</i></p>
      <div class="highlight-box">Слова-маркеры: <b>always, usually, often, sometimes, every day</b>.</div>`}
  ],
  examples:[
    {title:'He ___ (watch) TV every day',steps:[
      {text:'Подлежащее He — 3-е лицо.',rule:'He/She/It'},
      {text:'Глагол на -ch → добавляем <b>-es</b>.',rule:'watch → watches'},
      {text:'He <b>watches</b> TV every day.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'She ___ (go) to school every day.',a:['goes'],h:'go + es'},
      {q:'He ___ (watch) TV in the evening.',a:['watches'],h:'-ch → -es'},
      {q:'___ you like tea?',a:['do'],h:'Помощник для you'},
      {q:'The sun ___ (rise) in the east.',a:['rises'],h:'Факт + 3-е лицо'},
      {q:'They ___ (not/like) coffee. (2 слова)',a:['don’t like','do not like'],h:'don’t + глагол'}
    ])
  ]
},

'7.3':{
  title:'Present Continuous',
  context:'Действие происходит прямо сейчас: Look! It is raining.',
  theory:[
    {icon:'⏳',title:'Формула',html:`
      <div class="formula-block">be (am/is/are) + V-<b>ing</b></div>
      <p>I am read<b>ing</b>. They are play<b>ing</b>. She is sleep<b>ing</b>.</p>`},
    {icon:'🚨',title:'Маркеры',html:`
      <div class="highlight-box"><b>now, at the moment, Look!, Listen!</b></div>
      <p>Правописание: run → run<b>n</b>ing, write → writ<b>ing</b> (без e).</p>`}
  ],
  examples:[
    {title:'Look! The bus ___ (come)',steps:[
      {text:'Look! — действие сейчас.',rule:'Continuous'},
      {text:'The bus = it → <b>is</b>.',rule:'be'},
      {text:'Look! The bus <b>is coming</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'Look! It ___ (rain).',a:['is raining'],h:'is + ing'},
      {q:'They ___ (play) now.',a:['are playing'],h:'are + ing'},
      {q:'I ___ (read) a book at the moment.',a:['am reading'],h:'am + ing'},
      {q:'___ he working today?',a:['is'],h:'Вопрос: is вперёд'},
      {q:'She ___ (not/sleep).',a:['isn’t sleeping','is not sleeping'],h:'isn’t + ing'}
    ])
  ]
},

'7.4':{
  title:'Past Simple',
  context:'Прошедшее простое — для завершённых действий вчера: I went to school yesterday.',
  theory:[
    {icon:'⏪',title:'Формы',html:`
      <p>Правильные: +<b>ed</b> (work → worked). Неправильные — учим наизусть: go → <b>went</b>, buy → <b>bought</b>, see → <b>saw</b>.</p>`},
    {icon:'❓',title:'Вопросы: did',html:`
      <div class="formula-block">Did + подлежащее + <b>V1</b>?</div>
      <p>Did you go? — после did глагол без изменений! Маркеры: <b>yesterday, ago, last week</b>.</p>`}
  ],
  examples:[
    {title:'She ___ (buy) a car last month',steps:[
      {text:'last month — прошедшее.',rule:'Past Simple'},
      {text:'buy — неправильный: <b>bought</b>.',rule:'2-я форма'},
      {text:'She <b>bought</b> a car last month.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'I ___ (go) to the park yesterday.',a:['went'],h:'go-went-gone'},
      {q:'She ___ (visit) granny last week.',a:['visited'],h:'Правильный: +ed'},
      {q:'___ you see the film?',a:['did'],h:'Помощник прошлого'},
      {q:'He ___ (buy) a new phone.',a:['bought'],h:'buy-bought-bought'},
      {q:'They ___ (not/come) to the party.',a:['didn’t come','did not come'],h:'didn’t + V1'}
    ]),
    factsTT('Неправильные глаголы','',[
      {q:'2-я форма глагола see?',a:['saw'],h:'see-saw-seen'},
      {q:'2-я форма глагола take?',a:['took'],h:'take-took-taken'},
      {q:'2-я форма глагола eat?',a:['ate'],h:'eat-ate-eaten'},
      {q:'3-я форма глагола do?',a:['done'],h:'do-did-done'},
      {q:'2-я форма глагола make?',a:['made'],h:'make-made-made'}
    ])
  ]
},

'7.5':{
  title:'Артикли a / an / the',
  context:'Артикли — маленькое слово с большой ролью: a doctor, an apple, the sun.',
  theory:[
    {icon:'📰',title:'a / an',html:`
      <p><b>a</b> — перед согласным звуком: a book, a university. <b>an</b> — перед гласным: an apple, an hour.</p>`},
    {icon:'🌞',title:'the и нулевой',html:`
      <div class="highlight-box"><b>the</b> — единственный/конкретный: the sun, the Moon, the book on the table.<br><b>Без артикля</b>: music, sport, имена: I love music.</div>`}
  ],
  examples:[
    {title:'I saw ___ elephant in ___ zoo',steps:[
      {text:'elephant — гласный звук → <b>an</b>.',rule:'an + гласный'},
      {text:'zoo — конкретное место, знаем какое → <b>the</b>.',rule:'the'},
      {text:'I saw <b>an</b> elephant in <b>the</b> zoo.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Артикли','✏️',[
      {q:'I saw ___ elephant.',a:['an'],h:'Гласный звук'},
      {q:'___ sun is bright.',a:['the'],h:'Единственный'},
      {q:'He is ___ doctor.',a:['a'],h:'Профессия'},
      {q:'I love ___ music. (— если без артикля)',a:['—','без артикля','no article','0'],h:'Общее понятие'},
      {q:'It was ___ honour. (honour — [ɒnə])',a:['an'],h:'h не читается'}
    ])
  ]
},

'7.6':{
  title:'Countable / Uncountable, множественное',
  context:'Яблоки можно посчитать, а воду — нет. От этого зависит many/much и артикли.',
  theory:[
    {icon:'🍎',title:'Исчисляемые и неисчисляемые',html:`
      <p><b>Countable:</b> apple/apples, book/books. <b>Uncountable:</b> water, milk, money, information.</p>
      <div class="highlight-box">many + исчисляемые; much + неисчисляемые.</div>`},
    {icon:'👥',title:'Множественное число',html:`
      <p>box → box<b>es</b>, baby → bab<b>ies</b>, но: child → <b>children</b>, mouse → <b>mice</b>, man → <b>men</b>.</p>`}
  ],
  examples:[
    {title:'How ___ water?',steps:[
      {text:'water — неисчисляемое.',rule:'Uncountable'},
      {text:'С неисчисляемыми — <b>much</b>.',rule:'much'},
      {text:'How <b>much</b> water do you drink?',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'How ___ apples?',a:['many'],h:'Исчисляемое'},
      {q:'How ___ water?',a:['much'],h:'Неисчисляемое'},
      {q:'There isn\'t ___ milk in the fridge.',a:['any'],h:'В отрицании'},
      {q:'There are ___ books on the table.',a:['some'],h:'В утверждении'},
      {q:'Множественное от child?',a:['children'],h:'Исключение'},
      {q:'Множественное от mouse?',a:['mice'],h:'Исключение'}
    ])
  ]
},

'7.7':{
  title:'Предлоги in / on / at',
  context:'Три маленьких предлога управляют временем и местом. Запомни треугольник: at → on → in.',
  theory:[
    {icon:'🕐',title:'Время',html:`
      <div class="formula-block"><b>at</b> 7 o’clock · <b>on</b> Monday · <b>in</b> summer / in the morning</div>`},
    {icon:'📍',title:'Место',html:`
      <p><b>at</b> — точка (at school, at the bus stop); <b>on</b> — поверхность (on the table); <b>in</b> — внутри/город (in the box, in London).</p>`}
  ],
  examples:[
    {title:'Выбираем предлог',steps:[
      {text:'___ Friday — день недели → <b>on</b>.',rule:'Дни — on'},
      {text:'___ night — устойчивое → <b>at</b>.',rule:'at night'},
      {text:'___ July — месяц → <b>in</b>.',rule:'Месяцы — in'}
    ]}
  ],
  taskTypes:[
    factsTT('Предлоги','📍',[
      {q:'___ Monday',a:['on'],h:'Дни недели'},
      {q:'___ 7 o\'clock',a:['at'],h:'Точное время'},
      {q:'___ summer',a:['in'],h:'Времена года'},
      {q:'___ the morning',a:['in'],h:'Части суток (кроме night)'},
      {q:'___ night',a:['at'],h:'Исключение'},
      {q:'___ London',a:['in'],h:'Города — in'},
      {q:'The cat is ___ the table. (на поверхности)',a:['on'],h:'Поверхность'}
    ])
  ]
},

'7.8':{
  title:'Wh- вопросы',
  context:'What, where, when, who, why, how — шесть ключей к любой информации.',
  theory:[
    {icon:'❓',title:'Вопросительные слова',html:`
      <ul>
        <li><b>What</b> — что / какой</li>
        <li><b>Where</b> — где / куда</li>
        <li><b>When</b> — когда</li>
        <li><b>Who</b> — кто</li>
        <li><b>Why</b> — почему</li>
        <li><b>How</b> — как (+ how old, how much)</li>
      </ul>`}
  ],
  examples:[
    {title:'Строим вопрос',steps:[
      {text:'Выбираем слово: спрашиваем о месте → <b>Where</b>.',rule:'Место'},
      {text:'Дальше вопрос-порядок: <b>do you live</b>?',rule:'Wh + do + подлежащее'},
      {text:'<b>Where do you live?</b>',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Wh- слова','❓',[
      {q:'___ is your name?',a:['what'],h:'Что'},
      {q:'___ do you live?',a:['where'],h:'Где'},
      {q:'___ is your birthday?',a:['when'],h:'Когда'},
      {q:'___ is that man?',a:['who'],h:'Кто'},
      {q:'___ old are you?',a:['how'],h:'Сколько лет'},
      {q:'___ are you crying? — Because I\'m sad.',a:['why'],h:'Почему'}
    ])
  ]
},

/* ================= 8 КЛАСС ================= */

'8.1':{
  title:'Future: will / be going to',
  context:'Будущее в английском бывает двух видов: решение «на ходу» — will, план с доказательством — going to.',
  theory:[
    {icon:'⚡',title:'will',html:`
      <p>Решения в момент речи, обещания, предсказания: <i>I’ll help you! I think it will rain.</i></p>`},
    {icon:'📅',title:'be going to',html:`
      <div class="highlight-box">Планы и предсказания с доказательством: <i>Look at the clouds — it’s going to rain!</i></div>`}
  ],
  examples:[
    {title:'will или going to?',steps:[
      {text:'«Телефон звонит!» — «Я отвечу!» → решение сейчас → <b>I’ll answer</b>.',rule:'will'},
      {text:'«Мы купили билеты» — план → <b>We’re going to fly</b>.',rule:'going to'},
      {text:'Тучи на небе — доказательство → <b>It’s going to rain</b>.',rule:'going to'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'The phone is ringing! I ___ answer it.',a:['will','\'ll'],h:'Решение сейчас'},
      {q:'Look at the clouds! It ___ rain.',a:['is going to','\'s going to'],h:'Есть доказательство'},
      {q:'I promise I ___ help you.',a:['will','\'ll'],h:'Обещание'},
      {q:'We ___ visit granny next week (план).',a:['are going to','\'re going to'],h:'План'}
    ])
  ]
},

'8.2':{
  title:'Past Continuous',
  context:'Длительное действие в прошлом: I was sleeping when you called.',
  theory:[
    {icon:'🕰️',title:'Формула',html:`
      <div class="formula-block">was/were + V-<b>ing</b></div>
      <p>Часто с <b>when</b> (прервал) и <b>while</b> (параллельно): <i>While I was walking, it started to rain.</i></p>`}
  ],
  examples:[
    {title:'I ___ (sleep) when you called',steps:[
      {text:'when you called — короткий момент.',rule:'Past Simple'},
      {text:'sleep — длилось в этот момент.',rule:'Continuous'},
      {text:'I <b>was sleeping</b> when you called.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'I ___ (sleep) when you called.',a:['was sleeping'],h:'was + ing'},
      {q:'They ___ (play) at 5 pm yesterday.',a:['were playing'],h:'were + ing'},
      {q:'While she ___ (cook), he read.',a:['was cooking'],h:'while → continuous'},
      {q:'We ___ (not/watch) TV at 9 pm.',a:['weren’t watching','were not watching'],h:'were not + ing'}
    ])
  ]
},

'8.3':{
  title:'Present Perfect',
  context:'Связь прошлого с настоящим: результат важен сейчас. I have lost my keys (и до сих пор не нашёл).',
  theory:[
    {icon:'✅',title:'Формула',html:`
      <div class="formula-block">have/has + V3 (3-я форма)</div>
      <p>Маркеры: <b>just, already, yet, ever, never, since, for</b>.</p>`},
    {icon:'🆚',title:'since / for',html:`
      <p><b>since</b> + точка (since 2010); <b>for</b> + период (for 5 years).</p>`}
  ],
  examples:[
    {title:'She ___ (live) here since 2010',steps:[
      {text:'since 2010 — маркер Perfect.',rule:'Present Perfect'},
      {text:'She → <b>has</b>.',rule:'has'},
      {text:'She <b>has lived</b> here since 2010.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','✏️',[
      {q:'I ___ (lose) my keys. I can\'t open the door!',a:['have lost','\'ve lost'],h:'Результат сейчас'},
      {q:'She ___ (live) here since 2010.',a:['has lived'],h:'has + V3'},
      {q:'___ you ever ___ to Paris? (первое слово)',a:['have'],h:'Вопрос: have вперёд'},
      {q:'He ___ (not/finish) yet.',a:['hasn’t finished','has not finished'],h:'yet → Perfect'}
    ])
  ]
},

'8.4':{
  title:'Степени сравнения',
  context:'big → bigger → the biggest. good → better → the best. Английские прилагательные любят порядок.',
  theory:[
    {icon:'📏',title:'Правила',html:`
      <p>Короткие: +<b>er</b> / the +<b>est</b>. Длинные: <b>more</b> / the <b>most</b>.</p>
      <div class="highlight-box">Исключения: good–<b>better</b>–the best; bad–<b>worse</b>–the worst; far–farther–the farthest.</div>`}
  ],
  examples:[
    {title:'happy → ?',steps:[
      {text:'Короткое, оканчивается на -y.',rule:'-y → -i'},
      {text:'happ<b>ier</b> / the happ<b>iest</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Сравнения','📏',[
      {q:'big → bigger → the ___',a:['biggest'],h:'the + est'},
      {q:'good → ___ → the best',a:['better'],h:'Исключение'},
      {q:'beautiful → ___ beautiful',a:['more'],h:'Длинное — more'},
      {q:'bad → ___ → the worst',a:['worse'],h:'Исключение'},
      {q:'Это ___ (tall) здание в мире.',a:['tallest','the tallest'],h:'the + est'},
      {q:'happy → ___',a:['happier'],h:'-y → -ier'}
    ])
  ]
},

'8.5':{
  title:'Модальные глаголы',
  context:'can, must, should, may — они показывают отношение: возможность, обязанность, совет.',
  theory:[
    {icon:'⚙️',title:'Значения',html:`
      <ul>
        <li><b>can</b> — умение/возможность</li>
        <li><b>must</b> — обязанность; <b>mustn’t</b> — запрет</li>
        <li><b>should</b> — совет</li>
        <li><b>may/might</b> — вероятность</li>
      </ul>
      <div class="highlight-box">После модальных — глагол без to и без окончаний!</div>`}
  ],
  examples:[
    {title:'Выбираем модальный',steps:[
      {text:'«Здесь нельзя курить» — запрет → <b>mustn’t</b>.',rule:'Запрет'},
      {text:'«Тебе стоит отдохнуть» — совет → <b>should</b>.',rule:'Совет'},
      {text:'«Я умею плавать» — умение → <b>can</b>.',rule:'Умение'}
    ]}
  ],
  taskTypes:[
    factsTT('Модальные','⚙️',[
      {q:'You ___ smoke here. It\'s forbidden.',a:['mustn’t','must not'],h:'Запрет'},
      {q:'You ___ see a doctor. (совет)',a:['should'],h:'Совет'},
      {q:'I ___ swim when I was five.',a:['could'],h:'Умение в прошлом'},
      {q:'It ___ rain. Maybe.',a:['may','might'],h:'Вероятность'},
      {q:'You ___ wear a seatbelt. It\'s the law.',a:['must','have to'],h:'Закон = обязанность'}
    ])
  ]
},

'8.6':{
  title:'Some / any / much / many',
  context:'Some для утверждений, any для вопросов и отрицаний. Much и many считают то, что можно и нельзя посчитать.',
  theory:[
    {icon:'🧮',title:'Правила',html:`
      <div class="highlight-box"><b>some</b> — утверждения; <b>any</b> — вопросы/отрицания; <b>much</b> — неисчисл.; <b>many</b> — исчисл.; <b>a lot of</b> — везде.</div>`}
  ],
  examples:[
    {title:'Would you like ___ tea?',steps:[
      {text:'Это вопрос, но предложение/просьба.',rule:'Исключение'},
      {text:'В предложениях используем <b>some</b>.',rule:'some'},
      {text:'Would you like <b>some</b> tea?',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','🧮',[
      {q:'We don\'t have ___ time.',a:['much','any'],h:'Отрицание + неисчисл.'},
      {q:'There are ___ people here.',a:['many','a lot of'],h:'Исчисляемое'},
      {q:'Would you like ___ tea?',a:['some'],h:'Предложение'},
      {q:'How ___ money do you have?',a:['much'],h:'money — неисчисл.'},
      {q:'There isn\'t ___ cheese.',a:['any','much'],h:'Отрицание'}
    ])
  ]
},

'8.7':{
  title:'Наречия частоты и образа действия',
  context:'always, usually, often, sometimes, never — как часто? carefully, quickly — как?',
  theory:[
    {icon:'🎯',title:'Образование наречий',html:`
      <p>Прилагательное + <b>-ly</b>: careful → carefully, quick → quickly.</p>
      <div class="highlight-box">Исключения: good → <b>well</b>, hard → <b>hard</b> (усердно), fast → fast.</div>`}
  ],
  examples:[
    {title:'He drives ___ (careful)',steps:[
      {text:'Описывает глагол drives → наречие.',rule:'-ly'},
      {text:'careful + ly = <b>carefully</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Наречия','🎯',[
      {q:'quick → ___ (наречие)',a:['quickly'],h:'+ly'},
      {q:'He works ___ (careful).',a:['carefully'],h:'+ly'},
      {q:'I ___ go to the gym. (100%)',a:['always'],h:'Всегда'},
      {q:'good → ___ (наречие)',a:['well'],h:'Исключение'},
      {q:'He works ___ (усердно).',a:['hard'],h:'Не hardly!'}
    ])
  ]
},

'8.8':{
  title:'Первые фразовые глаголы',
  context:'Фразовый глагол = глагол + предлог с новым смыслом: give up = сдаться.',
  theory:[
    {icon:'🧩',title:'Базовые фразовые',html:`
      <ul>
        <li><b>get up</b> — вставать</li>
        <li><b>turn on/off</b> — включать/выключать</li>
        <li><b>look for</b> — искать</li>
        <li><b>put on</b> — надевать</li>
        <li><b>give up</b> — сдаваться</li>
      </ul>`}
  ],
  examples:[
    {title:'It\'s dark. Turn ___ the light.',steps:[
      {text:'Темно → нужно включить.',rule:'Смысл'},
      {text:'Включить = turn <b>on</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Фразовые','🧩',[
      {q:'It\'s dark. Turn ___ the light.',a:['on'],h:'Включить'},
      {q:'I get ___ at 7 am. (встаю)',a:['up'],h:'Вставать'},
      {q:'I\'m looking ___ my keys. (ищу)',a:['for'],h:'Искать'},
      {q:'Never give ___! (не сдавайся)',a:['up'],h:'Сдаваться'},
      {q:'Put ___ your coat. (надень)',a:['on'],h:'Надевать'}
    ])
  ]
},

/* ================= 9 КЛАСС ================= */

'9.1':{
  title:'Passive Voice',
  context:'Когда важен не исполнитель, а действие: The letter was sent yesterday.',
  theory:[
    {icon:'🏗️',title:'Формула',html:`
      <div class="formula-block">be + V3</div>
      <p>Present: is spoken · Past: was sent · Perfect: has been eaten.</p>
      <div class="highlight-box">Исполнитель — через <b>by</b>: by Shakespeare.</div>`}
  ],
  examples:[
    {title:'The bridge ___ (build) in 1990',steps:[
      {text:'1990 — прошедшее → was/were.',rule:'Past'},
      {text:'bridge — ед. число → <b>was</b>.',rule:'was'},
      {text:'The bridge <b>was built</b> in 1990.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Passive','🏗️',[
      {q:'The letter ___ (send) yesterday.',a:['was sent'],h:'was + V3'},
      {q:'English ___ (speak) all over the world.',a:['is spoken'],h:'is + V3'},
      {q:'The bridge ___ (build) in 1990.',a:['was built'],h:'build-built-built'},
      {q:'The cake ___ already ___ (eat). (2 слова)',a:['has been eaten','has been eaten'],h:'has been + V3'}
    ])
  ]
},

'9.2':{
  title:'Conditionals 0, 1, 2',
  context:'Если... то...: ноль — факты, один — реальное будущее, два — мечта.',
  theory:[
    {icon:'🔀',title:'Три типа',html:`
      <ul>
        <li><b>0:</b> If + Present → Present (факты)</li>
        <li><b>1:</b> If + Present → will + V (реально)</li>
        <li><b>2:</b> If + Past → would + V (нереально сейчас)</li>
      </ul>
      <div class="highlight-box">If I <b>were</b> you... (в условных — were для всех лиц!)</div>`}
  ],
  examples:[
    {title:'If I ___ (be) you, I would apologize',steps:[
      {text:'would во второй части → тип 2.',rule:'Second'},
      {text:'В if-части — Past: <b>were</b>.',rule:'were'},
      {text:'If I <b>were</b> you, I would apologize.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Conditionals','🔀',[
      {q:'If you heat ice, it ___ (melt).',a:['melts'],h:'Тип 0 — факт'},
      {q:'If it rains, we ___ (stay) at home.',a:['will stay'],h:'Тип 1'},
      {q:'If I ___ (be) you, I would go.',a:['were'],h:'Тип 2 — were'},
      {q:'If I had money, I ___ (buy) a car.',a:['would buy'],h:'Тип 2'}
    ])
  ]
},

'9.3':{
  title:'Third Conditional',
  context:'Сожаления о прошлом: If I had known, I would have come.',
  theory:[
    {icon:'⏮️',title:'Формула',html:`
      <div class="formula-block">If + Past Perfect → would have + V3</div>
      <p>О прошлом, которого не было: <i>If she had studied, she would have passed.</i></p>`}
  ],
  examples:[
    {title:'If I had known, I ___ (come)',steps:[
      {text:'had known — Past Perfect → тип 3.',rule:'Third'},
      {text:'Результат: <b>would have come</b>.',rule:'would have V3'},
      {text:'If I had known, I <b>would have come</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Third Conditional','⏮️',[
      {q:'If I had known, I ___ (come).',a:['would have come'],h:'would have + V3'},
      {q:'If she ___ (study), she would have passed.',a:['had studied'],h:'Past Perfect'},
      {q:'I would have called if I ___ (have) your number.',a:['had had'],h:'had + had'}
    ])
  ]
},

'9.4':{
  title:'Reported Speech',
  context:'Пересказываем чужие слова: времена сдвигаются назад — backshift.',
  theory:[
    {icon:'🗣️',title:'Backshift',html:`
      <p>am/is → <b>was</b>; will → <b>would</b>; Present → Past; today → <b>that day</b>; now → then.</p>
      <div class="highlight-box">"I am tired" → He said (that) he <b>was</b> tired.</div>`}
  ],
  examples:[
    {title:'"I will help" → She said...',steps:[
      {text:'will → <b>would</b>.',rule:'Backshift'},
      {text:'She said she <b>would</b> help.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Reported','🗣️',[
      {q:'"I am tired." → He said he ___ tired.',a:['was'],h:'am → was'},
      {q:'"I will help." → She said she ___ help.',a:['would'],h:'will → would'},
      {q:'"I live in Astana." → He said he ___ in Astana.',a:['lived'],h:'Present → Past'},
      {q:'"today" в косвенной речи → ___',a:['that day'],h:'Сдвиг слов'}
    ])
  ]
},

'9.5':{
  title:'Gerund vs Infinitive',
  context:'После одних глаголов — -ing, после других — to: enjoy reading, want to go.',
  theory:[
    {icon:'🔄',title:'Списки',html:`
      <p><b>+ -ing:</b> enjoy, finish, mind, be interested in, stop (бросить).</p>
      <p><b>+ to:</b> want, decide, hope, plan, would like.</p>`}
  ],
  examples:[
    {title:'He stopped ___ (smoke)',steps:[
      {text:'stop + -ing = бросить привычку.',rule:'Смысл'},
      {text:'He stopped <b>smoking</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Gerund/Inf','🔄',[
      {q:'I enjoy ___ (read).',a:['reading'],h:'enjoy + ing'},
      {q:'She wants ___ (go).',a:['to go'],h:'want + to'},
      {q:'He stopped ___ (smoke) = бросил.',a:['smoking'],h:'stop + ing'},
      {q:'They decided ___ (move).',a:['to move'],h:'decide + to'},
      {q:'I\'m interested in ___ (learn) English.',a:['learning'],h:'после предлога — ing'}
    ])
  ]
},

'9.6':{
  title:'Relative clauses',
  context:'who — люди, which — вещи, where — места, whose — владение.',
  theory:[
    {icon:'🔗',title:'Относительные слова',html:`
      <div class="highlight-box"><b>who</b> — человек; <b>which/that</b> — вещь; <b>where</b> — место; <b>when</b> — время; <b>whose</b> — «чей».</div>`}
  ],
  examples:[
    {title:'The city ___ I was born',steps:[
      {text:'city — место.',rule:'Место'},
      {text:'Используем <b>where</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Relative','🔗',[
      {q:'The man ___ called me.',a:['who'],h:'Человек'},
      {q:'The book ___ I bought.',a:['which','that'],h:'Вещь'},
      {q:'The city ___ I was born.',a:['where'],h:'Место'},
      {q:'The day ___ we met.',a:['when'],h:'Время'},
      {q:'The girl ___ brother is a doctor.',a:['whose'],h:'Чей'}
    ])
  ]
},

'9.7':{
  title:'Used to / be used to',
  context:'used to — привычка в прошлом; be used to — «привыкший» к чему-то сейчас.',
  theory:[
    {icon:'🕰️',title:'Три формы',html:`
      <ul>
        <li><b>used to + V</b> — раньше делал: I used to play.</li>
        <li><b>be used to + -ing</b> — привык: I’m used to getting up early.</li>
        <li><b>get used to + -ing</b> — привыкаю.</li>
      </ul>`}
  ],
  examples:[
    {title:'She is used ___ getting up early',steps:[
      {text:'be used to + -ing.',rule:'to'},
      {text:'She is used <b>to</b> getting up early.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Used to','🕰️',[
      {q:'I ___ play chess when I was a kid.',a:['used to'],h:'Прошлая привычка'},
      {q:'She is used ___ getting up early.',a:['to'],h:'be used to + ing'},
      {q:'I can\'t get used ___ driving on the left.',a:['to'],h:'get used to'},
      {q:'He didn\'t ___ like coffee.',a:['use to'],h:'После didn\'t — без d'}
    ])
  ]
},

'9.8':{
  title:'Present Perfect vs Past Simple',
  context:'Есть точное время в прошлом — Past Simple. Важен результат или опыт — Present Perfect.',
  theory:[
    {icon:'⚖️',title:'Как выбрать',html:`
      <p><b>yesterday, ago, last week, in 1999</b> → Past Simple.</p>
      <p><b>ever, never, just, yet, already, since, for</b> → Present Perfect.</p>`}
  ],
  examples:[
    {title:'I ___ (see) this film yesterday',steps:[
      {text:'yesterday — точное время.',rule:'Past Simple'},
      {text:'see → <b>saw</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Выбор времени','⚖️',[
      {q:'I ___ (see) this film yesterday.',a:['saw'],h:'yesterday → Past'},
      {q:'I ___ never ___ (see) this film. (2 слова)',a:['have seen','have never seen'],h:'never → Perfect'},
      {q:'She ___ (live) in London for 5 years (и сейчас).',a:['has lived'],h:'for + сейчас'},
      {q:'He ___ (leave) two days ago.',a:['left'],h:'ago → Past'}
    ])
  ]
},

/* ================= 10 КЛАСС ================= */

'10.1':{
  title:'Perfect Continuous',
  context:'Действие длилось какой-то период и всё ещё идёт (или только что закончилось): I have been waiting for 2 hours.',
  theory:[
    {icon:'⏳',title:'Формулы',html:`
      <div class="formula-block">have/has <b>been</b> V-ing · had <b>been</b> V-ing</div>
      <p>Present: I have been waiting. Past: She was tired because she had been working.</p>`}
  ],
  examples:[
    {title:'How long have you ___ (study) English?',steps:[
      {text:'How long + длительность → Perfect Continuous.',rule:'Длительность'},
      {text:'have you <b>been studying</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Grammar','⏳',[
      {q:'I ___ (wait) for 2 hours!',a:['have been waiting'],h:'have been + ing'},
      {q:'She was tired because she ___ (work) all day.',a:['had been working'],h:'had been + ing'},
      {q:'They ___ (play) since morning.',a:['have been playing'],h:'since → Perfect Cont.'},
      {q:'How long have you ___ (study) English? (2 слова)',a:['been studying'],h:'been + ing'}
    ])
  ]
},

'10.2':{
  title:'Wish / If only',
  context:'Жаль, что...: wish + Past (сейчас), wish + Past Perfect (о прошлом), wish + would (раздражение).',
  theory:[
    {icon:'🌠',title:'Три конструкции',html:`
      <ul>
        <li>now → <b>Past</b>: I wish I knew.</li>
        <li>past → <b>Past Perfect</b>: I wish I had studied.</li>
        <li>раздражение → <b>would</b>: I wish it would stop raining.</li>
      </ul>`}
  ],
  examples:[
    {title:'I wish I ___ (know) the answer now',steps:[
      {text:'now → Past после wish.',rule:'Past'},
      {text:'I wish I <b>knew</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Wish','🌠',[
      {q:'I wish I ___ (know) the answer now.',a:['knew'],h:'Past для сейчас'},
      {q:'I wish I ___ (study) harder yesterday.',a:['had studied'],h:'Past Perfect'},
      {q:'I wish it ___ (stop) raining!',a:['would stop'],h:'would — раздражение'},
      {q:'If only I ___ (can) fly.',a:['could'],h:'can → could'}
    ])
  ]
},

'10.3':{
  title:'Causative: have/get something done',
  context:'Когда действие делает кто-то для нас: I had my car repaired (мне починили).',
  theory:[
    {icon:'🛠️',title:'Формула',html:`
      <div class="formula-block">have/get + объект + <b>V3</b></div>
      <p>I <b>had</b> my car <b>repaired</b>. She <b>got</b> her hair <b>cut</b>.</p>`}
  ],
  examples:[
    {title:'We need to have the house ___ (paint)',steps:[
      {text:'Дом красят другие для нас.',rule:'Causative'},
      {text:'have + объект + <b>painted</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Causative','🛠️',[
      {q:'I ___ my car repaired yesterday. (have в past)',a:['had'],h:'had + V3'},
      {q:'She got her hair ___. (cut)',a:['cut'],h:'cut-cut-cut'},
      {q:'We had the house ___. (paint)',a:['painted'],h:'V3'}
    ])
  ]
},

'10.4':{
  title:'Inversion',
  context:'Never have I seen... — после отрицательных слов в начале предложения порядок вопросительный.',
  theory:[
    {icon:'🙃',title:'Триггеры',html:`
      <div class="highlight-box"><b>Never, Hardly, Not only, Only then, Rarely</b> → вспомогательный глагол перед подлежащим: Never <b>have I</b> seen.</div>`}
  ],
  examples:[
    {title:'Never ___ I seen such a view',steps:[
      {text:'Never в начале → инверсия.',rule:'Инверсия'},
      {text:'Seen → нужен <b>have</b>.',rule:'have'},
      {text:'Never <b>have</b> I seen such a view.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Inversion','🙃',[
      {q:'Never ___ I seen such a view.',a:['have'],h:'have перед I'},
      {q:'Hardly had we left ___ it started to rain.',a:['when'],h:'Hardly...when'},
      {q:'Not only ___ he sing, but he also dances.',a:['does'],h:'does перед he'},
      {q:'Only then ___ she understand.',a:['did'],h:'did'}
    ])
  ]
},

'10.5':{
  title:'Mixed Conditionals',
  context:'Прошлое влияет на настоящее: If I had taken the job, I would be rich now.',
  theory:[
    {icon:'🌀',title:'Смешанные типы',html:`
      <p><b>3→2:</b> If + Past Perfect → would + V (now): If I had taken the job, I would be rich now.</p>
      <p><b>2→3:</b> If + Past → would have + V3: If I were smarter, I wouldn’t have made that mistake.</p>`}
  ],
  examples:[
    {title:'If I had taken the job, I ___ (be) rich now',steps:[
      {text:'if — прошлое, результат — сейчас (now).',rule:'3→2'},
      {text:'→ <b>would be</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Mixed','🌀',[
      {q:'If I had taken the job, I ___ (be) rich now.',a:['would be'],h:'3→2'},
      {q:'If I were smarter, I ___ (not/make) that mistake yesterday.',a:['wouldn’t have made','would not have made'],h:'2→3'}
    ])
  ]
},

'10.6':{
  title:'Word Formation',
  context:'Из одного слова — целое семейство: happy → happiness → unhappy → happily.',
  theory:[
    {icon:'🏗️',title:'Суффиксы и приставки',html:`
      <p>-ness (happiness), -er (teacher), -tion (invention), -ous (dangerous), -ly (quickly); un-, im-, dis- (отрицание).</p>`}
  ],
  examples:[
    {title:'teach → человек',steps:[
      {text:'Кто делает действие → <b>-er</b>.',rule:'-er'},
      {text:'teach → <b>teacher</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Слова','🏗️',[
      {q:'happy → ___ (существительное)',a:['happiness'],h:'-ness'},
      {q:'teach → ___ (человек)',a:['teacher'],h:'-er'},
      {q:'danger → ___ (прилагательное)',a:['dangerous'],h:'-ous'},
      {q:'possible → ___ (отрицание)',a:['impossible'],h:'im-'},
      {q:'quick → ___ (наречие)',a:['quickly'],h:'-ly'},
      {q:'invent → ___ (предмет/идея)',a:['invention'],h:'-tion'}
    ])
  ]
},

'10.7':{
  title:'Phrasal verbs и идиомы',
  context:'Английский любит фразовые глаголы и идиомы: piece of cake = очень просто.',
  theory:[
    {icon:'🧩',title:'Нужно запомнить',html:`
      <ul>
        <li><b>run into</b> — встретить случайно</li>
        <li><b>get on</b> — сесть в транспорт</li>
        <li><b>look forward to</b> — с нетерпением ждать</li>
        <li><b>piece of cake</b> — очень легко</li>
        <li><b>break a leg</b> — удачи!</li>
      </ul>`}
  ],
  examples:[
    {title:'I ran ___ my friend yesterday',steps:[
      {text:'Встретил случайно → run <b>into</b>.',rule:'into'}
    ]}
  ],
  taskTypes:[
    factsTT('Phrasal & Idioms','🧩',[
      {q:'I ran ___ my friend yesterday. (случайно встретил)',a:['into'],h:'run into'},
      {q:'Get ___ the bus. (сесть в)',a:['on'],h:'get on'},
      {q:'I look forward ___ seeing you.',a:['to'],h:'look forward to'},
      {q:'Идиома "piece of cake" значит…',a:['easy','очень легко','легко','very easy'],h:'Про лёгкость'},
      {q:'"Break a leg!" значит…',a:['good luck','удачи','удача'],h:'Пожелание'}
    ])
  ]
},

'10.8':{
  title:'Formal & Informal letters',
  context:'Письмо другу и письмо в компанию — два разных стиля: Dear Tom vs Dear Sir or Madam.',
  theory:[
    {icon:'✉️',title:'Стили',html:`
      <p><b>Informal:</b> Dear Tom, ... Best wishes, Love. Сокращения OK.</p>
      <p><b>Formal:</b> Dear Sir or Madam → <b>Yours faithfully</b>; Dear Mr Smith → <b>Yours sincerely</b>. Без сокращений!</p>`}
  ],
  examples:[
    {title:'Выбираем концовку',steps:[
      {text:'Имя неизвестно (Dear Sir or Madam).',rule:'Не знаем'},
      {text:'→ <b>Yours faithfully</b>.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Letters','✉️',[
      {q:'Неформальное письмо начинается с Dear ___',a:['tom','dear tom','имени'],h:'Имя друга'},
      {q:'Formal: имя НЕ известно → концовка…',a:['yours faithfully'],h:'faithfully'},
      {q:'Formal: имя известно (Dear Mr Smith) → …',a:['yours sincerely'],h:'sincerely'},
      {q:'Неформальная концовка (2 слова)…',a:['best wishes'],h:'Best ...'}
    ])
  ]
},

/* ================= 11 КЛАСС ================= */

'11.1':{
  title:'Все времена: повторение',
  context:'Future Perfect, Past Perfect, Present Perfect Continuous — собираем всю систему времён.',
  theory:[
    {icon:'🧭',title:'Сложные времена',html:`
      <ul>
        <li><b>Future Perfect:</b> will have done (к моменту в будущем)</li>
        <li><b>Future Continuous:</b> will be doing (в процессе)</li>
        <li><b>Past Perfect:</b> had done (раньше другого прошлого)</li>
      </ul>`}
  ],
  examples:[
    {title:'When we arrived, the film ___ (start)',steps:[
      {text:'Фильм начался ДО приезда.',rule:'Раньше прошлого'},
      {text:'→ <b>had started</b>.',rule:'Past Perfect'}
    ]}
  ],
  taskTypes:[
    factsTT('Tenses','🧭',[
      {q:'By next year I ___ (finish) university.',a:['will have finished'],h:'Future Perfect'},
      {q:'When we arrived, the film ___ already ___ (start). (2 слова)',a:['had started'],h:'Past Perfect'},
      {q:'This time tomorrow I ___ (fly) to Paris.',a:['will be flying'],h:'Future Cont.'},
      {q:'I ___ (know) her since 2010.',a:['have known'],h:'Present Perfect'}
    ])
  ]
},

'11.2':{
  title:'Conditionals & Wish: advanced',
  context:'Had I known... = If I had known. It’s high time we left. I’d rather you went.',
  theory:[
    {icon:'🌠',title:'Продвинутые формы',html:`
      <ul>
        <li><b>Had I known</b> = If I had known (инверсия)</li>
        <li><b>It’s (high) time</b> + Past: It’s time we left.</li>
        <li><b>I’d rather</b> + Past: I’d rather you went now.</li>
        <li><b>Should you see</b> him = If you see him.</li>
      </ul>`}
  ],
  examples:[
    {title:'___ it not been for you, I would have failed',steps:[
      {text:'Инверсия 3-го типа: Had it not been...',rule:'Had'},
      {text:'<b>Had</b> it not been for you...',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Advanced','🌠',[
      {q:'___ it not been for you, I would have failed.',a:['had'],h:'Инверсия'},
      {q:'I\'d rather you ___ (go) now.',a:['went'],h:'would rather + Past'},
      {q:'It\'s high time we ___ (leave).',a:['left'],h:'it\'s time + Past'},
      {q:'Should you see him, tell him. = ___ you see him...',a:['if'],h:'= If'}
    ])
  ]
},

'11.3':{
  title:'Word Formation: advanced',
  context:'rely → reliable → reliability. Учимся строить слова для Use of English.',
  theory:[
    {icon:'🏗️',title:'Продвинутые суффиксы',html:`
      <p>-able (reliable), -ful/-less (successful/careless), -ment (agreement), -ee/-er (employee/employer), -th (strength).</p>`}
  ],
  examples:[
    {title:'employ → тот, кто нанимает',steps:[
      {text:'Кто нанимает → <b>employer</b>.',rule:'-er'},
      {text:'Кого нанимают → <b>employee</b>.',rule:'-ee'}
    ]}
  ],
  taskTypes:[
    factsTT('Words','🏗️',[
      {q:'rely → ___ (прилагательное)',a:['reliable'],h:'-able'},
      {q:'success → ___ (прилагательное)',a:['successful'],h:'-ful'},
      {q:'strong → ___ (существительное)',a:['strength'],h:'-th'},
      {q:'employ → ___ (начальник)',a:['employer'],h:'-er'},
      {q:'agree → ___ (существительное)',a:['agreement'],h:'-ment'}
    ])
  ]
},

'11.4':{
  title:'Reading: стратегии',
  context:'Skimming — общее понимание, scanning — поиск деталей. На экзамене время решает всё.',
  theory:[
    {icon:'📖',title:'Стратегии',html:`
      <ul>
        <li><b>skimming</b> — быстро по диагонали, общая идея (gist)</li>
        <li><b>scanning</b> — поиск конкретной информации (даты, имена)</li>
        <li>незнакомые слова — угадывай из <b>context</b></li>
      </ul>`}
  ],
  examples:[
    {title:'Нужно найти дату события',steps:[
      {text:'Не читаем всё — ищем цифру.',rule:'Scanning'},
      {text:'Ведём глазами по строкам.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Reading','📖',[
      {q:'Чтение для общей идеи — …',a:['skimming'],h:'Слово на s'},
      {q:'Поиск конкретной информации — …',a:['scanning'],h:'Слово на sc'},
      {q:'Значение слова угадываем из …',a:['context','контекста','контекст'],h:'Окружение'},
      {q:'"Main idea" по-другому — …',a:['gist'],h:'4 буквы'}
    ])
  ]
},

'11.5':{
  title:'Writing: essay & article',
  context:'Эссе: введение → аргументы → вывод. Формальный стиль без сокращений.',
  theory:[
    {icon:'✍️',title:'Структура эссе',html:`
      <p>Introduction → Body (2-3 абзаца) → Conclusion.</p>
      <div class="highlight-box">Linkers: <b>however, moreover, therefore, in conclusion</b>. Формальный стиль: без сокращений и сленга.</div>`}
  ],
  examples:[
    {title:'Пишем вывод',steps:[
      {text:'Начинаем с <b>In conclusion</b>.',rule:'Linker'},
      {text:'Кратко повторяем позицию.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Writing','✍️',[
      {q:'Последняя часть эссе — …',a:['conclusion'],h:'Вывод'},
      {q:'Формальный стиль избегает …',a:['contractions','сокращений','slang','сленга'],h:'don\'t → do not'},
      {q:'however, moreover — это … слова',a:['linking','linkers','связующие','formal'],h:'Связки'},
      {q:'Первая часть эссе — …',a:['introduction'],h:'Введение'}
    ])
  ]
},

'11.6':{
  title:'Speaking & экзамены',
  context:'IELTS, FCE, CAE — уровни и форматы. Учимся говорить и слушать как на экзамене.',
  theory:[
    {icon:'🎤',title:'Уровни и экзамены',html:`
      <p><b>FCE</b> = B2, <b>CAE</b> = C1, IELTS 6.5–7 ≈ B2–C1.</p>
      <p>Speaking IELTS: 3 части. Вежливые фразы: Could you repeat that, please?</p>`}
  ],
  examples:[
    {title:'Не расслышал вопрос',steps:[
      {text:'Не молчим — переспрашиваем вежливо.',rule:'Стратегия'},
      {text:'<b>Could you repeat that, please?</b>',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Exams','🎤',[
      {q:'Сколько частей в IELTS Speaking?',a:['3','three','три'],h:'Три'},
      {q:'FCE соответствует уровню …',a:['b2'],h:'B2'},
      {q:'CAE соответствует уровню …',a:['c1'],h:'C1'},
      {q:'"Could you repeat that?" — это … вопрос',a:['polite','вежливый'],h:'Вежливость'}
    ])
  ]
},

'11.7':{
  title:'Idioms & collocations',
  context:'make a decision, do homework, heavy rain — слова дружат парами. Учим устойчивые пары.',
  theory:[
    {icon:'💬',title:'Collocations',html:`
      <p><b>make</b>: a decision, a mistake, money. <b>do</b>: homework, business, a favour.</p>
      <p><b>heavy</b> rain, <b>strong</b> coffee, <b>fast</b> food.</p>`},
    {icon:'🎭',title:'Идиомы',html:`
      <p><b>hit the books</b> — учиться; <b>under the weather</b> — болею; <b>cost an arm and a leg</b> — очень дорого.</p>`}
  ],
  examples:[
    {title:'make или do?',steps:[
      {text:'decision → <b>make</b> a decision.',rule:'make'},
      {text:'homework → <b>do</b> homework.',rule:'do'}
    ]}
  ],
  taskTypes:[
    factsTT('Collocations','💬',[
      {q:'___ a decision (make/do)',a:['make'],h:'make'},
      {q:'___ homework (make/do)',a:['do'],h:'do'},
      {q:'___ rain (heavy/strong)',a:['heavy'],h:'heavy'},
      {q:'___ coffee (heavy/strong)',a:['strong'],h:'strong'},
      {q:'Идиома "hit the books" значит…',a:['study','учиться','учиться усердно'],h:'Про учёбу'},
      {q:'"Under the weather" значит…',a:['ill','sick','болею','больной'],h:'Про здоровье'}
    ])
  ]
},

'11.8':{
  title:'Итоговый повтор',
  context:'Финальный блиц по всему курсу: времена, пассив, условные, слова.',
  theory:[
    {icon:'🏁',title:'Чек-лист',html:`
      <ul>
        <li>Все 12 времён + Perfect Continuous</li>
        <li>Passive, Conditionals, Reported, Wish</li>
        <li>Word formation, collocations, linkers</li>
      </ul>`}
  ],
  examples:[
    {title:'Как повторять',steps:[
      {text:'Каждый день — 20 слов и 10 упражнений.',rule:'Регулярность'},
      {text:'Говори вслух правила с примерами.',rule:'Speaking'},
      {text:'Пиши мини-эссе 3 раза в неделю.',rule:'Writing'}
    ]}
  ],
  taskTypes:[
    factsTT('Блиц','⚡',[
      {q:'She ___ (work) here since 2015.',a:['has worked','has been working'],h:'Perfect'},
      {q:'The house ___ (build) last year.',a:['was built'],h:'Passive Past'},
      {q:'If I ___ (be) you, I would study.',a:['were'],h:'Conditional 2'},
      {q:'I wish I ___ (speak) English fluently.',a:['spoke'],h:'wish + Past'},
      {q:'happy → ___ (существительное)',a:['happiness'],h:'-ness'},
      {q:'He said he ___ (be) tired.',a:['was'],h:'Reported'}
    ])
  ]
}

};