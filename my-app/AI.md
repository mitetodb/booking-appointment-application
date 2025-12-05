# Enabling Claude Haiku 4.5 for all clients

This project is a frontend SPA. To instruct the backend (or any server) to use Claude Haiku 4.5 for model calls, follow the steps below.

1. Environment variable
   - Create a `.env` in the project root (do NOT commit secrets):
     ```
     VITE_AI_MODEL=claude-haiku-4.5
     VITE_API_BASE_URL=http://localhost:8082/api
     ```
   - Vite exposes variables prefixed with `VITE_` in `import.meta.env` at build time.

2. Client behavior
   - The frontend sends the default model via the `X-AI-Model` header on all requests (see `services/apiClient.js`).
   - The backend should read the header `X-AI-Model` (or fall back to its own configured default) and pass the `model` parameter when calling Anthropic (or other provider).

3. Backend (recommended)
   - Keep your Anthropic API key on the server only.
   - Example pseudo-code for backend (Node/Express):
     ```js
     const model = req.headers['x-ai-model'] || process.env.AI_MODEL || 'claude-haiku-4.5';
     const response = await fetch('https://api.anthropic.com/v1/complete', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-api-key': process.env.ANTHROPIC_API_KEY,
       },
       body: JSON.stringify({ model, prompt: userPrompt })
     });
     ```

4. Deployment
   - Set `AI_MODEL=claude-haiku-4.5` (or the provider-specific env) on your server or platform.
   - Restart or redeploy the backend so the value takes effect.

5. Security note
   - Do NOT put API keys in the frontend. Keep provider keys on the server.

If you want, I can also:
- Add server-side example endpoints to this repo (requires a backend), or
- Add an example test that triggers a call and verifies the backend received `X-AI-Model`.
