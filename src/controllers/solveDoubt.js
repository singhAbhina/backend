const { GoogleGenerativeAI } = require("@google/generative-ai");

const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;
        
        // Check if required environment variable is set
        if (!process.env.GEMINI_KEY) {
            console.error('❌ GEMINI_KEY environment variable is not set');
            return res.status(500).json({
                error: "AI service configuration error. Please contact support."
            });
        }

        // Check if required fields are provided
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: "Messages array is required"
            });
        }

        console.log('🤖 AI Chat Request:', {
            title: title || 'No title',
            messageCount: messages.length,
            hasDescription: !!description,
            hasTestCases: !!testCases,
            hasStartCode: !!startCode
        });

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the system instruction
        const systemInstruction = `You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title || 'Not specified'}
[PROBLEM_DESCRIPTION]: ${description || 'Not provided'}
[EXAMPLES]: ${testCases || 'Not provided'}
[START_CODE]: ${startCode || 'Not provided'}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Respond in the language the user is comfortable with

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics
- If asked about unrelated topics, politely redirect to the current problem

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices`;

        // Prepare the chat history
        const chatHistory = [
            {
                role: "user",
                parts: [{ text: systemInstruction }]
            },
            ...messages.map(msg => ({
                role: msg.role || "user",
                parts: [{ text: msg.content || msg.text || msg.message || msg }]
            }))
        ];

        console.log('📤 Sending request to Gemini API...');

        // Generate content
        const result = await model.generateContent(chatHistory);
        const response = await result.response;
        const aiResponse = response.text();

        console.log('✅ AI Response received, length:', aiResponse.length);

        // Send the response
        res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI Chat Error:', error);
        
        // Handle specific API errors
        if (error.message?.includes('API_KEY')) {
            return res.status(401).json({
                error: "Invalid API key. Please check configuration."
            });
        }
        
        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
            return res.status(429).json({
                error: "API rate limit exceeded. Please try again later."
            });
        }

        // Generic error response
        res.status(500).json({
            error: "AI service temporarily unavailable. Please try again later.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = solveDoubt;
