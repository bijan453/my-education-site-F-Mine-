# Deploy to Cloud

This project is ready for deployment to a Python cloud hosting provider.

## Recommended hosts

- Heroku
- Railway
- Render
- PythonAnywhere
- Fly

## Requirements

- The backend is `app.py` (Flask)
- The frontend page is `chat-lang.html`
- `requirements.txt` contains dependencies
- `Procfile` launches `gunicorn`
- `runtime.txt` selects Python 3.11

## Environment variables

Set your API keys in the host environment, not in the code:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `DEESEEK_API_KEY`

If you are using only one provider, set only that key.

## Heroku

1. Install the Heroku CLI and log in:
   ```bash
   heroku login
   ```
2. Create an app:
   ```bash
   heroku create your-app-name
   ```
3. Set config vars:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set GEMINI_API_KEY=your_key
   heroku config:set DEESEEK_API_KEY=your_key
   ```
4. Push your repo to Heroku:
   ```bash
   git add .
   git commit -m "Prepare for Heroku deploy"
   git push heroku main
   ```

## Railway

1. Sign in to Railway and create a new project.
2. Connect your GitHub repo or deploy from local CLI.
3. Add environment variables in Railway project settings.
4. Set the start command to:
   ```bash
   gunicorn app:app --bind 0.0.0.0:$PORT
   ```

## Render

1. Create a new Web Service.
2. Use GitHub repo or connect your project.
3. Set the build command:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the start command:
   ```bash
   gunicorn app:app --bind 0.0.0.0:$PORT
   ```
5. Add environment variables in Render service settings.

## PythonAnywhere

1. Upload the project files.
2. Set the web app to use Python 3.11.
3. In the web app settings, set the WSGI entry point to `app.app`.
4. Set the environment variables in the PythonAnywhere web app console.

## Notes

- `chat-lang.html` is already configured to call `/api/chat` on the same origin.
- Do not put API keys into `chat-lang.html` or other frontend files.
