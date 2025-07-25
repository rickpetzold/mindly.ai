# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a brain.os application called "brain.os2" that allows users to capture thoughts through three modalities: audio recording, text input, and image upload with captions. The application integrates with Vapi for voice assistance and n8n for workflow automation.

# TODO: SPLIT MD INTO SINGLE MD + HOOKS

## Architecture

### Backend (Node.js/Express)

- **Entry Point**: `backend/server.js` - Express server serving static files and API proxy endpoints
- **Configuration**: `backend/config.env` - Environment variables for Vapi API keys and n8n webhook URLs
- **Port**: Runs on port 3001 by default

### Frontend (Vanilla HTML/JS)

- **Entry Point**: `frontend/src/index.html` - Single-page application with embedded JavaScript
- **UI Framework**: Tailwind CSS for styling, custom CSS for animations and components
- **Architecture**: Component-based UI with step transitions for different input modes

### Key API Endpoints

- `/api/vapi/start` - Proxy to fetch user data from n8n and return Vapi configuration
- `/api/logs/audio` - Proxy to n8n webhook for audio log processing
- `/api/logs/text` - Proxy to n8n webhook for text log processing
- `/api/logs/image` - Proxy to n8n webhook for image log processing

### External Integrations

- **Vapi**: Voice AI assistant with embedded client-side SDK
- **n8n**: Workflow automation platform for processing different log types
- **User System**: Integrates with Softr user authentication via `window.logged_in_user.record_id`

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Start production server
pnpm run start
```

Both `dev` and `start` commands run `node backend/server.js` and serve the application on http://localhost:3001.

## File Structure

```
├── backend/
│   ├── server.js           # Express server with proxy endpoints
│   ├── config.env          # Environment configuration
│   └── n8n/               # n8n workflow exports
├── frontend/src/
│   └── index.html          # Complete SPA with embedded JS/CSS
├── package.json            # Dependencies and scripts
└── pnpm-lock.yaml         # Package lock file
```

## Key Dependencies

- **Backend**: express, cors, node-fetch, dotenv
- **Frontend**: Tailwind CSS (CDN), Vapi SDK (CDN), Web APIs (MediaRecorder, Canvas, Camera)
- **Dev Tools**: ESLint with Airbnb config, Prettier

## Environment Variables

Required in `backend/config.env`:

- `VAPI_API_KEY` - Vapi voice assistant API key
- `VAPI_ASSISTANT_ID` - Specific Vapi assistant configuration ID
- `N8N_WEBHOOK_BASE` - Base URL for n8n webhook endpoints
- `PORT` - Server port (optional, defaults to 3001)

## Security Notes

- API keys are handled server-side in the Express proxy
- Frontend uses Vapi's client-side SDK but user data is fetched through backend proxy
- File uploads have 5MB size limits for images
- Audio recordings are limited to 5 minutes maximum
