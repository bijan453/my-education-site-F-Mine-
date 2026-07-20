// geometry-lessons.js — All geometry lessons grades 7–11
const LESSONS = {};

// ==================== GRADE 7 ====================

LESSONS['7.1'] = {
  title: 'Точки, прямые, лучи, отрезки',
  context: 'В повседневной жизни мы постоянно имеем дело с геометрическими объектами: края стола — это отрезки, луч света фонаря — это луч, а углы стен — это точки пересечения прямых. В этой теме мы formalizируем эти понятия.',
  theory: [
    { icon: '📍', title: 'Точка', html: '<p>Точка — основное понятие геометрии. Точка не имеет размеров, только положение. Точки обозначают заглавными буквами: $A$, $B$, $C$.</p><div class="highlight-box"><strong>Факт:</strong> Через две точки проходит ровно одна прямая.</div>' },
    { icon: '➡️', title: 'Отрезок, луч, прямая', html: '<ul><li><strong>Отрезок</strong> $AB$ — часть прямой, ограниченная двумя точками $A$ и $B$, включая их. Обозначение: $|AB|$ — длина.</li><li><strong>Луч</strong> $AB$ — часть прямой, начинающаяся в точке $A$ и уходящая в сторону $B$ бесконечно.</li><li><strong>Прямая</strong> $AB$ — бесконечная линия, проходящая через точки $A$ и $B$ в обе стороны.</li></ul><div class="highlight-box green"><strong>Правило:</strong> Луч $AB$ ≠ луч $BA$ (разные направления). Отрезок $AB$ = отрезок $BA$.</div>' },
    { icon: '📐', title: 'Расстояние между точками', html: '<p>Если точки $A$ и $B$ лежат на координатной прямой с координатами $a$ и $b$, то:</p><div class="formula-block">$|AB| = |b - a|$</div><p>Если точки лежат на координатной плоскости: $A(x_1, y_1)$, $B(x_2, y_2)$:</p><div class="formula-block">$|AB| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$</div>' }
  ],
  examples: [
    { title: 'Пример 1: Длина отрезка на координатной прямой', steps: [
      { text: 'Найдём длину отрезка $AB$, где $A = -3$, $B = 5$.', rule: '' },
      { text: '$|AB| = |5 - (-3)| = |5 + 3| = 8$', rule: 'Модуль разности координат' },
      { text: 'Ответ: $|AB| = 8$', rule: 'Финальный ответ' }
    ]},
    { title: 'Пример 2: Расстояние на плоскости', steps: [
      { text: 'Найдём расстояние $A(1, 2)$ и $B(4, 6)$.', rule: '' },
      { text: '$|AB| = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25}$', rule: 'Формула расстояния' },
      { text: '$|AB| = 5$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Длина отрезка', icon: '📏',
      generate(){return{a:randInt(-10,-1),b:randInt(1,10)}},
      template(a,b){return{text:`$|AB| = ?$, где $A = ${a}$, $B = ${b}$`,answer:Math.abs(b-a),hint:`Модуль разности: $|${b} - (${a})|$`,solution:`$|AB| = |${b} - (${a})| = |${b-a}| = ${Math.abs(b-a)}$`}},
    },
    { name: 'Координата точки', icon: '📍',
      generate(){const a=randInt(-10,-1),d=randInt(1,15);const b=a+d;return{a,d,b}},
      template(a,d,b){return{text:`Отрезок $AB$ имеет длину $${d}$. Точка $A = ${a}$. Найдите $B$, если $B > A$.`,answer:b,hint:`$B = A + |AB| = ${a} + ${d}$`,solution:`$B = ${a} + ${d} = ${b}$`}},
    },
    { name: 'Расстояние 2D', icon: '🗺️',
      generate(){const x1=randInt(0,5),y1=randInt(0,5),dx=randInt(3,6),dy=randInt(3,6);return{x1,y1,dx,dy,x2:x1+dx,y2:y1+dy,ans:Math.sqrt(dx*dx+dy*dy)}},
      template(x1,y1,dx,dy,x2,y2,ans){return{text:`$A(${x1};${y1})$, $B(${x2};${y2})$. Найдите $|AB|$.`,answer:ans,hint:`$\\sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2}$`,solution:`$\\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx*dx} + ${dy*dy}} = \\sqrt{${dx*dx+dy*dy}}$`}},
    }
  ]
};

LESSONS['7.2'] = {
  title: 'Углы и их виды',
  context: 'Углы повсюду: угол поворота двери, наклон крыши, лучи солнца. Умение измерять и классифицировать углы — основа геометрии.',
  theory: [
    { icon: '📐', title: 'Определение угла', html: '<p><strong>Угол</strong> — фигура, образованная двумя лучами $OA$ и $OB$ с общим началом $O$. Обозначение: $\\angle AOB$ или просто $\\angle O$.</p><p>Измеряется в градусах ($°$) или радианах ($\\text{rad}$).</p>' },
    { icon: '📊', title: 'Виды углов', html: '<ul><li><strong>Острый:</strong> $0° < \\alpha < 90°$</li><li><strong>Прямой:</strong> $\\alpha = 90°$</li><li><strong>Тупой:</strong> $90° < \\alpha < 180°$</li><li><strong>Развёрнутый:</strong> $\\alpha = 180°$</li><li><strong>Выпуклый:</strong> $\\alpha > 180°$</li></ul>' },
    { icon: '🔗', title: 'Сумма углов на прямой и вокруг точки', html: '<div class="formula-block">$\\alpha_1 + \\alpha_2 + ... + \\alpha_n = 180°$ (на прямой)</div><div class="formula-block">$\\alpha_1 + \\alpha_2 + ... + \\alpha_n = 360°$ (вокруг точки)</div><div class="highlight-box"><strong>Смежные углы:</strong> Два угла, сумма которых $180°$.</div><div class="highlight-box green"><strong>Вертикальные углы:</strong> Равны.</div>' }
  ],
  examples: [
    { title: 'Пример 1: Смежные углы', steps: [
      { text: '$\\angle A = 72°$. Найдите смежный $\\angle B$.', rule: '' },
      { text: '$\\angle B = 180° - \\angle A = 180° - 72°$', rule: 'Сумма смежных углов = 180°' },
      { text: '$\\angle B = 108°$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Смежный угол', icon: '📐',
      generate(){const a=randInt(20,160);return{a}},
      template(a){return{text:`$\\angle A = ${a}°$. Найдите смежный угол $\\angle B$.`,answer:180-a,hint:`Сумма смежных углов = 180°`,solution:`$180° - ${a}° = ${180-a}°$`}},
    },
    { name: 'Вертикальный угол', icon: '🔢',
      generate(){const a=randInt(15,175);return{a}},
      template(a){return{text:`$\\angle A = ${a}°$. Найдите вертикальный угол $\\angle B$.`,answer:a,hint:`Вертикальные углы равны`,solution:`$\\angle B = \\angle A = ${a}°$`}},
    },
    { name: 'Тип угла', icon: '📝',
      generate(){const a=randInt(5,200);const types=['острый','острый','острой','прямой','тупой','тупой','развёрнутый'];let ans='тупой';if(a<90)ans='острый';else if(a===90)ans='прямой';else if(a===180)ans='развёрнутый';return{a,ans}},
      template(a,ans){return{text:`Определите тип угла: $\\angle = ${a}°$.`,answer:ans,hint:`Сравните с 90° и 180°`,solution:`$\\angle = ${a}°$ — это ${ans} угол`}},
    }
  ]
};

LESSONS['7.3'] = {
  title: 'Треугольники: виды и свойства',
  context: 'Треугольник — самая простая и самая прочная фигура. Триangles используются в мостах, крышах, кранах. В этой теме мы изучим свойства треугольников.',
  theory: [
    { icon: '🔺', title: 'Определение', html: '<p><strong>Треугольник</strong> — фигура, образованная тремя отрезками $AB$, $BC$, $CA$.</p><p>Вершины: $A$, $B$, $C$. Стороны: $a = BC$, $b = AC$, $c = AB$. Углы: $\\angle A$, $\\angle B$, $\\angle C$.</p><div class="highlight-box"><strong>Сумма углов:</strong> $\\angle A + \\angle B + \\angle C = 180°$</div>' },
    { icon: '📊', title: 'Виды по сторонам', html: '<ul><li><strong>Равносторонний:</strong> $a = b = c$ (все углы = 60°)</li><li><strong>Равнобедренный:</strong> две стороны равны, углы при основании равны</li><li><strong>Разносторонний:</strong> все стороны разные</li></ul>' },
    { icon: '📐', title: 'Виды по углам', html: '<ul><li><strong>Остроугольный:</strong> все углы < 90°</li><li><strong>Прямоугольный:</strong> один угол = 90°</li><li><strong>Тупоугольный:</strong> один угол > 90°</li></ul><div class="highlight-box green"><strong>Неравенство треугольника:</strong> Любая сторона меньше суммы двух других: $a < b + c$</div>' }
  ],
  examples: [
    { title: 'Пример: Третий угол', steps: [
      { text: '$\\angle A = 50°$, $\\angle B = 72°$. Найдите $\\angle C$.', rule: '' },
      { text: '$\\angle C = 180° - 50° - 72° = 58°$', rule: 'Сумма углов треугольника = 180°' },
      { text: '$\\angle C = 58°$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Третий угол', icon: '📐',
      generate(){const a=randInt(20,80),b=randInt(20,180-a-20);return{a,b,c:180-a-b}},
      template(a,b,c){return{text:`$\\angle A = ${a}°$, $\\angle B = ${b}°$. Найдите $\\angle C$ в треугольнике.`,answer:c,hint:`$180° - ${a}° - ${b}°$`,solution:`$180° - ${a}° - ${b}° = ${c}°$`}},
    },
    { name: 'Неравенство', icon: '✅',
      generate(){const sides=[[3,4,5],[2,3,4],[5,5,8],[1,2,3],[7,3,5]].filter(s=>s[0]+s[1]>s[2]);const s=sides[randInt(0,sides.length-1)];const valid=s[0]+s[1]>s[2]&&s[0]+s[2]>s[1]&&s[1]+s[2]>s[0];return{s,valid,ans:valid?'да':'нет'}},
      template(s,valid,ans){return{text:`Может ли треугольник иметь стороны $${s[0]}$, $${s[1]}$, $${s[2]}$?`,answer:ans,hint:`Проверьте: сумма любых двух сторон > третьей`,solution:`${s[0]} + ${s[1]} = ${s[0]+s[1]} ${s[0]+s[1]>s[2]?'>':'≤'} ${s[2]} — ${valid?'выполняется':'не выполняется'}`}},
    },
    { name: 'Вид треугольника', icon: '🔺',
      generate(){const types=[{sides:'3, 3, 3',ans:'равносторонний'},{sides:'5, 5, 8',ans:'равнобедренный'},{sides:'3, 4, 5',ans:'разносторонний'}];const t=types[randInt(0,2)];return{...t}},
      template(sides,ans){return{text:`Треугольник со сторонами $${sides}$. Определите вид по сторонам.`,answer:ans,hint:`Равносторонний: все стороны равны. Равнобедренный: две равны.`,solution:`Стороны $${sides}$ — ${ans} треугольник`}},
    }
  ]
};

LESSONS['7.4'] = {
  title: 'Четырёхугольники',
  context: 'Четырёхугольники окружают нас повсюду: окна, столы, листы бумаги, экраны телефонов. Их свойства лежат в основе архитектуры и дизайна.',
  theory: [
    { icon: '🔷', title: 'Общие свойства', html: '<p><strong>Четырёхугольник</strong> — фигура с четырьмя вершинами и четырьмя сторонами.</p><div class="formula-block">$\\angle A + \\angle B + \\angle C + \\angle D = 360°$</div>' },
    { icon: '📐', title: 'Виды четырёхугольников', html: '<ul><li><strong>Параллелограмм:</strong> противоположные стороны параллельны и равны, противоположные углы равны</li><li><strong>Прямоугольник:</strong> параллелограмм с прямыми углами</li><li><strong>Ромб:</strong> параллелограмм с равными сторонами</li><li><strong>Квадрат:</strong> прямоугольник и ромб одновременно</li><li><strong>Трапеция:</strong> ровно одна пара параллельных сторон</li></ul>' },
    { icon: '📊', title: 'Формулы площадей', html: '<div class="formula-block">$S_{\\text{пр}} = a \\cdot h$ (параллелограмм)</div><div class="formula-block">$S_{\\text{ромб}} = \\frac{d_1 \\cdot d_2}{2}$ (по диагоналям)</div><div class="formula-block">$S_{\\text{кв}} = a^2$</div><div class="formula-block">$S_{\\text{трап}} = \\frac{(a+b) \\cdot h}{2}$</div>' }
  ],
  examples: [
    { title: 'Пример: Сумма углов', steps: [
      { text: 'Три угла четырёхугольника: $80°$, $110°$, $95°$. Найдите четвёртый.', rule: '' },
      { text: '$\\angle D = 360° - 80° - 110° - 95° = 75°$', rule: 'Сумма углов = 360°' },
      { text: '$\\angle D = 75°$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Четвёртый угол', icon: '📐',
      generate(){const a=randInt(50,110),b=randInt(50,110),c=randInt(50,110);return{a,b,c,d:360-a-b-c}},
      template(a,b,c,d){return{text:`Три угла четырёхугольника: $${a}°$, $${b}°$, $${c}°$. Найдите четвёртый.`,answer:d,hint:`$360° - ${a}° - ${b}° - ${c}°$`,solution:`$360° - ${a}° - ${b}° - ${c}° = ${d}°$`}},
    },
    { name: 'Площадь параллелограмма', icon: '📐',
      generate(){const a=randInt(3,12),h=randInt(2,10);return{a,h,s:a*h}},
      template(a,h,s){return{text:`Параллелограмм: основание $a = ${a}$, высота $h = ${h}$. Найдите площадь.`,answer:s,hint:`$S = a \\cdot h = ${a} \\cdot ${h}$`,solution:`$S = ${a} \\cdot ${h} = ${s}$`}},
    },
    { name: 'Площадь трапеции', icon: '📊',
      generate(){const a=randInt(3,10),b=randInt(3,10),h=randInt(2,8);return{a,b,h,s:(a+b)*h/2}},
      template(a,b,h,s){return{text:`Трапеция: основания $a = ${a}$, $b = ${b}$, высота $h = ${h}$. Найдите площадь.`,answer:s,hint:`$S = \\frac{(${a}+${b}) \\cdot ${h}}{2}$`,solution:`$S = \\frac{${a+b} \\cdot ${h}}{2} = \\frac{${(a+b)*h}}{2} = ${s}$`}},
    }
  ]
};

LESSONS['7.5'] = {
  title: 'Окружность и круг',
  context: 'Колёса, планеты, арки мостов — окружность встречается всюду. Она единственная замкнутая кривая с постоянным расстоянием от центра.',
  theory: [
    { icon: '⭕', title: 'Основные понятия', html: '<ul><li><strong>Окружность</strong> — множество точек на расстоянии $R$ от центра $O$</li><li><strong>Круг</strong> — окружность + всё внутри</li><li><strong>Радиус</strong> $R$ — расстояние от центра до окружности</li><li><strong>Диаметр</strong> $D = 2R$ — проходящий через центр отрезок</li><li><strong>Хорда</strong> — отрезок между двумя точками окружности</li><li><strong>Секущая</strong> — прямая, пересекающая окружность в двух точках</li></ul>' },
    { icon: '📏', title: 'Длина окружности и площадь круга', html: '<div class="formula-block">$C = 2\\pi R = \\pi D$</div><div class="formula-block">$S = \\pi R^2 = \\frac{\\pi D^2}{4}$</div><div class="highlight-box green"><strong>$\\pi \\approx 3.14159$</strong></div>' },
    { icon: '📐', title: 'Вписанные и описанные углы', html: '<div class="highlight-box"><strong>Вписанный угол</strong> равен половине центрального угла, опирающегося на ту же дугу: $\\alpha = \\frac{\\beta}{2}$</div><p>Вписанный угол, опирающийся на диаметр, равен $90°$.</p>' }
  ],
  examples: [
    { title: 'Пример: Длина окружности', steps: [
      { text: 'Радиус $R = 5$ см. Найдите длину окружности.', rule: '' },
      { text: '$C = 2 \\cdot \\pi \\cdot 5 = 10\\pi$', rule: 'Формула длины окружности' },
      { text: '$C \\approx 31.42$ см', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Длина окружности', icon: '⭕',
      generate(){const r=randInt(2,15);return{r,c:2*Math.PI*r}},
      template(r,c){return{text:`Радиус $R = ${r}$. Найдите длину окружности ($\\pi \\approx 3.14$).`,answer:Math.round(c*100)/100,hint:`$C = 2\\pi R = 2 \\cdot 3.14 \\cdot ${r}$`,solution:`$C = 2 \\cdot 3.14 \\cdot ${r} = ${c.toFixed(2)}$`}},
    },
    { name: 'Площадь круга', icon: '⭕',
      generate(){const r=randInt(2,12);return{r,s:Math.PI*r*r}},
      template(r,s){return{text:`Радиус $R = ${r}$. Найдите площадь круга ($\\pi \\approx 3.14$).`,answer:Math.round(s*100)/100,hint:`$S = \\pi R^2 = 3.14 \\cdot ${r}^2$`,solution:`$S = 3.14 \\cdot ${r*r} = ${s.toFixed(2)}$`}},
    },
    { name: 'Диаметр', icon: '📏',
      generate(){const r=randInt(3,20);return{r,d:2*r}},
      template(r,d){return{text:`Радиус $R = ${r}$. Найдите диаметр.`,answer:d,hint:`$D = 2R$`,solution:`$D = 2 \\cdot ${r} = ${d}$`}},
    }
  ]
};

LESSONS['7.6'] = {
  title: 'Площади фигур',
  context: 'Площадь — это количество единичных квадратов, которые помещаются внутри фигуры. Знание площадей важно для строительства, дизайна и экономики.',
  theory: [
    { icon: '📐', title: 'Формулы площадей', html: '<div class="formula-block">$S_{\\text{кв}} = a^2$</div><div class="formula-block">$S_{\\text{пр}} = a \\cdot h$</div><div class="formula-block">$S_{\\text{треуг}} = \\frac{a \\cdot h}{2}$</div><div class="formula-block">$S_{\\text{трап}} = \\frac{(a+b) \\cdot h}{2}$</div><div class="formula-block">$S_{\\text{круг}} = \\pi R^2$</div>' },
    { icon: '🔗', title: 'Свойства площади', html: '<ul><li>Площадь не зависит от положения фигуры в пространстве</li><li>Если фигура разбита на части, площадь = сумме площадей частей</li><li>Если одна фигура contained в другой, её площадь меньше</li></ul>' }
  ],
  examples: [
    { title: 'Пример: Площадь треугольника', steps: [
      { text: 'Основание $a = 8$, высота $h = 5$.', rule: '' },
      { text: '$S = \\frac{8 \\cdot 5}{2} = \\frac{40}{2} = 20$', rule: 'Формула площади треугольника' },
      { text: '$S = 20$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Площадь квадрата', icon: '🔲',
      generate(){const a=randInt(2,20);return{a,s:a*a}},
      template(a,s){return{text:`Квадрат со стороной $a = ${a}$. Найдите площадь.`,answer:s,hint:`$S = a^2 = ${a}^2$`,solution:`$S = ${a}^2 = ${s}$`}},
    },
    { name: 'Площадь треугольника', icon: '🔺',
      generate(){const a=randInt(3,16),h=randInt(2,12);return{a,h,s:a*h/2}},
      template(a,h,s){return{text:`Треугольник: основание $a = ${a}$, высота $h = ${h}$. Найдите площадь.`,answer:s,hint:`$S = \\frac{${a} \\cdot ${h}}{2}$`,solution:`$S = \\frac{${a*h}}{2} = ${s}$`}},
    },
    { name: 'Площадь параллелограмма', icon: '🔷',
      generate(){const a=randInt(3,14),h=randInt(2,10);return{a,h,s:a*h}},
      template(a,h,s){return{text:`Параллелограмм: основание $a = ${a}$, высота $h = ${h}$.`,answer:s,hint:`$S = a \\cdot h = ${a} \\cdot ${h}$`,solution:`$S = ${a} \\cdot ${h} = ${s}$`}},
    }
  ]
};

LESSONS['7.7'] = {
  title: 'Периметр и длина окружности',
  context: 'Периметр — это длина границы фигуры. Сколько забора нужно поставить вокруг участка? Именно периметр даёт ответ.',
  theory: [
    { icon: '📏', title: 'Периметр', html: '<div class="formula-block">$P_{\\text{кв}} = 4a$</div><div class="formula-block">$P_{\\text{пр}} = 2(a+b)$</div><div class="formula-block">$P_{\\text{треуг}} = a + b + c$</div><div class="formula-block">$P_{\\text{трап}} = a + b + c + d$</div>' },
    { icon: '⭕', title: 'Длина окружности', html: '<div class="formula-block">$C = 2\\pi R = \\pi D$</div><p>Длина дуги $l$ при центральном угле $\\alpha$ (в градусах):</p><div class="formula-block">$l = \\frac{\\alpha}{360°} \\cdot 2\\pi R$</div>' }
  ],
  examples: [
    { title: 'Пример: Длина дуги', steps: [
      { text: '$R = 6$, $\\alpha = 60°$. Найдите длину дуги.', rule: '' },
      { text: '$l = \\frac{60}{360} \\cdot 2\\pi \\cdot 6 = \\frac{1}{6} \\cdot 12\\pi = 2\\pi$', rule: 'Формула длины дуги' },
      { text: '$l \\approx 6.28$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Периметр', icon: '📏',
      generate(){const a=randInt(3,12),b=randInt(3,12);return{a,b,p:2*(a+b)}},
      template(a,b,p){return{text:`Прямоугольник: $a = ${a}$, $b = ${b}$. Найдите периметр.`,answer:p,hint:`$P = 2(${a} + ${b})$`,solution:`$P = 2 \\cdot ${a+b} = ${p}$`}},
    },
    { name: 'Длина дуги', icon: '⭕',
      generate(){const r=randInt(3,10),ang=randInt(30,270);const l=ang/360*2*Math.PI*r;return{r,ang,l:Math.round(l*100)/100}},
      template(r,ang,l){return{text:`Дуга окружности $R = ${r}$, центральный угол $${ang}°$. Найдите длину ($\\pi=3.14$).`,answer:l,hint:`$l = \\frac{${ang}}{360} \\cdot 2 \\cdot 3.14 \\cdot ${r}$`,solution:`$l = ${(ang/360).toFixed(3)} \\cdot ${(2*3.14*r).toFixed(2)} \\approx ${l}$`}},
    },
    { name: 'Периметр треугольника', icon: '🔺',
      generate(){const a=randInt(3,10),b=randInt(3,10),c=randInt(Math.abs(a-b)+1,a+b-1);return{a,b,c,p:a+b+c}},
      template(a,b,c,p){return{text:`Треугольник: $a = ${a}$, $b = ${b}$, $c = ${c}$. Периметр?`,answer:p,hint:`$P = ${a} + ${b} + ${c}$`,solution:`$P = ${a} + ${b} + ${c} = ${p}$`}},
    }
  ]
};

LESSONS['7.8'] = {
  title: 'Площадь треугольника',
  context: 'Площадь треугольника — одна из важнейших формул в геометрии. Она используется при вычислении площадей любых многоугольников.',
  theory: [
    { icon: '📐', title: 'Основная формула', html: '<div class="formula-block">$S = \\frac{a \\cdot h}{2}$</div><p>где $a$ — основание, $h$ — высота, опущенная на это основание.</p>' },
    { icon: '🔺', title: 'Формула Герона', html: '<p>Если известны все три стороны $a$, $b$, $c$:</p><div class="formula-block">$p = \\frac{a+b+c}{2}$ (полупериметр)</div><div class="formula-block">$S = \\sqrt{p(p-a)(p-b)(p-c)}$</div>' },
    { icon: '📐', title: 'Через две стороны и угол', html: '<div class="formula-block">$S = \\frac{1}{2} ab \\sin C$</div>' }
  ],
  examples: [
    { title: 'Пример: Формула Герона', steps: [
      { text: '$a = 3$, $b = 4$, $c = 5$.', rule: '' },
      { text: '$p = \\frac{3+4+5}{2} = 6$', rule: 'Полупериметр' },
      { text: '$S = \\sqrt{6 \\cdot 3 \\cdot 2 \\cdot 1} = \\sqrt{36} = 6$', rule: 'Формула Герона' },
      { text: '$S = 6$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'S = ah/2', icon: '📐',
      generate(){const a=randInt(3,16),h=randInt(2,12);return{a,h,s:a*h/2}},
      template(a,h,s){return{text:`$a = ${a}$, $h = ${h}$. Найдите площадь треугольника.`,answer:s,hint:`$S = \\frac{${a} \\cdot ${h}}{2}$`,solution:`$S = \\frac{${a*h}}{2} = ${s}$`}},
    },
    { name: 'По трём сторонам', icon: '🔺',
      generate(){const tris=[[3,4,5],[5,12,13],[6,8,10],[7,8,9]];const [a,b,c]=tris[randInt(0,3)];const p=(a+b+c)/2;const s=Math.sqrt(p*(p-a)*(p-b)*(p-c));return{a,b,c,s}},
      template(a,b,c,s){return{text:`$a = ${a}$, $b = ${b}$, $c = ${c}$. Площадь по Герону.`,answer:s,hint:`$p = \\frac{${a}+${b}+${c}}{2}$, затем $S = \\sqrt{p(p-a)(p-b)(p-c)}$`,solution:`$p = ${p},\\; S = \\sqrt{${p}\\cdot${(p-a)}\\cdot${(p-b)}\\cdot${(p-c)}} = \\sqrt{${p*(p-a)*(p-b)*(p-c)}} = ${s}$`}},
    },
    { name: 'Найти высоту', icon: '📏',
      generate(){const a=randInt(4,12),s=randInt(6,40);const h=2*s/a;return{a,s,h}},
      template(a,s,h){return{text:`Треугольник: $a = ${a}$, $S = ${s}$. Найдите высоту $h$.`,answer:h,hint:`$h = \\frac{2S}{a} = \\frac{2 \\cdot ${s}}{${a}}$`,solution:`$h = \\frac{${2*s}}{${a}} = ${h}$`}},
    }
  ]
};

LESSONS['7.9'] = {
  title: 'Площадь параллелограмма и ромба',
  context: 'Параллелограмм и ромб — базовые четырёхугольники. Зная их свойства, можно вычислить площади сложных фигур.',
  theory: [
    { icon: '🔷', title: 'Параллелограмм', html: '<div class="formula-block">$S = a \\cdot h$</div><p>Также площадь через стороны и угол:</p><div class="formula-block">$S = a \\cdot b \\cdot \\sin \\alpha$</div>' },
    { icon: '💎', title: 'Ромб', html: '<div class="formula-block">$S = a \\cdot h$</div><div class="formula-block">$S = \\frac{d_1 \\cdot d_2}{2}$</div><p>где $d_1$, $d_2$ — диагонали ромба.</p>' }
  ],
  examples: [
    { title: 'Пример: Ромб по диагоналям', steps: [
      { text: '$d_1 = 6$, $d_2 = 8$.', rule: '' },
      { text: '$S = \\frac{6 \\cdot 8}{2} = \\frac{48}{2} = 24$', rule: 'Формула площади ромба' },
      { text: '$S = 24$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Площадь параллелограмма', icon: '🔷',
      generate(){const a=randInt(3,14),h=randInt(2,10);return{a,h,s:a*h}},
      template(a,h,s){return{text:`Параллелограмм: $a = ${a}$, $h = ${h}$. Площадь?`,answer:s,hint:`$S = ${a} \\cdot ${h}$`,solution:`$S = ${a} \\cdot ${h} = ${s}$`}},
    },
    { name: 'Ромб по диагоналям', icon: '💎',
      generate(){const d1=randInt(4,16),d2=randInt(4,16);return{d1,d2,s:d1*d2/2}},
      template(d1,d2,s){return{text:`Ромб: $d_1 = ${d1}$, $d_2 = ${d2}$. Площадь?`,answer:s,hint:`$S = \\frac{${d1} \\cdot ${d2}}{2}$`,solution:`$S = \\frac{${d1*d2}}{2} = ${s}$`}},
    },
    { name: 'Сторона параллелограмма', icon: '📏',
      generate(){const a=randInt(3,12),s=randInt(6,60);const h=s/a;return{a,s,h}},
      template(a,s,h){return{text:`Параллелограмм: $a = ${a}$, $S = ${s}$. Найдите высоту $h$.`,answer:h,hint:`$h = \\frac{S}{a} = \\frac{${s}}{${a}}$`,solution:`$h = \\frac{${s}}{${a}} = ${h}$`}},
    }
  ]
};

LESSONS['7.10'] = {
  title: 'Площадь трапеции',
  context: 'Трапеция — четырёхугольник с одной парой параллельных сторон. Она часто встречается в архитектуре и инженерии.',
  theory: [
    { icon: '📊', title: 'Формула площади трапеции', html: '<div class="formula-block">$S = \\frac{(a+b) \\cdot h}{2}$</div><p>где $a$, $b$ — основания (параллельные стороны), $h$ — высота.</p><div class="highlight-box"><strong>Замечание:</strong> Если $a = b$, формула даёт $S = a \\cdot h$ — площадь параллелограмма.</div>' },
    { icon: '📐', title: 'Средняя линия', html: '<div class="formula-block">$m = \\frac{a+b}{2}$</div><p>Средняя линия трапеции параллельна основаниям и равна их полу-сумме. Тогда:</p><div class="formula-block">$S = m \\cdot h$</div>' }
  ],
  examples: [
    { title: 'Пример: Площадь трапеции', steps: [
      { text: '$a = 5$, $b = 9$, $h = 4$.', rule: '' },
      { text: '$S = \\frac{(5+9) \\cdot 4}{2} = \\frac{14 \\cdot 4}{2} = \\frac{56}{2}$', rule: 'Формула площади' },
      { text: '$S = 28$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Площадь трапеции', icon: '📊',
      generate(){const a=randInt(3,10),b=randInt(3,10),h=randInt(2,8);return{a,b,h,s:(a+b)*h/2}},
      template(a,b,h,s){return{text:`Трапеция: $a = ${a}$, $b = ${b}$, $h = ${h}$. Площадь?`,answer:s,hint:`$S = \\frac{(${a}+${b}) \\cdot ${h}}{2}$`,solution:`$S = \\frac{${a+b} \\cdot ${h}}{2} = \\frac{${(a+b)*h}}{2} = ${s}$`}},
    },
    { name: 'Найти основание', icon: '📐',
      generate(){const b=randInt(4,10),h=randInt(2,8),s=randInt(10,50);const a=2*s/h-b;return{b,h,s,a}},
      template(b,h,s,a){return{text:`Трапеция: $b = ${b}$, $h = ${h}$, $S = ${s}$. Найдите $a$.`,answer:a,hint:`$a = \\frac{2S}{h} - b = \\frac{2 \\cdot ${s}}{${h}} - ${b}$`,solution:`$a = \\frac{${2*s}}{${h}} - ${b} = ${a}$`}},
    },
    { name: 'Средняя линия', icon: '📏',
      generate(){const a=randInt(3,10),b=randInt(3,10);return{a,b,m:(a+b)/2}},
      template(a,b,m){return{text:`Трапеция: $a = ${a}$, $b = ${b}$. Найдите среднюю линию.`,answer:m,hint:`$m = \\frac{a+b}{2} = \\frac{${a}+${b}}{2}$`,solution:`$m = \\frac{${a+b}}{2} = ${m}$`}},
    }
  ]
};

// ==================== GRADE 8 ====================

LESSONS['8.1'] = {
  title: 'Подобные треугольники',
  context: 'Подобие — это когда одна фигура является «масштабированной копией» другой. Это понятие используется в картографии, архитектуре и компьютерной графике.',
  theory: [
    { icon: '🔍', title: 'Определение подобия', html: '<p>Два треугольника <strong>подобны</strong>, если их соответственные углы равны, а соответственные стороны пропорциональны.</p><div class="formula-block">$\\triangle ABC \\sim \\triangle A\'B\'C\' \\Leftrightarrow \\frac{A\'B\'}{AB} = \\frac{B\'C\'}{BC} = \\frac{A\'C\'}{AC} = k$</div><p>$k$ — коэффициент подобия.</p>' },
    { icon: '📐', title: 'Свойства', html: '<ul><li>Соответственные углы равны</li><li>Соответственные стороны пропорциональны с коэффициентом $k$</li><li>$S_1/S_2 = k^2$ — отношение площадей равно квадрату коэффициента подобия</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\triangle ABC \\sim \\triangle DEF$, $AB = 4$, $DE = 8$, $BC = 6$. Найдите $EF$.', rule: '' },
      { text: '$k = \\frac{DE}{AB} = \\frac{8}{4} = 2$', rule: 'Коэффициент подобия' },
      { text: '$EF = BC \\cdot k = 6 \\cdot 2 = 12$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Найти сторону', icon: '📏',
      generate(){const k=randInt(2,5),a=randInt(2,8);return{k,a,b:a*k}},
      template(k,a,b){return{text:`$\\triangle ABC \\sim \\triangle DEF$, $k = ${k}$, $AB = ${a}$. Найдите $DE$.`,answer:b,hint:`$DE = AB \\cdot k = ${a} \\cdot ${k}$`,solution:`$DE = ${a} \\cdot ${k} = ${b}$`}},
    },
    { name: 'Коэффициент', icon: '🔢',
      generate(){const a=randInt(2,6),b=randInt(2,6)*2;return{a,b,k:b/a}},
      template(a,b,k){return{text:`$AB = ${a}$, $DE = ${b}$. Коэффициент подобия?`,answer:k,hint:`$k = \\frac{DE}{AB}$`,solution:`$k = \\frac{${b}}{${a}} = ${k}$`}},
    },
    { name: 'Площадь', icon: '📐',
      generate(){const k=randInt(2,4),s1=randInt(3,10);return{k,s1,s2:s1*k*k}},
      template(k,s1,s2){return{text:`$\\triangle ABC \\sim \\triangle DEF$, $k = ${k}$, $S_{ABC} = ${s1}$. Найдите $S_{DEF}$.`,answer:s2,hint:`$S_2 = S_1 \\cdot k^2 = ${s1} \\cdot ${k}^2$`,solution:`$S_{DEF} = ${s1} \\cdot ${k*k} = ${s2}$`}},
    }
  ]
};

LESSONS['8.2'] = {
  title: 'Признаки подобия треугольников',
  context: 'Чтобы доказать подобие треугольников, не обязательно знать все стороны — достаточно нескольких углов или пропорциональности.',
  theory: [
    { icon: '📋', title: 'Признаки подобия', html: '<ul><li><strong>По двум углам (по углу):</strong> Если два угла одного треугольника равны двум углам другого</li><li><strong>По двум сторонам и углу:</strong> Если две стороны пропорциональны и углы между ними равны</li><li><strong>По трём сторонам:</strong> Если все три стороны пропорциональны</li></ul><div class="highlight-box green"><strong>Примечание:</strong> Признака «по трём сторонам» аналогичен признаку равенства по трём сторонам, но для подобия.</div>' }
  ],
  examples: [
    { title: 'Пример: По углу', steps: [
      { text: '$\\angle A = \\angle D = 50°$, $\\angle B = \\angle E = 70°$.', rule: '' },
      { text: '$\\triangle ABC \\sim \\triangle DEF$ по признаку «по двум углам»', rule: 'Достаточно двух равных углов' }
    ]}
  ],
  taskTypes: [
    { name: 'Какой признак?', icon: '📋',
      generate(){const signs=[{info:'Два угла равны',ans:'по двум углам'},{info:'Две стороны пропорциональны и углы между ними равны',ans:'по двум сторонам и углу'},{info:'Все три стороны пропорциональны',ans:'по трём сторонам'}];const s=signs[randInt(0,2)];return{...s}},
      template(info,ans){return{text:`Какой признак подобия? ${info}`,answer:ans,hint:`Вспомните признаки подобия треугольников`,solution:`Это признак ${ans}`}},
    },
    { name: 'Третий угол', icon: '📐',
      generate(){const a=randInt(30,80),b=randInt(30,180-a-20);return{a,b,c:180-a-b}},
      template(a,b,c){return{text:`Если $\\angle A = ${a}°$ и $\\angle B = ${b}°$, какой $\\angle C$?`,answer:String(c),hint:`$180° - ${a}° - ${b}°$`,solution:`$\\angle C = ${c}°$`}},
    },
    { name: 'Коэффициент подобия', icon: '🔢',
      generate(){const a=randInt(3,8),b=randInt(3,8);return{a,b,k:b/a}},
      template(a,b,k){return{text:`$AB = ${a}$, $DE = ${b}$. Коэффициент $k$?`,answer:k,hint:`$k = \\frac{${b}}{${a}}$`,solution:`$k = ${k}$`}},
    }
  ]
};

LESSONS['8.3'] = {
  title: 'Медиана, биссектриса, высота',
  context: 'Три основных отрезка в треугольнике — медиана, биссектриса и высота — имеют уникальные свойства и пересекаются в особых точках.',
  theory: [
    { icon: '📏', title: 'Медиана', html: '<p><strong>Медиана</strong> — отрезок от вершины к середине противоположной стороны.</p><div class="formula-block">$m_a = \\frac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}$</div><div class="highlight-box"><strong>Свойство:</strong> Все три медианы пересекаются в центре тяжести, делящей каждую медиану в отношении 2:1 от вершины.</div>' },
    { icon: '📐', title: 'Биссектриса', html: '<p><strong>Биссектриса</strong> — отрезок, делящий угол пополам.</p><div class="formula-block">$\\frac{|BD|}{|DC|} = \\frac{AB}{AC}$</div><div class="highlight-box green"><strong>Свойство:</strong> Биссектрисы пересекаются в точке, равноудалённой от всех сторон.</div>' },
    { icon: '📏', title: 'Высота', html: '<p><strong>Высота</strong> — перпендикуляр от вершины к противоположной стороне.</p><div class="formula-block">$h_a = \\frac{2S}{a}$</div>' }
  ],
  examples: [
    { title: 'Пример: Медиана', steps: [
      { text: '$AB = 5$, $AC = 7$, $BC = 6$. Найдите медиану $m_a$.', rule: '' },
      { text: '$m_a = \\frac{1}{2}\\sqrt{2 \\cdot 49 + 2 \\cdot 25 - 36} = \\frac{1}{2}\\sqrt{88}$', rule: 'Формула медианы' },
      { text: '$m_a = \\frac{1}{2} \\cdot 9.38 \\approx 4.69$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Высота', icon: '📏',
      generate(){const a=randInt(4,12),s=randInt(6,40);return{a,s,h:2*s/a}},
      template(a,s,h){return{text:`$a = ${a}$, $S = ${s}$. Найдите высоту $h_a$.`,answer:h,hint:`$h = \\frac{2S}{a}$`,solution:`$h = \\frac{2 \\cdot ${s}}{${a}} = ${h}$`}},
    },
    { name: 'Деление биссектрисой', icon: '📐',
      generate(){const ab=randInt(3,10),ac=randInt(3,10),bc=randInt(3,15);const bd=(ab/(ab+ac))*bc;return{ab,ac,bc,bd:Math.round(bd*100)/100}},
      template(ab,ac,bc,bd){return{text:`$AB = ${ab}$, $AC = ${ac}$, $BC = ${bc}$. Биссектриса $AD$ делит $BC$. Найдите $BD$.`,answer:bd,hint:`$BD = \\frac{AB}{AB+AC} \\cdot BC$`,solution:`$BD = \\frac{${ab}}{${ab+ac}} \\cdot ${bc} \\approx ${bd}$`}},
    },
    { name: 'Медиана к стороне', icon: '📏',
      generate(){const a=randInt(3,10),b=randInt(3,10),c=randInt(3,10);const ma=Math.sqrt(2*b*b+2*c*c-a*a)/2;return{a,b,c,ma:Math.round(ma*100)/100}},
      template(a,b,c,ma){return{text:`$b = ${b}$, $c = ${c}$, $a = ${a}$. Медиана $m_a$?`,answer:ma,hint:`$m_a = \\frac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}$`,solution:`$m_a = \\frac{1}{2}\\sqrt{${2*b*b}+${2*c*c}-${a*a}} \\approx ${ma}$`}},
    }
  ]
};

LESSONS['8.4'] = {
  title: 'Прямоугольный треугольник',
  context: 'Прямоугольный треугольник — основа тригонометрии и аналитической геометрии. Его свойства используются повсюду: от построения зданий до навигации.',
  theory: [
    { icon: '📐', title: 'Свойства', html: '<ul><li>Один угол равен $90°$</li><li>Сторона против прямоугольного угла — <strong>гипотенуза</strong> ($c$)</li><li>Две другие стороны — <strong>катеты</strong> ($a$, $b$)</li><li>$c > a$, $c > b$</li></ul>' },
    { icon: '📏', title: 'Средняя линия к гипотенузе', html: '<div class="formula-block">$m = \\frac{c}{2}$</div><p>Средняя линия, проведённая к гипотенузе, равна половине гипотенузы.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$a = 3$, $b = 4$. Найдите гипотенузу.', rule: '' },
      { text: '$c = \\sqrt{a^2 + b^2} = \\sqrt{9 + 16} = \\sqrt{25}$', rule: 'Теорема Пифагора' },
      { text: '$c = 5$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Гипотенуза', icon: '📐',
      generate(){const triples=[[3,4,5],[5,12,13],[6,8,10],[7,24,25],[8,15,17]];const [a,b,c]=triples[randInt(0,4)];return{a,b,c}},
      template(a,b,c){return{text:`$a = ${a}$, $b = ${b}$. Гипотенуза?`,answer:c,hint:`$c = \\sqrt{${a}^2 + ${b}^2}$`,solution:`$c = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a+b*b}} = ${c}$`}},
    },
    { name: 'Катет', icon: '📏',
      generate(){const triples=[[3,4,5],[5,12,13],[6,8,10],[7,24,25],[8,15,17]];const [a,b,c]=triples[randInt(0,4)];const askB=Math.random()>.5;return{a,b,c,askB,ans:askB?b:a}},
      template(a,b,c,askB,ans){return{text:`Катет $${askB?'a':'b'} = ${askB?a:b}$, гипотенуза $c = ${c}$. Найдите $${askB?'b':'a'}$.`,answer:ans,hint:`$${askB?'b':'a'} = \\sqrt{${c}^2 - ${askB?a:b}^2}$`,solution:`$\\sqrt{${c*c} - ${askB?a:b}*${askB?a:b}} = \\sqrt{${c*c-(askB?a:b)*(askB?a:b)}} = ${ans}$`}},
    },
    { name: 'Площадь', icon: '📐',
      generate(){const a=randInt(3,12),b=randInt(3,12);return{a,b,s:a*b/2}},
      template(a,b,s){return{text:`Прямоугольный треугольник: $a = ${a}$, $b = ${b}$. Площадь?`,answer:s,hint:`$S = \\frac{a \\cdot b}{2}$`,solution:`$S = \\frac{${a} \\cdot ${b}}{2} = ${s}$`}},
    }
  ]
};

LESSONS['8.5'] = {
  title: 'Теорема Пифагора',
  context: 'Теорема Пифагора — одна из самых известных и важнейших теорем в математике. Она связывает стороны прямоугольного треугольника.',
  theory: [
    { icon: '📏', title: 'Формулировка', html: '<div class="formula-block">$a^2 + b^2 = c^2$</div><p>Квадрат гипотенузы равен сумме квадратов катетов.</p><div class="highlight-box green"><strong>Обратная теорема:</strong> Если $a^2 + b^2 = c^2$, то треугольник прямоугольный.</div>' },
    { icon: '📐', title: 'Числа Пифагора', html: '<p>Тройки натуральных чисел, удовлетворяющих $a^2 + b^2 = c^2$:</p><p>$3, 4, 5$;  $5, 12, 13$;  $6, 8, 10$;  $7, 24, 25$;  $8, 15, 17$</p>' }
  ],
  examples: [
    { title: 'Пример: Проверка', steps: [
      { text: 'Треугольник со сторонами $6$, $8$, $10$.', rule: '' },
      { text: '$6^2 + 8^2 = 36 + 64 = 100$', rule: 'Сумма квадратов катетов' },
      { text: '$10^2 = 100 = 6^2 + 8^2$ ✓', rule: 'Прямоугольный' }
    ]}
  ],
  taskTypes: [
    { name: 'Найти гипотенузу', icon: '📐',
      generate(){const a=randInt(3,15),b=randInt(3,15);return{a,b,c:Math.round(Math.sqrt(a*a+b*b)*100)/100}},
      template(a,b,c){return{text:`$a = ${a}$, $b = ${b}$. Найдите $c$ по теореме Пифагора.`,answer:c,hint:`$c = \\sqrt{${a}^2 + ${b}^2}$`,solution:`$c = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a+b*b}} \\approx ${c}$`}},
    },
    { name: 'Обратная теорема', icon: '✅',
      generate(){const t=randInt(0,1);if(t){const triples=[[3,4,5],[5,12,13],[6,8,10],[7,24,25],[8,15,17]];const s=triples[randInt(0,4)].sort(()=>Math.random()-.5);return{s,ans:'прямоугольный'}}else{const s=[randInt(3,6),randInt(7,11),randInt(12,16)].sort((a,b)=>a-b);return{s,ans:'не прямоугольный'}}},
      template(s,ans){return{text:`Треугольник со сторонами $${s[0]}$, $${s[1]}$, $${s[2]}$. Какой?`,answer:ans,hint:`Проверьте $a^2 + b^2$ и $c^2$`,solution:`${s[0]}^2 + ${s[1]}^2 = ${s[0]*s[0]+s[1]*s[1]} ${s[0]*s[0]+s[1]*s[1]===s[2]*s[2]?'=':'≠'} ${s[2]}^2 = ${s[2]*s[2]}$ — ${ans}`}},
    },
    { name: 'Катет', icon: '📏',
      generate(){const c=randInt(5,15),a=randInt(3,c-1);const b=Math.sqrt(c*c-a*a);return{c,a,b:Math.round(b*100)/100}},
      template(c,a,b){return{text:`Гипотенуза $c = ${c}$, катет $a = ${a}$. Найдите $b$.`,answer:b,hint:`$b = \\sqrt{${c}^2 - ${a}^2}$`,solution:`$b = \\sqrt{${c*c} - ${a*a}} = \\sqrt{${c*c-a*a}} \\approx ${b}$`}},
    }
  ]
};

LESSONS['8.6'] = {
  title: 'Метрические соотношения',
  context: 'В прямоугольном треугольнике высота, проведённая к гипотенузе, порождает множество полезных соотношений.',
  theory: [
    { icon: '📐', title: 'Соотношения с высотой', html: '<p>Пусть $CD$ — высота в прямоугольном $\\triangle ABC$ ($\\angle C = 90°$):</p><div class="formula-block">$CD^2 = AD \\cdot DB$</div><div class="formula-block">$AC^2 = AD \\cdot AB$</div><div class="formula-block">$BC^2 = BD \\cdot AB$</div><div class="formula-block">$CD = \\frac{AC \\cdot BC}{AB}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$AD = 4$, $DB = 9$. Найдите $CD$.', rule: '' },
      { text: '$CD = \\sqrt{4 \\cdot 9} = \\sqrt{36} = 6$', rule: 'Соотношение с высотой' },
      { text: '$CD = 6$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Высота к гипотенузе', icon: '📏',
      generate(){const ad=randInt(2,8),db=randInt(2,8);return{ad,db,cd:Math.sqrt(ad*db)}},
      template(ad,db,cd){return{text:`$AD = ${ad}$, $DB = ${db}$. Найдите высоту $CD$.`,answer:cd,hint:`$CD = \\sqrt{AD \\cdot DB}$`,solution:`$CD = \\sqrt{${ad} \\cdot ${db}} = \\sqrt{${ad*db}} = ${cd}$`}},
    },
    { name: 'Катет по проекции', icon: '📐',
      generate(){const ad=randInt(2,8),db=randInt(2,8);const ac=Math.sqrt(ad*(ad+db));return{ad,db,ab:ad+db,ac:Math.round(ac*100)/100}},
      template(ad,db,ab,ac){return{text:`$AD = ${ad}$, $DB = ${db}$. Найдите $AC$.`,answer:ac,hint:`$AC = \\sqrt{AD \\cdot AB}$`,solution:`$AC = \\sqrt{${ad} \\cdot ${ab}} = \\sqrt{${ad*ab}} \\approx ${ac}$`}},
    },
    { name: 'Сторона через высоту', icon: '📐',
      generate(){const a=randInt(4,10),b=randInt(4,10);const c=Math.sqrt(a*a+b*b);return{a,b,c:Math.round(c*100)/100}},
      template(a,b,c){return{text:`$a = ${a}$, $b = ${b}$. Найдите гипотенузу $c$.`,answer:c,hint:`$c = \\sqrt{a^2 + b^2}$`,solution:`$c = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a+b*b}} \\approx ${c}$`}},
    }
  ]
};

LESSONS['8.7'] = {
  title: 'Вписанные и описанные фигуры',
  context: 'Вписанные и описанные окружности и многоугольники — классические задачи геометрии с практическими приложениями.',
  theory: [
    { icon: '⭕', title: 'Вписанный многоугольник', html: '<p><strong>Вписанный многоугольник</strong> — все его вершины лежат на окружности.</p><div class="highlight-box"><strong>Свойство:</strong> Противоположные углы вписанного четырёхугольника дополнены до $180°$.</div>' },
    { icon: '📐', title: 'Описанный многоугольник', html: '<p><strong>Описанный многоугольник</strong> — все его стороны касаются окружности.</p><div class="highlight-box green"><strong>Сумма касательных:</strong> $AB + CD = BC + DA$ для описанного четырёхугольника.</div>' },
    { icon: '🔵', title: 'Вписанный угол', html: '<div class="formula-block">$\\angle = \\frac{1}{2} \\text{дуга}$</div><p>Вписанный угол равен половине дуги, на которую он опирается.</p>' }
  ],
  examples: [
    { title: 'Пример: Противоположные углы', steps: [
      { text: '$\\angle A = 65°$ во вписанном четырёхугольнике. Найдите $\\angle C$.', rule: '' },
      { text: '$\\angle C = 180° - 65° = 115°$', rule: 'Противоположные углы дополнены до 180°' }
    ]}
  ],
  taskTypes: [
    { name: 'Противоположный угол', icon: '📐',
      generate(){const a=randInt(30,150);return{a,b:180-a}},
      template(a,b){return{text:`Вписан четырёхугольник. $\\angle A = ${a}°$. Найдите $\\angle C$.`,answer:b,hint:`$180° - ${a}°$`,solution:`$\\angle C = ${b}°$`}},
    },
    { name: 'Вписанный угол', icon: '⭕',
      generate(){const arc=randInt(40,200);return{arc,ans:arc/2}},
      template(arc,ans){return{text:`Дуга $AB = ${arc}°$. Каков вписанный угол $\\angle ACB$?`,answer:ans,hint:`$\\angle = \\frac{1}{2} \\cdot ${arc}°$`,solution:`$\\angle = ${ans}°$`}},
    },
    { name: 'Сумма касательных', icon: '📏',
      generate(){const a=randInt(3,8),b=randInt(3,8),c=randInt(3,8);return{a,b,c,d:a+c-b-c}},
      template(a,b,c,d){return{text:`Описанный четырёхугольник: $AB = ${a}$, $BC = ${b}$, $CD = ${c}$. Найдите $DA$.`,answer:d,hint:`$DA = AB + CD - BC$`,solution:`$DA = ${a} + ${c} - ${b} = ${d}$`}},
    }
  ]
};

LESSONS['8.8'] = {
  title: 'Касательные к окружности',
  context: 'Касательные линии играют важную роль в механике (ремни, шкивы), оптике (лучи света) и навигации.',
  theory: [
    { icon: '⭕', title: 'Свойства касательной', html: '<div class="highlight-box"><strong>Касательная</strong> к окружности перпендикулярна радиусу в точке касания.</div><p>Из точки $A$ (вне окружности) можно провести две касательные, и они равны:</p><div class="formula-block">$|AT_1| = |AT_2|$</div>' },
    { icon: '📐', title: 'Длина касательной', html: '<div class="formula-block">$|AT| = \\sqrt{|OA|^2 - R^2}$</div><p>где $O$ — центр, $R$ — радиус, $A$ — внешняя точка.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$R = 5$, $|OA| = 13$. Найдите $|AT|$.', rule: '' },
      { text: '$|AT| = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$', rule: 'Длина касательной' }
    ]}
  ],
  taskTypes: [
    { name: 'Длина касательной', icon: '⭕',
      generate(){const triples=[[5,12,13],[6,8,10],[7,24,25],[8,15,17]];const [r,at,oa]=triples[randInt(0,3)];return{r,oa,at}},
      template(r,oa,at){return{text:`$R = ${r}$, $|OA| = ${oa}$. Найдите $|AT|$.`,answer:at,hint:`$\\sqrt{${oa}^2 - ${r}^2}$`,solution:`$|AT| = \\sqrt{${oa*oa} - ${r*r}} = \\sqrt{${oa*oa-r*r}} = ${at}$`}},
    },
    { name: 'Радиус', icon: '🔵',
      generate(){const r=randInt(3,10),at=randInt(3,10);return{r,at,oa:Math.sqrt(r*r+at*at)}},
      template(r,at,oa){return{text:`$|AT| = ${at}$, $|OA| = ${oa}$. Найдите $R$.`,answer:r,hint:`$R = \\sqrt{OA^2 - AT^2}$`,solution:`$R = \\sqrt{${oa*oa} - ${at*at}} = \\sqrt{${r*r}} = ${r}$`}},
    },
    { name: 'Угол касательной', icon: '📐',
      generate(){const ang=randInt(25,65);return{ang,comp:90-ang}},
      template(ang,comp){return{text:`Касательная и радиус образуют угол $90°$. Если угол между касательной и хордой $${ang}°$, какой вписанный угол?`,answer:ang,hint:`Вписанный угол = углу между касательной и хордой`,solution:`$\\angle = ${ang}°$`}},
    }
  ]
};

LESSONS['8.9'] = {
  title: 'Задачи на подобие',
  context: 'Подобие треугольников — мощный инструмент для решения задач на расстояния, высоты и пропорции.',
  theory: [
    { icon: '🧩', title: 'Типы задач', html: '<ul><li>Нахождение неизвестных сторон по коэффициенту подобия</li><li>Задачи с высотами, медианами и биссектрисами подобных треугольников</li><li>Задачи на пропорциональность отрезков</li></ul><div class="highlight-box green"><strong>Свойство:</strong> Отношение любых линейных элементов подобных треугольников равно коэффициенту подобия $k$.</div>' }
  ],
  examples: [
    { title: 'Пример: Высоты', steps: [
      { text: '$\\triangle ABC \\sim \\triangle DEF$, $k = 3$, $h_{ABC} = 4$. Найдите $h_{DEF}$.', rule: '' },
      { text: '$h_{DEF} = h_{ABC} \\cdot k = 4 \\cdot 3 = 12$', rule: 'Высоты пропорциональны сторонам' }
    ]}
  ],
  taskTypes: [
    { name: 'Высота подобного', icon: '📏',
      generate(){const k=randInt(2,5),h=randInt(2,8);return{k,h,ans:h*k}},
      template(k,h,ans){return{text:`$k = ${k}$, $h_1 = ${h}$. Найдите высоту второго треугольника.`,answer:ans,hint:`$h_2 = ${h} \\cdot ${k}$`,solution:`$h_2 = ${ans}$`}},
    },
    { name: 'Медиана', icon: '📏',
      generate(){const k=randInt(2,4),m=randInt(3,10);return{k,m,ans:m*k}},
      template(k,m,ans){return{text:`$k = ${k}$, $m_1 = ${m}$. Медиана второго треугольника?`,answer:ans,hint:`$m_2 = ${m} \\cdot ${k}$`,solution:`$m_2 = ${ans}$`}},
    },
    { name: 'Площадь', icon: '📐',
      generate(){const k=randInt(2,4),s=randInt(3,12);return{k,s,ans:s*k*k}},
      template(k,s,ans){return{text:`$k = ${k}$, $S_1 = ${s}$. Площадь второго?`,answer:ans,hint:`$S_2 = ${s} \\cdot ${k}^2$`,solution:`$S_2 = ${s} \\cdot ${k*k} = ${ans}$`}},
    }
  ]
};

LESSONS['8.10'] = {
  title: 'Тригонометрия в треугольнике',
  context: 'Тригонометрические функции связывают углы и стороны треугольника — основа для навигации, физики и инженерии.',
  theory: [
    { icon: '📐', title: 'Основные функции', html: '<div class="formula-block">$\\sin \\alpha = \\frac{\\text{против}}{\\text{гипотенуза}}$,  $\\cos \\alpha = \\frac{\\text{прилеж}}{\\text{гипотенуза}}$,  $\\text{tg} \\alpha = \\frac{\\text{против}}{\\text{прилеж}}$</div>' },
    { icon: '📏', title: 'Фундаментальное тождество', html: '<div class="formula-block">$\\sin^2 \\alpha + \\cos^2 \\alpha = 1$</div>' },
    { icon: '📐', title: 'Значения', html: '<div class="highlight-box"><strong>Ключевые значения:</strong><br>$\\sin 30° = \\frac{1}{2}$, $\\cos 30° = \\frac{\\sqrt{3}}{2}$<br>$\\sin 45° = \\frac{\\sqrt{2}}{2}$, $\\cos 45° = \\frac{\\sqrt{2}}{2}$<br>$\\sin 60° = \\frac{\\sqrt{3}}{2}$, $\\cos 60° = \\frac{1}{2}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\alpha = 30°$, против = 5. Найдите гипотенузу.', rule: '' },
      { text: '$\\sin 30° = \\frac{5}{c} \\Rightarrow c = \\frac{5}{\\sin 30°} = \\frac{5}{0.5} = 10$', rule: 'Через синус' }
    ]}
  ],
  taskTypes: [
    { name: 'Синус', icon: '📐',
      generate(){const opp=randInt(3,8),hyp=randInt(Math.max(opp+1,opp+2),opp+5);const sin=opp/hyp;return{opp,hyp,sin:sin.toFixed(2)}},
      template(opp,hyp,sin){return{text:`Против = $${opp}$, гипотенуза = $${hyp}$. $\\sin \\alpha = ?$`,answer:sin,hint:`$\\sin = \\frac{\\text{против}}{\\text{гипотенуза}}$`,solution:`$\\sin \\alpha = \\frac{${opp}}{${hyp}} = ${sin}$`}},
    },
    { name: 'Косинус', icon: '📐',
      generate(){const adj=randInt(3,8),hyp=randInt(Math.max(adj+1,adj+2),adj+5);const cos=adj/hyp;return{adj,hyp,cos:cos.toFixed(2)}},
      template(adj,hyp,cos){return{text:`Прилежащий = $${adj}$, гипотенуза = $${hyp}$. $\\cos \\alpha = ?$`,answer:cos,hint:`$\\cos = \\frac{\\text{прилеж}}{\\text{гипотенуза}}$`,solution:`$\\cos \\alpha = \\frac{${adj}}{${hyp}} = ${cos}$`}},
    },
    { name: 'Тангенс', icon: '📐',
      generate(){const opp=randInt(2,8),adj=randInt(2,8);const tg=(opp/adj).toFixed(2);return{opp,adj,tg}},
      template(opp,adj,tg){return{text:`Против = $${opp}$, прилежащий = $${adj}$. $\\text{tg} \\alpha = ?$`,answer:tg,hint:`$\\text{tg} = \\frac{\\text{против}}{\\text{прилеж}}$`,solution:`$\\text{tg} \\alpha = \\frac{${opp}}{${adj}} = ${tg}$`}},
    }
  ]
};

// ==================== GRADE 9 ====================

LESSONS['9.1'] = {
  title: 'Координаты на плоскости',
  context: 'Система координат позволяет задавать положение точек числами — основа аналитической геометрии и计算机ной графики.',
  theory: [
    { icon: '📊', title: 'Система координат', html: '<p><strong>Декартова система координат</strong> — две перпендикулярные оси $Ox$ и $Oy$, пересекающиеся в начале координат $O$.</p><p>Каждой точке $M$ ставится в соответствие пара чисел $(x; y)$ — координаты.</p>' },
    { icon: '📏', title: 'Расстояние между точками', html: '<div class="formula-block">$|AB| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$</div>' },
    { icon: '📍', title: 'Середина отрезка', html: '<div class="formula-block">$M = \\left(\\frac{x_1 + x_2}{2};\\; \\frac{y_1 + y_2}{2}\\right)$</div>' },
    { icon: '📐', title: 'Деление отрезка', html: '<p>Точка $C$ делит $AB$ в отношении $\\lambda = \\frac{AC}{CB}$:</p><div class="formula-block">$C = \\left(\\frac{x_1 + \\lambda x_2}{1+\\lambda};\\; \\frac{y_1 + \\lambda y_2}{1+\\lambda}\\right)$</div><div class="highlight-box green"><strong>Середина</strong> — частный случай: $\\lambda = 1$.</div>' }
  ],
  examples: [
    { title: 'Пример: Расстояние', steps: [
      { text: '$A(1; 2)$, $B(4; 6)$.', rule: '' },
      { text: '$|AB| = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$', rule: 'Формула расстояния' }
    ]},
    { title: 'Пример: Середина', steps: [
      { text: '$A(2; 4)$, $B(8; 10)$. Найти середину.', rule: '' },
      { text: '$M = \\left(\\frac{2+8}{2}; \\frac{4+10}{2}\\right) = (5; 7)$', rule: 'Среднее арифметическое координат' }
    ]}
  ],
  taskTypes: [
    { name: 'Расстояние', icon: '📏',
      generate(){const x1=randInt(0,5),y1=randInt(0,5),x2=x1+randInt(1,8),y2=y1+randInt(1,8);return{x1,y1,x2,y2,ans:Math.round(Math.sqrt((x2-x1)**2+(y2-y1)**2)*100)/100}},
      template(x1,y1,x2,y2,ans){return{text:`$A(${x1};${y1})$, $B(${x2};${y2})$. $|AB| = ?$, ответ округлите до сотых.`,answer:ans,hint:`$\\sqrt{(${x2}-${x1})^2+(${y2}-${y1})^2}$`,solution:`$\\sqrt{${(x2-x1)**2}+${(y2-y1)**2}} = \\sqrt{${(x2-x1)**2+(y2-y1)**2}} \\approx ${ans}$`}},
    },
    { name: 'Середина', icon: '📍',
      generate(){const x1=randInt(0,10),y1=randInt(0,10),x2=randInt(0,10),y2=randInt(0,10);return{x1,y1,x2,y2,xm:(x1+x2)/2,ym:(y1+y2)/2}},
      template(x1,y1,x2,y2,xm,ym){return{text:`$A(${x1};${y1})$, $B(${x2};${y2})$. Найдите середину $AB$. Ответ: $(x;y)$`,answer:`${xm};${ym}`,hint:`$x = \\frac{${x1}+${x2}}{2}$, $y = \\frac{${y1}+${y2}}{2}$`,solution:`$M = (${xm};${ym})$`}},
    },
    { name: 'Координата точки', icon: '🔢',
      generate(){const x1=randInt(0,5),y1=randInt(0,5),x2=randInt(7,12),y2=randInt(7,12);return{x1,y1,x2,y2,ans:x2}},
      template(x1,y1,x2,y2,ans){return{text:`$|AB| = \\sqrt{${(x2-x1)**2}+${(y2-y1)**2}}$. $A(${x1};${y1})$, $B(x;${y2})$. Найдите $x$.`,answer:ans,hint:`$(x-${x1})^2 = ${(x2-x1)**2+(y2-y1)**2}-${(y2-y1)**2} = ${(x2-x1)**2}$`,solution:`$x = ${x1} + ${x2-x1} = ${x2}$`}},
    }
  ]
};

LESSONS['9.2'] = {
  title: 'Векторы: определение и операции',
  context: 'Вектор — направленный отрезок. Векторы используются в физике (сила, скорость), навигации и компьютерной графике.',
  theory: [
    { icon: '➡️', title: 'Определение', html: '<p><strong>Вектор</strong> — отрезок с направлением. Обозначение: $\\vec{AB}$ или $\\vec{a}$.</p><p><strong>Длина (модуль)</strong> вектора: $|\\vec{AB}| = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$</p><p><strong>Координаты:</strong> $\\vec{AB} = (x_2-x_1;\\; y_2-y_1)$</p>' },
    { icon: '➕', title: 'Сложение и вычитание', html: '<div class="formula-block">$\\vec{a} + \\vec{b} = (a_x+b_x;\\; a_y+b_y)$</div><div class="formula-block">$\\vec{a} - \\vec{b} = (a_x-b_x;\\; a_y-b_y)$</div>' },
    { icon: '🔢', title: 'Умножение на число', html: '<div class="formula-block">$\\lambda \\vec{a} = (\\lambda a_x;\\; \\lambda a_y)$</div><div class="highlight-box"><strong>Свойство:</strong> $|\\lambda \\vec{a}| = |\\lambda| \\cdot |\\vec{a}|$</div>' },
    { icon: '⚖️', title: 'Коллинеарность', html: '<p>Два вектора <strong>коллинеарны</strong>, если один равен другому, умноженному на число: $\\vec{a} = \\lambda \\vec{b}$.</p><div class="formula-block">$\\vec{a} \\parallel \\vec{b} \\Leftrightarrow a_x b_y - a_y b_x = 0$</div>' }
  ],
  examples: [
    { title: 'Пример: Координаты вектора', steps: [
      { text: '$A(1; 2)$, $B(4; 6)$. Найдите $\\vec{AB}$.', rule: '' },
      { text: '$\\vec{AB} = (4-1; 6-2) = (3; 4)$', rule: 'Координаты конец минус начало' }
    ]}
  ],
  taskTypes: [
    { name: 'Координаты', icon: '➡️',
      generate(){const x1=randInt(0,5),y1=randInt(0,5),dx=randInt(1,8),dy=randInt(1,8);return{x1,y1,x2:x1+dx,y2:y1+dy,dx,dy}},
      template(x1,y1,x2,y2,dx,dy){return{text:`$A(${x1};${y1})$, $B(${x2};${y2})$. $\\vec{AB} = (x; y)$. Ответ: $x;y$`,answer:`${dx};${dy}`,hint:`$x = ${x2}-${x1}$, $y = ${y2}-${y1}$`,solution:`$\\vec{AB} = (${dx};${dy})$`}},
    },
    { name: 'Сложение', icon: '➕',
      generate(){const ax=randInt(1,8),ay=randInt(1,8),bx=randInt(1,8),by=randInt(1,8);return{ax,ay,bx,by,rx:ax+bx,ry:ay+by}},
      template(ax,ay,bx,by,rx,ry){return{text:`$\\vec{a}=(${ax};${ay})$, $\\vec{b}=(${bx};${by})$. $\\vec{a}+\\vec{b} = ?$ Ответ: $x;y$`,answer:`${rx};${ry}`,hint:`$x = ${ax}+${bx}$, $y = ${ay}+${by}$`,solution:`$\\vec{a}+\\vec{b} = (${rx};${ry})$`}},
    },
    { name: 'Длина вектора', icon: '📏',
      generate(){const ax=randInt(3,8),ay=randInt(3,8);return{ax,ay,len:Math.round(Math.sqrt(ax*ax+ay*ay)*100)/100}},
      template(ax,ay,len){return{text:`$\\vec{a}=(${ax};${ay})$. $|\\vec{a}| = ?$, округлите до сотых.`,answer:len,hint:`$\\sqrt{${ax}^2+${ay}^2}$`,solution:`$|\\vec{a}| = \\sqrt{${ax*ax}+${ay*ay}} = \\sqrt{${ax*ax+ay*ay}} \\approx ${len}$`}},
    }
  ]
};

LESSONS['9.3'] = {
  title: 'Декомпозиция вектора по базису',
  context: 'Любой вектор на плоскости можно разложить по двум неколлинеарным векторам — базису. Это аналог координатной системы.',
  theory: [
    { icon: '📐', title: 'Базис', html: '<p>Два неколлинеарных вектора $\\vec{e_1}$ и $\\vec{e_2}$ образуют <strong>базис</strong>, если любой вектор $\\vec{a}$ единственным образом представляется:</p><div class="formula-block">$\\vec{a} = \\alpha \\vec{e_1} + \\beta \\vec{e_2}$</div><p>$\\alpha$, $\\beta$ — координаты вектора в базисе $(\\vec{e_1}, \\vec{e_2})$.</p>' },
    { icon: '✅', title: 'Стандартный базис', html: '<p>Координатные оси задают базис: $\\vec{i} = (1; 0)$, $\\vec{j} = (0; 1)$.</p><div class="formula-block">$\\vec{a} = (x; y) = x\\vec{i} + y\\vec{j}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{e_1} = (1; 0)$, $\\vec{e_2} = (0; 1)$, $\\vec{a} = (3; 5)$.', rule: '' },
      { text: '$\\vec{a} = 3\\vec{e_1} + 5\\vec{e_2}$', rule: 'Координаты = коэффициенты в стандартном базисе' }
    ]}
  ],
  taskTypes: [
    { name: 'Коэффициенты', icon: '📐',
      generate(){const a=randInt(1,8),b=randInt(1,8);return{a,b}},
      template(a,b){return{text:`$\\vec{a} = (${a};${b})$ в стандартном базисе. Найдите коэффициенты $\\alpha$, $\\beta$. Ответ: $\\alpha;\\beta$`,answer:`${a};${b}`,hint:`В стандартном базисе координаты = коэффициенты`,solution:`$\\alpha = ${a}$, $\\beta = ${b}$`}},
    },
    { name: 'Сумма по базису', icon: '➕',
      generate(){const a=randInt(1,6),b=randInt(1,6),c=randInt(1,6),d=randInt(1,6);return{a,b,c,d,rx:a+c,ry:b+d}},
      template(a,b,c,d,rx,ry){return{text:`$\\vec{a} = ${a}\\vec{e_1}+${b}\\vec{e_2}$, $\\vec{c} = ${c}\\vec{e_1}+${d}\\vec{e_2}$. Сумма? Ответ: $\\alpha;\\beta$`,answer:`${rx};${ry}`,hint:`Сложите коэффициенты при $\\vec{e_1}$ и $\\vec{e_2}$ отдельно`,solution:`$(${a}+${c})\\vec{e_1}+(${b}+${d})\\vec{e_2} = ${rx}\\vec{e_1}+${ry}\\vec{e_2}$`}},
    },
    { name: 'Найти вектор', icon: '🔢',
      generate(){const alpha=randInt(1,8),beta=randInt(1,8);return{alpha,beta}},
      template(alpha,beta){return{text:`$\\vec{a} = ${alpha}\\vec{e_1}+${beta}\\vec{e_2}$. Каковы координаты? Ответ: $x;y$`,answer:`${alpha};${beta}`,hint:`Координаты = коэффициенты`,solution:`$\\vec{a} = (${alpha};${beta})$`}},
    }
  ]
};

LESSONS['9.4'] = {
  title: 'Скалярное произведение векторов',
  context: 'Скалярное произведение — операция над векторами, результат которой число. Оно связано с углом между векторами и проекцией.',
  theory: [
    { icon: '🔢', title: 'Определение', html: '<div class="formula-block">$\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y$</div><p>Также:</p><div class="formula-block">$\\vec{a} \\cdot \\vec{b} = |\\vec{a}| \\cdot |\\vec{b}| \\cdot \\cos \\varphi$</div><p>где $\\varphi$ — угол между векторами.</p>' },
    { icon: '📐', title: 'Свойства', html: '<ul><li>$\\vec{a} \\cdot \\vec{b} = \\vec{b} \\cdot \\vec{a}$ (коммутативность)</li><li>$\\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2$</li><li>$\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0$</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{a} = (2; 3)$, $\\vec{b} = (4; -1)$.', rule: '' },
      { text: '$\\vec{a} \\cdot \\vec{b} = 2 \\cdot 4 + 3 \\cdot (-1) = 8 - 3 = 5$', rule: 'По координатам' }
    ]}
  ],
  taskTypes: [
    { name: 'По координатам', icon: '🔢',
      generate(){const ax=randInt(1,8),ay=randInt(1,8),bx=randInt(1,8),by=randInt(-8,-1);return{ax,ay,bx,by,ans:ax*bx+ay*by}},
      template(ax,ay,bx,by,ans){return{text:`$\\vec{a}=(${ax};${ay})$, $\\vec{b}=(${bx};${by})$. $\\vec{a} \\cdot \\vec{b} = ?$`,answer:ans,hint:`${ax} \\cdot ${bx} + ${ay} \\cdot (${by})$`,solution:`$\\vec{a} \\cdot \\vec{b} = ${ax*bx} + ${ay*by} = ${ans}$`}},
    },
    { name: 'Угол', icon: '📐',
      generate(){const cosVals=[{val:'1',angle:0},{val:'0.5',angle:60},{val:'0',angle:90},{val:'-0.5',angle:120},{val:'-1',angle:180}];const c=cosVals[randInt(0,4)];return{...c}},
      template(val,angle){return{text:`$\\cos \\varphi = ${val}$. Найдите $\\varphi$ (в градусах).`,answer:angle,hint:`Вспомните таблицу значений косинуса`,solution:`$\\varphi = ${angle}°$`}},
    },
    { name: 'Перпендикулярность', icon: '✅',
      generate(){const ax=randInt(1,5),ay=randInt(1,5);const bx=-ay,by=ax;return{ax,ay,bx,by,ans:'да'}},
      template(ax,ay,bx,by,ans){return{text:`$\\vec{a}=(${ax};${ay})$, $\\vec{b}=(${bx};${by})$. Перпендикулярны ли они?`,answer:ans,hint:`Проверьте $\\vec{a}\\cdot\\vec{b}$`,solution:`${ax} \\cdot ${bx} + ${ay} \\cdot ${by} = ${ax*bx+ay*by} = 0$, ответ: ${ans}`}},
    }
  ]
};

LESSONS['9.5'] = {
  title: 'Уравнение прямой',
  context: 'Уравнение прямой — основа аналитической геометрии. Оно связывает координаты всех точек, лежащих на прямой.',
  theory: [
    { icon: '📏', title: 'Общее уравнение', html: '<div class="formula-block">$Ax + By + C = 0$</div><p>где $A$, $B$ — коэффициенты, $C$ — свободный член.</p>' },
    { icon: '📐', title: 'Уравнение с угловым коэффициентом', html: '<div class="formula-block">$y = kx + b$</div><p>$k$ — угловой коэффициент (тангенс угла наклона), $b$ — ордината точки пересечения с осью $Oy$.</p><div class="highlight-box"><strong>Через две точки</strong> $(x_1, y_1)$ и $(x_2, y_2)$:</div><div class="formula-block">$k = \\frac{y_2 - y_1}{x_2 - x_1}$</div>' },
    { icon: '📍', title: 'Нормальный вектор', html: '<p>Вектор $(A; B)$ — нормаль (перпендикулярен) к прямой $Ax + By + C = 0$.</p>' }
  ],
  examples: [
    { title: 'Пример: Через две точки', steps: [
      { text: '$A(1; 2)$, $B(3; 6)$.', rule: '' },
      { text: '$k = \\frac{6-2}{3-1} = \\frac{4}{2} = 2$', rule: 'Угловой коэффициент' },
      { text: '$y - 2 = 2(x - 1) \\Rightarrow y = 2x$', rule: 'Уравнение прямой' }
    ]}
  ],
  taskTypes: [
    { name: 'Угловой коэффициент', icon: '📏',
      generate(){const x1=randInt(0,3),y1=randInt(0,3),k=randInt(1,5),x2=x1+randInt(1,4),y2=y1+k*(x2-x1);return{x1,y1,x2,y2,k}},
      template(x1,y1,x2,y2,k){return{text:`$A(${x1};${y1})$, $B(${x2};${y2})$. Найдите $k$.`,answer:k,hint:`$k = \\frac{${y2}-${y1}}{${x2}-${x1}}$`,solution:`$k = \\frac{${y2-y1}}{${x2-x1}} = ${k}$`}},
    },
    { name: 'Уравнение', icon: '📐',
      generate(){const k=randInt(1,5),b=randInt(-5,5);return{k,b}},
      template(k,b){return{text:`Прямая $y = ${k}x + ${b >= 0 ? '+'+b : b}$. Чему равна $b$?`,answer:b,hint:`b — число при $x^0$, свободный член`,solution:`$b = ${b}$`}},
    },
    { name: 'Нормальный вектор', icon: '➡️',
      generate(){const A=randInt(1,5),B=randInt(1,5);return{A,B}},
      template(A,B){return{text:`Прямая $${A}x + ${B}y + C = 0$. Найдите нормальный вектор. Ответ: $x;y$`,answer:`${A};${B}`,hint:`Нормальный вектор = $(A; B)$`,solution:`$\\vec{n} = (${A};${B})$`}},
    }
  ]
};

LESSONS['9.6'] = {
  title: 'Уравнение окружности',
  context: 'Уравнение окружности связывает координаты точек на окружности с координатами центра и радиусом.',
  theory: [
    { icon: '⭕', title: 'Уравнение', html: '<p><strong>Каноническое уравнение</strong> окружности с центром в начале координат:</p><div class="formula-block">$x^2 + y^2 = R^2$</div><p><strong>С произвольным центром</strong> $(x_0; y_0)$:</p><div class="formula-block">$(x - x_0)^2 + (y - y_0)^2 = R^2$</div>' },
    { icon: '📐', title: 'Центр и радиус', html: '<p>Из общего уравнения $x^2 + y^2 + Dx + Ey + F = 0$:</p><div class="formula-block">$x_0 = -\\frac{D}{2}$, $y_0 = -\\frac{E}{2}$, $R = \\sqrt{x_0^2 + y_0^2 - F}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Центр $(2; -3)$, $R = 5$.', rule: '' },
      { text: '$(x-2)^2 + (y+3)^2 = 25$', rule: 'Подставляем в формулу' }
    ]}
  ],
  taskTypes: [
    { name: 'Уравнение', icon: '⭕',
      generate(){const cx=randInt(-5,5),cy=randInt(-5,5),r=randInt(2,8);return{cx,cy,r,r2:r*r}},
      template(cx,cy,r,r2){return{text:`Центр $(${cx};${cy})$, $R = ${r}$. Уравнение?`,answer:`(x-${cx>=0?cx:'('+cx+')'})^2+(y-${cy>=0?'+'+cy:'+'+('('+cy+')')})^2=${r2}`,hint:`$(x-x_0)^2+(y-y_0)^2=R^2$`,solution:`$(x-${cx})^2+(y${cy>=0?'+'+cy:'-'+(-cy)})^2=${r2}$`}},
    },
    { name: 'Радиус', icon: '📏',
      generate(){const cx=randInt(-5,5),cy=randInt(-5,5),r=randInt(2,8);return{cx,cy,r,r2:r*r}},
      template(cx,cy,r,r2){return{text:`$(x-${cx})^2+(y${cy>=0?'+'+cy:'-'+(-cy)})^2=${r2}$. Радиус?`,answer:r,hint:`$R^2 = ${r2}$, $R = \\sqrt{${r2}}$`,solution:`$R = ${r}$`}},
    },
    { name: 'Центр', icon: '📍',
      generate(){const cx=randInt(-5,5),cy=randInt(-5,5),r=randInt(2,8);return{cx,cy,r,r2:r*r}},
      template(cx,cy,r,r2){return{text:`$(x${cx>=0?'-'+cx:'+(-'+cx+')'})^2+(y${cy>=0?'-'+cy:'+(-'+cy+')'})^2=${r2}$. Центр?`,answer:`${cx};${cy}`,hint:`Центр = $(x_0; y_0)$ где $(x-x_0)^2$`,solution:`Центр $(${cx};${cy})$`}},
    }
  ]
};

LESSONS['9.7'] = {
  title: 'Взаимное расположение прямых',
  context: 'Знание взаимного расположения прямых позволяет решать задачи на параллельность, пересечение и совпадение.',
  theory: [
    { icon: '📏', title: 'Признаки', html: '<ul><li><strong>Параллельность:</strong> $k_1 = k_2$ (угловые коэффициенты равны, $b_1 \\neq b_2$)</li><li><strong>Совпадение:</strong> $k_1 = k_2$ и $b_1 = b_2$</li><li><strong>Пересечение:</strong> $k_1 \\neq k_2$</li><li><strong>Перпендикулярность:</strong> $k_1 \\cdot k_2 = -1$</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$y = 2x + 1$ и $y = 2x - 3$.', rule: '' },
      { text: '$k_1 = k_2 = 2$, $b_1 \\neq b_2$ → прямые параллельны', rule: 'Равные угловые коэффициенты' }
    ]}
  ],
  taskTypes: [
    { name: 'Расположение', icon: '📏',
      generate(){const types=[{k1:2,b1:1,k2:2,b2:5,ans:'параллельны'},{k1:2,b1:0,k2:-0.5,b2:3,ans:'перпендикулярны'},{k1:3,b1:1,k2:1,b2:-2,ans:'пересекаются'}];return types[randInt(0,2)]},
      template(k1,b1,k2,b2,ans){return{text:`$y=${k1}x${b1>=0?'+'+b1:b1}$, $y=${k2}x${b2>=0?'+'+b2:b2}$. Расположение?`,answer:ans,hint:`Сравните $k_1$ и $k_2$`,solution:`$k_1=${k1}$, $k_2=${k2}$ — ${ans}`}},
    },
    { name: 'Угловой коэффициент', icon: '🔢',
      generate(){const k=randInt(1,5);return{k,k2:-1/k}},
      template(k,k2){return{text:`Прямая $y=${k}x+b$. Какое $k$ у перпендикулярной?`,answer:k2,hint:`$k_1 \\cdot k_2 = -1$`,solution:`$k_2 = -\\frac{1}{${k}} = ${k2}$`}},
    }
  ]
};

LESSONS['9.8'] = {
  title: 'Прямая и окружность',
  context: 'Прямая и окружность могут пересекаться, касаться или не иметь общих точек. Это важно в навигации и компьютерной графике.',
  theory: [
    { icon: '⭕', title: 'Расстояние от центра до прямой', html: '<p>Расстояние от центра $(x_0; y_0)$ до прямой $Ax + By + C = 0$:</p><div class="formula-block">$d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$</div>' },
    { icon: '📐', title: 'Взаимное расположение', html: '<ul><li>$d > R$ — не пересекают</li><li>$d = R$ — касаются (1 точка)</li><li>$d < R$ — пересекают в двух точках</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Прямая $x + y - 5 = 0$, центр $(0; 0)$, $R = 3$.', rule: '' },
      { text: '$d = \\frac{|0+0-5|}{\\sqrt{2}} = \\frac{5}{\\sqrt{2}} \\approx 3.54$', rule: 'Расстояние от центра до прямой' },
      { text: '$d = 3.54 > R = 3$ → не пересекают', rule: 'Сравнение' }
    ]}
  ],
  taskTypes: [
    { name: 'Расстояние', icon: '📏',
      generate(){const A=randInt(1,3),B=randInt(1,3),C=randInt(-10,10),x0=randInt(-3,3),y0=randInt(-3,3);const d=Math.round(Math.abs(A*x0+B*y0+C)/Math.sqrt(A*A+B*B)*100)/100;return{A,B,C,x0,y0,d}},
      template(A,B,C,x0,y0,d){return{text:`Прямая $${A}x+${B}y${C>=0?'+'+C:C}=0$, центр $(${x0};${y0})$. Расстояние?`,answer:d,hint:`$\\frac{|${A}\\cdot${x0}+${B}\\cdot${y0}+${C}|}{\\sqrt{${A*A}+${B*B}}}$`,solution:`$d = ${d}$`}},
    },
    { name: 'Пересечение', icon: '✅',
      generate(){const R=randInt(3,8),d=R-1;return{R,d,ans:'пересекают'}},
      template(R,d,ans){return{text:`$R = ${R}$, $d = ${d}$. Прямая и окружность...`,answer:ans,hint:`${d < R ? 'd < R' : d === R ? 'd = R' : 'd > R'}`,solution:`$d=${d} ${d<R?'<':d===R?'>=':'>'} R=${R}$ — ${ans}`}},
    }
  ]
};

LESSONS['9.9'] = {
  title: 'Две окружности',
  context: 'Две окружности могут не пересекаться, касаться или пересекаться в двух точках.',
  theory: [
    { icon: '⭕', title: 'Расстояние между центрами', html: '<div class="formula-block">$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$</div>' },
    { icon: '📐', title: 'Взаимное расположение', html: '<ul><li>$d > R_1 + R_2$ — не пересекают (внешне)</li><li>$d = R_1 + R_2$ — касаются внешне</li><li>$|R_1-R_2| < d < R_1+R_2$ — пересекаются</li><li>$d = |R_1-R_2|$ — касаются внутри</li><li>$d < |R_1-R_2|$ — одна внутри другой</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$R_1 = 3$, $R_2 = 4$, $d = 7$.', rule: '' },
      { text: '$R_1 + R_2 = 7 = d$', rule: 'Сумма радиусов' },
      { text: 'Касаются внешне', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Расстояние', icon: '📏',
      generate(){const x1=randInt(0,3),y1=randInt(0,3),x2=x1+randInt(2,6),y2=y1+randInt(2,6);return{x1,y1,x2,y2,d:Math.round(Math.sqrt((x2-x1)**2+(y2-y1)**2)*100)/100}},
      template(x1,y1,x2,y2,d){return{text:`$O_1(${x1};${y1})$, $O_2(${x2};${y2})$. Расстояние между центрами?`,answer:d,hint:`$\\sqrt{(${x2}-${x1})^2+(${y2}-${y1})^2}$`,solution:`$d = \\sqrt{${(x2-x1)**2}+${(y2-y1)**2}} \\approx ${d}$`}},
    },
    { name: 'Расположение', icon: '⭕',
      generate(){const r1=randInt(2,5),r2=randInt(2,5);const d=r1+r2;return{r1,r2,d,ans:'касаются внешне'}},
      template(r1,r2,d,ans){return{text:`$R_1=${r1}$, $R_2=${r2}$, $d=${d}$. Расположение?`,answer:ans,hint:`$R_1+R_2 = ${r1+r2}$`,solution:`$d = R_1+R_2 = ${d}$ — ${ans}`}},
    }
  ]
};

LESSONS['9.10'] = {
  title: 'Расстояние от точки до прямой',
  context: 'Формула расстояния от точки до прямой — один из самых используемых инструментов аналитической геометрии.',
  theory: [
    { icon: '📍', title: 'Формула', html: '<p>Расстояние от точки $(x_0; y_0)$ до прямой $Ax + By + C = 0$:</p><div class="formula-block">$d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$</div><div class="highlight-box green"><strong>Знаменатель</strong> — длина нормального вектора $(A; B)$.</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$3x + 4y - 12 = 0$, точка $(0; 0)$.', rule: '' },
      { text: '$d = \\frac{|0+0-12|}{\\sqrt{9+16}} = \\frac{12}{5} = 2.4$', rule: 'Подставляем в формулу' }
    ]}
  ],
  taskTypes: [
    { name: 'Расстояние', icon: '📍',
      generate(){const A=randInt(1,4),B=randInt(1,4),C=randInt(-10,10),x0=randInt(-3,3),y0=randInt(-3,3);const denom=Math.sqrt(A*A+B*B);const d=Math.round(Math.abs(A*x0+B*y0+C)/denom*100)/100;return{A,B,C,x0,y0,d}},
      template(A,B,C,x0,y0,d){return{text:`$${A}x+${B}y${C>=0?'+'+C:C}=0$, точка $(${x0};${y0})$. Расстояние?`,answer:d,hint:`$\\frac{|${A}\\cdot(${x0})+${B}\\cdot(${y0})+(${C})|}{\\sqrt{${A*A}+${B*B}}}$`,solution:`$d = \\frac{|${A*x0+B*y0+C}|}{\\sqrt{${A*A+B*B}}} = ${d}$`}},
    },
    { name: 'Из уравнения', icon: '📐',
      generate(){const k=randInt(1,5),b=randInt(-5,5);return{k,b}},
      template(k,b){return{text:`Прямая $y=${k}x${b>=0?'+'+b:b}$, точка $(0;0)$. Расстояние?`,answer:Math.round(Math.abs(b)/Math.sqrt(1+k*k)*100)/100,hint:`Перепишите: $${k}x-y${b>=0?'+'+b:b}=0$, подставьте $(0;0)$`,solution:`$d = \\frac{|${b}|}{\\sqrt{${k*k}+1}} \\approx ${Math.round(Math.abs(b)/Math.sqrt(1+k*k)*100)/100}$`}},
    }
  ]
};

// ==================== GRADE 10 ====================

LESSONS['10.1'] = {
  title: 'Точки, прямые, плоскости',
  context: 'Стереометрия изучает фигуры в трёхмерном пространстве. В этой теме мы познакомимся с основными понятиями.',
  theory: [
    { icon: '🧊', title: 'Аксиомы стереометрии', html: '<ul><li>Через три не лежащие на одной прямой точки проходит единственная плоскость</li><li>Если две точки одной прямой принадлежат плоскости, то и все точки прямой принадлежат ей</li><li>Если две плоскости пересекаются, то их пересечение — прямая</li></ul>' },
    { icon: '📐', title: 'Взаимное расположение', html: '<ul><li><strong>Прямая и плоскость:</strong> параллельна, лежит в плоскости, пересекает в одной точке</li><li><strong>Две прямые:</strong> параллельны, пересекаются, скрещиваются</li><li><strong>Две плоскости:</strong> параллельны, пересекаются</li></ul>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Прямая $a$ лежит в плоскости $\\alpha$, прямая $b$ пересекает $\\alpha$ в точке, принадлежащей $a$.', rule: '' },
      { text: '$a$ и $b$ пересекаются (не скрещиваются)', rule: 'Общая точка существует' }
    ]}
  ],
  taskTypes: [
    { name: 'Расположение', icon: '📐',
      generate(){const types=[{desc:'Две прямые в одной плоскости, не пересекаются',ans:'параллельны'},{desc:'Две прямые не в одной плоскости',ans:'скрещиваются'},{desc:'Плоскость и прямая, общих точек нет',ans:'параллельны'}];return types[randInt(0,2)]},
      template(desc,ans){return{text:desc + '. Каково их расположение?',answer:ans,hint:'Вспомните аксиомы стереометрии',solution:'Ответ: ' + ans}},
    },
    { name: 'Общие точки', icon: '📍',
      generate(){const types=[{desc:'Две параллельные прямые',ans:'нет'},{desc:'Две пересекающиеся прямые',ans:'1'},{desc:'Параллельная прямая и плоскость',ans:'нет'}];return types[randInt(0,2)]},
      template(desc,ans){return{text:desc + '. Сколько общих точек?',answer:ans,hint:'Подумайте о взаимном расположении',solution:'Общих точек: ' + ans}},
    }
  ]
};

LESSONS['10.2'] = {
  title: 'Параллельность прямых и плоскостей',
  context: 'Параллельность в пространстве — основа построения зданий, мебели и машин.',
  theory: [
    { icon: '📏', title: 'Признак параллельности', html: '<div class="highlight-box"><strong>Признак:</strong> Если прямая $a$ не лежит в плоскости $\\alpha$ и параллельна прямой $b$ в $\\alpha$, то $a \\parallel \\alpha$.</div>' },
    { icon: '📐', title: 'Свойства', html: '<ul><li>Если прямая параллельна плоскости, то она параллельна с任何ой прямой в этой плоскости, проходящей через точку пересечения плоскости с плоскостью, содержащей данную прямую</li><li>Если две плоскости проходят через параллельные прямые и пересекаются, то линия пересечения параллельна данным прямым</li></ul>' },
    { icon: '📐', title: 'Признак параллельности плоскостей', html: '<div class="highlight-box green"><strong>Признак:</strong> Если две пересекающиеся прямые в одной плоскости параллельны соответствующим прямым в другой, то плоскости параллельны.</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$a \\parallel \\alpha$, $a$ лежит в $\\beta$, $\\alpha \\cap \\beta = c$.', rule: '' },
      { text: '$a \\parallel c$ по свойству параллельности', rule: 'Прямая параллельна линии пересечения' }
    ]}
  ],
  taskTypes: [
    { name: 'Что следует?', icon: '📏',
      generate(){const types=[{prem:'$a \\parallel b$, $b$ лежит в $\\alpha$',ans:'$a \\parallel \\alpha$'},{prem:'$a \\parallel \\alpha$, $a \\subset \\beta$, $\\alpha \\cap \\beta = c$',ans:'$a \\parallel c$'},{prem:'$a \\parallel \\alpha$, $b \\parallel \\alpha$, $a$ и $b$ пересекаются',ans:'$\\beta \\parallel \\alpha$'}];return types[randInt(0,2)]},
      template(prem,ans){return{text:`Из ${prem} следует...`,answer:ans,hint:'Вспомните признаки и свойства параллельности',solution:'Ответ: ' + ans}},
    }
  ]
};

LESSONS['10.3'] = {
  title: 'Перпендикулярность',
  context: 'Перпендикулярность в пространстве важна для построения вертикальных конструкций и измерения расстояний.',
  theory: [
    { icon: '📐', title: 'Определение', html: '<p>Прямая $a$ <strong>перпендикулярна</strong> плоскости $\\alpha$, если она перпендикулярна любой прямой в $\\alpha$, проходящей через точку пересечения.</p>' },
    { icon: '📏', title: 'Признак', html: '<div class="highlight-box"><strong>Признак:</strong> Если прямая перпендикулярна двум пересекающимся прямым в плоскости, то она перпендикулярна всей плоскости.</div>' },
    { icon: '📐', title: 'Плоскость перпендикулярности', html: '<p>Если $a \\perp \\alpha$, то любая плоскость, содержащая $a$, перпендикулярна $\\alpha$.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$a \\perp b$, $a \\perp c$, $b$ и $c$ пересекаются в точке $O$, $b, c \\subset \\alpha$.', rule: '' },
      { text: '$a \\perp \\alpha$ по признаку перпендикулярности', rule: 'Достаточно двух перпендикуляров' }
    ]}
  ],
  taskTypes: [
    { name: 'Определение', icon: '📐',
      generate(){const types=[{desc:'Прямая перпендикулярна двум пересекающимся прямым в плоскости',ans:'перпендикулярна плоскости'},{desc:'Прямая перпендикулярна плоскости',ans:'перпендикулярна любой прямой в плоскости'}];return types[randInt(0,1)]},
      template(desc,ans){return{text:desc + '. Что следует?',answer:ans,hint:'Вспомните определение перпендикулярности',solution:'Ответ: ' + ans}},
    }
  ]
};

