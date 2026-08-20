# Algebra Helper App 🧮

Умный помощник по алгебре на базе FastAPI и SymPy.

## Структура проекта
```
algebra-helper/
├── main.py                ← FastAPI сервер
├── static/
│   └── index.html        ← Веб-интерфейс
├── requirements.txt      ← Зависимости Python
├── Procfile             ← Команда запуска для Railway
├── .gitignore           ← Исключения для Git
└── README.md            ← Описание проекта
```

## Быстрый запуск
1. Создайте виртуальное окружение:
   ```bash
   python -m venv venv
   ```
2. Активируйте окружение:
   - **Windows:** `venv\Scripts\activate`
   - **Linux/Mac:** `source venv/bin/activate`
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Запустите сервер:
   ```bash
   python main.py
   ```
5. Откройте в браузере: `http://localhost:8000`
