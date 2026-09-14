# Study Buddy 📚

A subject-aware AI study assistant built with **React** and the **Claude API**. Students pick a subject, ask questions, and get clear explanations, worked examples, or quiz-style practice — all in a clean chat interface.

## Features

- **Subject-aware tutoring** — toggle between Math, Physics, CS/Programming, Biology, or General, and the assistant tailors its explanations accordingly
- **Conversational chat interface** — full message history, typing indicator, and smooth auto-scroll
- **Quiz mode** — ask it to quiz you on a topic and it walks through one question at a time
- **Powered by Claude** — uses Anthropic's `claude-sonnet-4-6` model via the Messages API for clear, well-explained responses

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (functional components, hooks) |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| AI | Claude API (Anthropic) |

## How It Works

1. The user selects a subject and types a question into the chat input.
2. The app sends the full conversation history, along with a subject-specific system prompt, to the Claude API's `/v1/messages` endpoint.
3. Claude's response is parsed from the returned content blocks and rendered in the chat window.
4. The conversation continues with full context, so follow-up questions stay coherent.

## Project Structure

```
study-buddy-chatbot/
├── study_buddy_chatbot.jsx   # Main chatbot component
└── README.md
```

## Running Locally

This project was originally built and tested as a Claude.ai artifact, where API calls are handled automatically. To run it as a standalone app:

1. Create a React project (e.g., with Vite):
   ```bash
   npm create vite@latest study-buddy -- --template react
   cd study-buddy
   npm install
   ```
2. Install dependencies:
   ```bash
   npm install lucide-react
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Copy `study_buddy_chatbot.jsx` into `src/` and import it in `App.jsx`.
4. Add your own Anthropic API key from [console.anthropic.com](https://console.anthropic.com), and route API calls through a small backend to keep the key secure (calling the API directly from browser JavaScript with an exposed key is not safe for production use).
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Why I Built This

I wanted hands-on experience working with a large language model API rather than just using an AI chat product — designing the prompt structure, managing conversation state, and building an interface around it. It also doubles as something genuinely useful: a study tool I can keep improving.

## Future Improvements

- Persist chat history between sessions
- Add support for image/diagram uploads (e.g., a math problem photo)
- Track quiz performance over time

---

**Author:** Jefflin Marina I
**Built with:** React, Tailwind CSS, Claude API
