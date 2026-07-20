// physics-lessons.js — All physics lessons grades 7–8
const LESSONS = {};

// ==================== GRADE 7 ====================

LESSONS['7.1'] = {
  title: 'Механическое движение. Скорость',
  context: 'Механическое движение — изменение положения тела относительно других тел со временем. Скорость — мера быстроты этого изменения.',
  theory: [
    { icon: '🏃', title: 'Механическое движение', html: '<p><strong>Механическое движение</strong> — изменение положения тела в пространстве относительно других тел с течением времени.</p><p>Тело, относительно которого изучают движение, называется <strong>телом отсчёта</strong>.</p><div class="highlight-box"><strong>Путь</strong> $s$ — длина траектории. <strong>Перемещение</strong> $\\Delta x$ — вектор от начальной к конечной точке.</div>' },
    { icon: '📐', title: 'Средняя скорость', html: '<div class="formula-block">$v = \\frac{s}{t}$</div><p>$v$ — скорость (м/с), $s$ — путь (м), $t$ — время (с).</p><div class="highlight-box green"><strong>Единицы:</strong> 1 м/с = 3.6 км/ч</div>' },
    { icon: '📏', title: 'Равномерное движение', html: '<p>При <strong>равномерном</strong> движении скорость постоянна:</p><div class="formula-block">$s = vt$</div>' }
  ],
  examples: [
    { title: 'Пример 1: Средняя скорость', steps: [
      { text: 'Автомобиль проехал $s = 120$ км за $t = 2$ ч.', rule: '' },
      { text: '$v = \\frac{120}{2} = 60$ км/ч', rule: 'Формула скорости' },
      { text: '$v = \\frac{60}{3.6} \\approx 16.67$ м/с', rule: 'Перевод в м/с' }
    ]},
    { title: 'Пример 2: Путь', steps: [
      { text: 'Скорость $v = 20$ м/с, время $t = 5$ с.', rule: '' },
      { text: '$s = vt = 20 \\cdot 5 = 100$ м', rule: 'Равномерное движение' }
    ]}
  ],
  taskTypes: [
    { name: 'Скорость', icon: '🏃',
      generate(){const s=randInt(20,200),t=randInt(2,10);return{s,t,v:round2(s/t)}},
      template(s,t,v){return{text:`Путь $s = ${s}$ м, время $t = ${t}$ с. Средняя скорость $v$? (м/с, округлите до сотых)`,answer:v,hint:`$v = \\frac{s}{t} = \\frac{${s}}{${t}}$`,solution:`$v = \\frac{${s}}{${t}} = ${v}$ м/с`}},
    },
    { name: 'Путь', icon: '📏',
      generate(){const v=randInt(5,30),t=randInt(2,12);return{v,t,s:v*t}},
      template(v,t,s){return{text:`Скорость $v = ${v}$ м/с, время $t = ${t}$ с. Путь $s$?`,answer:s,hint:`$s = v \\cdot t = ${v} \\cdot ${t}$`,solution:`$s = ${v} \\cdot ${t} = ${s}$ м`}},
    },
    { name: 'Время', icon: '⏱️',
      generate(){const s=randInt(50,500),v=randInt(5,30);return{s,v,t:round2(s/v)}},
      template(s,v,t){return{text:`Путь $s = ${s}$ м, скорость $v = ${v}$ м/с. Время $t$? (секунды, округлите до сотых)`,answer:t,hint:`$t = \\frac{s}{v} = \\frac{${s}}{${v}}$`,solution:`$t = \\frac{${s}}{${v}} = ${t}$ с`}},
    },
    { name: 'Единицы', icon: '🔄',
      generate(){const vals=[{v:10,ans:'36'},{v:20,ans:'72'},{v:30,ans:'108'},{v:15,ans:'54'},{v:25,ans:'90'}];const c=vals[randInt(0,4)];return{...c}},
      template(v,ans){return{text:`Переведите $v = ${v}$ м/с в км/ч.`,answer:ans,hint:`Умножьте на 3.6`,solution:`${v} \\cdot 3.6 = ${ans}$ км/ч`}},
    }
  ]
};

LESSONS['7.2'] = {
  title: 'Ускорение. Равноускоренное движение',
  context: 'Ускорение — скорость изменения скорости. Автомобиль при разгоне, тормозящий поезд — всё движется с ускорением.',
  theory: [
    { icon: '📈', title: 'Ускорение', html: '<div class="formula-block">$a = \\frac{\\Delta v}{t} = \\frac{v - v_0}{t}$</div><p>$a$ — ускорение (м/с²), $v_0$ — начальная скорость, $v$ — конечная.</p>' },
    { icon: '📐', title: 'Скорость при равном ускорении', html: '<div class="formula-block">$v = v_0 + at$</div>' },
    { icon: '📏', title: 'Путь при равном ускорении', html: '<div class="formula-block">$s = v_0 t + \\frac{at^2}{2}$</div><div class="formula-block">$s = \\frac{v_0 + v}{2} \\cdot t$</div>' },
    { icon: '🔗', title: 'Связь без времени', html: '<div class="formula-block">$v^2 = v_0^2 + 2as$</div>' }
  ],
  examples: [
    { title: 'Пример: Ускорение', steps: [
      { text: 'Автомобиль разгоняется с $v_0 = 0$ до $v = 20$ м/с за $t = 10$ с.', rule: '' },
      { text: '$a = \\frac{20 - 0}{10} = 2$ м/с²', rule: 'Формула ускорения' }
    ]},
    { title: 'Пример: Путь', steps: [
      { text: '$v_0 = 10$ м/с, $a = 2$ м/с², $t = 5$ с.', rule: '' },
      { text: '$s = 10 \\cdot 5 + \\frac{2 \\cdot 25}{2} = 50 + 25 = 75$ м', rule: 'Формула пути' }
    ]}
  ],
  taskTypes: [
    { name: 'Ускорение', icon: '📈',
      generate(){const v0=randInt(0,10),v=v0+randInt(2,15),t=randInt(2,8);return{v0,v,t,a:round2((v-v0)/t)}},
      template(v0,v,t,a){return{text:`$v_0 = ${v0}$ м/с, $v = ${v}$ м/с, $t = ${t}$ с. Ускорение $a$? (м/с², округлите до сотых)`,answer:a,hint:`$a = \\frac{v - v_0}{t} = \\frac{${v} - ${v0}}{${t}}$`,solution:`$a = \\frac{${v-v0}}{${t}} = ${a}$ м/с²`}},
    },
    { name: 'Путь', icon: '📏',
      generate(){const v0=randInt(0,10),a=randInt(1,5),t=randInt(2,8);return{v0,a,t,s:round2(v0*t+a*t*t/2)}},
      template(v0,a,t,s){return{text:`$v_0 = ${v0}$ м/с, $a = ${a}$ м/с², $t = ${t}$ с. Путь $s$? (м, округлите до сотых)`,answer:s,hint:`$s = v_0 t + \\frac{at^2}{2} = ${v0}\\cdot${t}+\\frac{${a}\\cdot${t}^2}{2}$`,solution:`$s = ${v0*t}+\\frac{${a*t*t}}{2} = ${s}$ м`}},
    },
    { name: 'Конечная скорость', icon: '🚀',
      generate(){const v0=randInt(0,5),a=randInt(1,6),t=randInt(2,8);return{v0,a,t,v:v0+a*t}},
      template(v0,a,t,v){return{text:`$v_0 = ${v0}$ м/с, $a = ${a}$ м/с², $t = ${t}$ с. Конечная скорость $v$?`,answer:v,hint:`$v = v_0 + at = ${v0}+${a}\\cdot${t}$`,solution:`$v = ${v0}+${a*t} = ${v}$ м/с`}},
    }
  ]
};

