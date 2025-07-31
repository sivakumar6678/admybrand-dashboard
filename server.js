import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Generate insights endpoint
app.post('/api/generate-insights', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Dashboard data is required' });
    }

    // Initialize Gemini
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a detailed prompt for business analysis
    const prompt = `
You are a senior business analyst with expertise in digital marketing and data interpretation. 
Based on the following JSON data from a marketing dashboard, provide a comprehensive, professional analysis with actionable insights.

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide your analysis in HTML format with the following structure:
1. **Executive Summary** - Key highlights and overall performance assessment
2. **Revenue Analysis** - Deep dive into revenue trends and opportunities
3. **User Engagement Insights** - User behavior patterns and conversion analysis
4. **Channel Performance** - Marketing channel effectiveness and recommendations
5. **Strategic Recommendations** - Specific, actionable next steps with priority levels

Requirements:
- Use professional business language
- Include specific numbers and percentages from the data
- Provide actionable recommendations with clear priorities
- Use appropriate emojis for visual appeal
- Format as clean HTML with proper styling classes
- Focus on insights that can drive business growth
- Highlight both strengths and areas for improvement

Format the response as clean HTML that can be directly inserted into a React component.
Use classes like 'text-green-600', 'font-semibold', 'mb-4', etc. for styling.
Wrap sections in divs with appropriate background colors and padding.
`;

    // Generate insights using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    // Return the generated insights
    return res.status(200).json({
      success: true,
      insights: insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    
    // Return appropriate error response
    if (error.message?.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        error: 'AI service configuration error',
        details: 'API key not configured'
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        error: 'AI service rate limit exceeded',
        details: 'Please try again later'
      });
    }

    return res.status(500).json({
      error: 'Failed to generate insights',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});