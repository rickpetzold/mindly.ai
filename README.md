# Mindly - AI-Powered Thought Logging Platform

An intelligent thought logging platform that combines voice AI, multimodal input processing, and automated workflow management to capture and organize personal insights.

## Overview

Mindly is an intelligent thought logging platform that combines voice AI, multimodal input processing, and automated workflow management to capture and organize personal insights.

## Architecture

### Frontend

- **Softr-based web interface** with custom HTML/CSS/JavaScript
- **Multi-modal input support**: Voice recording, text input, image upload with captions
- **Real-time voice chat** integration with VAPI
- **Responsive design** optimized for mobile and desktop

### Backend (Vercel)

- **API Gateway** handling CORS, authentication, and data forwarding
- **Secure VAPI integration** with server-side assistant creation
- **Binary file handling** for audio and image processing
- **Environment-based routing** (test/production)

### Automation (n8n)

- **Real-time workflow processing** triggered by webhooks
- **Airtable integration** for data persistence and retrieval
- **AI-powered content analysis** and categorization
- **Dynamic user context** management and personalization

### Voice AI (VAPI)

- **Personalized assistants** created per user with custom prompts
- **Real-time function calling** for data capture during conversations
- **Secure webhook routing** through backend proxy
- **Tool-based information storage** with intent recognition

## Key Features

- 🎤 **Voice Thought Capture**: Record thoughts with live audio visualization
- 💬 **AI Voice Conversations**: Real-time chat with personalized AI assistant
- 📝 **Text Input**: Simple text-based thought logging
- 📸 **Image Logging**: Upload images with contextual captions
- 🔄 **Automated Processing**: AI-powered categorization and storage
- 📊 **Personal Context**: User-specific data retrieval and personalization
- 🌐 **Cross-Platform**: Works seamlessly across devices

## Technical Stack

- **Frontend**: Softr, HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Vercel, Node.js, TypeScript
- **Database**: Airtable
- **Automation**: n8n
- **Voice AI**: VAPI with OpenAI models
- **File Storage**: FormData with binary file handling

## API Endpoints

| Endpoint            | Method | Purpose                                 |
| ------------------- | ------ | --------------------------------------- |
| `/api/audio/audio`  | POST   | Process audio recordings                |
| `/api/image/image`  | POST   | Handle image uploads with captions      |
| `/api/text/text`    | POST   | Process text-based thoughts             |
| `/api/vapi/start`   | POST   | Initialize personalized voice assistant |
| `/api/vapi/webhook` | POST   | Handle voice AI function calls          |

## Environment Variables

```bash
# n8n Configuration
N8N_WEBHOOK_BASE=https://your-n8n-instance.com
ENVIRONMENT=production # or test

# VAPI Configuration
VAPI_API_KEY=your-private-vapi-key
VAPI_WEBHOOK_BASE=https://your-domain.com
```

## Security Features

- **Server-side API key management** - No sensitive keys exposed to client
- **CORS protection** with domain restrictions
- **Secure webhook routing** through backend proxy
- **Environment-based configurations** for test/production separation
- **Binary file validation** and size limits

## Development Notes

This system is designed for:

- **Personal thought management** and AI-assisted reflection
- **Real-time voice interaction** with context-aware AI
- **Automated workflow processing** of multimodal inputs
- **Secure data handling** with enterprise-grade privacy

## License

**All Rights Reserved** - This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited. See [LICENSE](LICENSE) for full terms.

---

_Built with ❤️ for intelligent thought capture and AI-assisted personal development._
