# Evercalm

A full-screen immersive meditation and ambient sound experience.

## Setup & Deployment

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Deploy to Vercel

1. Push this entire folder to a GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy
5. Visit your live URL

### Update Media URLs

Replace placeholder URLs in `pages/index.js` with your Cloudinary URLs:

```javascript
const sceneries = [
  {
    id: 'fireplace',
    videoUrl: 'https://res.cloudinary.com/YOUR-NAME/video/upload/YOUR-ID.mp4',
    ambientSoundsUrl: 'https://res.cloudinary.com/YOUR-NAME/video/upload/YOUR-ID.mp3',
    meditationMusicUrl: 'https://res.cloudinary.com/YOUR-NAME/video/upload/YOUR-ID.mp3',
  },
  // ...
]
```

## Project Structure

```
evercalm/
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   └── index.js         # Main Evercalm component
├── package.json         # Dependencies
├── next.config.js       # Next.js config
└── .gitignore          # Git ignore file
```

## Features

- Full-screen immersive video
- Layered audio: ambient sounds + meditation music + voice
- Three audio modes: Guided Meditation, Ambient Only, Affirmations
- Smooth fade transitions between screens
- Moody, atmospheric design