LESSONS['7.3'] = {
  title: 'Свободное падение',
  context: 'Свободное падение — движение тела под действием силы тяжести. Все тела падают с одинаковым ускорением $g = 9.8$ м/с².',
  theory: [
    { icon: '🍎', title: 'Ускорение свободного падения', html: '<div class="formula-block">$g \\approx 9.8$ м/с²</div><p>Все тела near Земли падают с одинаковым ускорением (если пренебречь сопротивлением воздуха).</p>' },
    { icon: '📐', title: 'Формулы', html: '<div class="formula-block">$v = gt$</div><div class="formula-block">$h = \\frac{gt^2}{2}$</div><div class="formula-block">$v^2 = 2gh$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Тело брошено вниз со скоростью $v_0 = 5$ м/с с высоты $h = 20$ м.', rule: '' },
      { text: '$v^2 = v_0^2 + 2gh = 25 + 2 \\cdot 9.8 \\cdot 20 = 417$', rule: 'Формула' },
      { text: '$v = \\sqrt{417} \\approx 20.42$ м/с', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Скорость падения', icon: '🍎',
      generate(){const t=randInt(1,6);return{t,v:round2(9.8*t)}},
      template(t,v){return{text:`Тело падает свободно $t = ${t}$ с. Скорость $v$? (м/с, округлите до сотых)`,answer:v,hint:`$v = gt = 9.8 \\cdot ${t}$`,solution:`$v = 9.8 \\cdot ${t} = ${v}$ м/с`}},
    },
    { name: 'Высота', icon: '📏',
      generate(){const t=randInt(1,6);return{t,h:round2(4.9*t*t)}},
      template(t,h){return{text:`Свободное падение $t = ${t}$ с. Высота $h$? (м, округлите до сотых)`,answer:h,hint:`$h = \\frac{gt^2}{2} = \\frac{9.8 \\cdot ${t}^2}{2}$`,solution:`$h = \\frac{9.8 \\cdot ${t*t}}{2} = ${h}$ м`}},
    },
    { name: 'Время падения', icon: '⏱️',
      generate(){const h=randInt(5,100);return{h,t:round2(Math.sqrt(2*h/9.8))}},
      template(h,t){return{text:`Высота $h = ${h}$ м. Время свободного падения $t$? (с, округлите до сотых)`,answer:t,hint:`$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\cdot ${h}}{9.8}}$`,solution:`$t = \\sqrt{\\frac{${2*h}}{9.8}} = ${t}$ с`}},
    }
  ]
};

LESSONS['7.4'] = {
  title: 'Сила. Ньютон',
  context: 'Сила — причина изменения скорости тела. Законы Ньютона — основа механики.',
  theory: [
    { icon: '💪', title: 'Определение силы', html: '<p><strong>Сила</strong> — величина, характеризующая действие на тело, способная изменить скорость.</p><p>Единица: <strong>ньютон</strong> (Н).</p><div class="formula-block">$F = ma$</div><p>1 Н — сила, сообщающая телу массой 1 кг ускорение 1 м/с².</p>' },
    { icon: '📐', title: 'Виды сил', html: '<ul><li><strong>Сила тяжести:</strong> $F_{\\text{т}} = mg$</li><li><strong>Сила упругости:</strong> $F_{\\text{уп}} = kx$ (закон Гука)</li><li><strong>Сила трения:</strong> $F_{\\text{тр}} = \\mu N$</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Тело массой $m = 5$ кг движется с ускорением $a = 3$ м/с².', rule: '' },
      { text: '$F = ma = 5 \\cdot 3 = 15$ Н', rule: 'Второй закон Ньютона' }
    ]}
  ],
  taskTypes: [
    { name: 'Сила', icon: '💪',
      generate(){const m=randInt(1,20),a=randInt(1,10);return{m,a,f:m*a}},
      template(m,a,f){return{text:`$m = ${m}$ кг, $a = ${a}$ м/с². Сила $F$?`,answer:f,hint:`$F = ma = ${m} \\cdot ${a}$`,solution:`$F = ${m} \\cdot ${a} = ${f}$ Н`}},
    },
    { name: 'Масса', icon: '⚖️',
      generate(){const f=randInt(5,100),a=randInt(1,10);return{f,a,m:round2(f/a)}},
      template(f,a,m){return{text:`$F = ${f}$ Н, $a = ${a}$ м/с². Масса $m$? (кг, округлите до сотых)`,answer:m,hint:`$m = \\frac{F}{a} = \\frac{${f}}{${a}}$`,solution:`$m = ${m}$ кг`}},
    },
    { name: 'Вес тела', icon: '🍎',
      generate(){const m=randInt(1,50);return{m,g:round2(m*9.8)}},
      template(m,g){return{text:`$m = ${m}$ кг. Вес тела $F_{\\text{т}}$? (Н, округлите до сотых)`,answer:g,hint:`$F_{\\text{т}} = mg = ${m} \\cdot 9.8$`,solution:`$F_{\\text{т}} = ${m} \\cdot 9.8 = ${g}$ Н`}},
    }
  ]
};

