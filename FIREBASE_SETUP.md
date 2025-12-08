# Firebase Functions Setup Guide

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- OpenAI API key ready

## Step-by-Step Setup

### 1. Initialize Firebase (if not done)
```bash
firebase login
firebase init functions
# Select: TypeScript, ESLint, install dependencies
```

### 2. Install Dependencies
```bash
cd functions
npm install
```

### 3. Set OpenAI API Key
```bash
# From project root
firebase functions:config:set openai.key="SK_YOUR_OPENAI_KEY_HERE"
firebase deploy --only functions:config
```

### 4. Build & Deploy
```bash
cd functions
npm run build
firebase deploy --only functions:jjjAi
```

### 5. Update Flutter App
After deployment, get the function URL from Firebase Console and update:
- `lib/services/ai_service.dart` → `_endpoint` variable

Function URL format:
```
https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/jjjAi
```

## Testing

### Local Testing
```bash
cd functions
npm run serve
```

### Production Testing
```bash
curl -X POST https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/jjjAi \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello JJJ AI"}'
```

## Troubleshooting

- **Config not found:** Make sure you ran `firebase deploy --only functions:config`
- **OpenAI API error:** Check your API key is valid and has credits
- **CORS errors:** Function already handles CORS, but check if domain is allowed
- **Build errors:** Run `npm run build` in functions folder first