LESSONS['10.4'] = {
  title: 'Призмы',
  context: 'Призмы — один из основных видов многогранников. Они используются в архитектуре и инженерии.',
  theory: [
    { icon: '🧊', title: 'Определение', html: '<p><strong>Призма</strong> — многогранник, у которого две грани (основания) равны и параллельны, а боковые грани — параллелограммы.</p><p>$n$-угольная призма имеет $n+2$ граней, $3n$ рёбер, $2n$ вершин.</p>' },
    { icon: '📐', title: 'Объём', html: '<div class="formula-block">$V = S_{\\text{осн}} \\cdot h$</div><p>$S_{\\text{осн}}$ — площадь основания, $h$ — высота.</p>' },
    { icon: '📏', title: 'Площадь поверхности', html: '<div class="formula-block">$S_{\\text{полн}} = 2S_{\\text{осн}} + S_{\\text{бок}}$</div><p>$S_{\\text{бок}} = P_{\\text{осн}} \\cdot h$ (для прямой призмы).</p>' },
    { icon: '📐', title: 'Прямая и наклонная', html: '<p><strong>Прямая призма</strong> — боковые рёбра перпендикулярны основаниям.</p><p><strong>Наклонная</strong> — боковые рёбра наклонены.</p>' }
  ],
  examples: [
    { title: 'Пример: Объём', steps: [
      { text: 'Квадратная призма: основание $a = 4$, высота $h = 6$.', rule: '' },
      { text: '$S_{\\text{осн}} = 4^2 = 16$', rule: 'Площадь основания' },
      { text: '$V = 16 \\cdot 6 = 96$', rule: 'Объём' }
    ]}
  ],
  taskTypes: [
    { name: 'Объём', icon: '📐',
      generate(){const a=randInt(3,8),h=randInt(3,10);return{a,h,v:a*a*h}},
      template(a,h,v){return{text:`Квадратная призма: $a = ${a}$, $h = ${h}$. Объём?`,answer:v,hint:`$V = a^2 \\cdot h = ${a}^2 \\cdot ${h}$`,solution:`$V = ${a*a} \\cdot ${h} = ${v}$`}},
    },
    { name: 'Рёбра', icon: '🔢',
      generate(){const n=randInt(3,6);return{n,faces:n+2,edges:3*n,verts:2*n}},
      template(n,faces,edges,verts){return{text:`$${n}$-угольная призма. Сколько граней, рёбер, вершин? Ответ: граней,рёбер,вершин`,answer:`${faces},${edges},${verts}`,hint:`$F = n+2$, $E = 3n$, $V = 2n$`,solution:`$F=${faces}$, $E=${edges}$, $V=${verts}$`}},
    },
    { name: 'Площадь боковая', icon: '📏',
      generate(){const n=randInt(3,6),a=randInt(3,8),h=randInt(3,10);return{n,a,h,sb:n*a*h}},
      template(n,a,h,sb){return{text:`$${n}$-угольная прямая призма: $a = ${a}$, $h = ${h}$. Боковая поверхность?`,answer:sb,hint:`$S_{\\text{бок}} = P \\cdot h = ${n}\\cdot${a}\\cdot${h}$`,solution:`$S_{\\text{бок}} = ${sb}$`}},
    }
  ]
};

