# n8n CORS Configuration Fix

## The Problem

When deploying to Vercel, you may encounter this CORS error:
```
Access to fetch at 'https://your-instance.app.n8n.cloud/webhook/...' has been blocked by CORS policy
```

This happens because n8n needs special configuration to handle CORS preflight (OPTIONS) requests from browsers.

## Solutions

### Solution 1: Configure n8n Webhook (Recommended)

1. **In your n8n workflow**, click on the **Webhook** node
2. Go to **Settings** (gear icon)
3. Under **Webhook Settings**, find **Options**
4. Add this configuration:
   ```
   Allowed Origins: *
   ```
   Or for production, specify your domain:
   ```
   Allowed Origins: https://your-app.vercel.app
   ```

5. **Important**: Make sure the webhook accepts both POST and OPTIONS methods

### Solution 2: Update Webhook Node

If using n8n version 1.0+:

1. Open your workflow in n8n
2. Delete the existing Webhook node
3. Add a new **Webhook** node
4. Configure it with these settings:
   - **HTTP Method**: POST
   - **Path**: tomo-chat
   - **Response Mode**: Using 'Respond to Webhook' Node
   - **Options** → **Allowed Origins**: `*` or your specific domain

5. The new webhook node version handles CORS automatically

### Solution 3: Use n8n Self-Hosted with Custom CORS

If self-hosting n8n, add CORS configuration to your n8n environment:

```bash
# In your n8n environment variables
N8N_CORS_ALLOW_ORIGIN=*
N8N_CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS
N8N_CORS_ALLOW_HEADERS=Content-Type,Authorization
```

### Solution 4: Use a CORS Proxy (Temporary)

For testing only, you can use a CORS proxy:

```typescript
// In services/workflow.ts
const WEBHOOK_URL = 'https://cors-anywhere.herokuapp.com/' + 
                    import.meta.env.VITE_N8N_WEBHOOK_URL;
```

**Warning**: Never use CORS proxies in production!

### Solution 5: Create an API Route (Production-Ready)

Create a server-side endpoint that proxies requests to n8n:

1. **In Vercel**, create `api/workflow.ts`:

```typescript
// api/workflow.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Proxy to n8n
  try {
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await n8nResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Workflow request failed' });
  }
}
```

2. **Update your `.env`**:
```
VITE_N8N_WEBHOOK_URL=https://your-app.vercel.app/api/workflow
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/tomo-chat
```

3. **Update `services/workflow.ts`**:
```typescript
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '/api/workflow';
```

This approach:
- ✅ Avoids CORS issues completely
- ✅ Keeps your n8n URL private
- ✅ Production-ready
- ✅ Works with any n8n instance

## Testing the Fix

After implementing any solution:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** your app (Ctrl+Shift+R)
3. **Open browser console** (F12)
4. Try sending a message
5. Check for CORS errors

## Verification Checklist

- [ ] Webhook node has CORS enabled
- [ ] Workflow is **ACTIVE** (toggle in n8n)
- [ ] Webhook URL is correct in `.env`
- [ ] Browser cache is cleared
- [ ] No CORS errors in console
- [ ] Message sends successfully

## Still Having Issues?

### Check n8n Execution Logs

1. Go to n8n dashboard
2. Click on "Executions"
3. Look for failed executions
4. Check error messages

### Test Webhook Directly

Use curl to test if the webhook works:

```bash
curl -X POST https://your-instance.app.n8n.cloud/webhook/tomo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "test",
    "sessionId": "test123",
    "timestamp": "2025-12-11T10:00:00.000Z"
  }'
```

If this works but the browser doesn't, it's definitely a CORS issue.

### Debug Mode

Enable debug logging in `services/workflow.ts`:

```typescript
export const sendToWorkflow = async (message: string): Promise<WorkflowResponse> => {
  console.log('Sending to workflow:', { message, sessionId, url: WEBHOOK_URL });
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId, timestamp: new Date().toISOString() }),
    });
    
    console.log('Workflow response status:', response.status);
    console.log('Workflow response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Workflow data:', data);
    
    return data;
  } catch (error) {
    console.error('Workflow error details:', error);
    throw error;
  }
};
```

## Recommended Solution Order

1. **Try Solution 1** (Update webhook settings) - Fastest
2. **Try Solution 2** (New webhook node) - If using old n8n version
3. **Implement Solution 5** (API proxy) - Best for production

Solution 5 (API proxy) is the most reliable for production deployments.
