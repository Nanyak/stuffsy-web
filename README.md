# Stuffsy Web

Frontend for Stuffsy - a collection of useful online tools.

## Features

- **Cloud Storage** - Upload, download, and manage files with drag & drop support
- **URL Shortener** - Create short, shareable links from long URLs
- **More coming soon** - QR Generator, Password Generator, Text Tools

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- shadcn/ui components
- Lucide icons
- Axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd stuffsy-web
npm install
```

### Configuration

Copy `.env.sample` to `.env`:

```bash
cp .env.sample .env
```

| Variable       | Description     | Default                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:9808` |

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
stuffsy-web/
├── src/
│   ├── components/
│   │   ├── layout/       # Layout components (Navbar, Layout)
│   │   ├── pages/        # Page components (Home, Storage, Shortener)
│   │   ├── storage/      # Storage feature components
│   │   └── ui/           # shadcn/ui components
│   ├── services/         # API clients
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # Entry point
├── .claude/              # Claude context files
├── .github/prompts/      # AI prompts
└── public/               # Static assets
```

## Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## UI Guidelines

This project follows **ui-ux-pro-max** design guidelines:

- Lucide icons (no emojis)
- `cursor-pointer` on interactive elements
- Smooth transitions (150-300ms)
- Consistent Card/Button patterns
- Light/dark mode support

## License

MIT