LESSONS['10.5'] = {
  title: 'Пирамиды',
  context: 'Пирамиды — одни из древнейших архитектурных сооружений. Их геометрические свойства важны для понимания объёмов.',
  theory: [
    { icon: '🔺', title: 'Определение', html: '<p><strong>Пирамида</strong> — многогранник с основанием-многоугольником и вершиной, соединённой со всеми вершинами основания.</p><p>$n$-угольная пирамида: $n+1$ граней, $2n$ рёбер, $n+1$ вершин.</p>' },
    { icon: '📐', title: 'Объём', html: '<div class="formula-block">$V = \\frac{1}{3} S_{\\text{осн}} \\cdot h$</div><p>Объём пирамиды в 3 раза меньше объёма призмы с тем же основанием и высотой.</p>' },
    { icon: '📏', title: 'Правильная пирамида', html: '<p>Основание — правильный многоугольник, высота опущена в центр основания.</p><p>Боковые грани — равнобедренные треугольники.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Квадратная пирамида: $a = 6$, $h = 4$.', rule: '' },
      { text: '$V = \\frac{1}{3} \\cdot 36 \\cdot 4 = 48$', rule: 'Формула объёма пирамиды' }
    ]}
  ],
  taskTypes: [
    { name: 'Объём', icon: '📐',
      generate(){const a=randInt(3,8),h=randInt(3,10);return{a,h,v:Math.round(a*a*h/3)}},
      template(a,h,v){return{text:`Квадратная пирамида: $a = ${a}$, $h = ${h}$. Объём?`,answer:v,hint:`$V = \\frac{1}{3} \\cdot ${a}^2 \\cdot ${h}$`,solution:`$V = \\frac{${a*a} \\cdot ${h}}{3} = \\frac{${a*a*h}}{3} = ${v}$`}},
    },
    { name: 'Рёбра', icon: '🔢',
      generate(){const n=randInt(3,6);return{n,faces:n+1,edges:2*n,verts:n+1}},
      template(n,faces,edges,verts){return{text:`$${n}$-угольная пирамида. Граней? Рёбер? Вершин?`,answer:`${faces},${edges},${verts}`,hint:`$F = n+1$, $E = 2n$, $V = n+1$`,solution:`$F=${faces}$, $E=${edges}$, $V=${verts}$`}},
    },
    { name: 'Высота', icon: '📏',
      generate(){const a=randInt(3,8),h=randInt(3,10);return{a,h,v:Math.round(a*a*h/3)}},
      template(a,h,v){return{text:`Квадратная пирамида: $a = ${a}$, $V = ${v}$. Высота?`,answer:h,hint:`$h = \\frac{3V}{a^2} = \\frac{3 \\cdot ${v}}{${a*a}}$`,solution:`$h = \\frac{${3*v}}{${a*a}} = ${h}$`}},
    }
  ]
};

