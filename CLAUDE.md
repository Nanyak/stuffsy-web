# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Configuration

Copy `.env.sample` to `.env`. Key variable: `VITE_API_URL` (backend API, default `http://localhost:9808`).

## Architecture

React 19 + TypeScript + Vite 7 + Tailwind CSS 4 frontend for Stuffsy tools platform.

### Routing (App.tsx)

- `/` - HomePage
- `/storage` - StoragePage (file management)
- `/shortener` - ShortenerPage (URL shortener)
- `/s/:code` - RedirectPage (short URL redirect, outside Layout)

### Key Patterns

**Path alias**: `@/` maps to `src/` (configured in tsconfig.json and vite.config.ts)

**Services** (`src/services/`): API clients using axios with relative URLs (proxied via backend):

- `storage_service.ts` - File CRUD operations (`/files` endpoints)
- `url_shortener_service.tsx` - URL shortening (`/url` endpoint)

**Components structure**:

- `components/ui/` - shadcn/ui primitives (Button, Card, Input)
- `components/layout/` - Layout wrapper with Navbar
- `components/pages/` - Route-level page components
- `components/storage/` - File storage feature components (FileBrowser, FileCard, FileGrid, FileList, StagedFileCard, FileStagingArea)

**Types** (`src/types/storage.ts`): Shared interfaces for FileInfo, StagedFile, ViewMode, UploadProgress

## UI Guidelines

- Lucide icons only (no emojis)
- `cursor-pointer` on interactive elements
- Smooth transitions (150-300ms)
- Light/dark mode support

