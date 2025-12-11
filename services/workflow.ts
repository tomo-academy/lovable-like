// n8n Workflow Service for Email and AI Processing
// Use API proxy to avoid CORS issues
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '/api/workflow';

// Generate session ID for workflow tracking
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Get or create session ID
let sessionId = localStorage.getItem('workflowSessionId');
if (!sessionId) {
  sessionId = generateSessionId();
  localStorage.setItem('workflowSessionId', sessionId);
}

export interface WorkflowResponse {
  response: string;
  emailSent?: boolean;
  emailDetails?: {
    to: string;
    subject: string;
    status: string;
  };
}

/**
 * Send message to n8n workflow for processing
 * @param message - User message to send
 * @returns Promise<WorkflowResponse>
 */
export const sendToWorkflow = async (message: string): Promise<WorkflowResponse> => {
  try {
    console.log('Sending to workflow:', WEBHOOK_URL);
    console.log('Payload:', { chatInput: message, sessionId, action: 'sendMessage' });
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId,
        action: 'sendMessage'
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
    
    // Handle different response formats
    const responseMessage = data.output || data.message || data.response || data.aiResponse || 'Workflow completed successfully';
    
    return {
      response: responseMessage,
      emailSent: data.emailSent,
      emailDetails: data.emailDetails,
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
      `Send email to ${to} with subject "${subject}": ${body}`
    );
    return response.emailSent || false;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/**
 * Reset workflow session
 */
export const resetWorkflowSession = (): void => {
  sessionId = generateSessionId();
  localStorage.setItem('workflowSessionId', sessionId);
};