LESSONS['10.6'] = {
  title: 'Цилиндр, конус, шар',
  context: 'Тела вращения — цилиндр, конус и шар — повсюду: трубы, шары, воронки. Их формулы просты и элегантны.',
  theory: [
    { icon: '🔵', title: 'Цилиндр', html: '<div class="formula-block">$V = \\pi R^2 h$</div><div class="formula-block">$S_{\\text{полн}} = 2\\pi R^2 + 2\\pi R h$</div>' },
    { icon: '🔺', title: 'Конус', html: '<div class="formula-block">$V = \\frac{1}{3} \\pi R^2 h$</div><div class="formula-block">$S_{\\text{бок}} = \\pi R l$</div><p>$l$ — образующая (наклонная высота): $l = \\sqrt{R^2 + h^2}$.</p>' },
    { icon: '⚽', title: 'Шар', html: '<div class="formula-block">$V = \\frac{4}{3} \\pi R^3$</div><div class="formula-block">$S = 4\\pi R^2$</div>' }
  ],
  examples: [
    { title: 'Пример: Конус', steps: [
      { text: '$R = 3$, $h = 4$.', rule: '' },
      { text: '$l = \\sqrt{9 + 16} = 5$', rule: 'Образующая' },
      { text: '$V = \\frac{1}{3} \\pi \\cdot 9 \\cdot 4 = 12\\pi \\approx 37.7$', rule: 'Объём' }
    ]}
  ],
  taskTypes: [
    { name: 'Объём цилиндра', icon: '🔵',
      generate(){const r=randInt(2,8),h=randInt(3,10);return{r,h,v:Math.round(Math.PI*r*r*h*100)/100}},
      template(r,h,v){return{text:`Цилиндр: $R = ${r}$, $h = ${h}$. Объём ($\\pi\\approx3.14$)?`,answer:v,hint:`$V = 3.14 \\cdot ${r}^2 \\cdot ${h}$`,solution:`$V = 3.14 \\cdot ${r*r} \\cdot ${h} \\approx ${v}$`}},
    },
    { name: 'Объём конуса', icon: '🔺',
      generate(){const r=randInt(2,8),h=randInt(3,10);return{r,h,v:Math.round(Math.PI*r*r*h/3*100)/100}},
      template(r,h,v){return{text:`Конус: $R = ${r}$, $h = ${h}$. Объём ($\\pi\\approx3.14$)?`,answer:v,hint:`$V = \\frac{1}{3} \\cdot 3.14 \\cdot ${r}^2 \\cdot ${h}$`,solution:`$V \\approx ${v}$`}},
    },
    { name: 'Площадь шара', icon: '⚽',
      generate(){const r=randInt(2,10);return{r,s:Math.round(4*Math.PI*r*r*100)/100}},
      template(r,s){return{text:`Шар: $R = ${r}$. Площадь ($\\pi\\approx3.14$)?`,answer:s,hint:`$S = 4 \\cdot 3.14 \\cdot ${r}^2$`,solution:`$S \\approx ${s}$`}},
    }
  ]
};