LESSONS['7.5'] = {
  title: 'Второй и третий законы Ньютона',
  context: 'Второй закон связывает силу, массу и ускорение. Третий закон объясняет взаимодействие тел.',
  theory: [
    { icon: '⚖️', title: 'Второй закон', html: '<div class="formula-block">$F = ma$</div><p>Ускорение тела прямо пропорционально действующей на него силе и обратно пропорционально массе.</p>' },
    { icon: '🔄', title: 'Третий закон', html: '<p><strong>Сила действия</strong> равна по модулю и противоположна по направлению <strong>силе противодействия</strong>:</p><div class="formula-block">$F_{12} = -F_{21}$</div><div class="highlight-box green">Силы приложены к разным телам!</div>' },
    { icon: '📐', title: 'Система тел', html: '<p>Для системы тел: $F_{\\text{внеш}} = Ma$, где $M$ — суммарная масса.</p>' }
  ],
  examples: [
    { title: 'Пример: Сила трения', steps: [
      { text: 'Тело $m = 10$ кг тянут с силой $F = 50$ Н. Трение $F_{\\text{тр}} = 10$ Н.', rule: '' },
      { text: '$F_{\\text{сум}} = 50 - 10 = 40$ Н', rule: 'Равнодействующая' },
      { text: '$a = \\frac{F_{\\text{сум}}}{m} = \\frac{40}{10} = 4$ м/с²', rule: 'Второй закон' }
    ]}
  ],
  taskTypes: [
    { name: 'Равнодействующая', icon: '⚖️',
      generate(){const f1=randInt(10,50),f2=randInt(5,f1-1),m=randInt(2,20);return{f1,f2,m,a:round2((f1-f2)/m)}},
      template(f1,f2,m,a){return{text:`$F_1 = ${f1}$ Н, $F_2 = ${f2}$ Н (направлены противоположно). $m = ${m}$ кг. Ускорение $a$?`,answer:a,hint:`$F_{\\text{сум}} = ${f1}-${f2} = ${f1-f2}$ Н, $a = \\frac{${f1-f2}}{${m}}$`,solution:`$a = ${a}$ м/с²`}},
    },
    { name: 'Третий закон', icon: '🔄',
      generate(){const f=randInt(5,100);return{f}},
      template(f){return{text:`Человек толкает стену с силой $${f}$ Н. С какой силой стена действует на человека?`,answer:f,hint:'Третий закон Ньютона: сила действия = сила противодействия',solution:`$F = ${f}$ Н (направлена от стены)`}},
    }
  ]
};

LESSONS['7.6'] = {
  title: 'Закон всемирного тяготения',
  context: 'Ньютон открыл, что все тела притягиваются друг к другу с силой, пропорциональной массам и обратно пропорциональной квадрату расстояния.',
  theory: [
    { icon: '🌍', title: 'Закон', html: '<div class="formula-block">$F = G\\frac{m_1 m_2}{r^2}$</div><p>$G = 6.67 \\times 10^{-11}$ Н·м²/кг² — гравитационная постоянная.</p><p>$r$ — расстояние между центрами масс.</p>' },
    { icon: '📐', title: 'Связь с весом', html: '<div class="formula-block">$mg = G\\frac{Mm}{R^2} \\Rightarrow g = \\frac{GM}{R^2}$</div><p>$M$ — масса Земли, $R$ — радиус Земли.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$m_1 = 600$ кг, $m_2 = 400$ кг, $r = 2$ м.', rule: '' },
      { text: '$F = 6.67 \\times 10^{-11} \\cdot \\frac{600 \\cdot 400}{4} = 4 \\times 10^{-6}$ Н', rule: 'Очень мала!' }
    ]}
  ],
  taskTypes: [
    { name: 'Сила тяготения', icon: '🌍',
      generate(){const m1=randInt(1,10)*100,m2=randInt(1,10)*100,r=randInt(1,5);const f=round2(6.67e-11*m1*m2/(r*r));return{m1,m2,r,f}},
      template(m1,m2,r,f){return{text:`$m_1=${m1}$ кг, $m_2=${m2}$ кг, $r=${r}$ м. $F$? (Н, в формате a*10^-n)`,answer:f,hint:'$F = G \\cdot \\frac{m_1 m_2}{r^2}$',solution:`$F \\approx ${f}$ Н`}},
    },
    { name: 'Масса по $g$', icon: '📐',
      generate(){const M=randInt(5,10),R=randInt(6,7);const g=round2(6.67e-11*M*1e24/((R*1e6)*(R*1e6)));return{M,R,g}},
      template(M,R,g){return{text:`$M = ${M}\\times10^{24}$ кг, $R = ${R}\\times10^6$ м. Найдите $g$.`,answer:g,hint:'$g = \\frac{GM}{R^2}$',solution:`$g \\approx ${g}$ м/с²`}},
    }
  ]
};

