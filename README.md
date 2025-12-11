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
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/tomo-chat
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

### n8n Workflow Integration (Optional)

This app supports n8n workflow integration for email sending and custom automations.

1. **Set up n8n** (if you don't have it):
   - Sign up at [n8n.io](https://n8n.io)
   - Or self-host using [n8n documentation](https://docs.n8n.io)

2. **Import the workflow template**:
   - Copy the content from `workflow/n8n-workflow-template.json`
   - In n8n, click "Import from File"
   - Paste the JSON content
   - Customize the AI Logic node with your email service (Gmail, SendGrid, etc.)

3. **Configure CORS** in your workflow:
   - Add "Respond to Webhook" node
   - Set these headers:
     ```
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: POST, OPTIONS
     Access-Control-Allow-Headers: Content-Type
     Content-Type: application/json
     ```

4. **Activate the workflow** and copy your webhook URL to `.env`

#### Workflow Features

- **Hybrid Mode** (default): Automatically uses workflow for email requests, Gemini for others
- **Workflow Mode**: All requests go through n8n workflow
- **Gemini Mode**: Direct Gemini AI responses only

#### Example Email Commands

Once configured, you can send emails by saying:
- "Send email to john@example.com about the meeting tomorrow"
- "Email notification to team@company.com with the project update"
- "Send mail to client@business.com regarding the proposal"
