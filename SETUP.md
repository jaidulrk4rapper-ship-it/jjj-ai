# JJJ AI - Setup Guide

This guide will help you set up the JJJ AI application with quota management, payment integration, and usage tracking.

## Prerequisites

- Node.js 18+ installed
- Firebase project with Firestore enabled
- Razorpay account (for payments)
- Gemini API key

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Variables

Copy `env.example` to `.env.local` and fill in the values:

```bash
cp env.example .env.local
```

### Required Environment Variables:

1. **GEMINI_API_KEY**: Your Google Gemini API key
   - Get it from: https://aistudio.google.com/app/apikey

2. **FIREBASE_SERVICE_ACCOUNT_KEY**: Firebase Admin SDK service account JSON
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Copy the entire JSON and paste it as a single-line string in `.env.local`
   - Example: `FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}`

3. **Razorpay Keys**:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `RAZORPAY_WEBHOOK_SECRET`: Webhook secret (set up in Razorpay Dashboard)
   - Get these from: https://dashboard.razorpay.com/app/keys

4. **Usage Limits** (optional - defaults are set):
   - Free plan limits (per day)
   - Pro plan limits (per month)

## Step 3: Firebase Setup

1. Create a Firestore database in your Firebase project
2. Set up security rules (for production, restrict access appropriately)
3. The app will automatically create the `users` collection structure

## Step 4: Razorpay Webhook Setup

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add a webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.authorized`
4. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

## Step 5: Authentication Setup

The current implementation uses a development-friendly approach with headers. For production, you should:

1. Implement proper Firebase Auth or NextAuth.js
2. Update `src/lib/auth.ts` to use your authentication method
3. Remove the dev header fallback in production

### Development Testing

For testing without full auth setup, you can send these headers with requests:
- `x-user-id`: test-user-123
- `x-user-email`: test@example.com

## Step 6: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Features Implemented

### ✅ Free Plan
- 30 AI Chat messages per day
- 5 Text-to-Speech clips per day (max 30 seconds each)
- 5 Images per day
- Max 2,000 characters per message

### ✅ Pro Plan (₹699/month)
- 1,000+ AI Chat messages per month
- 300 minutes of Text-to-Speech per month
- 300 Images per month
- Max 6,000 characters per message
- Priority support

### ✅ Usage Tracking
- Daily limits for free users
- Monthly limits for pro users
- Real-time usage display in sidebar
- Automatic quota enforcement

### ✅ Payment Integration
- Razorpay checkout integration
- Webhook handling for payment verification
- Automatic plan upgrade on successful payment

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # Authentication helpers
│   ├── db.ts                # Firestore database helpers
│   ├── firebase-admin.ts    # Firebase Admin initialization
│   └── usageGuard.ts        # Quota checking and usage tracking
├── app/
│   ├── api/
│   │   ├── chat/            # AI Chat API with usage guard
│   │   ├── text-to-speech/  # TTS API with usage guard
│   │   ├── usage/           # Get user usage stats
│   │   └── payment/         # Razorpay integration
│   ├── upgrade/             # Upgrade page
│   └── ...
└── components/
    └── layout/
        └── Sidebar.tsx      # Sidebar with usage indicators
```

## Testing

1. **Test Free Plan Limits**:
   - Send 30 chat messages (should work)
   - Send 31st message (should be blocked with friendly message)

2. **Test Pro Upgrade**:
   - Go to `/upgrade`
   - Use Razorpay test mode
   - Complete payment
   - Verify user is upgraded in Firestore

3. **Test Usage Display**:
   - Check sidebar for usage indicators
   - Verify counts update after API calls

## Production Deployment

1. Set all environment variables in your hosting platform (Vercel, etc.)
2. Update Razorpay webhook URL to production domain
3. Implement proper authentication (remove dev headers)
4. Set up Firebase security rules for production
5. Enable Firestore indexes if needed

## Troubleshooting

### "FIREBASE_SERVICE_ACCOUNT_KEY is not set"
- Make sure you've copied the entire JSON as a single-line string
- Check for proper escaping of quotes

### "Please sign in to use JJJ AI"
- Implement proper authentication or use dev headers for testing
- Check `src/lib/auth.ts` for auth logic

### Payment webhook not working
- Verify webhook URL is accessible
- Check webhook secret matches
- Verify webhook events are selected in Razorpay dashboard

## Support

For issues or questions, check the code comments or create an issue in the repository.