LESSONS['7.7'] = {
  title: 'Импульс. Закон сохранения',
  context: 'Импульс — мера «количества движения». Закон сохранения импульса объясняет толчки, взрывы и реактивное движение.',
  theory: [
    { icon: '💥', title: 'Импульс', html: '<div class="formula-block">$p = mv$</div><p>$p$ — импульс (кг·м/с), $m$ — масса, $v$ — скорость.</p>' },
    { icon: '📐', title: 'Сила и импульс', html: '<div class="formula-block">$F = \\frac{\\Delta p}{\\Delta t}$</div><p>Сила равна скорости изменения импульса.</p>' },
    { icon: '⚖️', title: 'Закон сохранения импульса', html: '<div class="formula-block">$\\sum p_{\\text{до}} = \\sum p_{\\text{после}}$</div><div class="highlight-box green">Если нет внешних сил, суммарный импульс системы постоянен.</div>' }
  ],
  examples: [
    { title: 'Пример: Столкновение', steps: [
      { text: 'Шар $m_1 = 2$ кг, $v_1 = 5$ м/с. Шар $m_2 = 3$ кг, $v_2 = 0$. Столкнулись и движутся вместе.', rule: '' },
      { text: '$2 \\cdot 5 + 3 \\cdot 0 = (2+3) \\cdot v$', rule: 'Сохранение импульса' },
      { text: '$v = \\frac{10}{5} = 2$ м/с', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Импульс', icon: '💥',
      generate(){const m=randInt(1,20),v=randInt(1,15);return{m,p:m*v}},
      template(m,p){return{text:`$m = ${m}$ кг, $v = ${v}$ м/с. Импульс $p$?`,answer:p,hint:`$p = mv = ${m} \\cdot ${v}$`,solution:`$p = ${p}$ кг·м/с`}},
    },
    { name: 'ЗСИ', icon: '⚖️',
      generate(){const m1=randInt(1,5),v1=randInt(2,10),m2=randInt(1,5);const v=(m1*v1)/(m1+m2);return{m1,v1,m2,v:round2(v)}},
      template(m1,v1,m2,v){return{text:`$m_1=${m1}$ кг, $v_1=${v1}$ м/с. $m_2=${m2}$ кг, $v_2=0$. Столкнулись. Общая скорость?`,answer:v,hint:`$v = \\frac{m_1 v_1}{m_1+m_2}$`,solution:`$v = \\frac{${m1*v1}}{${m1+m2}} = ${v}$ м/с`}},
    },
    { name: 'Сила', icon: '📐',
      generate(){const dp=randInt(5,30),dt=randInt(1,5);return{dp,dt,f:round2(dp/dt)}},
      template(dp,dt,f){return{text:`$\\Delta p = ${dp}$ кг·м/с за $\\Delta t = ${dt}$ с. Сила $F$?`,answer:f,hint:`$F = \\frac{\\Delta p}{\\Delta t} = \\frac{${dp}}{${dt}}$`,solution:`$F = ${f}$ Н`}},
    }
  ]
};

LESSONS['7.8'] = {
  title: 'Работа и мощность',
  context: 'Работа — мера изменения энергии при перемещении тела под действием силы. Мощность — быстрота совершения работы.',
  theory: [
    { icon: '⚡', title: 'Работа', html: '<div class="formula-block">$A = Fs \\cos\\alpha$</div><p>$A$ — работа (Дж), $F$ — сила, $s$ — перемещение, $\\alpha$ — угол между силой и перемещением.</p><div class="highlight-box"><strong>Если $\\alpha = 0°$:</strong> $A = Fs$</div>' },
    { icon: '📐', title: 'Мощность', html: '<div class="formula-block">$N = \\frac{A}{t}$</div><p>$N$ — мощность (Вт), $A$ — работа, $t$ — время.</p><div class="formula-block">$N = Fv$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Сила $F = 50$ Н, путь $s = 10$ м, направление силы совпадает с перемещением.', rule: '' },
      { text: '$A = 50 \\cdot 10 = 500$ Дж', rule: 'Работа' },
      { text: 'Время $t = 10$ с. $N = \\frac{500}{10} = 50$ Вт', rule: 'Мощность' }
    ]}
  ],
  taskTypes: [
    { name: 'Работа', icon: '⚡',
      generate(){const f=randInt(5,50),s=randInt(2,20);return{f,s,a:f*s}},
      template(f,s,a){return{text:`$F = ${f}$ Н, $s = ${s}$ м. Работа $A$? (Дж)`,answer:a,hint:`$A = Fs = ${f} \\cdot ${s}$`,solution:`$A = ${a}$ Дж`}},
    },
    { name: 'Мощность', icon: '📐',
      generate(){const a=randInt(50,500),t=randInt(2,15);return{a,t,n:round2(a/t)}},
      template(a,t,n){return{text:`$A = ${a}$ Дж, $t = ${t}$ с. Мощность $N$? (Вт, округлите до сотых)`,answer:n,hint:`$N = \\frac{A}{t} = \\frac{${a}}{${t}}$`,solution:`$N = ${n}$ Вт`}},
    }
  ]
};

