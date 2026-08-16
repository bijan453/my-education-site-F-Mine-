function factsTT(name,icon,qs){
  return {icon:icon,name:name,
    generate:()=>{const q=qs[randInt(0,qs.length-1)];return{q}},
    template:(q)=>({text:q.q,answer:q.a,hint:q.h,solution:`Ответ: <b>${Array.isArray(q.a)?q.a[0]:q.a}</b>.`})};
}

const LESSONS = {

/* ================= 7 КЛАСС ================= */

'7.1':{
  title:'Числовые выражения и порядок действий',
  context:'Любое вычисление подчиняется одному и тому же закону — порядку действий. Освоишь его сейчас, и он будет работать во всей математике до самого экзамена.',
  theory:[
    {icon:'🔢',title:'Порядок действий (правило трёх этажей)',html:`
      <p>Выражение читается «по этажам». Сначала выполняются действия <b>в скобках</b>, затем <b>умножение и деление</b> (слева направо), и только потом <b>сложение и вычитание</b>.</p>
      <div class="highlight-box">1️⃣ Скобки → 2️⃣ Умножение/деление → 3️⃣ Сложение/вычитание.</div>
      <p>Умножение и деление — «равноправны»: делаем по порядку слева направо. Сложение и вычитание — тоже.</p>`},
    {icon:'⚗️',title:'Свойства действий (законы арифметики)',html:`
      <ul>
        <li><b>Переместительное:</b> $a+b=b+a$ и $a\\cdot b=b\\cdot a$</li>
        <li><b>Сочетательное:</b> $(a+b)+c=a+(b+c)$</li>
        <li><b>Распределительное:</b> $a(b+c)=ab+ac$ — самое важное, оно связывает умножение со сложением</li>
      </ul>`},
    {icon:'🧠',title:'Зачем это нужно',html:`
      <p>Свойства позволяют <b>упрощать</b> вычисления: $7\\cdot15+7\\cdot5 = 7\\cdot(15+5)=7\\cdot20=140$. Без порядка действий каждый считал бы по-своему и получал разные ответы.</p>`}
  ],
  examples:[
    {title:'Разбор: 2 + 3·4 − (6:2)',steps:[
      {text:'Скобки: $6:2=3$.',rule:'Этаж 1'},
      {text:'Умножение: $3\\cdot4=12$.',rule:'Этаж 2'},
      {text:'Сложение/вычитание: $2+12-3$.',rule:'Этаж 3'},
      {text:'Ответ: $11$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'🧮',name:'Вычисли',
      generate:()=>{const a=randInt(2,9),b=randInt(2,9),c=randInt(2,9);return{a,b,c,r:a+b*c}},
      template:(o)=>({text:`Вычисли: $${o.a} + ${o.b}\\cdot ${o.c}$`,answer:o.r,hint:'Сначала умножение',solution:`${o.b}·${o.c}=${o.b*o.c}; ${o.a}+${o.b*o.c}=<b>${o.r}</b>.`})},
    {icon:'🧮',name:'Со скобками',
      generate:()=>{const a=randInt(2,9),b=randInt(2,9),c=randInt(2,5);return{a,b,c,r:(a+b)*c}},
      template:(o)=>({text:`Вычисли: $(${o.a} + ${o.b})\\cdot ${o.c}$`,answer:o.r,hint:'Сначала скобки',solution:`(${o.a}+${o.b})=${o.a+o.b}; ·${o.c}=<b>${o.r}</b>.`})}
  ]
},

'7.2':{
  title:'Степень с натуральным показателем',
  context:'Степень — это «умножение в сокращённой записи». Вместо $2·2·2·2·2$ пишем $2^5$. Это экономит место и время.',
  theory:[
    {icon:'ⁿ',title:'Определение',html:`
      <div class="formula-block">$a^n = \\underbrace{a\\cdot a\\cdots a}_{n\\ раз}$</div>
      <p>$a$ — <b>основание</b>, $n$ — <b>показатель</b> (сколько раз умножаем). $a^1=a$, $a^0=1$ (при $a\\neq0$).</p>`},
    {icon:'⚙️',title:'Свойства степеней',html:`
      <div class="formula-block">$a^n\\cdot a^m=a^{n+m}$</div>
      <div class="formula-block">$a^n:a^m=a^{n-m}$</div>
      <div class="formula-block">$(a^n)^m=a^{n\\cdot m}$</div>
      <p>При умножении показатели <b>складываются</b>, при делении — <b>вычитаются</b>, при возведении степени в степень — <b>перемножаются</b>.</p>`},
    {icon:'⚠️',title:'Отрицательное основание',html:`
      <div class="highlight-box gold">$(-2)^2=4$ (чётная степень → «+»), но $(-2)^3=-8$ (нечётная → «−»). Скобки обязательны!</div>`}
  ],
  examples:[
    {title:'2³·2⁴',steps:[
      {text:'Основания одинаковые → показатели складываем: $3+4=7$.',rule:'aⁿ·a'},
      {text:'$2^7=128$.',rule:'Таблица'}
    ]}
  ],
  taskTypes:[
    {icon:'ⁿ',name:'Показатели',
      generate:()=>{const a=randInt(2,4),n=randInt(2,5),m=randInt(2,5);const v=randInt(0,2);
        if(v===0)return{text:`$${a}^{${n}}\\cdot ${a}^{${m}} = ${a}^{?}$`,answer:n+m,hint:'Сложи показатели',solution:`${n}+${m}=<b>${n+m}</b>.`};
        if(v===1)return{text:`$(${a}^{${n}})^{${m}} = ${a}^{?}$`,answer:n*m,hint:'Перемножь показатели',solution:`${n}·${m}=<b>${n*m}</b>.`};
        return{text:`$${a}^{${n+m}}:${a}^{${m}} = ${a}^{?}$`,answer:n,hint:'Вычти показатели',solution:`${n+m}−${m}=<b>${n}</b>.`}}},
    factsTT('Значения','🔢',[
      {q:'$2^5$ = ?',a:['32'],h:'2·2·2·2·2'},
      {q:'$3^3$ = ?',a:['27'],h:'3·3·3'},
      {q:'$5^0$ = ?',a:['1'],h:'a⁰=1'},
      {q:'$(-2)^2$ = ?',a:['4'],h:'Чётная степень'},
      {q:'$10^4$ = ?',a:['10000'],h:'1 и 4 нуля'}
    ])
  ]
},

'7.3':{
  title:'Одночлены и многочлены',
  context:'Алгебра — это «арифметика с буквами». Одночлен — произведение числа и букв, многочлен — сумма одночленов.',
  theory:[
    {icon:'🔤',title:'Определения',html:`
      <p><b>Одночлен:</b> $5x^2y$ (число × буквы). <b>Многочлен:</b> $3x^2+2x-7$ (сумма одночленов).</p>
      <p>Число перед буквами — <b>коэффициент</b>.</p>`},
    {icon:'➕',title:'Подобные слагаемые',html:`
      <p>Одночлены с одинаковой буквенной частью — <b>подобные</b>. Их коэффициенты складываются: $3x+5x=8x$.</p>
      <div class="highlight-box">$7a-2a+4a = (7-2+4)a = 9a$.</div>`},
    {icon:'✖️',title:'Раскрытие скобок',html:`
      <p>Множитель перед скобкой умножает <b>каждое</b> слагаемое: $2(x+3)=2x+6$.</p>
      <div class="highlight-box gold">Перед скобкой «−» — знаки внутри <b>меняются</b>: $-(x-3)=-x+3$.</div>`}
  ],
  examples:[
    {title:'(2x+3)+(x−1)',steps:[
      {text:'Снимаем скобки (знаки «+» не меняются).',rule:'Скобки'},
      {text:'Подобные: $2x+x=3x$; числа: $3-1=2$.',rule:'Приведение'},
      {text:'Ответ: $3x+2$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'➕',name:'Подобные',
      generate:()=>{const a=randInt(2,9),b=randInt(2,9);return{a,b,r:a+b}},
      template:(o)=>({text:`Упрости: $${o.a}x + ${o.b}x$`,answer:o.r+'x',hint:'Сложи коэффициенты',solution:`(${o.a}+${o.b})x=<b>${o.r}x</b>.`})},
    {icon:'✖️',name:'Скобки',
      generate:()=>{const a=randInt(2,5),b=randInt(1,9);return{a,b,r:a*b}},
      template:(o)=>({text:`Коэффициент при x после раскрытия: $${o.a}(x+${o.b})$`,answer:o.a,hint:'a·x',solution:`${o.a}x+${o.r}$; коэффициент <b>${o.a}</b>.`})}
  ]
},

'7.4':{
  title:'Формулы сокращённого умножения (ФСУ)',
  context:'ФСУ — это «горячие клавиши» алгебры. Они позволяют раскрывать и сворачивать скобки мгновенно, без долгого умножения.',
  theory:[
    {icon:'✂️',title:'Квадрат суммы и разности',html:`
      <div class="formula-block">$(a+b)^2 = a^2+2ab+b^2$</div>
      <div class="formula-block">$(a-b)^2 = a^2-2ab+b^2$</div>
      <p>«Квадрат первого, плюс/минус удвоенное произведение, плюс квадрат второго».</p>`},
    {icon:'➖',title:'Разность квадратов',html:`
      <div class="formula-block">$(a-b)(a+b)=a^2-b^2$</div>
      <p>Работает в обе стороны — и для разложения!</p>`},
    {icon:'🧊',title:'Кубы',html:`
      <div class="formula-block">$a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)$</div>`}
  ],
  examples:[
    {title:'(x+4)²',steps:[
      {text:'Квадрат первого: $x^2$.',rule:'a²'},
      {text:'Удвоенное произведение: $2\\cdot x\\cdot4=8x$.',rule:'2ab'},
      {text:'Квадрат второго: $16$.',rule:'b²'},
      {text:'Ответ: $x^2+8x+16$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'✂️',name:'ФСУ',
      generate:()=>{const b=randInt(2,9);const v=randInt(0,2);
        if(v===0)return{text:`$(x+${b})^2 = x^2+?x+${b*b}$. Коэффициент при x?`,answer:2*b,hint:'2ab',solution:`2·${b}=<b>${2*b}</b>.`};
        if(v===1)return{text:`$(x-${b})(x+${b}) = x^2-?$`,answer:b*b,hint:'b²',solution:`<b>${b*b}</b>.`};
        return{text:`$x^2-${b*b}=(x-?)(x+?)$`,answer:b,hint:'√ из '+b*b,solution:`<b>${b}</b>.`}}},
    {icon:'🧮',name:'Быстрый счёт',
      generate:()=>{const a=randInt(11,19),b=randInt(1,9);return{a,b,s:a*a-b*b}},
      template:(o)=>({text:`Вычисли через ФСУ: $${o.a}^2-${o.b}^2$`,answer:o.s,hint:'(a−b)(a+b)',solution:`(${o.a-o.b})·(${o.a+o.b})=<b>${o.s}</b>.`})}
  ]
},

'7.5':{
  title:'Линейные уравнения',
  context:'Уравнение — это равенство с неизвестным. Решить — значит найти все значения неизвестного, при которых равенство верно.',
  theory:[
    {icon:'⚖️',title:'Что такое уравнение',html:`
      <p>$ax+b=0$ — линейное уравнение. <b>Корень</b> — значение x, обращающее его в верное равенство.</p>
      <div class="highlight-box">Два правила: перенос через «=» меняет знак; обе части можно умножить/делить на одно число.</div>`},
    {icon:'🧭',title:'Алгоритм решения',html:`
      <ol><li>Раскрой скобки</li><li>Перенеси неизвестные влево, числа вправо (со сменой знака)</li><li>Приведи подобные</li><li>Раздели на коэффициент при x</li></ol>`},
    {icon:'⚠️',title:'Особые случаи',html:`
      <p>$0\\cdot x=0$ — корней бесконечно много; $0\\cdot x=5$ — корней нет.</p>`}
  ],
  examples:[
    {title:'3x+5=20',steps:[
      {text:'Переносим 5: $3x=20-5=15$.',rule:'Смена знака'},
      {text:'Делим на 3: $x=5$.',rule:'Деление'}
    ]}
  ],
  taskTypes:[
    {icon:'⚖️',name:'Реши',
      generate:()=>{const x=randInt(-9,9),a=randInt(2,6),b=randInt(1,20);return{x,a,b,c:a*x+b}},
      template:(o)=>({text:`Реши: $${o.a}x+${o.b}=${o.c}$`,answer:o.x,hint:'Перенеси и подели',solution:`${o.a}x=${o.c-o.b}; x=<b>${o.x}</b>.`})},
    {icon:'⚖️',name:'С минусом',
      generate:()=>{const x=randInt(-9,9),a=randInt(2,7),b=randInt(1,15);return{x,a,b,c:a*x-b}},
      template:(o)=>({text:`Реши: $${o.a}x-${o.b}=${o.c}$`,answer:o.x,hint:'Перенеси −b',solution:`${o.a}x=${o.c+o.b}; x=<b>${o.x}</b>.`})}
  ]
},

'7.6':{
  title:'Линейная функция y=kx+b',
  context:'Функция — это «машина»: каждому x ставит в соответствие один y. Линейная функция — простейшая: её график прямая.',
  theory:[
    {icon:'📈',title:'График — прямая',html:`
      <p>$k$ — <b>угловой коэффициент</b> (наклон): $k>0$ — прямая растёт, $k<0$ — падает. $b$ — сдвиг по оси y (точка $(0;b)$).</p>`},
    {icon:'🧮',title:'Как строить',html:`
      <p>Достаточно двух точек: подставь любые два x, найди y, соедини прямой.</p>
      <div class="highlight-box">Прямые с одинаковым k <b>параллельны</b>.</div>`}
  ],
  examples:[
    {title:'y=2x+1 при x=3',steps:[
      {text:'Подставляем: $y=2\\cdot3+1$.',rule:'Подстановка'},
      {text:'$y=7$. Точка (3;7).',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'📈',name:'Значения',
      generate:()=>{const k=randInt(2,5),b=randInt(1,9),x=randInt(2,7);return{k,b,x,r:k*x+b}},
      template:(o)=>({text:`y=${o.k}x+${o.b}. Найди y при x=${o.x}`,answer:o.r,hint:'Подставь',solution:`${o.k}·${o.x}+${o.b}=<b>${o.r}</b>.`})},
    factsTT('График','📈',[
      {q:'График y=kx+b — это…?',a:['прямая'],h:'Прямая'},
      {q:'k>0 — прямая…?',a:['растёт','возрастает'],h:'Вверх'},
      {q:'b — сдвиг по оси…?',a:['y','игрек'],h:'y'}
    ])
  ]
},

/* ================= 8 КЛАСС (BIG) ================= */

'8.1':{
  title:'Рациональные выражения и ОДЗ',
  context:'Рациональное выражение — это «дробь из многочленов». Главное ограничение: на ноль делить нельзя, поэтому знаменатель не может обращаться в ноль — это и даёт ОДЗ.',
  theory:[
    {icon:'🚫',title:'Что такое ОДЗ и как её искать',html:`
      <p><b>ОДЗ</b> (область допустимых значений) — все значения переменной, при которых выражение <b>имеет смысл</b>.</p>
      <div class="highlight-box gold">Алгоритм: приравняй знаменатель к нулю → реши → эти значения <b>исключаем</b>.</div>
      <p>$\\dfrac{x+1}{x-3}$: $x-3=0\\Rightarrow x=3$ → ОДЗ: $x\\neq3$.</p>
      <p>$\\dfrac{5}{x^2-4}$: $x^2-4=0\\Rightarrow x=\\pm2$ → ОДЗ: $x\\neq2,\\ x\\neq-2$.</p>`},
    {icon:'✂️',title:'Основное свойство дроби',html:`
      <p>Числитель и знаменатель можно <b>умножить или разделить</b> на одно и то же ненулевое выражение — дробь не изменится.</p>
      <div class="highlight-box">$\\dfrac{6x}{9x}=\\dfrac{2}{3}$ (поделили на $3x$).</div>`},
    {icon:'🧩',title:'Как сокращать дроби с многочленами',html:`
      <p>Сокращать можно только <b>множители</b>, поэтому сначала раскладываем на множители:</p>
      <ul><li>вынесение общего множителя: $6x^2+9x=3x(2x+3)$</li>
      <li>группировка</li>
      <li>ФСУ: $x^2-9=(x-3)(x+3)$</li></ul>
      <div class="highlight-box green">$\\dfrac{x^2-9}{x-3}=\\dfrac{(x-3)(x+3)}{x-3}=x+3$ (при $x\\neq3$).</div>`}
  ],
  examples:[
    {title:'Сокращаем (x²−25)/(x−5)',steps:[
      {text:'Числитель — разность квадратов: $(x-5)(x+5)$.',rule:'ФСУ'},
      {text:'Сокращаем общий множитель $(x-5)$.',rule:'Свойство дроби'},
      {text:'Ответ: $x+5$, при ОДЗ $x\\neq5$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'🚫',name:'ОДЗ',
      generate:()=>{const b=randInt(2,9),s=Math.random()<.5?1:-1;return{b,s,ans:s>0?b:-b}},
      template:(o)=>({text:`$\\dfrac{x+2}{x${o.s>0?'-':'+'}${o.b}}$ — при каком x дробь не имеет смысла?`,answer:o.ans,hint:'Знаменатель = 0',solution:`x${o.s>0?'-':'+'}${o.b}=0\\Rightarrow x=<b>${o.ans}</b>$.`})},
    {icon:'✂️',name:'Сокращение',
      generate:()=>{const p=randInt(2,7),q=randInt(p+1,12),k=randInt(2,5);return{p,q,k,P:p*k,Q:q*k}},
      template:(o)=>({text:`Сократи: $\\dfrac{${o.P}x}{${o.Q}x}$`,answer:fr(o.p,o.q),hint:`Общий множитель ${o.k}x`,solution:`<b>${fr(o.p,o.q)}</b>.`})},
    {icon:'🧩',name:'ФСУ в дробях',
      generate:()=>{const a=randInt(2,9);return{a,A:a*a}},
      template:(o)=>({text:`$\\dfrac{x^2-${o.A}}{x-${o.a}} = x+?$ (при $x\\neq${o.a}$)`,answer:o.a,hint:'x²−a²=(x−a)(x+a)',solution:`x+<b>${o.a}</b>.`})}
  ]
},

'8.2':{
  title:'Арифметика рациональных дробей',
  context:'Дроби складываются только с одинаковыми знаменателями — как яблоки с яблоками. Поэтому первый шаг почти всегда — привести к общему знаменателю.',
  theory:[
    {icon:'➕',title:'Сложение и вычитание',html:`
      <div class="formula-block">$\\frac{a}{b}\\pm\\frac{c}{d}=\\frac{ad\\pm cb}{bd}$</div>
      <p>Шаги: 1) найти общий знаменатель (лучше НОК); 2) домножить числители; 3) сложить/вычесть; 4) <b>сократить</b> ответ.</p>
      <div class="highlight-box">$\\frac12+\\frac13=\\frac{3+2}{6}=\\frac56$.</div>`},
    {icon:'✖️',title:'Умножение и деление',html:`
      <div class="formula-block">$\\frac{a}{b}\\cdot\\frac{c}{d}=\\frac{ac}{bd}\\qquad \\frac{a}{b}:\\frac{c}{d}=\\frac{a}{b}\\cdot\\frac{d}{c}$</div>
      <p>Здесь общий знаменатель <b>не нужен</b>. При делении — «переворачиваем» вторую дробь.</p>`},
    {icon:'🏗️',title:'Многоэтажные дроби',html:`
      <div class="highlight-box gold">$\\dfrac{\\frac{a}{b}}{\\frac{c}{d}}=\\dfrac{a}{b}\\cdot\\dfrac{d}{c}$. «Делим — умножаем на перевёрнутую».</div>`}
  ],
  examples:[
    {title:'1/2 + 1/3',steps:[
      {text:'НОК(2,3)=6 — общий знаменатель.',rule:'НОК'},
      {text:'$\\frac{3}{6}+\\frac{2}{6}$.',rule:'Дополняем'},
      {text:'$=\\frac56$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'➕',name:'Сложение и вычитание',
      generate:()=>{const b=randInt(2,9),d=randInt(2,9);const a=randInt(1,b-1),c=randInt(1,d-1);const op=Math.random()<.5?1:-1;const p=a*d+op*c*b;return{a,b,c,d,op,ans:fracForms(p,b*d)}},
      template:(o)=>({text:`Вычисли: $\\frac{${o.a}}{${o.b}}${o.op>0?'+':'-'}\\frac{${o.c}}{${o.d}}$`,answer:o.ans,hint:`Общий знаменатель ${o.b*o.d}`,solution:`$\\frac{${o.a*o.d+(o.op>0?o.c*o.b:-o.c*o.b)}}{${o.b*o.d}}=<b>${o.ans[0]}</b>$.`})},
    {icon:'✖️',name:'Умножение и деление',
      generate:()=>{const a=randInt(1,7),b=randInt(2,9),c=randInt(1,7),d=randInt(2,9);const op=Math.random()<.5?1:0;
        if(op)return{a,b,c,d,op,ans:fracForms(a*c,b*d)};return{a,b,c,d,op,ans:fracForms(a*d,b*c)}},
      template:(o)=>({text:o.op?`$\\frac{${o.a}}{${o.b}}\\cdot\\frac{${o.c}}{${o.d}}=?$`:`$\\frac{${o.a}}{${o.b}}:\\frac{${o.c}}{${o.d}}=?$`,answer:o.ans,hint:o.op?'Числители·числители':'Переверни вторую',solution:`<b>${o.ans[0]}</b>.`})},
    {icon:'🏗️',name:'Многоэтажные',
      generate:()=>{const a=randInt(1,6),b=randInt(2,7),c=randInt(1,6),d=randInt(2,7);return{a,b,c,d,ans:fracForms(a*d,b*c)}},
      template:(o)=>({text:`$\\dfrac{\\frac{${o.a}}{${o.b}}}{\\frac{${o.c}}{${o.d}}}=?$`,answer:o.ans,hint:'Умножь на перевёрнутую',solution:`<b>${o.ans[0]}</b>.`})}
  ]
},

'8.3':{
  title:'Действительные числа и множества',
  context:'Числа устроены как «матрёшка»: натуральные внутри целых, целые внутри рациональных, рациональные вместе с иррациональными образуют действительные.',
  theory:[
    {icon:'ℝ',title:'Четыре множества',html:`
      <ul>
        <li>$\\mathbb{N}$ — <b>натуральные</b>: 1,2,3… (для счёта)</li>
        <li>$\\mathbb{Z}$ — <b>целые</b>: …,−2,−1,0,1,2,…</li>
        <li>$\\mathbb{Q}$ — <b>рациональные</b>: все, что можно записать дробью $p/q$</li>
        <li>$\\mathbb{R}$ — <b>действительные</b>: вообще все точки числовой прямой</li>
      </ul>
      <div class="highlight-box">$\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}$.</div>`},
    {icon:'🌀',title:'Рациональные vs иррациональные',html:`
      <p>Рациональные числа в десятичном виде — <b>конечные</b> или <b>периодические</b> дроби ($0,5$; $0,333…$).</p>
      <p>Иррациональные — <b>бесконечные непериодические</b>: $\\sqrt2=1,41421…$, $\\pi=3,14159…$.</p>`}
  ],
  examples:[
    {title:'Куда входит −3?',steps:[
      {text:'−3 — целое: $\\in\\mathbb{Z}$.',rule:'Целые'},
      {text:'И рациональное: $-3=\\frac{-3}{1}\\in\\mathbb{Q}$.',rule:'Q'},
      {text:'Но не натуральное (отрицательное).',rule:'Не N'}
    ]}
  ],
  taskTypes:[
    factsTT('Множества','ℝ',[
      {q:'−3 — наименьшее множество?',a:['z','целые','целых'],h:'Z'},
      {q:'√2 — какое число?',a:['иррациональное'],h:'Не дробь'},
      {q:'0,5 — наименьшее множество?',a:['q','рациональное'],h:'Q'},
      {q:'7 ∈ N?',a:['да'],h:'Натуральное'},
      {q:'π — какое число?',a:['иррациональное'],h:'Непериодическое'}
    ]),
    {icon:'√',name:'Корни из квадратов',
      generate:()=>{const a=randInt(2,15),b=randInt(2,15);return{a,b,r:a*b}},
      template:(o)=>({text:`$\\sqrt{${o.a*o.a}\\cdot${o.b*o.b}}=?$`,answer:o.r,hint:'√a²·√b²',solution:`${o.a}·${o.b}=<b>${o.r}</b>.`})}
  ]
},

'8.4':{
  title:'Квадратные корни и их свойства',
  context:'Квадратный корень — операция, обратная возведению в квадрат. Если $5^2=25$, то $\\sqrt{25}=5$.',
  theory:[
    {icon:'√',title:'Определение',html:`
      <p><b>Арифметический квадратный корень</b> из $a\\ge0$ — неотрицательное число, квадрат которого равен $a$.</p>
      <div class="highlight-box">$\\sqrt{a^2}=|a|$ — модуль! Например $\\sqrt{(-5)^2}=5$.</div>`},
    {icon:'⚙️',title:'Свойства корней',html:`
      <div class="formula-block">$\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}$</div>
      <div class="formula-block">$\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt a}{\\sqrt b}$</div>
      <p>Корень из произведения = произведение корней; то же для дроби.</p>`},
    {icon:'📊',title:'Таблица квадратов (наизусть!)',html:`
      <p>$11^2=121$, $12^2=144$, $13^2=169$, $14^2=196$, $15^2=225$, $20^2=400$, $25^2=625$.</p>`}
  ],
  examples:[
    {title:'√12·√3',steps:[
      {text:'Сливаем под один корень: $\\sqrt{12\\cdot3}=\\sqrt{36}$.',rule:'√a·√b'},
      {text:'$=6$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'√',name:'Вычисли',
      generate:()=>{const a=randInt(2,9),b=randInt(2,9);const v=randInt(0,2);
        if(v===0)return{text:`$\\sqrt{${a*a}}=?$`,answer:a,hint:'Квадрат чего?',solution:`<b>${a}</b>.`};
        if(v===1)return{text:`$\\sqrt{${a*a*b}}=?$ (вид $k\\sqrt{${b}}$)`,answer:a+'√'+b,hint:'Вынеси из-под корня',solution:`<b>${a}√${b}</b>.`};
        return{text:`$\\sqrt{${a*a}}\\cdot\\sqrt{${b*b}}=?$`,answer:a*b,hint:'√·√',solution:`<b>${a*b}</b>.`}}},
    {icon:'➗',name:'Деление корней',
      generate:()=>{const a=randInt(2,9),b=randInt(2,9);return{a,b,A:a*a*b*b,B:b*b,r:a}},
      template:(o)=>({text:`$\\sqrt{${o.A}}:\\sqrt{${o.B}}=?$`,answer:o.r,hint:'√(A/B)',solution:`$\\sqrt{${o.A/o.B}}=<b>${o.r}</b>$.`})}
  ]
},

'8.5':{
  title:'Преобразование иррациональных выражений',
  context:'Три главных приёма работы с корнями: вынести множитель из-под корня, внести под корень и избавиться от иррациональности в знаменателе.',
  theory:[
    {icon:'',title:'Вынести и внести',html:`
      <p><b>Вынести:</b> $\\sqrt{50}=\\sqrt{25\\cdot2}=5\\sqrt2$ (вытащили квадрат 25).</p>
      <p><b>Внести:</b> $3\\sqrt2=\\sqrt{9\\cdot2}=\\sqrt{18}$ (число вошло квадратом).</p>
      <div class="highlight-box">Ищем внутри корня наибольший полный квадрат!</div>`},
    {icon:'🧼',title:'Освобождение от иррациональности',html:`
      <p>Если в знаменателе корень — домножаем числитель и знаменатель на него:</p>
      <div class="highlight-box gold">$\\dfrac{1}{\\sqrt2}=\\dfrac{1\\cdot\\sqrt2}{\\sqrt2\\cdot\\sqrt2}=\\dfrac{\\sqrt2}{2}$.</div>
      <p>Для $a+\\sqrt b$ домножаем на <b>сопряжённое</b> $a-\\sqrt b$.</p>`}
  ],
  examples:[
    {title:'6/√3',steps:[
      {text:'Домножаем на $\\frac{\\sqrt3}{\\sqrt3}$.',rule:'Приём'},
      {text:'$\\frac{6\\sqrt3}{3}=2\\sqrt3$.',rule:'Сократили'}
    ]}
  ],
  taskTypes:[
    {icon:'',name:'Вынесение',
      generate:()=>{const a=randInt(2,7),b=[2,3,5,6,7][randInt(0,4)];return{a,b,N:a*a*b}},
      template:(o)=>({text:`$\\sqrt{${o.N}}=k\\sqrt{${o.b}}$. Найди k.`,answer:o.a,hint:`${o.N}=${o.a}²·${o.b}`,solution:`<b>${o.a}</b>√${o.b}.`})},
    {icon:'🧼',name:'Иррациональность',
      generate:()=>{const a=randInt(2,6),b=randInt(2,6);return{a,b,r:a*b,A:a*a*b*b}},
      template:(o)=>({text:`$\\dfrac{\\sqrt{${o.A}}}{\\sqrt{${o.b*o.b}}}=?$`,answer:o.a,hint:'√(A/B)',solution:`<b>${o.a}</b>.`})},
    {icon:'🧮',name:'Упрощение',
      generate:()=>{const a=randInt(2,5),b=randInt(2,5);return{a,b,r:2*a*b,A:a*a*4*b}},
      template:(o)=>({text:`$\\sqrt{${o.a*o.a*4*o.b}}\\cdot\\sqrt{${o.b}}=?$`,answer:2*o.a*o.b,hint:'√(4a²b)=2a√b',solution:`2·${o.a}·${o.b}=<b>${2*o.a*o.b}</b>.`})}
  ]
},

'8.6':{
  title:'Квадратные уравнения: дискриминант',
  context:'Квадратное уравнение $ax^2+bx+c=0$ — центр алгебры 8 класса. Дискриминант — «детектор корней»: он говорит, сколько их и существуют ли они вообще.',
  theory:[
    {icon:'🎯',title:'Дискриминант и корни',html:`
      <div class="formula-block">$D=b^2-4ac$</div>
      <div class="formula-block">$x_{1,2}=\\frac{-b\\pm\\sqrt D}{2a}$</div>
      <p>$D>0$ — два корня; $D=0$ — один; $D<0$ — корней нет.</p>`},
    {icon:'🧩',title:'Неполные уравнения (без D)',html:`
      <ul>
        <li>$ax^2=0\\Rightarrow x=0$</li>
        <li>$ax^2+c=0\\Rightarrow x^2=-c/a$ (корни, если $-c/a>0$)</li>
        <li>$ax^2+bx=0\\Rightarrow x(ax+b)=0\\Rightarrow x=0$ или $x=-b/a$</li>
      </ul>`},
    {icon:'🌀',title:'«Размешанные» уравнения',html:`
      <div class="highlight-box">Сначала приведи к стандартному виду: раскрой скобки → перенеси всё влево → приведи подобные. Только потом считай D!</div>`}
  ],
  examples:[
    {title:'x²−5x+6=0',steps:[
      {text:'$D=25-24=1$.',rule:'D'},
      {text:'$x=\\frac{5\\pm1}{2}$.',rule:'Формула'},
      {text:'$x_1=3,\\ x_2=2$.',rule:'Корни'}
    ]}
  ],
  taskTypes:[
    {icon:'🎯',name:'Дискриминант',
      generate:()=>{const x1=randInt(-8,8),x2=randInt(-8,8);const b=-(x1+x2),c=x1*x2;return{x1,x2,b,c,D:(x1-x2)*(x1-x2)}},
      template:(o)=>({text:`$x^2${o.b>=0?'+':'-'}${Math.abs(o.b)}x${o.c>=0?'+':'-'}${Math.abs(o.c)}=0$. Найди D.`,answer:o.D,hint:'b²−4ac',solution:`D=<b>${o.D}</b>.`})},
    {icon:'🌱',name:'Корни',
      generate:()=>{const x1=randInt(-9,9),x2=randInt(-9,9);const b=-(x1+x2),c=x1*x2;return{x1,x2,b,c,hi:Math.max(x1,x2)}},
      template:(o)=>({text:`$x^2${o.b>=0?'+':'-'}${Math.abs(o.b)}x${o.c>=0?'+':'-'}${Math.abs(o.c)}=0$. Больший корень?`,answer:o.hi,hint:'Виета',solution:`Корни ${o.x1} и ${o.x2}$; больший <b>${o.hi}</b>.`})},
    {icon:'🧩',name:'Неполные',
      generate:()=>{const s=randInt(2,12);const v=randInt(0,1);
        if(v===0)return{text:`$x^2=${s*s}$. Больший корень?`,answer:s,hint:'√',solution:`x=±${s}$; больший <b>${s}</b>.`};
        const a=randInt(2,5);return{text:`$${a}x^2-${a*s*s}=0$. Больший корень?`,answer:s,hint:'x²='+s*s,solution:`x^2=${s*s}; x=<b>${s}</b>.`}}},
    {icon:'🌀',name:'Полный квадрат',
      generate:()=>{const r=randInt(2,9);return{r}},
      template:(o)=>({text:`$(x-${o.r})^2=0$. Корень?`,answer:o.r,hint:'Квадрат=0',solution:`x=<b>${o.r}</b>.`})}
  ]
},

'8.7':{
  title:'Теорема Виета и разложение на множители',
  context:'Виета — «читерский» способ: для приведённого уравнения корни находятся устно через сумму и произведение. А обратная теорема строит уравнение по корням.',
  theory:[
    {icon:'🧠',title:'Прямая теорема',html:`
      <div class="formula-block">$x^2+px+q=0:\\quad x_1+x_2=-p,\\quad x_1\\cdot x_2=q$</div>
      <p>Сумма корней = второй коэффициент с минусом; произведение = свободный член.</p>`},
    {icon:'🏗️',title:'Обратная теорема',html:`
      <p>Если числа дают нужные сумму и произведение — они и есть корни. Так составляют уравнение по корням.</p>`},
    {icon:'🧩',title:'Разложение трёхчлена',html:`
      <div class="highlight-box">$ax^2+bx+c=a(x-x_1)(x-x_2)$ — по найденным корням!</div>`}
  ],
  examples:[
    {title:'Уравнение с корнями 2 и 5',steps:[
      {text:'Сумма $=7\\Rightarrow p=-7$.',rule:'−p'},
      {text:'Произведение $=10\\Rightarrow q=10$.',rule:'q'},
      {text:'$x^2-7x+10=0$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'🧠',name:'Сумма и произведение',
      generate:()=>{const x1=randInt(-9,9),x2=randInt(-9,9);return{x1,x2,s:x1+x2,p:x1*x2}},
      template:(o)=>({text:`Корни ${o.x1} и ${o.x2}$. Сумма корней?`,answer:o.s,hint:'x1+x2',solution:`<b>${o.s}</b>.`})},
    {icon:'🏗️',name:'Составь уравнение',
      generate:()=>{const x1=randInt(1,9),x2=randInt(1,9);return{x1,x2,q:x1*x2}},
      template:(o)=>({text:`Корни ${o.x1} и ${o.x2}$. В $x^2+px+q=0$ найди q.`,answer:o.q,hint:'q=x1·x2',solution:`q=<b>${o.o!==undefined?o.q:o.q}</b>.`.replace('o.o','x1*x2')})},
    {icon:'🧩',name:'Разложение',
      generate:()=>{const x1=randInt(1,9),x2=randInt(1,9);return{x1,x2}},
      template:(o)=>({text:`$x^2-${o.x1+o.x2}x+${o.x1*o.x2}=(x-${o.x1})(x-?)$`,answer:o.x2,hint:'Второй корень',solution:`<b>${o.x2}</b>.`})}
  ]
},

'8.8':{
  title:'Биквадратные уравнения и замена переменной',
  context:'«Би» = два: биквадратное уравнение содержит $x^4$ и $x^2$. Замена $t=x^2$ превращает его в обычное квадратное.',
  theory:[
    {icon:'🔁',title:'Метод замены',html:`
      <ol><li>Введи $t=x^2$ (обязательно $t\\ge0$!)</li><li>Реши квадратное по t</li><li>Вернись: $x=\\pm\\sqrt t$</li></ol>
      <div class="highlight-box gold">Отрицательные t <b>отбрасываем</b> — квадрат не бывает отрицательным!</div>`},
    {icon:'🧠',title:'Уравнения высших степеней',html:`
      <p>Та же идея: если видишь повторяющийся блок — замени его. $(x^2+1)^2-5(x^2+1)+4=0$: пусть $t=x^2+1$.</p>`}
  ],
  examples:[
    {title:'x⁴−10x²+9=0',steps:[
      {text:'$t=x^2$: $t^2-10t+9=0$.',rule:'Замена'},
      {text:'$t=1$ или $t=9$.',rule:'Квадратное'},
      {text:'$x=\\pm1,\\ \\pm3$ — четыре корня.',rule:'Возврат'}
    ]}
  ],
  taskTypes:[
    {icon:'🔁',name:'Биквадратные',
      generate:()=>{const t1=[1,4,9,16][randInt(0,3)],t2=[1,4,9,16][randInt(0,3)];const b=-(t1+t2),c=t1*t2;return{t1,t2,b,c,r:Math.max(Math.sqrt(t1),Math.sqrt(t2))}},
      template:(o)=>({text:`$x^4${o.b>=0?'+':'-'}${Math.abs(o.b)}x^2+${o.c}=0$. Наибольший корень?`,answer:o.r,hint:'t=x²',solution:`t=${o.t1},${o.t2}; x=±${Math.sqrt(o.t1)},±${Math.sqrt(o.t2)}; наибольший <b>${o.r}</b>.`})},
    {icon:'🔢',name:'Число корней',
      generate:()=>{const t1=[1,4,9][randInt(0,2)],t2=randInt(1,9);const neg=Math.random()<.5;const b=-(neg?t1-t2:t1+t2),c=neg?-t1*t2:t1*t2;return{b,c,n:neg?2:4}},
      template:(o)=>({text:`$x^4${o.b>=0?'+':'-'}${Math.abs(o.b)}x^2${o.c>=0?'+':'-'}${Math.abs(o.c)}=0$. Сколько корней?`,answer:o.n,hint:'t≥0!',solution:`<b>${o.n}</b>.`})}
  ]
},

'8.9':{
  title:'Дробно-рациональные уравнения',
  context:'Когда неизвестное прячется в знаменателе, главное — не потерять ОДЗ: «посторонний» корень, обращающий знаменатель в ноль, должен быть отброшен.',
  theory:[
    {icon:'🧮',title:'Дробь равна нулю',html:`
      <div class="highlight-box">$\\frac{P(x)}{Q(x)}=0\\ \\Leftrightarrow\\ P(x)=0$ <b>и</b> $Q(x)\\neq0$.</div>
      <p>Числитель = 0 даёт кандидатов; знаменатель ≠ 0 их проверяет.</p>`},
    {icon:'⚙️',title:'Общий алгоритм',html:`
      <ol><li>Найди ОДЗ</li><li>Умножь обе части на общий знаменатель</li><li>Реши полученное уравнение</li><li>Отбрось корни вне ОДЗ</li></ol>`}
  ],
  examples:[
    {title:'(x²−9)/(x−3)=0',steps:[
      {text:'Числитель: $x^2-9=0\\Rightarrow x=\\pm3$.',rule:'P=0'},
      {text:'ОДЗ: $x\\neq3$ → корень 3 отбрасываем.',rule:'Проверка'},
      {text:'Ответ: $x=-3$.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    {icon:'🧮',name:'Дробь = 0',
      generate:()=>{const a=randInt(-9,9);let b=randInt(-9,9);if(b===a)b=a+1;return{a,b}},
      template:(o)=>({text:`$\\dfrac{x${o.a>=0?'-':'+'}${Math.abs(o.a)}}{x${o.b>=0?'-':'+'}${Math.abs(o.b)}}=0$`,answer:o.a,hint:'Числитель=0',solution:`x=<b>${o.a}</b>$ (при $x\\neq${o.b}$).`})},
    {icon:'⚠️',name:'Посторонние корни',
      generate:()=>{const a=randInt(2,9);return{a,A:a*a,ans:-a}},
      template:(o)=>({text:`$\\dfrac{x^2-${o.A}}{x-${o.a}}=0$`,answer:o.ans,hint:'x≠'+o.a,solution:`x=±${o.a}$, но $x\\neq${o.a}\\Rightarrow$ <b>${o.ans}</b>.`})}
  ]
},

'8.10':{
  title:'Функции: гипербола, парабола, √x, |x|',
  context:'Четыре «базовые» функции, из которых как из конструктора собираются все остальные графики.',
  theory:[
    {icon:'〽️',title:'Гипербола y=k/x',html:`
      <p>Две ветви. $k>0$ — I и III четверти; $k<0$ — II и IV. Оси координат — <b>асимптоты</b> (график приближается, но не касается).</p>`},
    {icon:'⛰️',title:'Парабола y=x²',html:`
      <p>Ветви вверх, вершина в (0;0), симметрична относительно оси y. $y=ax^2$: при $a>0$ ветви вверх, при $a<0$ вниз; больше |a| — «уже».</p>`},
    {icon:'🌱',title:'y=√x и y=|x|',html:`
      <p>$y=\\sqrt x$ — «половина параболы на боку», только при $x\\ge0$.</p>
      <p>$y=|x|$ — «уголок»: две прямые, сходящиеся в (0;0).</p>`}
  ],
  examples:[
    {title:'y=6/x при x=2',steps:[
      {text:'$y=6/2=3$.',rule:'Подстановка'},
      {text:'Точка (2;3) на гиперболе.',rule:'График'}
    ]}
  ],
  taskTypes:[
    {icon:'〽️',name:'Гипербола',
      generate:()=>{const k=[4,6,8,9,12][randInt(0,4)],d=[1,2,3,4,6][randInt(0,4)];return{k,d,ans:fracForms(k,d)}},
      template:(o)=>({text:`y=${o.k}/x. y при x=${o.d}?`,answer:o.ans,hint:'k/x',solution:`<b>${o.ans[0]}</b>.`})},
    factsTT('Графики','〽️',[
      {q:'График y=k/x — …?',a:['гипербола'],h:'Гипербола'},
      {q:'График y=x² — …?',a:['парабола'],h:'Парабола'},
      {q:'График y=|x| — …?',a:['уголок','угол'],h:'Уголок'},
      {q:'y=√x определена при x…?',a:['>=0','больше или равно 0','неотрицательных'],h:'x≥0'}
    ])
  ]
},

'8.11':{
  title:'Квадратичная функция и вершина параболы',
  context:'$y=ax^2+bx+c$ — парабола. Её «центр» — вершина; зная её и направление ветвей, можно нарисовать график и решить любую задачу.',
  theory:[
    {icon:'⛰️',title:'Вершина и ветви',html:`
      <div class="formula-block">$x_0=-\\frac{b}{2a}\\qquad y_0=c-\\frac{b^2}{4a}$</div>
      <p>$a>0$ — ветви вверх (вершина — минимум); $a<0$ — вниз (максимум). Ось симметрии: $x=x_0$.</p>`},
    {icon:'🧭',title:'Построение по точкам',html:`
      <ol><li>Найди вершину</li><li>Возьми 2-3 точки слева и справа</li><li>Соедини плавной параболой</li></ol>`},
    {icon:'🔀',title:'Сдвиги графиков',html:`
      <div class="highlight-box">$y=f(x+m)+n$: «+m» внутри — сдвиг <b>влево</b> на m; «+n» снаружи — <b>вверх</b> на n. Вершина $(x-m;\\ n)$ у $(x-m)^2+n$.</div>`}
  ],
  examples:[
    {title:'y=x²−6x+5',steps:[
      {text:'$x_0=6/2=3$.',rule:'−b/2a'},
      {text:'$y_0=9-18+5=-4$.',rule:'Подстановка'},
      {text:'Вершина (3;−4), ветви вверх.',rule:'Вывод'}
    ]}
  ],
  taskTypes:[
    {icon:'⛰️',name:'Вершина',
      generate:()=>{const x0=randInt(-5,5),y0=randInt(-9,9);const b=-2*x0,c=y0+x0*x0;return{x0,y0,b,c}},
      template:(o)=>({text:`y=x^2${o.b>=0?'+':'-'}${Math.abs(o.b)}x${o.c>=0?'+':'-'}${Math.abs(o.c)}. x-координата вершины?`,answer:o.x0,hint:'−b/2',solution:`x₀=<b>${o.x0}</b>.`})},
    {icon:'🔀',name:'Сдвиги',
      generate:()=>{const m=randInt(-6,6),n=randInt(-6,6);return{m,n}},
      template:(o)=>({text:`y=(x${o.m>=0?'-':'+'}${Math.abs(o.m)})^2${o.n>=0?'+':'-'}${Math.abs(o.n)}$. m (сдвиг по x)?`,answer:o.m,hint:'(x−m)²',solution:`m=<b>${o.m}</b>, n=${o.n}.`})},
    factsTT('Ветви','⛰️',[
      {q:'a>0 — ветви…?',a:['вверх'],h:'Вверх'},
      {q:'a<0 — ветви…?',a:['вниз'],h:'Вниз'},
      {q:'y=−x²+4: ветви…?',a:['вниз'],h:'a=−1'}
    ])
  ]
},

'8.12':{
  title:'Неравенства и системы неравенств',
  context:'Неравенство решается почти как уравнение, но с одним коварным правилом: деление/умножение на отрицательное переворачивает знак. Системы — это пересечение промежутков.',
  theory:[
    {icon:'<',title:'Свойства неравенств',html:`
      <ul><li>Перенос слагаемого через знак — со сменой знака</li>
      <li>Умножение на положительное — знак тот же</li>
      <li>Умножение на <b>отрицательное</b> — знак <b>переворачивается</b>!</li></ul>`},
    {icon:'📏',title:'Числовые промежутки',html:`
      <p>Решение — промежуток: $(a;b)$, $[a;b]$, лучи. Решение системы — <b>пересечение</b> (общая часть), объединения — объединение.</p>`},
    {icon:'🎯',title:'Квадратные: метод интервалов',html:`
      <div class="highlight-box">$(x-a)(x-b)<0$ (a<b) — решение «между»: $(a;b)$. «>0» — «снаружи». Расставь корни и чередуй знаки!</div>`}
  ],
  examples:[
    {title:'−2x>6',steps:[
      {text:'Делим на −2 — знак переворачиваем.',rule:'Правило'},
      {text:'$x<-3$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'<',name:'Линейные',
      generate:()=>{const a=[2,3,4,5,-2,-3,-4][randInt(0,6)],b=randInt(-10,10);return{a,b,ans:fracForms(-b,a),dir:a>0?'>':'<'}},
      template:(o)=>({text:`${o.a}x+${o.b}>0 → x ${o.dir} ?`,answer:o.ans,hint:'x > −b/a (знак!)',solution:`x ${o.dir} <b>${o.ans[0]}</b>.`})},
    {icon:'🎯',name:'Метод интервалов',
      generate:()=>{const a=randInt(-8,4),b=a+randInt(2,9);return{a,b,len:b-a}},
      template:(o)=>({text:`$(x${o.a>=0?'-':'+'}${Math.abs(o.a)})(x${o.b>=0?'-':'+'}${Math.abs(o.b)})<0$. Длина решения?`,answer:o.len,hint:'(a;b)',solution:`(${o.a};${o.b}); длина <b>${o.len}</b>.`})},
    {icon:'🧩',name:'Системы',
      generate:()=>{const a=randInt(-8,2),b=a+randInt(3,10);return{a,b,len:b-a}},
      template:(o)=>({text:`Система: x>${o.a} и x<${o.b}. Длина решения?`,answer:o.len,hint:'Пересечение',solution:`(${o.a};${o.b}); длина <b>${o.len}</b>.`})}
  ]
},

'8.13':{
  title:'Степень с целым показателем',
  context:'Показатель может быть не только натуральным: нулевая степень даёт 1, отрицательная — «переворачивает» число. Это позволяет записывать огромные и крошечные числа компактно.',
  theory:[
    {icon:'⁻ⁿ',title:'Нулевая и отрицательная степень',html:`
      <div class="formula-block">$a^0=1\\qquad a^{-n}=\\frac{1}{a^n}$</div>
      <p>$2^{-3}=\\frac1{2^3}=\\frac18$. Отрицательная степень = единица делить на положительную.</p>`},
    {icon:'🔬',title:'Стандартный вид числа',html:`
      <p>$a\\cdot10^n$, где $1\\le a<10$. $3400=3,4\\cdot10^3$; $0,005=5\\cdot10^{-3}$.</p>
      <div class="highlight-box">n = сколько знаков «переехала» запятая (вправо → «+», влево → «−» для малых чисел).</div>`}
  ],
  examples:[
    {title:'5⁻²',steps:[
      {text:'$=\\frac1{5^2}=\\frac1{25}$.',rule:'Формула'},
      {text:'$=0,04$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'⁻ⁿ',name:'Значения',
      generate:()=>{const a=[2,3,5,10][randInt(0,3)],n=randInt(1,4);return{a,n,ans:fr(1,Math.pow(a,n))}},
      template:(o)=>({text:`$${o.a}^{-${o.n}}=?$ (дробью)`,answer:o.ans,hint:'1/aⁿ',solution:`<b>${o.ans}</b>.`})},
    {icon:'🔬',name:'Стандартный вид',
      generate:()=>{const c=randInt(2,9),n=randInt(2,6);return{c,n,N:c*Math.pow(10,n)}},
      template:(o)=>({text:`${o.N}=${o.c}\\cdot10^{?}$`,answer:o.n,hint:'Считай нули',solution:`<b>${o.n}</b>.`})},
    {icon:'ⁿ',name:'Свойства',
      generate:()=>{const a=randInt(2,4),n=randInt(2,5),m=randInt(2,5);return{a,n,m,r:n+m}},
      template:(o)=>({text:`$${o.a}^{${o.n}}\\cdot${o.a}^{${o.m}}=${o.a}^{?}$`,answer:o.r,hint:'Сложи',solution:`<b>${o.r}</b>.`})}
  ]
},

/* ================= 9 КЛАСС ================= */

'9.1':{
  title:'Арифметическая прогрессия',
  context:'Последовательность, где каждый следующий член получается прибавлением одного и того же числа d — как ступеньки лестницы одинаковой высоты.',
  theory:[
    {icon:'🪜',title:'Определение и формула члена',html:`
      <div class="formula-block">$a_n=a_1+d(n-1)$</div>
      <p>d — разность (шаг). $a_{n+1}=a_n+d$.</p>`},
    {icon:'➕',title:'Сумма',html:`
      <div class="formula-block">$S_n=\\frac{(a_1+a_n)\\cdot n}{2}$</div>
      <p>Гаусс в детстве сложил 1+2+…+100 именно так: пары с краёв дают одинаковую сумму.</p>`}
  ],
  examples:[
    {title:'a₁=2, d=3: a₅',steps:[
      {text:'$a_5=2+3\\cdot4=14$.',rule:'Формула'}
    ]}
  ],
  taskTypes:[
    {icon:'🪜',name:'Члены',
      generate:()=>{const a1=randInt(1,9),d=randInt(2,6),n=randInt(4,10);return{a1,d,n,r:a1+d*(n-1)}},
      template:(o)=>({text:`a₁=${o.a1}, d=${o.d}. a при n=${o.n}?`,answer:o.r,hint:'a1+d(n−1)',solution:`<b>${o.r}</b>.`})},
    {icon:'➕',name:'Суммы',
      generate:()=>{const a1=randInt(1,5),d=2,n=randInt(5,10);const an=a1+d*(n-1);return{a1,d,n,r:(a1+an)*n/2}},
      template:(o)=>({text:`S при n=${o.n}, a₁=${o.a1}, d=${o.d}?`,answer:o.r,hint:'(a1+an)n/2',solution:`<b>${o.r}</b>.`})}
  ]
},

'9.2':{
  title:'Геометрическая прогрессия',
  context:'Последовательность, где каждый член получается умножением на одно и то же q — как рост бактерий или сложные проценты.',
  theory:[
    {icon:'📈',title:'Формула',html:`
      <div class="formula-block">$b_n=b_1\\cdot q^{n-1}$</div>
      <p>q — знаменатель. Пример: 2,6,18… (q=3).</p>`}
  ],
  examples:[
    {title:'b₁=3, q=2: b₄',steps:[
      {text:'$b_4=3\\cdot2^3=24$.',rule:'Формула'}
    ]}
  ],
  taskTypes:[
    {icon:'📈',name:'Члены',
      generate:()=>{const b1=randInt(1,5),q=randInt(2,3),n=randInt(3,5);return{b1,q,n,r:b1*Math.pow(q,n-1)}},
      template:(o)=>({text:`b₁=${o.b1}, q=${o.q}. b при n=${o.n}?`,answer:o.r,hint:'b1·q^(n−1)',solution:`<b>${o.r}</b>.`})}
  ]
},

'9.3':{
  title:'Системы уравнений',
  context:'Два уравнения с двумя неизвестными. Решение — пара (x;y), удовлетворяющая обоим сразу. Методы: подстановка и сложение.',
  theory:[
    {icon:'🧩',title:'Метод сложения',html:`
      <p>Складываем/вычитаем уравнения так, чтобы одна переменная исчезла.</p>`},
    {icon:'🔁',title:'Метод подстановки',html:`
      <p>Выражаем одну переменную из одного уравнения и подставляем в другое.</p>`}
  ],
  examples:[
    {title:'x+y=7; x−y=3',steps:[
      {text:'Складываем: $2x=10$.',rule:'+'},
      {text:'$x=5$, тогда $y=2$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'🧩',name:'Реши',
      generate:()=>{const x=randInt(1,9),y=randInt(1,9);return{x,y,s:x+y,d:x-y}},
      template:(o)=>({text:`x+y=${o.s}; x−y=${o.d}. Найди x.`,answer:o.x,hint:'Сложи',solution:`2x=${o.s+o.d}; x=<b>${o.x}</b>.`})}
  ]
},

'9.4':{
  title:'Комбинаторика',
  context:'Наука о подсчёте вариантов: сколькими способами можно выбрать, расставить, составить?',
  theory:[
    {icon:'🎲',title:'Базовые подсчёты',html:`
      <p>Пары из n: $\\frac{n(n-1)}{2}$. Перестановки n предметов: $n!$. Правило умножения: выбор A (m способов) и B (k способов) — $m\\cdot k$.</p>`}
  ],
  examples:[
    {title:'Пары из 5',steps:[
      {text:'$\\frac{5\\cdot4}{2}=10$.',rule:'Формула'}
    ]}
  ],
  taskTypes:[
    {icon:'🎲',name:'Подсчёт',
      generate:()=>{const n=randInt(4,8);const v=randInt(0,1);
        if(v===0)return{text:`Сколько пар из ${n} человек?`,answer:n*(n-1)/2,hint:'n(n−1)/2',solution:`<b>${n*(n-1)/2}</b>.`};
        return{text:`$\\frac{${n}!}{(${n-1})!}=?$`,answer:n,hint:'n!',solution:`<b>${n}</b>.`}}}
  ]
},

'9.5':{
  title:'Основы вероятности',
  context:'Вероятность — числовая мера случайности: от 0 (невозможно) до 1 (наверняка).',
  theory:[
    {icon:'🍀',title:'Классическая формула',html:`
      <div class="formula-block">$P=\\frac{m}{n}$</div>
      <p>m — благоприятные исходы, n — все равновозможные.</p>`}
  ],
  examples:[
    {title:'Кубик: чётное',steps:[
      {text:'Чётных 3 из 6.',rule:'m/n'},
      {text:'$P=0,5$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'🍀',name:'Вероятность',
      generate:()=>{const n=[4,6,8,10][randInt(0,3)],m=randInt(1,n);return{m,n,ans:fracForms(m,n)}},
      template:(o)=>({text:`${o.n} шаров, ${o.m} красных. P(красный)?`,answer:o.ans,hint:'m/n',solution:`<b>${o.ans[0]}</b>.`})}
  ]
},

'9.6':{
  title:'Текстовые задачи',
  context:'Задачи на движение, работу и проценты решаются по одной схеме: перевести текст на язык уравнений.',
  theory:[
    {icon:'🚗',title:'Движение и работа',html:`
      <div class="formula-block">$S=v\\cdot t\\qquad A=p\\cdot t$</div>
      <p>Составь таблицу (скорость, время, путь) и запиши уравнение.</p>`}
  ],
  examples:[
    {title:'60 км/ч, 2 ч',steps:[
      {text:'$S=60\\cdot2=120$ км.',rule:'S=vt'}
    ]}
  ],
  taskTypes:[
    {icon:'🚗',name:'Движение',
      generate:()=>{const v=randInt(40,90),t=randInt(2,5);return{v,t,r:v*t}},
      template:(o)=>({text:`v=${o.v} км/ч, t=${o.t} ч. Путь?`,answer:o.r,hint:'S=vt',solution:`<b>${o.r}</b> км.`})}
  ]
},

/* ================= 10 КЛАСС ================= */

'10.1':{
  title:'Тригонометрия: круг и значения',
  context:'Тригонометрия связывает углы и числа. Поворот на единичной окружности — и угол становится числом (радианами).',
  theory:[
    {icon:'🌀',title:'Градусы ↔ радианы',html:`
      <p>$\\pi$ рад $=180°$. $30°=\\pi/6$, $45°=\\pi/4$, $60°=\\pi/3$, $90°=\\pi/2$.</p>`},
    {icon:'📊',title:'Таблица значений',html:`
      <div class="highlight-box">sin30=½, cos60=½, sin45=√2/2, cos45=√2/2, sin60=√3/2, tg45=1.</div>`}
  ],
  examples:[
    {title:'π/3 в градусах',steps:[
      {text:'$180/3=60°$.',rule:'π=180°'}
    ]}
  ],
  taskTypes:[
    factsTT('Значения','🌀',[
      {q:'π/6 в градусах?',a:['30'],h:'180/6'},
      {q:'π/2 в градусах?',a:['90'],h:'180/2'},
      {q:'sin 30°?',a:['0.5','0,5','1/2'],h:'½'},
      {q:'cos 60°?',a:['0.5','0,5','1/2'],h:'½'},
      {q:'tg 45°?',a:['1'],h:'1'}
    ])
  ]
},

'10.2':{
  title:'Тригонометрические тождества',
  context:'Главное тождество sin²+cos²=1 — это теорема Пифагора в тригонометрии: точка на единичной окружности.',
  theory:[
    {icon:'🟰',title:'Тождества',html:`
      <div class="formula-block">$\\sin^2\\alpha+\\cos^2\\alpha=1$</div>
      <div class="formula-block">$\\tan\\alpha=\\frac{\\sin\\alpha}{\\cos\\alpha}$</div>`}
  ],
  examples:[
    {title:'sin=0,6 → cos²',steps:[
      {text:'$1-0,36=0,64$.',rule:'Тождество'},
      {text:'cos=0,8.',rule:'√'}
    ]}
  ],
  taskTypes:[
    {icon:'🟰',name:'Тождества',
      generate:()=>{const p=[[0.6,0.8],[0.8,0.6]][randInt(0,1)];return{s:p[0]}},
      template:(o)=>({text:`sin α=${o.s}. cos² α?`,answer:Math.round((1-o.s*o.s)*100)/100,hint:'1−sin²',solution:`<b>${Math.round((1-o.s*o.s)*100)/100}</b>.`})}
  ]
},

'10.3':{
  title:'Простейшие триг. уравнения',
  context:'sin x=a и cos x=a имеют бесконечно много решений — они повторяются с периодом, поэтому ответ записывается серией с πk.',
  theory:[
    {icon:'🌊',title:'Серии решений',html:`
      <p>sin x=0 → $x=\\pi k$; cos x=1 → $x=2\\pi k$; cos x=0 → $x=\\pi/2+\\pi k$.</p>`}
  ],
  examples:[
    {title:'cos x=1',steps:[
      {text:'$x=2\\pi k$.',rule:'Серия'}
    ]}
  ],
  taskTypes:[
    factsTT('Уравнения','🌊',[
      {q:'sin x=0 → x=π·?',a:['k','πk','пиk'],h:'πk'},
      {q:'cos x=1 → x=2π·?',a:['k','πk','2πk'],h:'2πk'},
      {q:'Наименьший положительный корень sin x=1 (в градусах)?',a:['90'],h:'90°'}
    ])
  ]
},

'10.4':{
  title:'Производная',
  context:'Производная — мгновенная скорость изменения функции. Геометрически — наклон графика.',
  theory:[
    {icon:'',title:'Правила дифференцирования',html:`
      <div class="formula-block">$(x^n)'=n x^{n-1}\\quad (C)'=0\\quad (Cu)'=Cu'$</div>`}
  ],
  examples:[
    {title:'(x³)′',steps:[
      {text:'$3x^2$.',rule:'Правило'}
    ]}
  ],
  taskTypes:[
    {icon:'',name:'Производные',
      generate:()=>{const n=randInt(2,6),c=randInt(2,5);const v=randInt(0,1);
        if(v===0)return{text:`$(x^{${n}})'=?x^{${n-1}}$ — коэффициент?`,answer:n,hint:'n',solution:`<b>${n}</b>.`};
        return{text:`$(${c}x^2)'$ при x=1?`,answer:2*c,hint:'2cx',solution:`<b>${2*c}</b>.`}}}
  ]
},

'10.5':{
  title:'Касательная и смысл производной',
  context:'f′(x₀) — угловой коэффициент касательной к графику в точке x₀.',
  theory:[
    {icon:'📏',title:'Смысл',html:`
      <p>$k=f'(x_0)$. Для $y=x^2$: $y'=2x$, в $x_0=3$ → $k=6$.</p>`}
  ],
  examples:[
    {title:'y=x², x₀=4',steps:[
      {text:'$y`=2x\\Rightarrow k=8$.',rule:'Подстановка'}
    ]}
  ],
  taskTypes:[
    {icon:'📏',name:'Касательная',
      generate:()=>{const x0=randInt(2,7);return{x0,r:2*x0}},
      template:(o)=>({text:`y=x². k касательной в x₀=${o.x0}?`,answer:o.r,hint:'2x₀',solution:`<b>${o.r}</b>.`})}
  ]
},

'10.6':{
  title:'Экстремумы функций',
  context:'В точке максимума/минимума производная равна нулю — график «разворачивается».',
  theory:[
    {icon:'⛰️',title:'Минимум параболы',html:`
      <p>$y=x^2+bx+c$: минимум в $x_0=-b/2$.</p>`}
  ],
  examples:[
    {title:'y=x²−4x+5',steps:[
      {text:'$x_0=2$.',rule:'−b/2'},
      {text:'$y_0=1$ — минимум.',rule:'Значение'}
    ]}
  ],
  taskTypes:[
    {icon:'⛰️',name:'Экстремумы',
      generate:()=>{const x0=randInt(-5,5);const b=-2*x0;return{x0,b}},
      template:(o)=>({text:`y=x^2${o.b>=0?'+':'-'}${Math.abs(o.b)}x+1: точка минимума x₀?`,answer:o.x0,hint:'−b/2',solution:`<b>${o.x0}</b>.`})}
  ]
},

/* ================= 11 КЛАСС ================= */

'11.1':{
  title:'Первообразная',
  context:'Первообразная — «обратная производная»: F′=f. Это открывает путь к площадям и интегралам.',
  theory:[
    {icon:'∫',title:'Правило',html:`
      <div class="formula-block">$\\int x^n dx=\\frac{x^{n+1}}{n+1}+C$</div>`}
  ],
  examples:[
    {title:'∫x²dx',steps:[
      {text:'$\\frac{x^3}{3}+C$.',rule:'Правило'}
    ]}
  ],
  taskTypes:[
    {icon:'∫',name:'Первообразные',
      generate:()=>{const n=randInt(1,4);return{n,r:n+1}},
      template:(o)=>({text:`$\\int x^{${o.n}}dx$: степень при x?`,answer:o.r,hint:'n+1',solution:`<b>${o.r}</b>.`})}
  ]
},

'11.2':{
  title:'Определённый интеграл и площади',
  context:'Формула Ньютона–Лейбница: интеграл = разность первообразных на концах. Это площадь под графиком.',
  theory:[
    {icon:'🟦',title:'Ньютон–Лейбниц',html:`
      <div class="formula-block">$\\int_a^b f(x)dx=F(b)-F(a)$</div>`}
  ],
  examples:[
    {title:'∫₀¹ 2x dx',steps:[
      {text:'$F=x^2$; $1-0=1$.',rule:'Формула'}
    ]}
  ],
  taskTypes:[
    {icon:'🟦',name:'Интегралы',
      generate:()=>{const n=randInt(1,3);return{n,ans:fr(1,n+1)}},
      template:(o)=>({text:`$\\int_0^1 x^{${o.n}}dx=?$`,answer:o.ans,hint:'1/(n+1)',solution:`<b>${o.ans[0]}</b>.`})}
  ]
},

'11.3':{
  title:'Показательные уравнения',
  context:'Уравнения, где неизвестное в показателе. Главный приём — привести обе части к одному основанию.',
  theory:[
    {icon:'📈',title:'Метод',html:`
      <p>$2^x=8\\Rightarrow2^x=2^3\\Rightarrow x=3$. Основания равны → показатели равны.</p>`}
  ],
  examples:[
    {title:'3ˣ=81',steps:[
      {text:'$81=3^4\\Rightarrow x=4$.',rule:'Основание 3'}
    ]}
  ],
  taskTypes:[
    {icon:'📈',name:'Реши',
      generate:()=>{const a=[2,3,5][randInt(0,2)],n=randInt(2,5);return{a,n,N:Math.pow(a,n)}},
      template:(o)=>({text:`$${o.a}^x=${o.N}$`,answer:o.n,hint:o.a+' в какой степени?',solution:`<b>${o.n}</b>.`})}
  ]
},

'11.4':{
  title:'Логарифмы',
  context:'Логарифм отвечает на вопрос: «в какую степень возвести основание, чтобы получить число?».',
  theory:[
    {icon:'🔢',title:'Свойства',html:`
      <div class="formula-block">$\\log_a a^n=n\\quad \\log_a(bc)=\\log_a b+\\log_a c$</div>`}
  ],
  examples:[
    {title:'log₂ 32',steps:[
      {text:'$32=2^5\\Rightarrow5$.',rule:'Степень'}
    ]}
  ],
  taskTypes:[
    {icon:'🔢',name:'Вычисли',
      generate:()=>{const a=[2,3,5][randInt(0,2)],n=randInt(2,5);return{a,n,N:Math.pow(a,n)}},
      template:(o)=>({text:`$\\log_{${o.a}}${o.N}=?$`,answer:o.n,hint:o.a+'ⁿ='+o.N,solution:`<b>${o.n}</b>.`})}
  ]
},

'11.5':{
  title:'Уравнения: повторение к экзамену',
  context:'Блиц по всем типам уравнений — квадратные, дробные, биквадратные, показательные, логарифмические.',
  theory:[
    {icon:'🎯',title:'Чек-лист',html:`
      <ul><li>Квадратные: D и Виет</li><li>Дробные: ОДЗ</li><li>Биквадратные: замена t=x²</li><li>Показательные/логарифмические: одно основание</li></ul>`}
  ],
  examples:[
    {title:'Стратегия',steps:[
      {text:'Определи тип уравнения.',rule:'1'},
      {text:'Примени свой метод.',rule:'2'},
      {text:'Проверь ОДЗ и корни.',rule:'3'}
    ]}
  ],
  taskTypes:[
    factsTT('Блиц','⚡',[
      {q:'$x^2-9=0$, больший корень?',a:['3'],h:'√9'},
      {q:'$x^2-7x+12=0$, больший корень?',a:['4'],h:'3 и 4'},
      {q:'$2^x=32$?',a:['5'],h:'2⁵'},
      {q:'$\\log_3 27$?',a:['3'],h:'3³'},
      {q:'D у $x^2+2x+1=0$?',a:['0'],h:'Полный квадрат'}
    ])
  ]
},

'11.6':{
  title:'Неравенства: повторение к экзамену',
  context:'Метод интервалов — универсальный инструмент для неравенств любой сложности.',
  theory:[
    {icon:'⚖️',title:'Метод интервалов',html:`
      <p>Отметь корни на прямой, расставь знаки, чередуя, и выбери промежутки с нужным знаком.</p>`}
  ],
  examples:[
    {title:'(x−1)(x−4)>0',steps:[
      {text:'Корни 1 и 4.',rule:'Нули'},
      {text:'«>0» — снаружи.',rule:'Знаки'},
      {text:'$x<1$ или $x>4$.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'⚖️',name:'Интервалы',
      generate:()=>{const a=randInt(-7,3),b=a+randInt(2,8);return{a,b,len:b-a}},
      template:(o)=>({text:`$(x${o.a>=0?'-':'+'}${Math.abs(o.a)})(x${o.b>=0?'-':'+'}${Math.abs(o.b)})<0$. Длина решения?`,answer:o.len,hint:'(a;b)',solution:`<b>${o.len}</b>.`})}
  ]
}

};