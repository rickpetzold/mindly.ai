# AGENT.md

This file provides guidance to Claude Code and cursor when working with code in this repository.

## Project Overview

This is a brain.os application called "brain.os2" that allows users to capture thoughts through three modalities: audio recording, text input, and image upload with captions. The application integrates with Vapi for voice assistance and n8n for workflow automation.

## Architecture

### Backend (Node.js/Express)

Deployed on vercel as serverless function, stores envs, acts as middleware to calls to n8n
N8N deployed on Hetzner with webhooks

### Frontend (Vanilla HTML/JS)

Served in airtable

### Key API Endpoints

- `/api/vapi` - Proxy to fetch user data from n8n and return Vapi configuration
- `/api/audio` - Proxy to n8n webhook for audio log processing
- `/api/text` - Proxy to n8n webhook for text log processing
- `/api/image` - Proxy to n8n webhook for image log processing

### External Integrations

- **Vapi**: Voice AI assistant with embedded client-side SDK
- **n8n**: Workflow automation platform for processing different log types
- **User System**: Integrates with Softr user authentication via `window.logged_in_user.record_id`

## Environment Variables

Required in `backend/config.env`:

- `VAPI_API_KEY` - Vapi voice assistant API key
- `VAPI_ASSISTANT_ID` - Specific Vapi assistant configuration ID
- `N8N_WEBHOOK_BASE` - Base URL for n8n webhook endpoints
- `PORT` - Server port (optional, defaults to 3001)

## Security Notes

- API keys are handled server-side in the node serverless functions proxy
- Frontend uses Vapi's client-side SDK but user data is fetched through backend proxy
