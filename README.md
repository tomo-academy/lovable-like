<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XhWD2HdDfTXWtj3HnbLoWJTTeDes_JgX

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   VITE_CODEWORDS_API_KEY=cwk-your-api-key-here
   ```
   You can copy `.env.example` to `.env` and replace with your actual API keys.

3. Run the app:
   ```bash
   npm run dev
   ```

## Get API Keys

### Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

### CodeWords API Key (For Email Sending)

This app uses CodeWords AI for intelligent email sending with HTML formatting.

1. **Get your API key**:
   - Visit [CodeWords API Keys](https://codewords.agemo.ai/account/keys)
   - Create a new API key (starts with `cwk-`)
   - Copy the key and add it to your `.env` file as `VITE_CODEWORDS_API_KEY`

2. **How it works**:
   - Gemini AI detects when you want to send an email
   - Uses function calling to extract recipient, subject, and body
   - Sends natural language request to CodeWords API
   - CodeWords AI processes and sends HTML-formatted email via Gmail
   - Returns confirmation with email details

3. **Features**:
   - ✅ Natural language email composition
   - ✅ Automatic HTML formatting
   - ✅ AI extraction of recipient, subject, and body
   - ✅ Gmail integration with professional styling
   - ✅ Real-time delivery confirmation

#### AI Modes

- **Hybrid Mode** (default): Automatically uses CodeWords for email requests, Gemini for others
- **Workflow Mode**: All requests go through CodeWords API
- **Gemini Mode**: Direct Gemini AI responses only (no email sending)

#### Example Email Commands

You can send emails using natural language:
- "Send email to john@example.com with subject Meeting Tomorrow and tell him we'll discuss the project at 3pm"
- "Email sarah@company.com about the weekly sales report. Sales are up 30% this quarter."
- "Send a message to client@business.com with subject Invoice Due and remind them payment is due Friday"
