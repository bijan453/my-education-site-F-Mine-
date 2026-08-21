function factsTT(name,icon,qs){
  return {icon:icon,name:name,
    generate:()=>{const q=qs[randInt(0,qs.length-1)];return{q}},
    template:(q)=>({text:q.q,answer:q.a,hint:q.h,solution:`Ответ: <b>${Array.isArray(q.a)?q.a[0]:q.a}</b>.`})};
}

const LESSONS = {

/* ═════════ 7 КЛАСС ═════════ */

'7.1':{
  title:'Как устроен компьютер',
  context:'Компьютер — не магия, а понятная машина. Все современные компьютеры построены по одному принципу, описанному Джоном фон Нейманом в 1945 году: программа хранится в памяти вместе с данными, а процессор достаёт её и выполняет шаг за шагом.',
  theory:[
    {icon:'🏗️',title:'Четыре кита компьютера',html:`
      <p>Любой компьютер состоит из четырёх частей: <b>процессор (CPU)</b> — считает и управляет; <b>оперативная память (RAM)</b> — хранит работающие программы; <b>долговременное хранилище (SSD/HDD)</b> — хранит файлы «навсегда»; <b>устройства ввода/вывода</b> — клавиатура, мышь, экран.</p>
      <div class="highlight-box">Аналогия с кухней: CPU — повар, RAM — рабочий стол (быстрый, но маленький и очищается), SSD — холодильник (медленнее, но всё хранится без электричества), ввод/вывод — окно выдачи блюд.</div>`},
    {icon:'🔁',title:'Цикл «достать → понять → выполнить»',html:`
      <p>Процессор миллионы раз в секунду повторяет один цикл: <b>достать</b> команду из памяти, <b>декодировать</b> (понять, что делать), <b>выполнить</b> и записать результат. Именно поэтому, когда «оперативки не хватает», компьютер тормозит: повару некуда класть продукты со стола!</p>`}
  ],
  examples:[
    {title:'Что происходит при запуске игры',steps:[
      {text:'Файл игры лежит на SSD («в холодильнике»).',rule:'Хранилище'},
      {text:'Код и данные загружаются в RAM («на стол»).',rule:'Память'},
      {text:'Процессор читает команды из RAM: рисует, считает физику.',rule:'CPU'},
      {text:'Картинка идёт на экран, звук — в колонки.',rule:'Вывод'}
    ]}
  ],
  taskTypes:[
    factsTT('Вопросы','🖥️',[
      {q:'«Мозг» компьютера — это…?',a:['процессор','cpu','ЦПУ'],h:'CPU'},
      {q:'Какая память очищается при выключении?',a:['ram','оперативная','оперативка'],h:'Оперативная'},
      {q:'Где файлы хранятся без электричества?',a:['ssd','hdd','жёсткий диск','накопитель'],h:'Хранилище'},
      {q:'Кто описал принцип «программа в памяти»?',a:['фон нейман','нейман'],h:'Фон Нейман'},
      {q:'Клавиатура — устройство…?',a:['ввода'],h:'Ввода'},
      {q:'Монитор — устройство…?',a:['вывода'],h:'Вывода'}
    ])
  ]
},

'7.2':{
  title:'Процессор: мозг машины',
  context:'Процессор — крошечный чип, выполняющий миллиарды операций в секунду. Три главных характеристики: частота (герцы), ядра и кэш.',
  theory:[
    {icon:'⏱️',title:'Тактовая частота',html:`
      <p><b>Герц</b> — один такт (цикл) в секунду. <b>3 ГГц = 3 000 000 000 тактов в секунду</b>. Каждый такт — шанс выполнить кусочек работы.</p>
      <div class="highlight-box">1 ГГц = 1000 МГц = 1 000 000 000 Гц.</div>`},
    {icon:'👨🍳',title:'Ядра и кэш',html:`
      <p><b>Ядро</b> — самостоятельный «повар». 4 ядра = 4 повара работают параллельно. <b>Кэш</b> — сверхбыстрая память прямо внутри процессора, хранит то, что вот-вот понадобится (меньше RAM, но гораздо ближе и быстрее).</p>`}
  ],
  examples:[
    {title:'Почему 8 ядер быстрее 4',steps:[
      {text:'Рендер видео делится на куски.',rule:'Параллелизм'},
      {text:'8 ядер обрабатывают 8 кусков одновременно.',rule:'Ядра'},
      {text:'Работа заканчивается вдвое быстрее.',rule:'Результат'}
    ]}
  ],
  taskTypes:[
    factsTT('Вопросы','🧠',[
      {q:'2 ГГц = сколько миллионов тактов в секунду?',a:['2000'],h:'2×1000'},
      {q:'Сколько «поваров» у 6-ядерного CPU?',a:['6'],h:'Ядра'},
      {q:'Сверхбыстрая память внутри CPU — …?',a:['кэш','кеш'],h:'Кэш'},
      {q:'3 ГГц = сколько миллиардов тактов?',a:['3'],h:'Гига = миллиард'}
    ])
  ]
},

'7.3':{
  title:'Память и единицы информации',
  context:'Информацию можно измерить. Минимальная единица — бит (0 или 1), 8 бит = 1 байт. А память бывает быстрая-временная и медленная-вечная.',
  theory:[
    {icon:'💾',title:'RAM vs SSD и единицы',html:`
      <p><b>RAM</b> — рабочая область (стирается при выключении), <b>SSD</b> — долговременная.</p>
      <div class="formula-block">1 байт = 8 бит · 1 КБ = 1024 Б · 1 МБ = 1024 КБ · 1 ГБ = 1024 МБ · 1 ТБ = 1024 ГБ</div>`},
    {icon:'📦',title:'Сколько весит текст',html:`
      <p>Один символ текста ≈ 1 байт = 8 бит. Слово «ПРИВЕТ» (6 букв) ≈ 6 байт ≈ 48 бит. Интернет измеряют в мега<b>БИТАХ</b> (Мбит/с): 100 Мбит/с = 12,5 МБайт/с — дели на 8!</p>`}
  ],
  examples:[
    {title:'2048 КБ → МБ',steps:[
      {text:'1 МБ = 1024 КБ.',rule:'Правило'},
      {text:'2048 / 1024 = 2.',rule:'Деление'},
      {text:'Ответ: 2 МБ.',rule:'Готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Перевод единиц','💾',[
      {q:'1 КБ = сколько байт?',a:['1024'],h:'1024'},
      {q:'2048 КБ = сколько МБ?',a:['2'],h:'/1024'},
      {q:'3 ГБ = сколько МБ?',a:['3072'],h:'3×1024'},
      {q:'1 байт = сколько бит?',a:['8'],h:'8'},
      {q:'3 байта = сколько бит?',a:['24'],h:'×8'}
    ])
  ]
},

'7.4':{
  title:'Двоичный код и системы счисления',
  context:'Внутри компьютера всё — нули и единицы, потому что транзистор имеет два состояния: ток есть / тока нет. Научимся переводить числа туда и обратно.',
  theory:[
    {icon:'🔌',title:'Почему двоичная',html:`
      <p>Транзистор — как выключатель: <b>0</b> (выкл) или <b>1</b> (вкл). Поэтому компьютеру удобно считать в двоичной системе, а человеку — в десятичной.</p>`},
    {icon:'🔢',title:'Перевод десятичного в двоичный',html:`
      <p>Делим на 2 и записываем остатки <b>снизу вверх</b>: 13 → 1101. Обратный перевод: умножаем разряды на степени двойки (8,4,2,1).</p>
      <div class="code-sample">13/2=6 ост.1 | 6/2=3 ост.0 | 3/2=1 ост.1 | 1/2=0 ост.1 → 1101</div>`},
    {icon:'🎨',title:'Шестнадцатеричная',html:`
      <p>Цифры 0–9 и буквы A–F (A=10…F=15). Используется для цветов: #FF0000 — красный.</p>`}
  ],
  examples:[
    {title:'Двоичное 1010 → десятичное',steps:[
      {text:'Разряды: 8, 4, 2, 1.',rule:'Степени двойки'},
      {text:'1·8 + 0·4 + 1·2 + 0·1.',rule:'Сумма'},
      {text:'= 10.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    {icon:'🔢',name:'Десятичное → двоичное',
      generate:()=>{const n=randInt(2,15);return{n,b:n.toString(2)}},
      template:(o)=>({text:`Переведи ${o.n} в двоичную систему`,answer:o.b,hint:'Дели на 2, остатки снизу вверх',solution:`<b>${o.b}</b>.`})},
    {icon:'🔁',name:'Двоичное → десятичное',
      generate:()=>{const n=randInt(2,15);return{n,b:n.toString(2)}},
      template:(o)=>({text:`Переведи двоичное ${o.b} в десятичную`,answer:o.n,hint:'Степени двойки',solution:`<b>${o.n}</b>.`})},
    factsTT('Шестнадцатеричная','🎨',[
      {q:'Шестнадцатеричное F = ?',a:['15'],h:'F=15'},
      {q:'Шестнадцатеричное A = ?',a:['10'],h:'A=10'},
      {q:'Двоичное 111 = ?',a:['7'],h:'4+2+1'},
      {q:'Двоичное 1111 = ?',a:['15'],h:'8+4+2+1'}
    ])
  ]
},

'7.5':{
  title:'Логика: И, ИЛИ, НЕ',
  context:'Вся цифровая техника построена на трёх операциях: И (AND), ИЛИ (OR), НЕ (NOT). Из миллиардов таких вентилей собраны процессоры.',
  theory:[
    {icon:'🚦',title:'Три вентиля',html:`
      <div class="formula-block">И (AND): 1 только если ОБА = 1<br>ИЛИ (OR): 1 если ХОТЯ БЫ один = 1<br>НЕ (NOT): переворачивает (1→0, 0→1)</div>`},
    {icon:'📊',title:'Таблицы истинности',html:`
      <div class="code-sample">A B | AND | OR      A | NOT
0 0 |  0  |  0      0 |  1
0 1 |  0  |  1      1 |  0
1 0 |  0  |  1
1 1 |  1  |  1</div>`}
  ],
  examples:[
    {title:'1 AND 0',steps:[
      {text:'AND требует, чтобы ОБА входа были 1.',rule:'Правило'},
      {text:'Один из входов 0.',rule:'Смотрим'},
      {text:'Результат 0.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Логика','🚦',[
      {q:'1 AND 0 = ?',a:['0'],h:'Оба должны быть 1'},
      {q:'1 OR 0 = ?',a:['1'],h:'Хотя бы один'},
      {q:'NOT 1 = ?',a:['0'],h:'Переворот'},
      {q:'1 AND 1 = ?',a:['1'],h:'Оба 1'},
      {q:'NOT 0 = ?',a:['1'],h:'Переворот'},
      {q:'0 OR 0 = ?',a:['0'],h:'Ни одного 1'}
    ])
  ]
},

'7.6':{
  title:'Как работает интернет',
  context:'Интернет — это сеть компьютеров, обменивающихся маленькими кусочками данных (пакетами) по общим правилам (протоколам).',
  theory:[
    {icon:'📦',title:'Пакеты, IP и DNS',html:`
      <p>Большой файл режется на <b>пакеты</b>, каждый идёт своим путём и собирается заново у получателя. У каждого устройства — <b>IP-адрес</b>. <b>DNS</b> — «телефонный справочник»: превращает site.ru в IP.</p>
      <div class="highlight-box">Ты пишешь «google.com» → DNS говорит «это 142.250.185.78» → браузер шлёт запрос туда.</div>`},
    {icon:'🔒',title:'HTTP и HTTPS',html:`
      <p><b>HTTPS</b> — тот же HTTP, но с шифрованием: никто по дороге не прочитает твои пароли. Сервер — компьютер, отдающий страницы; клиент — твой браузер.</p>`}
  ],
  examples:[
    {title:'Путь запроса',steps:[
      {text:'Вводишь site.ru → запрос к DNS.',rule:'DNS'},
      {text:'DNS возвращает IP.',rule:'Адрес'},
      {text:'Браузер шлёт пакеты серверу по HTTPS.',rule:'Запрос'},
      {text:'Сервер отвечает — страница собирается.',rule:'Ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Интернет','🌐',[
      {q:'«Телефонный справочник» интернета — …?',a:['dns'],h:'DNS'},
      {q:'Маленькие кусочки данных — …?',a:['пакеты'],h:'Пакеты'},
      {q:'Буква S в HTTPS = …?',a:['secure','безопасный','шифрование'],h:'Secure'},
      {q:'Компьютер, отдающий страницы — …?',a:['сервер'],h:'Сервер'}
    ])
  ]
},

/* ═════════ 8 КЛАСС: HTML+CSS ═════════ */

'8.1':{
  title:'HTML: скелет страницы',
  context:'HTML — язык разметки: ты говоришь браузеру, ЧТО показать, а браузер рисует. Это самый лёгкий старт в программирование: теги — как скобки, оборачивающие содержимое.',
  theory:[
    {icon:'🏷️',title:'Теги и скелет',html:`
      <p>Тег — команда в угловых скобках: <b>&lt;p&gt;</b> открывает абзац, <b>&lt;/p&gt;</b> (со слэшем) закрывает.</p>
      <div class="code-sample">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;&lt;title&gt;Вкладка&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt; ...всё, что видно... &lt;/body&gt;
&lt;/html&gt;</div>
      <p><b>head</b> — служебная часть (не видна), <b>body</b> — то, что видно на странице.</p>`},
    {icon:'🎛️',title:'Атрибуты',html:`
      <p>Атрибуты дают тегу настройки и пишутся внутри открывающего тега: <b>&lt;p lang="ru"&gt;</b>. Класс (class) и id — «имена» для стилей и скриптов.</p>`}
  ],
  examples:[
    {title:'Разбираем тег',steps:[
      {text:'&lt;p&gt; — «начало абзаца».',rule:'Открытие'},
      {text:'Текст между тегами.',rule:'Контент'},
      {text:'&lt;/p&gt; — «конец абзаца».',rule:'Закрытие'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📄',[
      {q:'Какой тег закрывает абзац?',a:['</p>','/p'],h:'Со слэшем'},
      {q:'Где лежит то, что ВИДНО на странице?',a:['body'],h:'body'},
      {q:'Какой тег задаёт текст вкладки?',a:['title'],h:'title'},
      {q:'HTML — это язык…?',a:['разметки'],h:'Разметки'}
    ])
  ],
  code:[
    {title:'Первая страница',lang:'html',
     taskText:'Создай заголовок <b>&lt;h1&gt;</b> с текстом «Мой сайт» и абзац <b>&lt;p&gt;</b> с любым текстом.',
     starter:'',
     checks:[{sel:'h1',text:'Мой сайт',label:'<h1> «Мой сайт»'},{sel:'p',label:'<p> существует'}],
     hint:'<h1>Мой сайт</h1> и <p>текст</p>'}
  ]
},

'8.2':{
  title:'Текст, списки, ссылки, картинки',
  context:'Собираем «мясо» страницы: заголовки, выделение, списки, ссылки и изображения — самые используемые теги HTML.',
  theory:[
    {icon:'✍️',title:'Текст и списки',html:`
      <p><b>h1–h6</b> — заголовки (h1 — главный, один на страницу). <b>b/strong</b> — жирный, <b>i/em</b> — курсив, <b>br</b> — перенос, <b>hr</b> — линия.</p>
      <div class="code-sample">&lt;ul&gt;&lt;li&gt;точка&lt;/li&gt;&lt;/ul&gt;  &lt;!-- маркированный --&gt;
&lt;ol&gt;&lt;li&gt;цифра&lt;/li&gt;&lt;/ol&gt;  &lt;!-- нумерованный --&gt;</div>`},
    {icon:'🔗',title:'Ссылки и картинки',html:`
      <div class="code-sample">&lt;a href="https://google.com"&gt;Поиск&lt;/a&gt;
&lt;img src="cat.png" alt="Мой кот"&gt;</div>
      <p><b>href</b> — куда ведёт ссылка; <b>src</b> — путь к картинке; <b>alt</b> — текст, если картинка не загрузилась (и для незрячих пользователей).</p>`}
  ],
  examples:[
    {title:'Зачем нужен alt',steps:[
      {text:'Картинка не загрузилась (плохой интернет).',rule:'Проблема'},
      {text:'Пользователь видит текст alt.',rule:'alt'},
      {text:'Скринридеры читают alt вслух.',rule:'Доступность'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🔗',[
      {q:'Атрибут ссылки с адресом?',a:['href'],h:'href'},
      {q:'Атрибут картинки с путём?',a:['src'],h:'src'},
      {q:'Атрибут-описание картинки?',a:['alt'],h:'alt'},
      {q:'Маркированный список — тег…?',a:['ul'],h:'ul'},
      {q:'Нумерованный список — тег…?',a:['ol'],h:'ol'}
    ])
  ],
  code:[
    {title:'Ссылка и картинка',lang:'html',
     taskText:'Сделай ссылку <b>&lt;a&gt;</b> на https://google.com с текстом «Поиск» и <b>&lt;img&gt;</b> с атрибутом alt.',
     starter:'',
     checks:[{sel:'a[href*="google"]',text:'Поиск',label:'ссылка на google'},{sel:'img[alt]',label:'<img> с alt'}],
     hint:'a href + img alt'}
  ]
},

'8.3':{
  title:'Таблицы и формы',
  context:'Таблицы — для табличных данных (расписания, цены), формы — для сбора данных (логин, поиск). Формы делают сайт интерактивным.',
  theory:[
    {icon:'🧮',title:'Таблицы',html:`
      <div class="code-sample">&lt;table&gt;
  &lt;tr&gt;&lt;th&gt;Имя&lt;/th&gt;&lt;th&gt;Возраст&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Аня&lt;/td&gt;&lt;td&gt;14&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</div>
      <p><b>tr</b> — строка, <b>td</b> — ячейка, <b>th</b> — шапка (жирная).</p>`},
    {icon:'🔘',title:'Формы',html:`
      <div class="code-sample">&lt;input type="text" placeholder="Имя"&gt;
&lt;input type="password"&gt;
&lt;button&gt;Отправить&lt;/button&gt;</div>
      <p><b>placeholder</b> — серая подсказка внутри поля.</p>`}
  ],
  examples:[
    {title:'Форма входа',steps:[
      {text:'Поле логина (text).',rule:'input'},
      {text:'Поле пароля (password).',rule:'password'},
      {text:'Кнопка «Войти».',rule:'button'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧮',[
      {q:'Строка таблицы — тег…?',a:['tr'],h:'tr'},
      {q:'Обычная ячейка — тег…?',a:['td'],h:'td'},
      {q:'Серая подсказка в поле — атрибут…?',a:['placeholder'],h:'placeholder'},
      {q:'Поле для пароля: type=…?',a:['password'],h:'password'}
    ])
  ],
  code:[
    {title:'Таблица 2×2 и форма',lang:'html',
     taskText:'Создай <b>&lt;table&gt;</b> с 2 строками и 4+ ячейками, а также <b>&lt;input&gt;</b> с placeholder и <b>&lt;button&gt;</b>.',
     starter:'',
     checks:[{sel:'table tr',min:2,label:'2+ строки <tr>'},{sel:'td',min:4,label:'4+ ячейки <td>'},{sel:'input[placeholder]',label:'input с placeholder'},{sel:'button',label:'кнопка'}],
     hint:'table>tr×2>td×2 + input+button'}
  ]
},

'8.4':{
  title:'CSS: селекторы, цвета, единицы',
  context:'HTML — скелет, CSS — одежда: цвета, шрифты, размеры. Правило CSS = «селектор { свойство: значение; }». И помни: каждое свойство заканчивается точкой с запятой!',
  theory:[
    {icon:'🎯',title:'Селекторы и специфичность',html:`
      <div class="code-sample">p { }      /* тег */
.note { }  /* класс (точка) */
#title { } /* id (решётка) */</div>
      <p>«Вес»: id=100 &gt; класс=10 &gt; тег=1. Побеждает больший вес.</p>`},
    {icon:'🎨',title:'Цвета и единицы',html:`
      <div class="code-sample">color: red;  color: #ff0000;  color: rgb(255,0,0);</div>
      <p>Единицы: <b>px</b> (фиксировано), <b>%</b> (от родителя), <b>rem</b> (от корня, масштабируется), <b>vw/vh</b> (% экрана).</p>`}
  ],
  examples:[
    {title:'Кто перекрасит заголовок',steps:[
      {text:'h1{color:black} — вес 1.',rule:'тег'},
      {text:'.big{color:green} — вес 10.',rule:'класс'},
      {text:'#title{color:red} — вес 100 → победит red.',rule:'id'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🎯',[
      {q:'Селектор класса начинается с…?',a:['.','. точки','точки'],h:'Точка'},
      {q:'Селектор id начинается с…?',a:['#'],h:'Решётка'},
      {q:'hex-цвет красного?',a:['#ff0000'],h:'#ff0000'},
      {q:'Единица от корня html — …?',a:['rem'],h:'rem'}
    ])
  ],
  code:[
    {title:'Id и класс',lang:'css',inject:true,
     taskText:'Сделай <b>#title</b> синим через id, а <b>.note</b> — красным через класс. Не забудь «;»!',
     html:'<h1 id="title">Заголовок</h1><p class="note">Заметка</p><p>Обычный</p>',
     starter:'<style>\n/* твой CSS */\n</style>',
     verify:`[getComputedStyle(document.getElementById('title')).color==='rgb(0, 0, 255)', getComputedStyle(document.querySelector('.note')).color==='rgb(255, 0, 0)']`,
     labels:['#title синий','.note красная'],
     hint:'#title{color:blue;} .note{color:red;}'}
  ]
},

'8.5':{
  title:'CSS: бокс-модель',
  context:'Каждый элемент — коробка из четырёх слоёв: контент → padding (внутри) → border (рамка) → margin (снаружи). Понимание бокс-модели = полный контроль над отступами.',
  theory:[
    {icon:'📦',title:'Четыре слоя',html:`
      <div class="code-sample">.box {
  padding: 20px;      /* внутри, вокруг текста */
  border: 3px solid;  /* рамка */
  margin: 10px;       /* снаружи, от соседей */
}</div>
      <div class="highlight-box"><b>box-sizing: border-box</b> — width включает padding и border (удобнее!). Все современные проекты начинают с <code>*{box-sizing:border-box}</code>.</div>`},
    {icon:'🎯',title:'Центрирование',html:`<p><b>margin: 0 auto;</b> центрирует блок с заданной шириной по горизонтали.</p>`}
  ],
  examples:[
    {title:'Считаем итоговую ширину',steps:[
      {text:'width 200 + padding 20×2 + border 3×2.',rule:'слои'},
      {text:'200+40+6 = 246px (content-box).',rule:'сумма'},
      {text:'С border-box было бы ровно 200.',rule:'сравнение'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📦',[
      {q:'Отступ ВНУТРИ блока — …?',a:['padding'],h:'padding'},
      {q:'Отступ СНАРУЖИ — …?',a:['margin'],h:'margin'},
      {q:'width включает padding при box-sizing…?',a:['border-box'],h:'border-box'}
    ])
  ],
  code:[
    {title:'Коробка с отступами',lang:'css',inject:true,
     taskText:'Дай <b>.box</b> padding <b>20px</b> и рамку <b>3px solid green</b>. Каждая строка — с «;»!',
     html:'<div class="box">Контент</div>',
     starter:'<style>\n\n</style>',
     verify:`(function(){var el=document.querySelector('.box');var s=getComputedStyle(el);var rule=null;try{for(var i=0;i<document.styleSheets.length;i++){var rs=document.styleSheets[i].cssRules;for(var j=0;j<rs.length;j++){if(rs[j].selectorText&&rs[j].selectorText.indexOf('.box')>-1)rule=rs[j];}}}catch(e){}var bOk=s.borderTopWidth==='3px'||s.borderTopStyle==='solid'||(rule&&(rule.style.borderTopWidth==='3px'||rule.style.border.indexOf('3px')>-1));return [s.paddingTop==='20px',!!bOk];})()`,
     labels:['padding 20px','border 3px'],
     hint:'.box{padding:20px; border:3px solid green;}'}
  ]
},

'8.6':{
  title:'CSS: Flexbox и Grid',
  context:'Flexbox раскладывает элементы в ряд/колонку, Grid — двумерная сетка (строки И столбцы). Это два главных инструмента современных макетов.',
  theory:[
    {icon:'🧘',title:'Flexbox',html:`
      <div class="code-sample">.menu { display: flex; justify-content: space-between; align-items: center; gap: 10px; }</div>
      <p><b>justify-content</b> — главная ось, <b>align-items</b> — поперечная, <b>gap</b> — расстояние, <b>flex-direction: column</b> — вертикаль.</p>`},
    {icon:'🔲',title:'Grid',html:`
      <div class="code-sample">.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }</div>
      <p><b>fr</b> — доля свободного места. <b>repeat(auto-fit, minmax(150px,1fr))</b> — колонки сами перестраиваются под экран!</p>`}
  ],
  examples:[
    {title:'Шапка сайта',steps:[
      {text:'.header{display:flex;justify-content:space-between}.',rule:'логотип слева, меню справа'},
      {text:'align-items:center — по центру вертикали.',rule:'выравнивание'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧘',[
      {q:'Включить флекс — свойство…?',a:['display: flex','display:flex'],h:'display'},
      {q:'Распределить по главной оси — …?',a:['justify-content'],h:'justify'},
      {q:'Единица доли в grid — …?',a:['fr'],h:'fr'},
      {q:'Зазоры — свойство…?',a:['gap'],h:'gap'}
    ])
  ],
  code:[
    {title:'Flex-меню',lang:'css',inject:true,
     taskText:'Сделай <b>.menu</b> флексом с <b>space-between</b>.',
     html:'<div class="menu"><span>Главная</span><span>Курсы</span><span>Контакты</span></div>',
     starter:'<style>\n\n</style>',
     verify:`[getComputedStyle(document.querySelector('.menu')).display==='flex', getComputedStyle(document.querySelector('.menu')).justifyContent==='space-between']`,
     labels:['display:flex','space-between'],
     hint:'.menu{display:flex; justify-content:space-between;}'}
  ]
},

'8.7':{
  title:'CSS: hover, анимации, позиция',
  context:'Интерактивность: кнопка реагирует на наведение (:hover), элементы плавно меняются (transition) и крутятся (@keyframes), а position вырывает элемент из потока.',
  theory:[
    {icon:'🖱️',title:':hover и transition',html:`
      <div class="code-sample">.btn { transition: all .3s; }
.btn:hover { background: orange; transform: scale(1.05); }</div>
      <p>Без transition изменение мгновенное, с ним — плавное.</p>`},
    {icon:'📌',title:'position',html:`
      <ul><li><b>static</b> — как обычно</li><li><b>relative</b> — сдвиг от своего места</li><li><b>absolute</b> — от ближайшего не-static родителя</li><li><b>fixed</b> — прибит к экрану</li><li><b>sticky</b> — липнет при скролле</li></ul>
      <div class="highlight-box"><b>z-index</b> — какой элемент «выше» в стопке.</div>`}
  ],
  examples:[
    {title:'Бейдж на карточке',steps:[
      {text:'.card{position:relative}.',rule:'якорь'},
      {text:'.badge{position:absolute;top:10px;right:10px}.',rule:'бейдж'},
      {text:'Бейдж в углу карточки.',rule:'готово'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','✨',[
      {q:'Псевдокласс наведения — …?',a:[':hover','hover'],h:':hover'},
      {q:'Плавный переход — свойство…?',a:['transition'],h:'transition'},
      {q:'Прибит к экрану — position…?',a:['fixed'],h:'fixed'},
      {q:'Кто «выше» в стопке — …?',a:['z-index'],h:'z-index'}
    ])
  ],
  code:[
    {title:'Плавная кнопка + бейдж',lang:'css',inject:true,
     taskText:'Дай <b>.btn</b> transition <b>0.3s</b>, а <b>.badge</b> — position <b>absolute</b> и top <b>10px</b>.',
     html:'<div style="position:relative;height:60px"><button class="btn">Жми</button><span class="badge">NEW</span></div>',
     starter:'<style>\n\n</style>',
     verify:`[getComputedStyle(document.querySelector('.btn')).transitionDuration==='0.3s', getComputedStyle(document.querySelector('.badge')).position==='absolute', getComputedStyle(document.querySelector('.badge')).top==='10px']`,
     labels:['transition 0.3s','position:absolute','top:10px'],
     hint:'.btn{transition:all .3s;} .badge{position:absolute; top:10px;}'}
  ]
},

'8.8':{
  title:'Адаптивность + мини-проект',
  context:'Один сайт должен хорошо выглядеть и на телефоне, и на ноутбуке. @media применяет стили по условию (ширине). Собираем всё в мини-проект!',
  theory:[
    {icon:'📱',title:'@media и mobile-first',html:`
      <div class="code-sample">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
@media (max-width: 600px) { .menu { flex-direction: column; } }</div>
      <div class="highlight-box">Mobile-first: базовые стили под телефон, потом расширяй через <b>min-width</b>.</div>`},
    {icon:'🏆',title:'Рецепт красивой карточки',html:`
      <div class="code-sample">.card { border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,.1); padding:20px; transition:.3s; }
.card:hover { transform: translateY(-4px); }</div>`}
  ],
  examples:[
    {title:'Колонки → столбик',steps:[
      {text:'База: .grid{display:grid;grid-template-columns:1fr 1fr}.',rule:'2 колонки'},
      {text:'@media(max-width:600px){1fr}.',rule:'1 колонка'},
      {text:'На телефоне — столбик.',rule:'адаптив'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📱',[
      {q:'Условие по ширине — правило…?',a:['@media','media'],h:'@media'},
      {q:'Подход «сначала телефон» — …?',a:['mobile-first'],h:'mobile-first'},
      {q:'Скругление углов — …?',a:['border-radius'],h:'border-radius'},
      {q:'Тень блока — …?',a:['box-shadow'],h:'box-shadow'}
    ])
  ],
  code:[
    {title:'Карточка мечты',lang:'css',inject:true,
     taskText:'Стилизируй <b>.card</b>: border-radius <b>16px</b>, box-shadow, padding <b>20px</b>.',
     html:'<div class="card"><h3>Курс CSS</h3><p>Стань верстальщиком!</p></div>',
     starter:'<style>\n\n</style>',
     verify:`[getComputedStyle(document.querySelector('.card')).borderRadius==='16px', getComputedStyle(document.querySelector('.card')).boxShadow!=='none', getComputedStyle(document.querySelector('.card')).paddingTop==='20px']`,
     labels:['border-radius 16px','box-shadow','padding 20px'],
     hint:'.card{border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,.1); padding:20px;}'}
  ]
},

/* ═════════ 9 КЛАСС: JS ═════════ */

'9.1':{
  title:'JS: переменные и типы',
  context:'JavaScript оживляет страницы. Переменная — «коробка» для данных: let можно менять, const — запечатанная. Три кита типов: number, string, boolean.',
  theory:[
    {icon:'📦',title:'let / const и console.log',html:`
      <div class="code-sample">let age = 14;      // можно менять
const name = "Аня"; // менять НЕЛЬЗЯ
console.log("Привет, " + name);  // Привет, Аня</div>
      <p>console.log выводит в консоль браузера (F12 → Console) — главный инструмент отладки.</p>`},
    {icon:'🧮',title:'Типы и операторы',html:`
      <div class="code-sample">42        // number
"текст"   // string
true      // boolean
+ - * / % **   // арифметика (7 % 2 = 1, 2 ** 3 = 8)
"а" + "б" = "аб";  1 + "2" = "12"  // склейка строк</div>`}
  ],
  examples:[
    {title:'7 % 2',steps:[
      {text:'7 делим на 2 = 3 и остаток 1.',rule:'деление'},
      {text:'% возвращает остаток → 1.',rule:'ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','⚡',[
      {q:'Какое ключевое слово нельзя переприсвоить?',a:['const'],h:'const'},
      {q:'7 % 2 = ?',a:['1'],h:'остаток'},
      {q:'2 ** 3 = ?',a:['8'],h:'степень'},
      {q:'"1" + 2 = ?',a:['12'],h:'строка + число'}
    ])
  ],
  code:[
    {title:'Функция приветствия',lang:'js',
     taskText:'Напиши функцию <b>greet(name)</b>, возвращающую <b>"Привет, " + name</b>.',
     starter:'function greet(name) {\n    // твой код\n}',
     tests:[{call:"greet('Мир')",expected:'Привет, Мир'},{call:"greet('Аня')",expected:'Привет, Аня'}],
     hint:'return "Привет, " + name;'}
  ]
},

'9.2':{
  title:'Операторы и условия',
  context:'Программа принимает решения: ЕСЛИ условие верно — делаем одно, ИНАЧЕ — другое. Логика: && (И), || (ИЛИ), ! (НЕ).',
  theory:[
    {icon:'🚦',title:'if / else / else if',html:`
      <div class="code-sample">if (age &gt;= 18) {
  console.log("вход разрешён");
} else {
  console.log("вход запрещён");
}</div>`},
    {icon:'🔗',title:'Сравнения и логика',html:`
      <p>=== строгое равенство, !== неравенство, &gt; &lt; &gt;= &lt;=. <b>&amp;&amp;</b> — оба true, <b>||</b> — хотя бы один, <b>!</b> — переворот.</p>`}
  ],
  examples:[
    {title:'Оценка по баллам',steps:[
      {text:'if (b &gt;= 90) → "5".',rule:'первое'},
      {text:'else if (b &gt;= 70) → "4".',rule:'второе'},
      {text:'else → "учись ещё".',rule:'иначе'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🚦',[
      {q:'«И» в JS — это…?',a:['&&'],h:'&&'},
      {q:'«ИЛИ» в JS — это…?',a:['||'],h:'||'},
      {q:'«НЕ» в JS — это…?',a:['!'],h:'!'}
    ])
  ],
  code:[
    {title:'Максимум и знак',lang:'js',
     taskText:'Напиши <b>max(a,b)</b> (большее) и <b>sign(n)</b> ("+", "-", "0").',
     starter:'function max(a, b) {\n    \n}\nfunction sign(n) {\n    \n}',
     tests:[{call:'max(3, 9)',expected:9},{call:'max(10, 2)',expected:10},{call:"sign(5)",expected:'+'},{call:"sign(-3)",expected:'-'},{call:"sign(0)",expected:'0'}],
     hint:'if (a > b) return a; else return b;'}
  ]
},

'9.3':{
  title:'Циклы',
  context:'Цикл повторяет код, пока условие верно. Не пиши одно и то же — зацикли! for — когда знаешь сколько раз, while — пока условие true.',
  theory:[
    {icon:'🔁',title:'for и while',html:`
      <div class="code-sample">for (let i = 1; i &lt;= 5; i++) { console.log(i); }  // 1..5
let n = 3;
while (n &gt; 0) { console.log(n); n--; }              // 3 2 1</div>
      <p><b>break</b> — выйти из цикла, <b>continue</b> — пропустить круг.</p>`}
  ],
  examples:[
    {title:'Сумма 1..n',steps:[
      {text:'let s = 0; — копилка.',rule:'старт'},
      {text:'for i=1..n: s += i.',rule:'круг'},
      {text:'return s.',rule:'ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🔁',[
      {q:'Выйти из цикла — оператор…?',a:['break'],h:'break'},
      {q:'Пропустить круг — оператор…?',a:['continue'],h:'continue'},
      {q:'for (let i=0; i&lt;3; i++) — сколько кругов?',a:['3'],h:'0,1,2'}
    ])
  ],
  code:[
    {title:'Сумма и факториал',lang:'js',
     taskText:'Напиши <b>sumTo(n)</b> (сумма 1..n) и <b>factorial(n)</b> (1·2·…·n).',
     starter:'function sumTo(n) {\n    \n}\nfunction factorial(n) {\n    \n}',
     tests:[{call:'sumTo(5)',expected:15},{call:'sumTo(10)',expected:55},{call:'factorial(4)',expected:24},{call:'factorial(5)',expected:120}],
     hint:'цикл for и копилка'}
  ]
},

'9.4':{
  title:'Функции',
  context:'Функция — мини-программа с именем: принимает данные, делает работу, возвращает результат. return останавливает функцию и отдаёт значение.',
  theory:[
    {icon:'🧰',title:'Объявление и стрелки',html:`
      <div class="code-sample">function add(a, b) { return a + b; }
const add2 = (a, b) =&gt; a + b;   // стрелочная
function hi(name = "гость") { return "Привет, " + name; } // значение по умолчанию</div>
      <p>Без return функция вернёт undefined.</p>`}
  ],
  examples:[
    {title:'Периметр',steps:[
      {text:'function perimeter(a, b).',rule:'объявили'},
      {text:'return 2 * (a + b).',rule:'формула'},
      {text:'perimeter(2, 3) → 10.',rule:'вызов'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧰',[
      {q:'Что возвращает функция без return?',a:['undefined'],h:'undefined'},
      {q:'Стрелочная функция пишется через …?',a:['=>'],h:'=>'}
    ])
  ],
  code:[
    {title:'Цельсий и периметр',lang:'js',
     taskText:'Напиши <b>celsius(f)</b> = (f−32)·5/9 и <b>perimeter(a,b)</b> = 2·(a+b).',
     starter:'function celsius(f) {\n    \n}\nfunction perimeter(a, b) {\n    \n}',
     tests:[{call:'celsius(212)',expected:100},{call:'celsius(32)',expected:0},{call:'perimeter(2, 3)',expected:10}],
     hint:'(f - 32) * 5 / 9'}
  ]
},

'9.5':{
  title:'Массивы и объекты',
  context:'Массив — список значений (нумерация с нуля!). Объект — «анкета»: пары ключ-значение. Это способы хранить много данных.',
  theory:[
    {icon:'📚',title:'Массивы',html:`
      <div class="code-sample">let arr = [10, 20, 30];
arr[0];          // 10 (с нуля!)
arr.length;      // 3
arr.push(40);    // добавить в конец
for (let x of arr) { console.log(x); }   // перебор
arr.map(x =&gt; x * 2);      // [20,40,60]
arr.filter(x =&gt; x &gt; 15); // [20,30]</div>`},
    {icon:'🗃️',title:'Объекты',html:`
      <div class="code-sample">let user = { name: "Аня", age: 14 };
user.name;      // "Аня"
user["age"];    // 14
user.city = "Астана"; // добавить</div>`}
  ],
  examples:[
    {title:'Сумма массива',steps:[
      {text:'let s = 0.',rule:'копилка'},
      {text:'for (let x of arr) s += x.',rule:'перебор'},
      {text:'return s.',rule:'ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📚',[
      {q:'arr = [10,20,30]; arr[0] = ?',a:['10'],h:'с нуля'},
      {q:'[1,2,3].length = ?',a:['3'],h:'length'},
      {q:'Добавить в конец — метод…?',a:['push'],h:'push'}
    ])
  ],
  code:[
    {title:'Сумма и максимум массива',lang:'js',
     taskText:'Напиши <b>sumArr(arr)</b> и <b>maxArr(arr)</b>.',
     starter:'function sumArr(arr) {\n    \n}\nfunction maxArr(arr) {\n    \n}',
     tests:[{call:'sumArr([1,2,3])',expected:6},{call:'sumArr([])',expected:0},{call:'maxArr([3,9,2])',expected:9}],
     hint:'for (let x of arr)'}
  ]
},

'9.6':{
  title:'DOM: страница оживает',
  context:'DOM — «дерево» страницы, которое JS может менять: тексты, цвета, реакции на клики. Так рождаются интерактивные сайты!',
  theory:[
    {icon:'🎭',title:'Поиск и изменение',html:`
      <div class="code-sample">let el = document.getElementById("title");
el.textContent = "Привет!";      // сменить текст
btn.onclick = function() { alert("Клик!"); };  // событие</div>
      <p>onclick, oninput, onload — «когда случилось — сделай».</p>`}
  ],
  examples:[
    {title:'Кнопка меняет заголовок',steps:[
      {text:'Находим #title и кнопку.',rule:'getElementById'},
      {text:'btn.onclick = …',rule:'событие'},
      {text:'Внутри меняем title.textContent.',rule:'действие'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🎭',[
      {q:'Найти элемент по id — метод…?',a:['getelementbyid'],h:'getElementById'},
      {q:'Сменить текст — свойство…?',a:['textcontent'],h:'textContent'},
      {q:'Реакция на клик — свойство…?',a:['onclick'],h:'onclick'}
    ])
  ],
  code:[
    {title:'Смени заголовок',lang:'js',dom:true,
     taskText:'Напиши <b>setText()</b>, ставящую элементу #title текст <b>«Привет!»</b>.',
     starter:'function setText() {\n    \n}',
     html:'<h1 id="title">Старый текст</h1>',
     run:'setText();',
     verify:`document.getElementById('title').textContent === 'Привет!'`,
     hint:'document.getElementById("title").textContent = "Привет!";'}
  ]
},

'9.7':{
  title:'Проект: калькулятор',
  context:'Собираем всё вместе: функции + условия. Напиши функции калькулятора — они будут протестированы автоматически!',
  theory:[
    {icon:'🧮',title:'Что используем',html:`<p>Функции (function/return), условия (if), операторы (+ − * /). Плюс защита от деления на ноль!</p>`}
  ],
  examples:[
    {title:'Деление с защитой',steps:[
      {text:'if (b === 0) return "ошибка".',rule:'защита'},
      {text:'else return a / b.',rule:'деление'}
    ]}
  ],
  taskTypes:[
    factsTT('Повторение','🧮',[
      {q:'Оператор остатка — …?',a:['%'],h:'%'},
      {q:'Строгое равенство — …?',a:['==='],h:'==='}
    ])
  ],
  code:[
    {title:'Калькулятор',lang:'js',
     taskText:'Напиши <b>add(a,b)</b>, <b>sub(a,b)</b>, <b>mul(a,b)</b> и <b>div(a,b)</b> (при b=0 возвращай строку "ошибка").',
     starter:'function add(a, b) { }\nfunction sub(a, b) { }\nfunction mul(a, b) { }\nfunction div(a, b) { }',
     tests:[{call:'add(2,3)',expected:5},{call:'sub(10,4)',expected:6},{call:'mul(3,4)',expected:12},{call:'div(10,2)',expected:5},{call:"div(5,0)",expected:'ошибка'}],
     hint:'function add(a,b){return a+b;} и т.д.'}
  ]
},

/* ═════════ 10 КЛАСС: PYTHON ═════════ */

'10.1':{
  title:'Python: старт, print, переменные',
  context:'Python — самый популярный язык для обучения: читается почти как английский. Отступы (4 пробела) — это СИНТАКСИС, они заменяют фигурные скобки!',
  theory:[
    {icon:'🐍',title:'print и переменные',html:`
      <div class="code-sample">name = "Аня"      # без let/const, просто имя
age = 14
print("Привет,", name)   # Привет, Аня
print(age)               # 14</div>
      <p>Комментарии — через <b>#</b>. Типы определяются автоматически.</p>`},
    {icon:'🧮',title:'Типы',html:`
      <div class="code-sample">5        # int
3.14     # float
"текст"  # str
True     # bool (с большой буквы!)</div>`}
  ],
  examples:[
    {title:'Первая программа',steps:[
      {text:'name = "Мир".',rule:'переменная'},
      {text:'print("Привет, " + name).',rule:'вывод'},
      {text:'Вывод: Привет, Мир.',rule:'результат'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🐍',[
      {q:'Комментарий в Python начинается с…?',a:['#'],h:'#'},
      {q:'Булево «истина» в Python — …?',a:['true','True'],h:'True'},
      {q:'Что заменяет фигурные скобки?',a:['отступы','отступ','пробелы'],h:'Отступы'}
    ])
  ],
  code:[
    {title:'Функция приветствия',lang:'py',
     taskText:'Напиши функцию <b>greet(name)</b>, возвращающую строку <b>"Привет, " + name</b>.',
     starter:'def greet(name):\n    # твой код (4 пробела!)',
     tests:[{call:"greet('Мир')",expected:'Привет, Мир'},{call:"greet('Аня')",expected:'Привет, Аня'}],
     hint:'return "Привет, " + name'}
  ]
},

'10.2':{
  title:'Операторы и input()',
  context:'Python умеет считать и спрашивать пользователя. input() всегда возвращает СТРОКУ — для чисел оборачивай в int() или float()!',
  theory:[
    {icon:'🧮',title:'Операторы',html:`
      <div class="code-sample">+ - * /        # / — обычное деление
//             # целочисленное: 7 // 2 = 3
%              # остаток: 7 % 2 = 1
**             # степень: 2 ** 3 = 8</div>`},
    {icon:'⌨️',title:'input()',html:`
      <div class="code-sample">age = int(input("Сколько тебе? "))  # строка → int
print(age * 2)</div>`}
  ],
  examples:[
    {title:'7 // 2 и 7 % 2',steps:[
      {text:'7 // 2 = 3 (целая часть).',rule:'//'},
      {text:'7 % 2 = 1 (остаток).',rule:'%'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧮',[
      {q:'7 // 2 = ?',a:['3'],h:'целочисленное'},
      {q:'7 % 2 = ?',a:['1'],h:'остаток'},
      {q:'2 ** 3 = ?',a:['8'],h:'степень'},
      {q:'input() возвращает какой тип?',a:['str','строку','строка'],h:'строка'}
    ])
  ],
  code:[
    {title:'Квадрат и чётность',lang:'py',
     taskText:'Напиши <b>square(x)</b> (x·x) и <b>is_even(n)</b> (True/False).',
     starter:'def square(x):\n    \n\ndef is_even(n):\n    ',
     tests:[{call:'square(3)',expected:9},{call:'square(7)',expected:49},{call:'is_even(4)',expected:true},{call:'is_even(7)',expected:false}],
     hint:'return x * x  /  return n % 2 == 0'}
  ]
},

'10.3':{
  title:'Условия if / elif / else',
  context:'Python принимает решения через if / elif / else. Обрати внимание: после условия — двоеточие, а тело — с отступом!',
  theory:[
    {icon:'🚦',title:'Синтаксис',html:`
      <div class="code-sample">if age &gt;= 18:
    print("вход разрешён")
elif age &gt;= 14:
    print("только с родителями")
else:
    print("вход запрещён")</div>
      <p>Сравнения: ==, !=, &gt;, &lt;, &gt;=, &lt;=. Логика: and, or, not (словами!).</p>`}
  ],
  examples:[
    {title:'Знак числа',steps:[
      {text:'if n &gt; 0: return "+".',rule:'плюс'},
      {text:'elif n &lt; 0: return "-".',rule:'минус'},
      {text:'else: return "0".',rule:'ноль'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🚦',[
      {q:'«И» в Python — слово…?',a:['and'],h:'and'},
      {q:'«ИЛИ» в Python — слово…?',a:['or'],h:'or'},
      {q:'«НЕ» в Python — слово…?',a:['not'],h:'not'},
      {q:'Равенство сравнивается через…?',a:['=='],h:'=='}
    ])
  ],
  code:[
    {title:'Знак и максимум',lang:'py',
     taskText:'Напиши <b>sign(n)</b> ("+", "-", "0") и <b>max2(a,b)</b>.',
     starter:'def sign(n):\n    \n\ndef max2(a, b):\n    ',
     tests:[{call:"sign(5)",expected:'+'},{call:"sign(-3)",expected:'-'},{call:"sign(0)",expected:'0'},{call:'max2(3, 9)',expected:9}],
     hint:'if/elif/else с отступами'}
  ]
},

'10.4':{
  title:'Циклы for и while',
  context:'for перебирает последовательности (range — диапазон), while крутится пока условие истинно. Отступы обязательны!',
  theory:[
    {icon:'🔁',title:'for и range',html:`
      <div class="code-sample">for i in range(1, 6):   # 1..5 (конец НЕ входит)
    print(i)
n = 3
while n &gt; 0:
    print(n)
    n -= 1</div>
      <p><b>break</b> — выход, <b>continue</b> — пропуск круга.</p>`}
  ],
  examples:[
    {title:'Сумма 1..n',steps:[
      {text:'s = 0.',rule:'копилка'},
      {text:'for i in range(1, n+1): s += i.',rule:'круг'},
      {text:'return s.',rule:'ответ'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🔁',[
      {q:'range(1, 5) даёт числа от 1 до…?',a:['4'],h:'конец не входит'},
      {q:'Выйти из цикла — …?',a:['break'],h:'break'},
      {q:'Пропустить круг — …?',a:['continue'],h:'continue'}
    ])
  ],
  code:[
    {title:'Сумма и факториал',lang:'py',
     taskText:'Напиши <b>sum_to(n)</b> (сумма 1..n) и <b>factorial(n)</b>.',
     starter:'def sum_to(n):\n    \n\ndef factorial(n):\n    ',
     tests:[{call:'sum_to(5)',expected:15},{call:'sum_to(10)',expected:55},{call:'factorial(4)',expected:24},{call:'factorial(5)',expected:120}],
     hint:'for i in range(1, n+1):'}
  ]
},

'10.5':{
  title:'Функции def и return',
  context:'Функция в Python объявляется через def, тело — с отступом, результат — через return. Параметры могут иметь значения по умолчанию.',
  theory:[
    {icon:'🧰',title:'def и return',html:`
      <div class="code-sample">def add(a, b):
    return a + b

def hi(name="гость"):      # значение по умолчанию
    return "Привет, " + name</div>`}
  ],
  examples:[
    {title:'Цельсий',steps:[
      {text:'def celsius(f):',rule:'объявили'},
      {text:'return (f - 32) * 5 / 9.',rule:'формула'},
      {text:'celsius(212) → 100.0.',rule:'вызов'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧰',[
      {q:'Объявление функции — слово…?',a:['def'],h:'def'},
      {q:'Возврат значения — слово…?',a:['return'],h:'return'}
    ])
  ],
  code:[
    {title:'Цельсий и периметр',lang:'py',
     taskText:'Напиши <b>celsius(f)</b> и <b>perimeter(a,b)</b>.',
     starter:'def celsius(f):\n    \n\ndef perimeter(a, b):\n    ',
     tests:[{call:'celsius(212)',expected:100},{call:'celsius(32)',expected:0},{call:'perimeter(2, 3)',expected:10}],
     hint:'(f - 32) * 5 / 9'}
  ]
},

'10.6':{
  title:'Списки и словари',
  context:'Список (list) — упорядоченный набор (нумерация с 0), словарь (dict) — пары ключ:значение. Главные структуры данных Python.',
  theory:[
    {icon:'📚',title:'Списки',html:`
      <div class="code-sample">arr = [10, 20, 30]
arr[0]          # 10
len(arr)        # 3
arr.append(40)  # добавить
sum(arr)        # сумма!  max(arr), min(arr)</div>`},
    {icon:'🗃️',title:'Словари',html:`
      <div class="code-sample">user = {"name": "Аня", "age": 14}
user["name"]     # "Аня"
user["city"] = "Астана"</div>`}
  ],
  examples:[
    {title:'Сумма списка',steps:[
      {text:'sum(arr) — встроенная!',rule:'готово'},
      {text:'Или циклом: for x in arr: s += x.',rule:'вручную'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📚',[
      {q:'arr = [10,20,30]; arr[0] = ?',a:['10'],h:'с нуля'},
      {q:'Длина списка — функция…?',a:['len'],h:'len'},
      {q:'Добавить в конец списка — метод…?',a:['append'],h:'append'}
    ])
  ],
  code:[
    {title:'Сумма и максимум списка',lang:'py',
     taskText:'Напиши <b>sum_list(arr)</b> и <b>max_list(arr)</b>.',
     starter:'def sum_list(arr):\n    \n\ndef max_list(arr):\n    ',
     tests:[{call:'sum_list([1,2,3])',expected:6},{call:'max_list([3,9,2])',expected:9}],
     hint:'sum(arr) / max(arr) или циклом'}
  ]
},

'10.7':{
  title:'Строки и методы',
  context:'Строка в Python — последовательность символов: можно индексировать, срезы, куча методов (upper, lower, replace, len).',
  theory:[
    {icon:'🔤',title:'Методы строк',html:`
      <div class="code-sample">s = "Привет"
s.upper()      # "ПРИВЕТ"
s.lower()      # "привет"
len(s)         # 6
s[0]           # "П"
s[::-1]        # "тевирП" (реверс!)</div>`}
  ],
  examples:[
    {title:'Реверс строки',steps:[
      {text:'s[::-1] — срез с шагом −1.',rule:'срез'},
      {text:'"абв" → "вба".',rule:'результат'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🔤',[
      {q:'В верхний регистр — метод…?',a:['upper','upper()'],h:'upper'},
      {q:'Длина строки — функция…?',a:['len'],h:'len'},
      {q:'s[::-1] делает…?',a:['реверс','переворот','переворачивает'],h:'реверс'}
    ])
  ],
  code:[
    {title:'Реверс и длина',lang:'py',
     taskText:'Напиши <b>rev(s)</b> (строка задом наперёд) и <b>how_long(s)</b> (длина).',
     starter:'def rev(s):\n    \n\ndef how_long(s):\n    ',
     tests:[{call:"rev('абв')",expected:'вба'},{call:"rev('hello')",expected:'olleh'},{call:"how_long('Привет')",expected:6}],
     hint:'return s[::-1] / return len(s)'}
  ]
},

'10.8':{
  title:'Проект: угадай число',
  context:'Собираем всё: функции, условия, циклы, input. Напиши функции для игры «угадай число» — они будут протестированы!',
  theory:[
    {icon:'🎯',title:'Логика игры',html:`<p>Компьютер загадывает число, игрок вводит попытки, программа отвечает «больше/меньше/угадал». Мы напишем «движок» проверки попыток.</p>`}
  ],
  examples:[
    {title:'Подсказка больше/меньше',steps:[
      {text:'if guess &lt; secret: return "больше".',rule:'подсказка'},
      {text:'elif guess &gt; secret: return "меньше".',rule:'подсказка'},
      {text:'else: return "угадал!".',rule:'победа'}
    ]}
  ],
  taskTypes:[
    factsTT('Повторение','🎯',[
      {q:'Случайное число: модуль…?',a:['random'],h:'import random'},
      {q:'random.randint(1, 10) даёт число от 1 до…?',a:['10'],h:'включительно'}
    ])
  ],
  code:[
    {title:'Движок «угадай число»',lang:'py',
     taskText:'Напиши <b>hint(secret, guess)</b>: "больше", "меньше" или "угадал!".',
     starter:'def hint(secret, guess):\n    ',
     tests:[{call:'hint(5, 3)',expected:'больше'},{call:'hint(5, 8)',expected:'меньше'},{call:'hint(5, 5)',expected:'угадал!'}],
     hint:'if guess < secret: return "больше"'}
  ]
},

/* ═════════ 11 КЛАСС: C++ ═════════ */

'11.1':{
  title:'C++: структура, cout/cin',
  context:'C++ — быстрый и строгий язык: используется в играх, движках, олимпиадах. Каждая программа начинается с #include и функции main.',
  theory:[
    {icon:'⚙️',title:'Скелет программы',html:`
      <div class="code-sample">#include &lt;iostream&gt;      // подключение библиотеки ввода-вывода
using namespace std;

int main() {
    cout &lt;&lt; "Привет, мир!";   // вывод (&lt;&lt; — «стрелка» в cout)
    return 0;
}</div>
      <p><b>cout</b> — вывод, <b>cin</b> — ввод, <b>;</b> в конце каждой строки обязательна!</p>`},
    {icon:'📤',title:'cin — ввод',html:`
      <div class="code-sample">int age;
cin &gt;&gt; age;    // прочитать число в age</div>`}
  ],
  examples:[
    {title:'Вывод двух чисел',steps:[
      {text:'cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b;',rule:'цепочка &lt;&lt;'},
      {text:'endl — перевод строки.',rule:'endl'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','⚙️',[
      {q:'Вывод в C++ — это…?',a:['cout'],h:'cout'},
      {q:'Ввод в C++ — это…?',a:['cin'],h:'cin'},
      {q:'Какая функция — точка входа?',a:['main'],h:'main'},
      {q:'Что подключить для ввода-вывода?',a:['#include <iostream>','iostream'],h:'iostream'}
    ])
  ],
  code:[
    {title:'Привет, мир!',lang:'cpp',
     taskText:'Напиши полную программу: подключи iostream, в main выведи <b>"Привет, мир!"</b> через cout.',
     starter:'#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {need:'#include <iostream>',label:'подключён iostream'},
       {need:'int main',label:'есть функция main'},
       {re:'cout\\s*<<',label:'используется cout <<'},
       {need:'Привет, мир!',label:'выводит «Привет, мир!»'},
       {need:'return 0',label:'return 0'}
     ],
     hint:'cout << "Привет, мир!";'}
  ]
},

'11.2':{
  title:'Переменные и типы',
  context:'C++ — язык со строгой типизацией: тип переменной объявляется один раз и навсегда (int, double, string, bool).',
  theory:[
    {icon:'🧮',title:'Типы',html:`
      <div class="code-sample">int a = 5;          // целое
double pi = 3.14;   // дробное
string s = "текст"; // строка
bool b = true;      // булево</div>
      <p>Операторы: + − * / % . Внимание: <b>7 / 2 = 3</b> (целое деление int!), 7.0 / 2 = 3.5.</p>`}
  ],
  examples:[
    {title:'Почему 7/2=3',steps:[
      {text:'Оба операнда int → деление целочисленное.',rule:'int'},
      {text:'7 / 2 = 3 (остаток отбрасывается).',rule:'результат'},
      {text:'7.0 / 2 = 3.5 (есть double).',rule:'сравнение'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧮',[
      {q:'Целое число — тип…?',a:['int'],h:'int'},
      {q:'Дробное число — тип…?',a:['double','float'],h:'double'},
      {q:'Строка — тип…?',a:['string'],h:'string'},
      {q:'7 / 2 в int = ?',a:['3'],h:'целочисленное'}
    ])
  ],
  code:[
    {title:'Сумма двух чисел',lang:'cpp',
     taskText:'Напиши программу: объяви <b>int a = 2, b = 3</b> и выведи их сумму через cout.',
     starter:'#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {re:'int\\s+a\\s*=\\s*2',label:'объявлена int a = 2'},
       {re:'int\\s+b\\s*=\\s*3',label:'объявлена int b = 3'},
       {re:'cout\\s*<<.*(a\\s*\\+\\s*b|5)',label:'выводит сумму (a + b)'}
     ],
     hint:'cout << a + b;'}
  ]
},

'11.3':{
  title:'Условия и switch',
  context:'Условия в C++ — в фигурных скобках, после if/else. Для выбора из нескольких вариантов — switch.',
  theory:[
    {icon:'🚦',title:'if / else if / else',html:`
      <div class="code-sample">if (age &gt;= 18) {
    cout &lt;&lt; "вход разрешён";
} else if (age &gt;= 14) {
    cout &lt;&lt; "с родителями";
} else {
    cout &lt;&lt; "нельзя";
}</div>
      <p>Сравнения: ==, !=, &gt;, &lt;. Логика: &amp;&amp;, ||, !.</p>`}
  ],
  examples:[
    {title:'Знак числа',steps:[
      {text:'if (n &gt; 0) cout &lt;&lt; "+";',rule:'плюс'},
      {text:'else if (n &lt; 0) cout &lt;&lt; "-";',rule:'минус'},
      {text:'else cout &lt;&lt; "0";',rule:'ноль'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🚦',[
      {q:'Равенство в C++ — …?',a:['=='],h:'=='},
      {q:'«И» в C++ — …?',a:['&&'],h:'&&'},
      {q:'«ИЛИ» в C++ — …?',a:['||'],h:'||'}
    ])
  ],
  code:[
    {title:'Чётное или нечётное',lang:'cpp',
     taskText:'Напиши программу: объяви <b>int n = 7</b> и выведи "чётное" или "нечётное" через if/else и <b>n % 2</b>.',
     starter:'#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 7;\n    \n    return 0;\n}',
     patterns:[
       {re:'if\\s*\\(.*%\\s*2',label:'условие с n % 2'},
       {need:'чётное',label:'выводит «чётное»'},
       {need:'нечётное',label:'выводит «нечётное»'},
       {need:'else',label:'есть else'}
     ],
     hint:'if (n % 2 == 0) cout << "чётное"; else cout << "нечётное";'}
  ]
},

'11.4':{
  title:'Циклы for и while',
  context:'for — когда знаешь число повторений, while — пока условие истинно. Синтаксис for: (старт; условие; шаг).',
  theory:[
    {icon:'🔁',title:'for и while',html:`
      <div class="code-sample">for (int i = 1; i &lt;= 5; i++) {
    cout &lt;&lt; i &lt;&lt; " ";
}
int n = 3;
while (n &gt; 0) { cout &lt;&lt; n; n--; }</div>`}
  ],
  examples:[
    {title:'Сумма 1..n',steps:[
      {text:'int s = 0;',rule:'копилка'},
      {text:'for (int i=1; i&lt;=n; i++) s += i;',rule:'круг'},
      {text:'cout &lt;&lt; s;',rule:'вывод'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🔁',[
      {q:'for (int i=0; i&lt;3; i++) — сколько кругов?',a:['3'],h:'0,1,2'},
      {q:'Выйти из цикла — …?',a:['break'],h:'break'},
      {q:'Пропустить круг — …?',a:['continue'],h:'continue'}
    ])
  ],
  code:[
    {title:'Выведи 1..5',lang:'cpp',
     taskText:'Напиши цикл <b>for</b>, выводящий числа от 1 до 5 через cout.',
     starter:'#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {re:'for\\s*\\(',label:'есть цикл for'},
       {re:'i\\s*<=\\s*5|i\\s*<\\s*6',label:'условие до 5'},
       {re:'cout\\s*<<',label:'вывод в cout'},
       {re:'i\\+\\+',label:'шаг i++'}
     ],
     hint:'for (int i = 1; i <= 5; i++) cout << i << " ";'}
  ]
},

'11.5':{
  title:'Функции',
  context:'Функция в C++ имеет тип возвращаемого значения и типы параметров. Объявляется до main или с прототипом.',
  theory:[
    {icon:'🧰',title:'Синтаксис',html:`
      <div class="code-sample">int add(int a, int b) {   // тип_возврата имя(типы параметры)
    return a + b;
}

int main() {
    cout &lt;&lt; add(2, 3);   // 5
}</div>`}
  ],
  examples:[
    {title:'Квадрат',steps:[
      {text:'int square(int x) { return x * x; }',rule:'функция'},
      {text:'square(4) → 16.',rule:'вызов'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','🧰',[
      {q:'Что указывается ПЕРЕД именем функции?',a:['тип возвращаемого значения','тип'],h:'int / double / void'},
      {q:'Функция ничего не возвращает — тип…?',a:['void'],h:'void'}
    ])
  ],
  code:[
    {title:'Функция square',lang:'cpp',
     taskText:'Напиши функцию <b>int square(int x)</b>, возвращающую x·x, и вызови её в main.',
     starter:'#include <iostream>\nusing namespace std;\n\n// твоя функция здесь\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {re:'int\\s+square\\s*\\(\\s*int',label:'объявлена int square(int)'},
       {re:'return\\s+x\\s*\\*\\s*x',label:'return x * x'},
       {re:'square\\s*\\(',label:'вызывается в main'}
     ],
     hint:'int square(int x){ return x*x; }'}
  ]
},

'11.6':{
  title:'Массивы и vector',
  context:'Обычный массив имеет фиксированный размер, vector — «резиновый» массив из библиотеки <vector> (рекомендуется!).',
  theory:[
    {icon:'📚',title:'Массив и vector',html:`
      <div class="code-sample">int arr[3] = {1, 2, 3};      // фиксированный
#include &lt;vector&gt;
vector&lt;int&gt; v = {1, 2, 3};
v.push_back(4);               // добавить
v.size();                     // размер</div>`}
  ],
  examples:[
    {title:'Сумма vector',steps:[
      {text:'int s = 0;',rule:'копилка'},
      {text:'for (int x : v) s += x;',rule:'range-for'},
      {text:'cout &lt;&lt; s;',rule:'вывод'}
    ]}
  ],
  taskTypes:[
    factsTT('Теория','📚',[
      {q:'Добавить в vector — метод…?',a:['push_back'],h:'push_back'},
      {q:'Размер vector — метод…?',a:['size'],h:'size'},
      {q:'arr[5] — индексы от…?',a:['0'],h:'с нуля'}
    ])
  ],
  code:[
    {title:'Vector и сумма',lang:'cpp',
     taskText:'Создай <b>vector&lt;int&gt;</b> с числами и выведи его сумму (циклом).',
     starter:'#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {re:'vector\\s*<\\s*int',label:'объявлен vector<int>'},
       {re:'push_back|\\{\\s*\\d',label:'vector заполнен'},
       {re:'for\\s*\\(',label:'есть цикл for'},
       {re:'cout\\s*<<',label:'вывод суммы'}
     ],
     hint:'vector<int> v = {1,2,3}; int s=0; for(int x: v) s+=x; cout<<s;'}
  ]
},

'11.7':{
  title:'Проект: итоговая задача',
  context:'Финальный босс: собери всё — переменные, условия, циклы, функции — в одной программе на C++.',
  theory:[
    {icon:'🏆',title:'Что используем',html:`<p>#include, main, cout/cin, int/double, if/else, for/while, функции. Задача: посчитать среднее из n чисел и вывести вердикт.</p>`}
  ],
  examples:[
    {title:'Среднее и вердикт',steps:[
      {text:'Считаем сумму циклом.',rule:'for'},
      {text:'double avg = sum / n;',rule:'double!'},
      {text:'if (avg &gt;= 4) "отлично", else "учись".',rule:'if'}
    ]}
  ],
  taskTypes:[
    factsTT('Итоги','🏆',[
      {q:'Среднее лучше хранить в типе…?',a:['double'],h:'double'},
      {q:'Вывод — …?',a:['cout'],h:'cout'},
      {q:'Точка входа — …?',a:['main'],h:'main'}
    ])
  ],
  code:[
    {title:'Среднее из трёх',lang:'cpp',
     taskText:'Напиши функцию <b>double avg(int a, int b, int c)</b> — среднее трёх чисел, и вызови её.',
     starter:'#include <iostream>\nusing namespace std;\n\n// функция avg здесь\n\nint main() {\n    \n    return 0;\n}',
     patterns:[
       {re:'double\\s+avg\\s*\\(\\s*int',label:'объявлена double avg(int,int,int)'},
       {re:'return\\s+.*\\/\\s*3',label:'делит сумму на 3'},
       {re:'avg\\s*\\(',label:'вызывается в main'}
     ],
     hint:'double avg(int a,int b,int c){ return (a+b+c)/3.0; }'}
  ]
}

};