LESSONS['7.9'] = {
  title: 'Кинетическая и потенциальная энергия',
  context: 'Энергия — универсальная мера движения материи. Кинетическая — энергия движения, потенциальная — энергия положения.',
  theory: [
    { icon: '🔋', title: 'Кинетическая энергия', html: '<div class="formula-block">$E_k = \\frac{mv^2}{2}$</div><p>Энергия, обусловленная движением тела.</p>' },
    { icon: '📐', title: 'Потенциальная энергия', html: '<div class="formula-block">$E_p = mgh$</div><p>Энергия положения тела в поле тяжести.</p>' },
    { icon: '⚖️', title: 'Закон сохранения энергии', html: '<div class="formula-block">$E_k + E_p = \\text{const}$</div><div class="highlight-box green">Полная механическая энергия сохраняется, если действуют только консервативные силы.</div>' }
  ],
  examples: [
    { title: 'Пример: Падение', steps: [
      { text: 'Тело массой $m = 2$ кг бросили с высоты $h = 10$ м. Найдите скорость у земли.', rule: '' },
      { text: '$mgh = \\frac{mv^2}{2} \\Rightarrow v = \\sqrt{2gh}$', rule: 'Сохранение энергии' },
      { text: '$v = \\sqrt{2 \\cdot 9.8 \\cdot 10} = \\sqrt{196} = 14$ м/с', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Кинетическая', icon: '🔋',
      generate(){const m=randInt(1,20),v=randInt(1,15);return{m,v,ek:round2(m*v*v/2)}},
      template(m,v,ek){return{text:`$m = ${m}$ кг, $v = ${v}$ м/с. $E_k$? (Дж, округлите до сотых)`,answer:ek,hint:`$E_k = \\frac{${m} \\cdot ${v}^2}{2}$`,solution:`$E_k = \\frac{${m*v*v}}{2} = ${ek}$ Дж`}},
    },
    { name: 'Потенциальная', icon: '📐',
      generate(){const m=randInt(1,30),h=randInt(2,20);return{m,h,ep:round2(m*9.8*h)}},
      template(m,h,ep){return{text:`$m = ${m}$ кг, $h = ${h}$ м. $E_p$? (Дж, $g=9.8$)`,answer:ep,hint:`$E_p = mgh = ${m} \\cdot 9.8 \\cdot ${h}$`,solution:`$E_p = ${ep}$ Дж`}},
    }
  ]
};

LESSONS['7.10'] = {
  title: 'Простые механизмы',
  context: 'Простые механизмы позволяют уменьшить необходимую силу ценой увеличения пути.',
  theory: [
    { icon: '⚙️', title: 'Простые механизмы', html: '<ul><li><strong>Рычаг:</strong> $F_1 l_1 = F_2 l_2$</li><li><strong>Наклонная плоскость:</strong> $F = \\frac{Gh}{l}$</li><li><strong>Блок:</strong> изменяет направление силы (подвижный — уменьшает в 2 раза)</li></ul>' },
    { icon: '📐', title: 'КПД', html: '<div class="formula-block">$\\eta = \\frac{A_{\\text{пол}}}{A_{\\text{полн}}} \\cdot 100\\%$</div><div class="highlight-box"><strong>Для идеальных механизмов:</strong> $\\eta = 100\\%$, но в реальности $\\eta < 100\\%$ из-за трения.</div>' }
  ],
  examples: [
    { title: 'Пример: Рычаг', steps: [
      { text: 'На рычаге: $F_1 = 20$ Н, $l_1 = 5$ м, $l_2 = 10$ м.', rule: '' },
      { text: '$F_2 = \\frac{F_1 l_1}{l_2} = \\frac{20 \\cdot 5}{10} = 10$ Н', rule: 'Условие равновесия' }
    ]}
  ],
  taskTypes: [
    { name: 'Рычаг', icon: '⚙️',
      generate(){const f1=randInt(5,30),l1=randInt(2,8),l2=randInt(l1+1,15);return{f1,l1,l2,f2:round2(f1*l1/l2)}},
      template(f1,l1,l2,f2){return{text:`$F_1 = ${f1}$ Н, $l_1 = ${l1}$ м, $l_2 = ${l2}$ м. Сила $F_2$? (Н, округлите до сотых)`,answer:f2,hint:`$F_2 = \\frac{F_1 l_1}{l_2} = \\frac{${f1} \\cdot ${l1}}{${l2}}$`,solution:`$F_2 = ${f2}$ Н`}},
    },
    { name: 'Наклонная плоскость', icon: '📐',
      generate(){const g=randInt(10,50),h=randInt(1,5),l=randInt(h+1,h+10);return{g,h,l,f:round2(g*h/l)}},
      template(g,h,l,f){return{text:`$G = ${g}$ Н, высота $h = ${h}$ м, длина $l = ${l}$ м. Сила $F$?`,answer:f,hint:`$F = \\frac{Gh}{l} = \\frac{${g} \\cdot ${h}}{${l}}$`,solution:`$F = ${f}$ Н`}},
    }
  ]
};

// ==================== GRADE 8 ====================

LESSONS['8.1'] = {
  title: 'Давление твёрдых тел',
  context: 'Давление — сила, действующая перпендикулярно на единицу площади. Оно определяет, насколько глубоко втыкается гвоздь.',
  theory: [
    { icon: '🪨', title: 'Определение', html: '<div class="formula-block">$p = \\frac{F}{S}$</div><p>$p$ — давление (Па), $F$ — сила (Н), $S$ — площадь (м²).</p><p>1 Па = 1 Н/м²</p>' },
    { icon: '📐', title: 'Давление на грунт', html: '<div class="formula-block">$p = \\frac{mg}{S}$</div>' },
    { icon: '📏', title: 'Формула для цилиндра/призмы', html: '<div class="formula-block">$p = \\rho gh$</div><p>Давление столба жидкости или однородного тела.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Блок $m = 50$ кг, площадь основания $S = 0.5$ м².', rule: '' },
      { text: '$p = \\frac{mg}{S} = \\frac{50 \\cdot 9.8}{0.5} = 980$ Па', rule: 'Давление на грунт' }
    ]}
  ],
  taskTypes: [
    { name: 'Давление', icon: '🪨',
      generate(){const f=randInt(10,200),s=randInt(1,10);return{f,s,p:round2(f/s)}},
      template(f,s,p){return{text:`$F = ${f}$ Н, $S = ${s}$ м². Давление $p$? (Па, округлите до сотых)`,answer:p,hint:`$p = \\frac{F}{S} = \\frac{${f}}{${s}}$`,solution:`$p = ${p}$ Па`}},
    },
    { name: 'Сила', icon: '📐',
      generate(){const p=randInt(100,5000),s=randInt(1,10);return{p,s,f:p*s}},
      template(p,s,f){return{text:`$p = ${p}$ Па, $S = ${s}$ м². Сила $F$?`,answer:f,hint:`$F = pS = ${p} \\cdot ${s}$`,solution:`$F = ${f}$ Н`}},
    }
  ]
};

LESSONS['8.2'] = {
  title: 'Давление жидкостей и газов',
  context: 'Жидкости и газы оказывают давление на стенки сосуда и на погружённые тела.',
  theory: [
    { icon: '💧', title: 'Давление жидкости', html: '<div class="formula-block">$p = \\rho gh$</div><p>Зависит от плотности и глубины, не зависит от формы сосуда.</p>' },
    { icon: '📐', title: 'Сообщение сосудов', html: '<p>В сообщающихся сосудах жидкость устанавливается на одном уровне.</p><div class="highlight-box green"><strong>Парадокс:</strong> Давление не зависит от объёма жидкости!</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Глубина $h = 5$ м, $\\rho_{\\text{воды}} = 1000$ кг/м³.', rule: '' },
      { text: '$p = 1000 \\cdot 9.8 \\cdot 5 = 49\\,000$ Па', rule: 'Давление столба воды' }
    ]}
  ],
  taskTypes: [
    { name: 'Давление', icon: '💧',
      generate(){const rho=randInt(800,1300),h=randInt(1,15);return{rho,h,p:round2(rho*9.8*h)}},
      template(rho,h,p){return{text:`$\\rho = ${rho}$ кг/м³, $h = ${h}$ м. Давление $p$? (Па, округлите до сотых)`,answer:p,hint:`$p = \\rho gh = ${rho} \\cdot 9.8 \\cdot ${h}$`,solution:`$p = ${p}$ Па`}},
    },
    { name: 'Глубина', icon: '📏',
      generate(){const p=randInt(5000,100000),rho=1000;return{p,rho,h:round2(p/(rho*9.8))}},
      template(p,rho,h){return{text:`$p = ${p}$ Па, $\\rho = 1000$ кг/м³. Глубина $h$? (м, округлите до сотых)`,answer:h,hint:`$h = \\frac{p}{\\rho g} = \\frac{${p}}{1000 \\cdot 9.8}$`,solution:`$h = ${h}$ м`}},
    }
  ]
};

