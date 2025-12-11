# n8n Workflow Integration Guide

## Overview

This project integrates with n8n workflows to provide email sending capabilities and custom automation features alongside Gemini AI responses.

## Setup Instructions

### 1. Configure n8n Workflow

#### Import the Template

1. Open n8n
2. Click on "Workflows" → "Import from File"
3. Upload `n8n-workflow-template.json` from this directory
4. The workflow will be imported with three nodes:
   - **Webhook Trigger**: Receives messages from the app
   - **AI Logic**: Processes messages and handles email sending
   - **Respond to Webhook**: Returns responses with CORS headers

#### Customize the AI Logic Node

Replace the demo code with your actual email service integration:

```javascript
// Extract data from webhook
const message = $input.first().json.body.message;
const sessionId = $input.first().json.body.sessionId;

// Check if it's an email request
const isEmailRequest = message.toLowerCase().includes('send email') || 
                       message.toLowerCase().includes('email to');

if (isEmailRequest) {
  // Extract email details (you can improve this parsing)
  const emailRegex = /email to ([^\s]+)/i;
  const match = message.match(emailRegex);
  
  if (match) {
    const recipient = match[1];
    
    // TODO: Add your email sending logic here
    // Example with Gmail node or SendGrid:
    // - Connect to your email service
    // - Parse subject and body from message
    // - Send email
    
    return {
      response: `Email sent successfully to ${recipient}`,
      emailSent: true,
      emailDetails: {
        to: recipient,
        subject: "Message from Lovable App",
        status: "sent"
      }
    };
  }
}

// Default AI response
return {
  response: "I understand your request. How else can I help you?",
  emailSent: false
};
```

### 2. Configure Email Service

You can integrate various email services in n8n:

#### Option A: Gmail

1. Add a **Gmail** node after AI Logic
2. Connect your Gmail account
3. Configure recipient, subject, and body from the message

#### Option B: SendGrid

1. Add an **HTTP Request** node
2. Configure SendGrid API endpoint
3. Add your API key in headers
4. Format the email payload

#### Option C: Custom SMTP

1. Add an **Email Send** node
2. Configure SMTP settings
3. Map message data to email fields

### 3. Enable CORS

The template already includes CORS headers in the "Respond to Webhook" node:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
}
```

### 4. Activate Workflow

1. Click the "Active" toggle in n8n
2. Copy the webhook URL (e.g., `https://your-instance.app.n8n.cloud/webhook/tomo-chat`)
3. Add it to your `.env` file:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/tomo-chat
   ```

## Usage Modes

The app supports three AI modes:

### Hybrid Mode (Default)
- Email requests → n8n workflow
- Other requests → Gemini AI
- Best for most use cases

### Workflow Mode
- All requests → n8n workflow
- Use when you want full control
- Requires workflow to handle all message types

### Gemini Mode
- All requests → Gemini AI
- Email sending not available
- Fastest response times

## Testing

### Test Email Sending

Try these commands:
```
Send email to test@example.com about the project update
Email john@company.com with meeting notes
Send mail to team@startup.com regarding the launch
```

### Test Workflow Connection

The app automatically tests the workflow connection on load. Check browser console for:
- ✅ Workflow connected successfully
- ❌ Workflow connection error (with details)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS headers in "Respond to Webhook" node
   - Check that headers include all required values
   - Ensure no conflicting CORS settings

2. **Workflow Not Found (404)**
   - Verify workflow is activated (toggle in n8n)
   - Check webhook URL in `.env` matches n8n
   - Ensure workflow path is correct

3. **Email Not Sending**
   - Check n8n execution logs
   - Verify email service credentials
   - Test email service independently

4. **Timeout Errors**
   - Email sending might take time
   - Consider async processing
   - Add loading indicators in UI

### Debug Mode

To enable detailed logging, add to your `.env`:
```
VITE_DEBUG_WORKFLOW=true
```

## Advanced Configuration

### Session Management

The workflow receives a `sessionId` with each request for tracking conversations:

```javascript
// Access session data
const sessionId = $input.first().json.body.sessionId;

// Store session data in n8n or external database
// Retrieve context for follow-up messages
```

### Custom Automations

Beyond email, you can add:
- Database operations
- API integrations
- File generation
- Scheduled tasks
- Notifications
- Data processing

### Error Handling

The workflow service includes automatic error handling:
- Network errors → Fallback to Gemini (hybrid mode)
- 404 errors → Clear error message
- 403 errors → Permission guidance
- 500 errors → Workflow debugging hint

## Security Best Practices

1. **API Keys**: Never commit `.env` file
2. **Webhook URLs**: Use environment variables
3. **Email Validation**: Validate recipients in workflow
4. **Rate Limiting**: Implement in n8n if needed
5. **CORS**: Restrict origins in production

## Examples

### Complete Email Workflow

```javascript
// Enhanced email processing
const message = $input.first().json.body.message;

// Advanced email parsing
const emailPattern = /send (?:email|mail) to ([^\s]+)(?:\s+(?:with |about |regarding )?(.+))?/i;
const match = message.match(emailPattern);

if (match) {
  const to = match[1];
  const content = match[2] || "Message from Lovable App";
  
  // Split into subject and body
  const [subject, ...bodyParts] = content.split(/[:.]/);
  const body = bodyParts.join(' ').trim() || content;
  
  // Send via your email service
  // ... email sending code ...
  
  return {
    response: `✉️ Email sent to ${to}\nSubject: ${subject}`,
    emailSent: true,
    emailDetails: { to, subject, status: 'sent' }
  };
}

// AI response for non-email requests
return {
  response: "How can I help you today?",
  emailSent: false
};
```

## Support

For issues or questions:
- Check n8n execution logs
- Review browser console errors
- Test workflow independently
- Verify environment variables

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [n8n Workflow Examples](https://n8n.io/workflows)
- [Email Service Setup](https://docs.n8n.io/integrations/builtin/app-nodes/)
