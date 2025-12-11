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

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get n8n webhook URL from environment
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl) {
    res.status(500).json({ 
      error: 'N8N_WEBHOOK_URL not configured',
      message: 'Please add N8N_WEBHOOK_URL to your Vercel environment variables'
    });
    return;
  }

  try {
    // Forward request to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n returned status ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Workflow proxy error:', error);
    res.status(500).json({ 
      error: 'Workflow request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check that your n8n workflow is active and the URL is correct'
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