LESSONS['8.3'] = {
  title: 'Атмосферное давление',
  context: 'Атмосфера Земли оказывает давление на всё вокруг. На уровне моря оно равно примерно 101 325 Па.',
  theory: [
    { icon: '🌬️', title: 'Определение', html: '<p><strong>Атмосферное давление</strong> — давление столба воздуха на поверхность Земли.</p><div class="formula-block">$p_0 \\approx 101\\,325$ Па $\\approx 760$ мм рт. ст.</div>' },
    { icon: '📐', title: 'Опыт Торричелли', html: '<p>Ртуть в трубке поддерживается на высоте 760 мм — это и есть атмосферное давление.</p>' },
    { icon: '📏', title: 'Зависимость от высоты', html: '<p>С высотой атмосферное давление уменьшается.</p><div class="highlight-box">На 12 км высоты давление примерно в 10 раз меньше, чем на уровне моря.</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Давление $p_0 = 760$ мм рт. ст. Переведите в Па.', rule: '' },
      { text: '$p = \\rho g h = 13\\,600 \\cdot 9.8 \\cdot 0.76 \\approx 101\\,300$ Па', rule: 'Формула столба жидкости' }
    ]}
  ],
  taskTypes: [
    { name: 'Перевод', icon: '🌬️',
      generate(){const vals=[{h:760,ans:'101325'},{h:750,ans:'99992'},{h:740,ans:'98659'},{h:770,ans:'102658'}];const c=vals[randInt(0,3)];return{...c}},
      template(h,ans){return{text:`$p = ${h}$ мм рт. ст. Сколько Па? (округлите до целого)`,answer:ans,hint:'$p = \\rho_{\\text{рт}} \\cdot g \\cdot h$',solution:`$p \\approx ${ans}$ Па`}},
    },
    { name: 'Высота столба', icon: '📏',
      generate(){const h=randInt(5,30);return{h,p:round2(13600*9.8*h/1e5)}},
      template(h,p){return{text:`Сколько метров ртутного столба соответствует давлению ${p * 100000} Па?`,answer:h,hint:'$h = \\frac{p}{\\rho g}$',solution:`$h \\approx ${h}$ м`}},
    }
  ]
};

LESSONS['8.4'] = {
  title: 'Сила Архимеда',
  context: 'Тело, погружённое в жидкость, теряет в весе на величину силы Архимеда. Этот закон объясняет, почему корабли держатся на воде.',
  theory: [
    { icon: '🏊', title: 'Закон Архимеда', html: '<div class="formula-block">$F_{\\text{А}} = \\rho_{\\text{ж}} g V_{\\text{погр}}$</div><p>$\\rho_{\\text{ж}}$ — плотность жидкости, $V_{\\text{погр}}$ — объём погружённой части.</p>' },
    { icon: '📐', title: 'Плавание', html: '<ul><li>$F_{\\text{А}} > mg$ → тело всплывает</li><li>$F_{\\text{А}} = mg$ → тело в равновесии (плавает)</li><li>$F_{\\text{А}} < mg$ → тело тонет</li></ul><div class="highlight-box green"><strong>Условие плавания:</strong> $\\rho_{\\text{тела}} \\leq \\rho_{\\text{жидкости}}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Тело объёмом $V = 0.5$ м³ погружено в воду. $\\rho = 1000$ кг/м³.', rule: '' },
      { text: '$F_{\\text{А}} = 1000 \\cdot 9.8 \\cdot 0.5 = 4900$ Н', rule: 'Закон Архимеда' }
    ]}
  ],
  taskTypes: [
    { name: 'Сила Архимеда', icon: '🏊',
      generate(){const v=round2(randInt(1,10)/10),rho=randInt(800,1300);return{v,rho,fa:round2(rho*9.8*v)}},
      template(v,rho,fa){return{text:`$V = ${v}$ м³, $\\rho = ${rho}$ кг/м³. $F_{\\text{А}}$? (Н, округлите до сотых)`,answer:fa,hint:`$F_{\\text{А}} = \\rho gV = ${rho} \\cdot 9.8 \\cdot ${v}$`,solution:`$F_{\\text{А}} = ${fa}$ Н`}},
    },
    { name: 'Плавание', icon: '📐',
      generate(){const types=[{rho1:800,rho2:1000,ans:'всплывает'},{rho1:1200,rho2:1000,ans:'тонет'},{rho1:1000,rho2:1000,ans:'плавает'}];return types[randInt(0,2)]},
      template(rho1,rho2,ans){return{text:`Тело $\\rho = ${rho1}$ кг/м³, жидкость $\\rho = ${rho2}$ кг/м³. Что происходит?`,answer:ans,hint:'Сравните плотности',solution:`$\\rho_{\\text{тела}} ${rho1<rho2?'<':rho1>rho2?'>':'='} \\rho_{\\text{жидкости}}$ — ${ans}`}},
    }
  ]
};