LESSONS['10.7'] = {
  title: 'Объёмы многогранников',
  context: 'Зная объёмы простых тел, можно вычислить объёмы сложных фигур — составных и разностных.',
  theory: [
    { icon: '📐', title: 'Основные формулы', html: '<div class="formula-block">$V_{\\text{призма}} = S_{\\text{осн}} \\cdot h$</div><div class="formula-block">$V_{\\text{пирамиды}} = \\frac{1}{3} S_{\\text{осн}} \\cdot h$</div><div class="formula-block">$V_{\\text{цел}} = \\pi R^2 h$</div><div class="formula-block">$V_{\\text{конуса}} = \\frac{1}{3} \\pi R^2 h$</div><div class="formula-block">$V_{\\text{шара}} = \\frac{4}{3} \\pi R^3$</div>' },
    { icon: '🔗', title: 'Свойства', html: '<ul><li>Объём не зависит от положения тела в пространстве</li><li>Объём составного тела = сумме объёмов частей</li><li>Если тело вписано в другое, его объём меньше</li></ul>' }
  ],
  examples: [
    { title: 'Пример: Разность', steps: [
      { text: 'Из цилиндра $R=5, h=10$ вырезали конус $R=5, h=10$. Объём остатка.', rule: '' },
      { text: '$V = \\pi R^2 h - \\frac{1}{3}\\pi R^2 h = \\frac{2}{3}\\pi R^2 h$', rule: 'Разность' },
      { text: '$V = \\frac{2}{3} \\cdot \\pi \\cdot 25 \\cdot 10 \\approx 523.6$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Составной объём', icon: '📐',
      generate(){const r=randInt(2,6),h=randInt(3,8);const vcyl=Math.PI*r*r*h;const vcone=vcyl/3;const vrest=vcyl-vcone;return{r,h,vcyl:Math.round(vcyl*100)/100,vrest:Math.round(vrest*100)/100}},
      template(r,h,vcyl,vcyl2,vrest){return{text:`Цилиндр $R=${r}, h=${h}$ минус конус с теми же параметрами. Объём?`,answer:vrest,hint:`$V = \\frac{2}{3}\\pi R^2 h$`,solution:`$V \\approx ${vrest}$`}},
    },
    { name: 'Масштаб', icon: '🔢',
      generate(){const k=randInt(2,4);return{k,k3:k*k*k}},
      template(k,k3){return{text:`Если все размеры тела увеличить в $${k}$ раз, объём увеличится во сколько раз?`,answer:k3,hint:`$k^3 = ${k}^3$`,solution:`$V_2/V_1 = ${k}^3 = ${k3}$`}},
    }
  ]
};

LESSONS['10.8'] = {
  title: 'Объёмы тел вращения',
  context: 'Тела вращения получаются вращением плоской фигуры вокруг оси. Цилиндр, конус и шар — частные случаи.',
  theory: [
    { icon: '🔄', title: 'Метод сечений', html: '<p>Объём тела вращения можно найти через площадь поперечного сечения:</p><div class="formula-block">$V = \\int_0^h S(x)\\,dx$</div><p>На школьном уровне используется формула площадей сечений.</p>' },
    { icon: '📐', title: 'Формулы', html: '<ul><li><strong>Цилиндр</strong> (прямоугольник): $V = \\pi R^2 h$</li><li><strong>Конус</strong> (треугольник): $V = \\frac{1}{3}\\pi R^2 h$</li><li><strong>Шар</strong> (полукруг): $V = \\frac{4}{3}\\pi R^3$</li></ul>' },
    { icon: '📐', title: 'Составные тела', html: '<p>Полушар + цилиндр, конус в конусе и т.д. — объём = сумме/разности объёмов.</p>' }
  ],
  examples: [
    { title: 'Пример: Полушар в цилиндре', steps: [
      { text: 'В цилиндр $R = 3, h = 3$ вписано полушар $R = 3$.', rule: '' },
      { text: '$V_{\\text{цел}} = \\pi \\cdot 9 \\cdot 3 = 27\\pi$', rule: 'Цилиндр' },
      { text: '$V_{\\text{пш}} = \\frac{2}{3}\\pi \\cdot 27 = 18\\pi$', rule: 'Полушар' },
      { text: '$V_{\\text{ост}} = 27\\pi - 18\\pi = 9\\pi \\approx 28.27$', rule: 'Остаток' }
    ]}
  ],
  taskTypes: [
    { name: 'Полушар', icon: '🔵',
      generate(){const r=randInt(2,8);return{r,v:Math.round(2/3*Math.PI*r*r*r*100)/100}},
      template(r,v){return{text:`Полушар $R = ${r}$. Объём ($\\pi\\approx3.14$)?`,answer:v,hint:`$V = \\frac{2}{3} \\cdot 3.14 \\cdot ${r}^3$`,solution:`$V \\approx ${v}$`}},
    },
    { name: 'Вращение прямоугольника', icon: '🔄',
      generate(){const r=randInt(2,6),h=randInt(3,8);return{r,h,v:Math.round(Math.PI*r*r*h*100)/100}},
      template(r,h,v){return{text:`Прямоугольник $r=${r}, h=${h}$ вращается вокруг стороны $h$. Объём?`,answer:v,hint:`Получается цилиндр: $V = \\pi R^2 h$`,solution:`$V \\approx ${v}$`}},
    },
    { name: 'Вращение треугольника', icon: '🔺',
      generate(){const r=randInt(2,6),h=randInt(3,8);return{r,h,v:Math.round(1/3*Math.PI*r*r*h*100)/100}},
      template(r,h,v){return{text:`Прямоугольный треугольник $r=${r}, h=${h}$ вращается вокруг $h$. Объём?`,answer:v,hint:`Получается конус: $V = \\frac{1}{3}\\pi R^2 h$`,solution:`$V \\approx ${v}$`}},
    }
  ]
};

LESSONS['10.9'] = {
  title: 'Площади поверхностей',
  context: 'Полная поверхность тела — сумма площадей всех его граней. Это важно для покраски, обёртывания и теплоизоляции.',
  theory: [
    { icon: '📐', title: 'Формулы', html: '<div class="formula-block">$S_{\\text{цел}} = 2\\pi R^2 + 2\\pi R h$</div><div class="formula-block">$S_{\\text{конус}} = \\pi R^2 + \\pi R l$, $l = \\sqrt{R^2+h^2}$</div><div class="formula-block">$S_{\\text{шара}} = 4\\pi R^2$</div>' },
    { icon: '📏', title: 'Призма', html: '<div class="formula-block">$S_{\\text{полн}} = 2S_{\\text{осн}} + P_{\\text{осн}} \\cdot h$ (прямая)</div>' },
    { icon: '📐', title: 'Пирамида', html: '<div class="formula-block">$S_{\\text{полн}} = S_{\\text{осн}} + S_{\\text{бок}}$</div><p>$S_{\\text{бок}}$ — сумма площадей боковых треугольников.</p>' }
  ],
  examples: [
    { title: 'Пример: Конус', steps: [
      { text: '$R = 3$, $h = 4$.', rule: '' },
      { text: '$l = \\sqrt{9+16} = 5$', rule: 'Образующая' },
      { text: '$S = \\pi \\cdot 9 + \\pi \\cdot 3 \\cdot 5 = 9\\pi + 15\\pi = 24\\pi \\approx 75.4$', rule: 'Полная поверхность' }
    ]}
  ],
  taskTypes: [
    { name: 'Полная поверхность', icon: '📐',
      generate(){const r=randInt(2,6),h=randInt(3,8);const l=Math.sqrt(r*r+h*h);const s=Math.round((Math.PI*r*r+Math.PI*r*l)*100)/100;return{r,h,l:Math.round(l*100)/100,s}},
      template(r,h,l,s){return{text:`Конус: $R=${r}, h=${h}$. Полная поверхность?`,answer:s,hint:`$l = \\sqrt{${r}^2+${h}^2} = ${l}$, $S = \\pi R^2 + \\pi Rl$`,solution:`$S \\approx ${s}$`}},
    },
    { name: 'Площадь шара', icon: '⚽',
      generate(){const r=randInt(2,10);return{r,s:Math.round(4*Math.PI*r*r*100)/100}},
      template(r,s){return{text:`Шар $R=${r}$. Площадь?`,answer:s,hint:`$S = 4\\pi R^2 = 4 \\cdot 3.14 \\cdot ${r}^2$`,solution:`$S \\approx ${s}$`}},
    }
  ]
};

LESSONS['10.10'] = {
  title: 'Сечения многогранников',
  context: 'Сечение многогранника — плоская фигура, образованная пересечением многогранника плоскостью.',
  theory: [
    { icon: '✂️', title: 'Виды сечений', html: '<ul><li><strong>Призма:</strong> сечение — многоугольник (треугольник, четырёхугольник...)</li><li><strong>Пирамида:</strong> сечение — подобная основанию фигура (если параллельно основанию)</li><li><strong>Цилиндр:</strong> прямоугольник, круг, эллипс</li><li><strong>Конус:</strong> круг, эллипс, парабола, гипербола</li></ul>' },
    { icon: '📐', title: 'Площадь сечения', html: '<p>Площадь сечения зависит от угла наклона секущей плоскости.</p><div class="highlight-box green"><strong>Сечение, параллельное основанию призмы,</strong> равно основанию.</div>' }
  ],
  examples: [
    { title: 'Пример: Сечение пирамиды', steps: [
      { text: 'Пирамида с основанием-квадратом $a = 6$, высота $h = 9$. Сечение параллельно основанию на высоте $h_1 = 3$ от вершины.', rule: '' },
      { text: '$k = \\frac{h_1}{h} = \\frac{3}{9} = \\frac{1}{3}$', rule: 'Коэффициент подобия' },
      { text: '$a_1 = k \\cdot a = \\frac{1}{3} \\cdot 6 = 2$, $S_1 = 4$', rule: 'Площадь сечения' }
    ]}
  ],
  taskTypes: [
    { name: 'Сечение пирамиды', icon: '✂️',
      generate(){const a=randInt(4,10),h=randInt(6,15),h1=randInt(2,h-2);const k=h1/h;const a1=Math.round(a*k*100)/100;return{a,h,h1,k:Math.round(k*100)/100,a1,s:Math.round(a1*a1*100)/100}},
      template(a,h,h1,k,a1,s){return{text:`Пирамида: основание-квадрат $a=${a}$, $h=${h}$. Сечение на высоте $h_1=${h1}$ от вершины. Площадь?`,answer:s,hint:`$k = ${h1}/${h} = ${k}$, $a_1 = ${a} \\cdot ${k} = ${a1}$`,solution:`$S = ${a1}^2 \\approx ${s}$`}},
    },
    { name: 'Сечение призмы', icon: '📐',
      generate(){const types=[{prem:'Призма, сечение параллельно основанию',ans:'равно основанию'},{prem:'Цилиндр, сечение параллельно оси',ans:'прямоугольник'},{prem:'Конус, сечение параллельно основанию',ans:'круг'}];return types[randInt(0,2)]},
      template(prem,ans){return{text:`${prem}. Какая фигура?`,answer:ans,hint:'Вспомните виды сечений',solution:'Ответ: ' + ans}},
    }
  ]
};

// ==================== GRADE 11 ====================

LESSONS['11.1'] = {
  title: 'Координаты в пространстве',
  context: 'Трёхмерная система координат позволяет задавать положение точек в пространстве тремя числами.',
  theory: [
    { icon: '📊', title: 'Декартова система', html: '<p>Три перпендикулярные оси $Ox$, $Oy$, $Oz$ с началом в точке $O$.</p><p>Каждой точке $M$ соответствует тройка $(x; y; z)$.</p>' },
    { icon: '📏', title: 'Расстояние', html: '<div class="formula-block">$|AB| = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$</div>' },
    { icon: '📍', title: 'Середина', html: '<div class="formula-block">$M = \\left(\\frac{x_1+x_2}{2};\\frac{y_1+y_2}{2};\\frac{z_1+z_2}{2}\\right)$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$A(1; 2; 3)$, $B(4; 6; 3)$.', rule: '' },
      { text: '$|AB| = \\sqrt{9+16+0} = \\sqrt{25} = 5$', rule: 'Формула расстояния' }
    ]}
  ],
  taskTypes: [
    { name: 'Расстояние', icon: '📏',
      generate(){const x1=randInt(0,5),y1=randInt(0,5),z1=randInt(0,5),dx=randInt(1,6),dy=randInt(1,6),dz=randInt(0,5);return{x1,y1,z1,x2:x1+dx,y2:y1+dy,z2:z1+dz,d:Math.round(Math.sqrt(dx*dx+dy*dy+dz*dz)*100)/100}},
      template(x1,y1,z1,x2,y2,z2,d){return{text:`$A(${x1};${y1};${z1})$, $B(${x2};${y2};${z2})$. Расстояние?`,answer:d,hint:`$\\sqrt{(${x2-x1})^2+(${y2-y1})^2+(${z2-z1})^2}$`,solution:`$d = \\sqrt{${(x2-x1)**2}+${(y2-y1)**2}+${(z2-z1)**2}} \\approx ${d}$`}},
    },
    { name: 'Середина', icon: '📍',
      generate(){const x1=randInt(0,6),y1=randInt(0,6),z1=randInt(0,6),x2=randInt(0,6),y2=randInt(0,6),z2=randInt(0,6);return{x1,y1,z1,x2,y2,z2,xm:(x1+x2)/2,ym:(y1+y2)/2,zm:(z1+z2)/2}},
      template(x1,y1,z1,x2,y2,z2,xm,ym,zm){return{text:`$A(${x1};${y1};${z1})$, $B(${x2};${y2};${z2})$. Середина?`,answer:`${xm};${ym};${zm}`,hint:`Среднее каждой координаты`,solution:`$M(${xm};${ym};${zm})$`}},
    }
  ]
};

