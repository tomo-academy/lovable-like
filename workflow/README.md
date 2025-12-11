# n8n Email Workflow Integration Guide

## Overview

This project integrates with a simplified n8n workflow for email sending. The workflow uses AI to extract recipient, subject, and body from natural language requests and sends emails via Gmail.

## Current Workflow Configuration

### Webhook Details

**URL:** `https://kamesh14151.app.n8n.cloud/webhook/d8e46f97-de79-4b82-9fec-345a2679023f/email-sender`

**Method:** POST

**Request Format:**
```json
{
  "chatInput": "Send email to john@example.com with subject Meeting Tomorrow and body Let's discuss the project at 3pm"
}
```

**Alternative field names supported:** `chatInput`, `message`, or `text`

### Workflow Features

- ✅ Standard webhook trigger (no chat/conversation interface)
- ✅ No session tracking or conversation memory needed
- ✅ AI-powered extraction of recipient, subject, and body from natural language
- ✅ Immediate email processing without conversation context
- ✅ Simplified input validation (only requires chatInput field)

### Response Format

```json
{
  "output": "Email sent confirmation message",
  "timestamp": "2024-01-10T12:34:56.789Z",
  "status": "sent",
  "recipient": "john@example.com",
  "subject": "Meeting Tomorrow"
}
```

## How It Works

1. Your chat interface sends a natural language email request to the webhook
2. The n8n AI agent extracts recipient, subject, and body from the message
3. Email is sent via Gmail
4. Response returns with confirmation and email details

### Example Usage

**Request:**
```bash
curl -X POST https://kamesh14151.app.n8n.cloud/webhook/d8e46f97-de79-4b82-9fec-345a2679023f/email-sender \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Send email to john@example.com with subject Meeting Tomorrow and body Lets discuss the project at 3pm"
  }'
```

**Response:**
```json
{
  "output": "Email sent successfully!",
  "timestamp": "2024-01-10T12:34:56.789Z",
  "status": "sent",
  "recipient": "john@example.com",
  "subject": "Meeting Tomorrow"
}
```

## Integration with Your App

The app automatically detects email requests and routes them to the n8n workflow. Update your `.env` file:

```bash
VITE_N8N_WEBHOOK_URL=https://kamesh14151.app.n8n.cloud/webhook/d8e46f97-de79-4b82-9fec-345a2679023f/email-sender
```

### AI Modes

The app supports three AI modes in the settings:

**Hybrid Mode (Default)**
- Email requests → n8n workflow
- Other requests → Gemini AI
- Best for most use cases

**Workflow Mode**
- All requests → n8n workflow
- Use when you want full workflow control

**Gemini Mode**
- All requests → Gemini AI only
- No email sending capability
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