LESSONS['8.5'] = {
  title: 'Температура и теплота',
  context: 'Температура — мера средней кинетической энергии молекул. Теплота — энергия, переданная при разнице температур.',
  theory: [
    { icon: '🌡️', title: 'Температура', html: '<p><strong>Температура</strong> — физическая величина, характеризующая степень нагретости тела.</p><p>Шкала Цельсия: $0°$ — точка замерзания, $100°$ — точка кипения воды.</p>' },
    { icon: '📐', title: 'Количество теплоты', html: '<div class="formula-block">$Q = cm\\Delta t$</div><p>$Q$ — теплота (Дж), $c$ — удельная теплоёмкость (Дж/(кг·°C)), $m$ — масса, $\\Delta t$ — изменение температуры.</p>' },
    { icon: '📏', title: 'Тепловое равновесие', html: '<p>При соприкосновении горячее тело отдаёт холодному теплоту, пока температуры не сравняются.</p><div class="formula-block">$Q_{\\text{гор}} = Q_{\\text{хол}}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$m = 2$ кг воды ($c = 4200$), нагрели на $\\Delta t = 30°$C.', rule: '' },
      { text: '$Q = 4200 \\cdot 2 \\cdot 30 = 252\\,000$ Дж', rule: 'Формула теплоты' }
    ]}
  ],
  taskTypes: [
    { name: 'Теплота', icon: '🌡️',
      generate(){const m=randInt(1,10),dt=randInt(5,50);return{m,dt,q:4200*m*dt}},
      template(m,dt,q){return{text:`$m = ${m}$ кг воды, $\\Delta t = ${dt}$°C. $Q$? (Дж)`,answer:q,hint:`$Q = cm\\Delta t = 4200 \\cdot ${m} \\cdot ${dt}$`,solution:`$Q = ${q}$ Дж`}},
    },
    { name: 'Масса', icon: '⚖️',
      generate(){const q=randInt(10000,200000),dt=randInt(5,30);return{q,dt,m:round2(q/(4200*dt))}},
      template(q,dt,m){return{text:`$Q = ${q}$ Дж, $\\Delta t = ${dt}$°C. Масса воды? (кг, округлите до сотых)`,answer:m,hint:`$m = \\frac{Q}{c\\Delta t} = \\frac{${q}}{4200 \\cdot ${dt}}$`,solution:`$m = ${m}$ кг`}},
    }
  ]
};

LESSONS['8.6'] = {
  title: 'Внутренняя энергия. КПД',
  context: 'Внутренняя энергия — сумма кинетической энергии молекул и потенциальной энергии их взаимодействия.',
  theory: [
    { icon: '🔥', title: 'Внутренняя энергия', html: '<p>$U$ — внутренняя энергия тела.</p><p>Изменить $U$ можно двумя способами:</p><ul><li>Совершить работу (нагреть трением)</li><li>Передать теплоту (нагреть на огне)</li></ul><div class="formula-block">$\\Delta U = Q + A$</div>' },
    { icon: '📐', title: 'КПД', html: '<div class="formula-block">$\\eta = \\frac{A_{\\text{пол}}}{Q_{\\text{нап}}} \\cdot 100\\%$</div><div class="highlight-box"><strong>В тепловых машинах:</strong> $\\eta < 100\\%$ всегда!</div>' }
  ],
  examples: [
    { title: 'Пример: КПД', steps: [
      { text: 'Двигатель потребляет $Q = 1000$ Дж, совершает полезную работу $A = 250$ Дж.', rule: '' },
      { text: '$\\eta = \\frac{250}{1000} \\cdot 100\\% = 25\\%$', rule: 'КПД' }
    ]}
  ],
  taskTypes: [
    { name: 'КПД', icon: '🔥',
      generate(){const q=randInt(100,500),kpd=randInt(15,45);return{q,kpd,a:Math.round(q*kpd/100)}},
      template(q,kpd,a){return{text:`$Q_{\\text{нап}} = ${q}$ Дж, КПД = ${kpd}$\\%$. Полезная работа $A$?`,answer:a,hint:`$A = \\eta Q = \\frac{${kpd}}{100} \\cdot ${q}$`,solution:`$A = ${a}$ Дж`}},
    }
  ]
};

LESSONS['8.7'] = {
  title: 'Электрический ток. Сила тока',
  context: 'Электрический ток — упорядоченное движение заряженных частиц. Сила тока — мера интенсивности этого потока.',
  theory: [
    { icon: '🔌', title: 'Определение', html: '<p><strong>Электрический ток</strong> — упорядоченное движение электрических зарядов.</p><p>Для возникновения тока необходимо:</p><ul><li>Наличие свободных зарядов (проводник)</li><li>Разность потенциалов (напряжение)</li></ul>' },
    { icon: '📐', title: 'Сила тока', html: '<div class="formula-block">$I = \\frac{q}{t}$</div><p>$I$ — сила тока (А), $q$ — заряд (Кл), $t$ — время (с).</p><p>1 А — через сечение проводника за 1 с проходит 1 Кл заряда.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Через проводник за $t = 10$ с прошёл заряд $q = 50$ Кл.', rule: '' },
      { text: '$I = \\frac{50}{10} = 5$ А', rule: 'Формула силы тока' }
    ]}
  ],
  taskTypes: [
    { name: 'Сила тока', icon: '🔌',
      generate(){const q=randInt(5,100),t=randInt(2,20);return{q,t,i:round2(q/t)}},
      template(q,t,i){return{text:`$q = ${q}$ Кл, $t = ${t}$ с. Сила тока $I$? (А, округлите до сотых)`,answer:i,hint:`$I = \\frac{q}{t} = \\frac{${q}}{${t}}$`,solution:`$I = ${i}$ А`}},
    },
    { name: 'Заряд', icon: '📐',
      generate(){const i=randInt(1,10),t=randInt(2,20);return{i,t,q:i*t}},
      template(i,t,q){return{text:`$I = ${i}$ А, $t = ${t}$ с. Заряд $q$? (Кл)`,answer:q,hint:`$q = It = ${i} \\cdot ${t}$`,solution:`$q = ${q}$ Кл`}},
    }
  ]
};