LESSONS['11.2'] = {
  title: 'Уравнение плоскости',
  context: 'Уравнение плоскости связывает координаты всех её точек. Основа стереометрии.',
  theory: [
    { icon: '📐', title: 'Общее уравнение', html: '<div class="formula-block">$Ax + By + Cz + D = 0$</div><p>$(A; B; C)$ — нормальный вектор плоскости.</p>' },
    { icon: '📍', title: 'Через три точки', html: '<p>Плоскость через три неколлинеарные точки задаётся определителем:</p><div class="formula-block">$\\begin{vmatrix} x-x_1 & y-y_1 & z-z_1 \\\\ x_2-x_1 & y_2-y_1 & z_2-z_1 \\\\ x_3-x_1 & y_3-y_1 & z_3-z_1 \\end{vmatrix} = 0$</div>' },
    { icon: '📐', title: 'В отрезках', html: '<div class="formula-block">$\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$</div><p>$a$, $b$, $c$ — отрезки на осях.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Плоскость $2x - y + 3z - 6 = 0$.', rule: '' },
      { text: 'Нормальный вектор: $(2; -1; 3)$', rule: 'Коэффициенты = координаты нормали' }
    ]}
  ],
  taskTypes: [
    { name: 'Нормаль', icon: '📐',
      generate(){const A=randInt(1,5),B=randInt(-5,5),C=randInt(1,5);return{A,B,C}},
      template(A,B,C){return{text:`$${A}x${B>=0?'+'+B+'y':B+'y'}+${C}z+D=0$. Нормальный вектор?`,answer:`${A};${B};${C}`,hint:'$(A; B; C)$ — коэффициенты при $x, y, z$',solution:`$\\vec{n} = (${A};${B};${C})$`}},
    },
    { name: 'В отрезках', icon: '📍',
      generate(){const a=randInt(2,6),b=randInt(2,6),c=randInt(2,6);return{a,b,c}},
      template(a,b,c){return{text:`Плоскость проходит через $(a;0;0)$, $(0;b;0)$, $(0;0;c)$ где $a=${a},b=${b},c=${c}$. Уравнение?`,answer:`x/${a}+y/${b}+z/${c}=1`,hint:'$\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1$',solution:`$\\frac{x}{${a}}+\\frac{y}{${b}}+\\frac{z}{${c}}=1$`}},
    }
  ]
};

