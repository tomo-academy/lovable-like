// n8n Workflow Service for Email Processing
// Connect directly to n8n webhook (CORS must be configured in n8n)
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://kamesh14151.app.n8n.cloud/webhook/email-sender';

export interface WorkflowResponse {
  output: string;
  timestamp?: string;
  status?: string;
  recipient?: string;
  subject?: string;
}

/**
 * Send message to n8n workflow for processing
 * @param message - User message to send
 * @returns Promise<WorkflowResponse>
 */
export const sendToWorkflow = async (message: string): Promise<WorkflowResponse> => {
  try {
    console.log('Sending to workflow:', WEBHOOK_URL);
    console.log('Payload:', { chatInput: message });
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMsg = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.errorMessage || errorData.error || errorMsg;
      } catch (e) {
        // If we can't parse error response, use status message
      }
      throw new Error(errorMsg);
    }

    // Get raw response text first
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from workflow');
    }
    
    // Parse JSON
    const data = JSON.parse(responseText);
    console.log('Parsed data:', data);
    
    // Return the workflow response
    return {
      output: data.output || data.message || 'Email sent successfully',
      timestamp: data.timestamp,
      status: data.status,
      recipient: data.recipient,
      subject: data.subject,
    };
  } catch (error) {
    console.error('Workflow Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Status: 500')) {
        throw new Error('Workflow encountered an internal error. Check n8n execution logs.');
      } else if (error.message.includes('Status: 404')) {
        throw new Error('Workflow not found. Verify n8n workflow is active.');
      } else if (error.message.includes('Status: 403')) {
        throw new Error('Access denied. Check workflow permissions and CORS settings.');
      } else if (error.name === 'TypeError') {
        throw new Error('Cannot reach workflow server. Check network connection.');
      }
    }
    
    throw error;
  }
};

/**
 * Send email via n8n workflow
 * @param to - Recipient email
 * @param subject - Email subject
 * @param body - Email body
 * @returns Promise<boolean>
 */
export const sendEmailViaWorkflow = async (
  to: string,
  subject: string,
  body: string
): Promise<boolean> => {
  try {
    const response = await sendToWorkflow(
      `Send email to ${to} with subject "${subject}" and body ${body}`
    );
    return response.status === 'sent';
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