LESSONS['8.8'] = {
  title: 'Напряжение и сопротивление',
  context: 'Напряжение — «давление» электричества. Сопротивление — мера того, как проводник препятствует току.',
  theory: [
    { icon: '⚡', title: 'Напряжение', html: '<div class="formula-block">$U = \\frac{A}{q}$</div><p>$U$ — напряжение (В), $A$ — работа, $q$ — заряд.</p><p>Напряжение между двумя точками — работа электрического поля по перемещению заряда.</p>' },
    { icon: '📐', title: 'Сопротивление', html: '<div class="formula-block">$R = \\frac{U}{I}$</div><p>$R$ — сопротивление (Ом, $\\Omega$).</p><div class="formula-block">$R = \\rho \\frac{l}{S}$</div><p>$\\rho$ — удельное сопротивление, $l$ — длина, $S$ — сечение.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$U = 220$ В, $R = 1100$ Ом.', rule: '' },
      { text: '$I = \\frac{U}{R} = \\frac{220}{1100} = 0.2$ А', rule: 'Закон Ома' }
    ]}
  ],
  taskTypes: [
    { name: 'Сопротивление', icon: '📐',
      generate(){const u=randInt(5,220),i=round2(randInt(1,20)/10);return{u,i,r:round2(u/i)}},
      template(u,i,r){return{text:`$U = ${u}$ В, $I = ${i}$ А. Сопротивление $R$? (Ом, округлите до сотых)`,answer:r,hint:`$R = \\frac{U}{I} = \\frac{${u}}{${i}}$`,solution:`$R = ${r}$ Ом`}},
    },
    { name: 'Напряжение', icon: '⚡',
      generate(){const i=randInt(1,10),r=randInt(5,100);return{i,r,u:i*r}},
      template(i,r,u){return{text:`$I = ${i}$ А, $R = ${r}$ Ом. Напряжение $U$?`,answer:u,hint:`$U = IR = ${i} \\cdot ${r}$`,solution:`$U = ${u}$ В`}},
    }
  ]
};

LESSONS['8.9'] = {
  title: 'Закон Ома',
  context: 'Закон Ома — главный закон электрических цепей. Он связывает ток, напряжение и сопротивление.',
  theory: [
    { icon: '📊', title: 'Закон Ома для участка цепи', html: '<div class="formula-block">$I = \\frac{U}{R}$</div><p>Сила тока прямо пропорциональна напряжению и обратно пропорциональна сопротивлению.</p>' },
    { icon: '📐', title: 'Последовательное соединение', html: '<ul><li>$R = R_1 + R_2 + ... + R_n$</li><li>$I = I_1 = I_2 = ... = I_n$</li><li>$U = U_1 + U_2 + ... + U_n$</li></ul>' },
    { icon: '📏', title: 'Параллельное соединение', html: '<ul><li>$\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_2} + ...$</li><li>$U = U_1 = U_2 = ... = U_n$</li><li>$I = I_1 + I_2 + ... + I_n$</li></ul>' }
  ],
  examples: [
    { title: 'Пример: Последовательное', steps: [
      { text: '$R_1 = 10$ Ом, $R_2 = 20$ Ом, $U = 30$ В.', rule: '' },
      { text: '$R = 10 + 20 = 30$ Ом', rule: 'Сумма сопротивлений' },
      { text: '$I = \\frac{30}{30} = 1$ А', rule: 'Закон Ома' }
    ]}
  ],
  taskTypes: [
    { name: 'Закон Ома', icon: '📊',
      generate(){const u=randInt(5,50),r=randInt(2,25);return{u,r,i:round2(u/r)}},
      template(u,r,i){return{text:`$U = ${u}$ В, $R = ${r}$ Ом. $I$? (А, округлите до сотых)`,answer:i,hint:`$I = \\frac{U}{R} = \\frac{${u}}{${r}}$`,solution:`$I = ${i}$ А`}},
    },
    { name: 'Последовательное', icon: '🔗',
      generate(){const r1=randInt(5,20),r2=randInt(5,20),u=r1+r2;return{r1,r2,r:r1+r2,i:round2(u/(r1+r2))}},
      template(r1,r2,r,i){return{text:`$R_1=${r1}$ Ом, $R_2=${r2}$ Ом, $U=${r}$ В. Ток $I$?`,answer:i,hint:`$R = ${r1}+${r2}=${r}$, $I = \\frac{${r}}{${r}}$`,solution:`$I = ${i}$ А`}},
    }
  ]
};

LESSONS['8.10'] = {
  title: 'Электрическая мощность и энергия',
  context: 'Электрическая мощность — скорость преобразования электрической энергии. Энергия — за сколько потребляет прибор.',
  theory: [
    { icon: '💡', title: 'Мощность', html: '<div class="formula-block">$P = UI = I^2R = \\frac{U^2}{R}$</div><p>$P$ — мощность (Вт).</p><div class="formula-block">$1$ кВт $= 1000$ Вт</div>' },
    { icon: '📐', title: 'Энергия', html: '<div class="formula-block">$W = Pt$</div><p>$W$ — энергия (Дж или кВт·ч).</p><div class="formula-block">$1$ кВт·ч $= 3.6 \\times 10^6$ Дж</div>' },
    { icon: '📏', title: 'Закон Джоуля — Ленца', html: '<div class="formula-block">$Q = I^2 R t$</div><p>Теплота, выделяемая проводником с током.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Лампа $P = 100$ Вт работает $t = 5$ ч.', rule: '' },
      { text: '$W = Pt = 0.1 \\cdot 5 = 0.5$ кВт·ч', rule: 'Энергия' },
      { text: '$W = 0.5 \\cdot 3.6 \\times 10^6 = 1.8 \\times 10^6$ Дж', rule: 'Перевод' }
    ]}
  ],
  taskTypes: [
    { name: 'Мощность', icon: '💡',
      generate(){const u=randInt(5,50),r=randInt(2,25);return{u,r,p:round2(u*u/r)}},
      template(u,r,p){return{text:`$U = ${u}$ В, $R = ${r}$ Ом. Мощность $P$? (Вт, округлите до сотых)`,answer:p,hint:`$P = \\frac{U^2}{R} = \\frac{${u}^2}{${r}}$`,solution:`$P = ${p}$ Вт`}},
    },
    { name: 'Энергия', icon: '📐',
      generate(){const p=randInt(1,10),t=randInt(1,10);return{p,t,w:p*t}},
      template(p,t,w){return{text:`Лампа $P = ${p}$ кВт работает $t = ${t}$ ч. Энергия $W$? (кВт·ч)`,answer:w,hint:`$W = Pt = ${p} \\cdot ${t}$`,solution:`$W = ${w}$ кВт·ч`}},
    }
  ]
};