LESSONS['11.3'] = {
  title: 'Прямая в пространстве',
  context: 'Прямая в пространстве задаётся точкой и направляющим вектором, либо как пересечение двух плоскостей.',
  theory: [
    { icon: '📏', title: 'Каноническое уравнение', html: '<div class="formula-block">$\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$</div><p>$(x_0; y_0; z_0)$ — точка, $(a; b; c)$ — направляющий вектор.</p>' },
    { icon: '📐', title: 'Параметрическое', html: '<div class="formula-block">$x = x_0 + at$, $y = y_0 + bt$, $z = z_0 + ct$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Прямая через $(1; 2; 3)$ с направляющим $(2; -1; 4)$.', rule: '' },
      { text: '$\\frac{x-1}{2} = \\frac{y-2}{-1} = \\frac{z-3}{4}$', rule: 'Каноническое уравнение' }
    ]}
  ],
  taskTypes: [
    { name: 'Уравнение', icon: '📏',
      generate(){const x0=randInt(0,5),y0=randInt(0,5),z0=randInt(0,5),a=randInt(1,5),b=randInt(-5,5),c=randInt(1,5);return{x0,y0,z0,a,b,c}},
      template(x0,y0,z0,a,b,c){return{text:`Точка $(${x0};${y0};${z0})$, направляющий $(a=${a};b=${b};c=${c})$. Каноническое?`,answer:`x-${x0})/${a}=(y-${y0})/${b}=(z-${z0})/${c}`,hint:'$\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$',solution:`$\\frac{x${x0>=0?'-'+x0:'+'+(-x0)}}{${a}} = \\frac{y${y0>=0?'-'+y0:'+'+(-y0)}}{${b}} = \\frac{z${z0>=0?'-'+z0:'+'+(-z0)}}{${c}}$`}},
    },
    { name: 'Направляющий', icon: '➡️',
      generate(){const x1=randInt(0,3),y1=randInt(0,3),z1=randInt(0,3),dx=randInt(1,5),dy=randInt(-5,5),dz=randInt(1,5);return{x1,y1,z1,x2:x1+dx,y2:y1+dy,z2:z1+dz,dx,dy,dz}},
      template(x1,y1,z1,x2,y2,z2,dx,dy,dz){return{text:`Прямая через $A(${x1};${y1};${z1})$ и $B(${x2};${y2};${z2})$. Направляющий вектор?`,answer:`${dx};${dy};${dz}`,hint:'$\\vec{AB} = B - A$',solution:`$\\vec{AB} = (${dx};${dy};${dz})$`}},
    }
  ]
};

