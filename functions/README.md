# Firebase Functions - JJJ AI Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Set OpenAI API Key in Firebase Config
```bash
# From project root or functions folder
firebase functions:config:set openai.key="SK_YOUR_OPENAI_KEY_HERE"
firebase deploy --only functions:config
```

⚠️ **Important:** Never hardcode API keys in code. Always use Firebase config.

### 3. Build TypeScript
```bash
cd functions
npm run build
```

### 4. Deploy Function
```bash
# From functions folder
npm run build
firebase deploy --only functions:jjjAi
```

### 5. Get Function URL
After deployment, check Firebase Console → Functions section:
- Function URL will be: `https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/jjjAi`
- Copy this URL and update `lib/services/ai_service.dart` with the endpoint

## Function Details

- **Name:** `jjjAi`
- **Region:** `asia-south1` (India)
- **Method:** POST
- **Request Body:** `{ "text": "user input text" }`
- **Response:** `{ "reply": "AI response text" }`

## Testing Locally

```bash
cd functions
npm run serve
```

Then test with:
```bash
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/asia-south1/jjjAi \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello JJJ AI"}'
```

