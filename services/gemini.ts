import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendToWorkflow } from './workflow';

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);

export type AIMode = 'gemini' | 'workflow' | 'hybrid';

// Define email sending function for Gemini
const sendEmailFunction = {
  name: "send_email",
  description: "Send an email to a recipient with a subject and body. Use this when the user wants to send an email.",
  parameters: {
    type: "OBJECT" as const,
    properties: {
      recipient: {
        type: "STRING" as const,
        description: "The email address of the recipient",
      },
      subject: {
        type: "STRING" as const,
        description: "The subject line of the email",
      },
      body: {
        type: "STRING" as const,
        description: "The body content of the email",
      },
    },
    required: ["recipient", "subject", "body"],
  },
};

// Check if message contains email-related keywords
const isEmailRequest = (message: string): boolean => {
  const emailKeywords = [
    'send email', 'email to', 'mail to', 'send mail', 
    'notify', 'email notification', 'send an email',
    'compose email', 'write email', 'draft email',
    '@', // Check for email addresses
  ];
  const lowerMessage = message.toLowerCase();
  
  // Check for keywords
  const hasKeyword = emailKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const hasEmailAddress = emailPattern.test(message);
  
  return hasKeyword || hasEmailAddress;
};

export const sendMessageToGemini = async (prompt: string, mode: AIMode = 'hybrid'): Promise<string> => {
  try {
    // If mode is workflow only, always use workflow
    if (mode === 'workflow') {
      try {
        const workflowResponse = await sendToWorkflow(prompt);
        
        if (workflowResponse.success && workflowResponse.recipient_email) {
          return `✅ ${workflowResponse.message}\n\n📧 To: ${workflowResponse.recipient_email}\n📋 Subject: ${workflowResponse.subject}\n\nYour email has been delivered with beautiful HTML formatting.`;
        }
        
        return workflowResponse.message;
      } catch (workflowError) {
        console.error('Workflow error:', workflowError);
        return `${workflowError instanceof Error ? workflowError.message : '⚠️ Unknown error occurred'}`;
      }
    }
    
    // Use Gemini AI with function calling (for hybrid and gemini modes)
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      tools: mode === 'hybrid' ? [{ functionDeclarations: [sendEmailFunction] }] : undefined,
      systemInstruction: mode === 'hybrid' 
        ? "You are Lovable, a helpful AI coding assistant. You are concise, friendly, and expert in React and web development. You have the ability to send emails using the send_email function. When users ask about sending emails or mention email addresses, use the send_email function to help them. For other requests, provide helpful coding assistance."
        : "You are Lovable, a helpful AI coding assistant. You are concise, friendly, and expert in React and web development.",
    });
    
    const chat = model.startChat({
      history: [],
    });
    
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    // Check if Gemini wants to call the email function
    const functionCall = response.functionCalls()?.[0];
    
    if (functionCall && functionCall.name === 'send_email' && mode === 'hybrid') {
      try {
        const { recipient, subject, body } = functionCall.args as { recipient: string; subject: string; body: string };
        
        // Call CodeWords API with natural language
        const emailPrompt = `Send email to ${recipient} with subject ${subject}. ${body}`;
        const workflowResponse = await sendToWorkflow(emailPrompt);
        
        if (workflowResponse.success) {
          return `✅ Email sent successfully!\n\n📧 To: ${workflowResponse.recipient_email}\n📋 Subject: ${workflowResponse.subject}\n\nYour email has been delivered with beautiful HTML formatting.`;
        }
        
        return workflowResponse.message;
      } catch (error) {
        console.error('Email sending error:', error);
        return `${error instanceof Error ? error.message : '⚠️ Failed to send email'}`;
      }
    }
    
    // Return regular text response
    return response.text() || "I couldn't generate a response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