LESSONS['11.4'] = {
  title: 'Прямые и плоскости',
  context: 'Прямая может лежать в плоскости, быть параллельной ей или пересекать.',
  theory: [
    { icon: '📐', title: 'Взаимное расположение', html: '<ul><li><strong>Прямая в плоскости:</strong> нормаль перпендикулярна направляющему, точка принадлежит плоскости</li><li><strong>Параллельность:</strong> нормаль перпендикулярна направляющему, точка не принадлежит</li><li><strong>Пересечение:</strong> нормаль не перпендикулярна направляющему</li></ul><div class="formula-block">$\\vec{n} \\cdot \\vec{s} = 0$ и $Ax_0+By_0+Cz_0+D = 0$ → прямая в плоскости</div>' },
    { icon: '📏', title: 'Угол', html: '<div class="formula-block">$\\sin \\varphi = \\frac{|\\vec{n} \\cdot \\vec{s}|}{|\\vec{n}| \\cdot |\\vec{s}|}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{n} = (1; 2; -1)$, $\\vec{s} = (2; -1; 0)$.', rule: '' },
      { text: '$\\vec{n} \\cdot \\vec{s} = 2 - 2 + 0 = 0$', rule: 'Скалярное произведение' },
      { text: 'Прямая параллельна плоскости или лежит в ней', rule: 'Нужно проверить точку' }
    ]}
  ],
  taskTypes: [
    { name: 'Расположение', icon: '📐',
      generate(){const types=[{n:'(1;2;-1)',s:'(2;-1;0)',dot:0,ans:'параллельна или лежит'},{n:'(1;1;1)',s:'(1;-1;0)',dot:0,ans:'параллельна или лежит'},{n:'(2;1;-1)',s:'(1;2;3)',dot:3,ans:'пересекает'}];return types[randInt(0,2)]},
      template(n,s,dot,ans){return{text:`$\\vec{n}=${n}$, $\\vec{s}=${s}$. Положение прямой относительно плоскости?`,answer:ans,hint:'$\\vec{n} \\cdot \\vec{s}$ = ' + dot,solution:`$\\vec{n}\\cdot\\vec{s}=${dot}$ — ${ans}`}},
    }
  ]
};

LESSONS['11.5'] = {
  title: 'Две прямые в пространстве',
  context: 'Две прямые в пространстве могут быть параллельны, пересекаться или скрещиваться.',
  theory: [
    { icon: '📏', title: 'Расположение', html: '<ul><li><strong>Параллельны:</strong> направляющие коллинеарны</li><li><strong>Пересекаются:</strong> общая точка</li><li><strong>Скрещиваются:</strong> не параллельны и не пересекаются</li></ul>' },
    { icon: '📐', title: 'Минимальное расстояние', html: '<p>Для скрещивающихся прямых:</p><div class="formula-block">$d = \\frac{|(\\vec{AB}, \\vec{s_1}, \\vec{s_2})|}{|\\vec{s_1} \\times \\vec{s_2}|}$</div><p>где $(\\vec{AB}, \\vec{s_1}, \\vec{s_2})$ — смешанное произведение.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{s_1} = (1; 2; 3)$, $\\vec{s_2} = (2; 4; 6)$.', rule: '' },
      { text: '$\\vec{s_2} = 2 \\vec{s_1}$ — направляющие коллинеарны', rule: 'Проверка' },
      { text: 'Прямые параллельны', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'Расположение', icon: '📏',
      generate(){const types=[{s1:'(1;2;3)',s2:'(2;4;6)',ans:'параллельны'},{s1:'(1;0;0)',s2:'(0;1;0)',ans:'пересекаются или скрещиваются'}];return types[randInt(0,1)]},
      template(s1,s2,ans){return{text:`$\\vec{s_1}=${s1}$, $\\vec{s_2}=${s2}$. Расположение?`,answer:ans,hint:'Проверьте коллинеарность',solution:'Ответ: ' + ans}},
    },
    { name: 'Коллинеарность', icon: '✅',
      generate(){const k=randInt(2,5),a=randInt(1,5),b=randInt(1,5),c=randInt(1,5);return{k,a,b,c,ans:'да',s1:`(${a};${b};${c})`,s2:`(${k*a};${k*b};${k*c})`}},
      template(k,a,b,c,ans,s1,s2){return{text:`$\\vec{s_1}=${s1}$, $\\vec{s_2}=${s2}$. Коллинеарны?`,answer:ans,hint:`$\\vec{s_2} = ${k} \\cdot \\vec{s_1}$`,solution:`$\\vec{s_2} = ${k}\\vec{s_1}$ — ${ans}`}},
    }
  ]
};

LESSONS['11.6'] = {
  title: 'Две плоскости',
  context: 'Две плоскости в пространстве могут быть параллельны или пересекаться по прямой.',
  theory: [
    { icon: '📐', title: 'Расположение', html: '<ul><li><strong>Параллельны:</strong> нормали коллинеарны</li><li><strong>Пересекаются:</strong> нормали неколлинеарны</li></ul><div class="formula-block">$\\pi_1 \\parallel \\pi_2 \\Leftrightarrow \\vec{n_1} = \\lambda \\vec{n_2}$</div>' },
    { icon: '📏', title: 'Угол между плоскостями', html: '<div class="formula-block">$\\cos \\varphi = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{|\\vec{n_1}| \\cdot |\\vec{n_2}|}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{n_1} = (1; 2; -1)$, $\\vec{n_2} = (2; 4; -2)$.', rule: '' },
      { text: '$\\vec{n_2} = 2\\vec{n_1}$ → плоскости параллельны', rule: 'Коллинеарные нормали' }
    ]}
  ],
  taskTypes: [
    { name: 'Расположение', icon: '📐',
      generate(){const k=randInt(2,4),A=randInt(1,3),B=randInt(1,3),C=randInt(1,3);return{k,A,B,C,n1:`(${A};${B};${C})`,n2:`(${k*A};${k*B};${k*C})`,ans:'параллельны'}},
      template(k,A,B,C,n1,n2,ans){return{text:`$\\vec{n_1}=${n1}$, $\\vec{n_2}=${n2}$. Расположение?`,answer:ans,hint:`$\\vec{n_2} = ${k}\\vec{n_1}$`,solution:'Ответ: ' + ans}},
    }
  ]
};

LESSONS['11.7'] = {
  title: 'Углы и расстояния',
  context: 'Зная уравнения плоскостей и прямых, можно находить углы между ними и расстояния.',
  theory: [
    { icon: '📐', title: 'Угол между прямой и плоскостью', html: '<div class="formula-block">$\\sin \\varphi = \\frac{|\\vec{n} \\cdot \\vec{s}|}{|\\vec{n}| \\cdot |\\vec{s}|}$</div>' },
    { icon: '📏', title: 'Угол между двумя плоскостями', html: '<div class="formula-block">$\\cos \\varphi = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{|\\vec{n_1}| \\cdot |\\vec{n_2}|}$</div>' },
    { icon: '📍', title: 'Расстояние от точки до плоскости', html: '<div class="formula-block">$d = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\vec{n_1} = (1; 0; 0)$, $\\vec{n_2} = (0; 1; 0)$.', rule: '' },
      { text: '$\\cos \\varphi = \\frac{0}{1 \\cdot 1} = 0 \\Rightarrow \\varphi = 90°$', rule: 'Плоскости перпендикулярны' }
    ]}
  ],
  taskTypes: [
    { name: 'Угол плоскостей', icon: '📐',
      generate(){const types=[{n1:'(1;0;0)',n2:'(0;1;0)',cos:0,ans:90},{n1:'(1;1;0)',n2:'(1;0;1)',cos:0.5,ans:60},{n1:'(1;1;1)',n2:'(1;1;1)',cos:1,ans:0}];return types[randInt(0,2)]},
      template(n1,n2,cos,ans){return{text:`$\\vec{n_1}=${n1}$, $\\vec{n_2}=${n2}$. Угол?`,answer:ans,hint:`$\\cos \\varphi = ${cos}$`,solution:`$\\varphi = ${ans}°$`}},
    },
    { name: 'Расстояние', icon: '📍',
      generate(){const A=randInt(1,3),B=randInt(1,3),C=randInt(1,3),D=randInt(-10,10),x0=0,y0=0,z0=0;const d=Math.round(Math.abs(D)/Math.sqrt(A*A+B*B+C*C)*100)/100;return{A,B,C,D,d}},
      template(A,B,C,D,d){return{text:`$${A}x+${B}y+${C}z${D>=0?'+'+D:D}=0$, начало координат. Расстояние?`,answer:d,hint:`$\\frac{|${D}|}{\\sqrt{${A*A}+${B*B}+${C*C}}}$`,solution:`$d = ${d}$`}},
    }
  ]
};

LESSONS['11.8'] = {
  title: 'Перпендикуляр и наклонная',
  context: 'Перпендикуляр и наклонная — основные понятия для нахождения расстояний в пространстве.',
  theory: [
    { icon: '📏', title: 'Определения', html: '<ul><li><strong>Перпендикуляр</strong> из точки к плоскости — кратчайшее расстояние</li><li><strong>Наклонная</strong> — любая другая прямая из точки до плоскости</li></ul><div class="formula-block">$|\\text{перп}| < |\\text{наклонная}|$</div>' },
    { icon: '📐', title: 'Связь', html: '<div class="formula-block">$\\cos \\varphi = \\frac{|\\text{перп}|}{|\\text{наклонная}|}$</div><p>$\\varphi$ — угол между перпендикуляром и наклонной.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: 'Перпендикуляр $h = 4$, наклонная $l = 5$.', rule: '' },
      { text: '$\\cos \\varphi = \\frac{4}{5} = 0.8 \\Rightarrow \\varphi \\approx 36.87°$', rule: 'Формула' }
    ]}
  ],
  taskTypes: [
    { name: 'Угол', icon: '📐',
      generate(){const triples=[[3,4,5],[5,12,13],[6,8,10],[8,15,17]];const [a,b,c]=triples[randInt(0,3)];return{perp:a,slant:c,cos:(a/c).toFixed(2)}},
      template(perp,slant,cos){return{text:`Перпендикуляр $=${perp}$, наклонная $=${slant}$. $\\cos \\varphi$?`,answer:cos,hint:`$\\cos = \\frac{${perp}}{${slant}}$`,solution:`$\\cos \\varphi = ${cos}$`}},
    },
    { name: 'Наклонная', icon: '📏',
      generate(){const perp=randInt(3,8),proj=randInt(3,8);const slant=Math.sqrt(perp*perp+proj*proj);return{perp,proj,slant:Math.round(slant*100)/100}},
      template(perp,proj,slant){return{text:`Перпендикуляр $=${perp}$, проекция $=${proj}$. Наклонная?`,answer:slant,hint:`$l = \\sqrt{${perp}^2+${proj}^2}$`,solution:`$l \\approx ${slant}$`}},
    }
  ]
};

LESSONS['11.9'] = {
  title: 'Тетраэдр',
  context: 'Тетраэдр — простейший многогранник (4 грани-треугольника). Основа стереометрии.',
  theory: [
    { icon: '🔺', title: 'Свойства', html: '<ul><li>4 вершины, 6 рёбер, 4 грани</li><li>Объём: $V = \\frac{1}{3} S_{\\text{осн}} \\cdot h$</li><li>Правильный тетраэдр: все грани — равносторонние треугольники</li></ul>' },
    { icon: '📐', title: 'Объём через три вектора', html: '<div class="formula-block">$V = \\frac{1}{6} |(\\vec{AB}, \\vec{AC}, \\vec{AD})|$</div><p>Смешанное произведение трёх рёбер, выходящих из одной вершины.</p>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$S_{\\text{осн}} = 12$, $h = 6$.', rule: '' },
      { text: '$V = \\frac{1}{3} \\cdot 12 \\cdot 6 = 24$', rule: 'Объём тетраэдра' }
    ]}
  ],
  taskTypes: [
    { name: 'Объём', icon: '📐',
      generate(){const s=randInt(4,20),h=randInt(3,10);return{s,h,v:Math.round(s*h/3)}},
      template(s,h,v){return{text:`$S_{\\text{осн}}=${s}$, $h=${h}$. Объём тетраэдра?`,answer:v,hint:`$V = \\frac{1}{3} \\cdot ${s} \\cdot ${h}$`,solution:`$V = \\frac{${s*h}}{3} = ${v}$`}},
    },
    { name: 'Рёбра', icon: '🔢',
      generate(){return{ans:'6'}},
      template(ans){return{text:`Сколько рёбер у тетраэдра?`,answer:ans,hint:'4 вершины, каждая соединена с тремя другими',solution:'6 рёбер (K4 — полный граф)'}},
    }
  ]
};

LESSONS['11.10'] = {
  title: 'Сферические координаты',
  context: 'Сферические координаты — альтернатива декартовым. Удобны для задач с шарами и симметрией.',
  theory: [
    { icon: '🌐', title: 'Определение', html: '<p>Точка задаётся тройкой $(\\rho; \\varphi; \\theta)$:</p><ul><li>$\\rho$ — расстояние от начала координат ($\\rho \\geq 0$)</li><li>$\\varphi$ — угол с положительным направлением $Oz$ ($0 \\leq \\varphi \\leq \\pi$)</li><li>$\\theta$ — азимутальный угол в плоскости $Oxy$ ($0 \\leq \\theta < 2\\pi$)</li></ul>' },
    { icon: '📐', title: 'Переход', html: '<div class="formula-block">$x = \\rho \\sin\\varphi \\cos\\theta$</div><div class="formula-block">$y = \\rho \\sin\\varphi \\sin\\theta$</div><div class="formula-block">$z = \\rho \\cos\\varphi$</div><div class="highlight-box green"><strong>Обратно:</strong> $\\rho = \\sqrt{x^2+y^2+z^2}$</div>' }
  ],
  examples: [
    { title: 'Пример', steps: [
      { text: '$\\rho = 5$, $\\varphi = 90°$, $\\theta = 0°$.', rule: '' },
      { text: '$x = 5\\sin90°\\cos0° = 5$', rule: '' },
      { text: '$y = 5\\sin90°\\sin0° = 0$', rule: '' },
      { text: '$z = 5\\cos90° = 0$', rule: '' },
      { text: 'Декартовы: $(5; 0; 0)$', rule: 'Ответ' }
    ]}
  ],
  taskTypes: [
    { name: 'В декартовы', icon: '📊',
      generate(){const rho=randInt(2,8),phi_deg=randInt(30,150),theta_deg=randInt(0,360);const phi=phi_deg*Math.PI/180,theta=theta_deg*Math.PI/180;const x=Math.round(rho*Math.sin(phi)*Math.cos(theta)*100)/100;const y=Math.round(rho*Math.sin(phi)*Math.sin(theta)*100)/100;const z=Math.round(rho*Math.cos(phi)*100)/100;return{rho,phi_deg,theta_deg,x,y,z}},
      template(rho,phi_deg,theta_deg,x,y,z){return{text:`$\\rho=${rho}$, $\\varphi=${phi_deg}°$, $\\theta=${theta_deg}°$. Декартовы координаты?`,answer:`${x};${y};${z}`,hint:'Подставьте в формулы перехода',solution:`$x=${x}$, $y=${y}$, $z=${z}$`}},
    },
    { name: '$\\rho$', icon: '🌐',
      generate(){const x=randInt(1,5),y=randInt(1,5),z=randInt(1,5);return{x,y,z,rho:Math.round(Math.sqrt(x*x+y*y+z*z)*100)/100}},
      template(x,y,z,rho){return{text:`$(${x};${y};${z})$. Найдите $\\rho$.`,answer:rho,hint:`$\\rho = \\sqrt{${x}^2+${y}^2+${z}^2}$`,solution:`$\\rho = \\sqrt{${x*x+y*y+z*z}} \\approx ${rho}$`}},
    }
  ]
};
