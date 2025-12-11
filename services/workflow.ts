// CodeWords Email Service Integration
const CODEWORDS_API_URL = 'https://runtime.codewords.ai/run/voice_text_email_sender_1616b679';
const CODEWORDS_API_KEY = import.meta.env.VITE_CODEWORDS_API_KEY || '';

export interface WorkflowResponse {
  success: boolean;
  recipient_email: string;
  subject: string;
  message: string;
}

/**
 * Send email request to CodeWords AI service
 * @param message - Natural language email request
 * @returns Promise<WorkflowResponse>
 */
export const sendToWorkflow = async (message: string): Promise<WorkflowResponse> => {
  try {
    console.log('Sending to CodeWords API:', CODEWORDS_API_URL);
    console.log('Message:', message);
    
    const response = await fetch(CODEWORDS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CODEWORDS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_message: message
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.detail || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMsg);
    }

    // Parse response
    const data = await response.json();
    console.log('CodeWords response:', data);
    
    // Return the formatted response
    return {
      success: data.success || true,
      recipient_email: data.recipient_email || '',
      subject: data.subject || '',
      message: data.message || 'Email sent successfully',
    };
  } catch (error) {
    console.error('CodeWords API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('🔒 Authentication error. Please check your CodeWords API key configuration.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('⏱️ Rate limit exceeded. Please try again in a moment.');
      } else if (error.message.includes('Status: 404')) {
        throw new Error('API endpoint not found. Please verify the CodeWords service URL.');
      } else if (error.name === 'TypeError') {
        throw new Error('Cannot reach CodeWords API. Check network connection.');
      }
    }
    
    throw error;
  }
};

/**
 * Send email via CodeWords API
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
    const message = `Send email to ${to} with subject "${subject}". ${body}`;
    const response = await sendToWorkflow(message);
    return response.success;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
