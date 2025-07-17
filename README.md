# Portuguese Learning App

A web application for learning European Portuguese with interactive fill-in-the-blank exercises.

## Features

- **Configuration**: Select your language levels (A1-C2) and topics
- **Learning**: Interactive exercises with gap-filling
- **AI Integration**: Optional Claude AI for generating exercises and providing explanations
- **Progress Tracking**: Tracks incorrect answers and provides review sessions
- **Persistent Storage**: Saves your configuration and progress locally

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Without AI (Basic Mode)
- The app works with pre-built exercises
- Basic answer checking
- No API key required

### With Claude AI (Enhanced Mode)
- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- Enter it in the configuration page
- Enables AI-generated exercises and detailed explanations

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Options
- **Netlify**: Similar to Vercel, great for Next.js
- **Railway**: Good for full-stack apps
- **Render**: Free tier available

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: Anthropic Claude API
- **Storage**: localStorage (no database needed)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-exercise/
│   │   └── check-answer/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── Configuration.tsx
│   ├── Learning.tsx
│   └── Header.tsx
├── store/
│   └── useStore.ts
├── data/
│   └── topics.ts
└── types/
    └── index.ts
```

## Development

### Adding New Topics
Edit `src/data/topics.ts` to add new grammar topics and their associated levels.

### Adding Fallback Exercises
Edit `src/app/api/generate-exercise/route.ts` to add more fallback exercises for when AI is not available.

### Customizing Levels
The app supports CEFR levels A1-C2. Topics are associated with appropriate levels in the topics configuration.

## License

MIT
