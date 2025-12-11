import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendToWorkflow } from './workflow';

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);

export type AIMode = 'gemini' | 'workflow' | 'hybrid';

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
    // If mode is workflow or it's an email request, use workflow
    if (mode === 'workflow' || (mode === 'hybrid' && isEmailRequest(prompt))) {
      try {
        const workflowResponse = await sendToWorkflow(prompt);
        
        if (workflowResponse.status === 'sent' && workflowResponse.recipient) {
          return `${workflowResponse.output}\n\n✅ Email sent successfully to ${workflowResponse.recipient}${workflowResponse.subject ? `\nSubject: ${workflowResponse.subject}` : ''}`;
        }
        
        return workflowResponse.output;
      } catch (workflowError) {
        console.error('Workflow error, falling back to Gemini:', workflowError);
        if (mode === 'workflow') {
          return `⚠️ Workflow error: ${workflowError instanceof Error ? workflowError.message : 'Unknown error'}`;
        }
        // Fall through to Gemini in hybrid mode
      }
    }
    
    // Use Gemini AI
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: "You are Lovable, a helpful AI coding assistant. You are concise, friendly, and expert in React and web development. Answer requests as if you are about to build them. For email sending requests, guide users to use natural language like 'Send email to john@example.com with subject X and body Y' - the system will automatically handle it through workflow integration.",
    });
    
    return response.response.text() || "I couldn't generate a response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
