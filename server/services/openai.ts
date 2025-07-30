import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export class AITutorService {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  private model = "gpt-4o";

  async generateResponse(messages: { role: "user" | "assistant" | "system"; content: string; }[], context?: {
    currentSubject?: string;
    currentTopic?: string;
    recentTest?: string;
  }): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async analyzeTestPerformance(testData: {
    score: number;
    totalQuestions: number;
    subjectWise: { subjectId: string; correct: number; total: number; }[];
    topicWise: { topicId: string; correct: number; total: number; }[];
  }): Promise<{
    overallAnalysis: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `Analyze this student's test performance and provide detailed feedback:
      
      Overall Score: ${testData.score}/${testData.totalQuestions} (${Math.round((testData.score/testData.totalQuestions)*100)}%)
      
      Subject-wise Performance:
      ${testData.subjectWise.map(s => `Subject ${s.subjectId}: ${s.correct}/${s.total} (${Math.round((s.correct/s.total)*100)}%)`).join('\n')}
      
      Topic-wise Performance:
      ${testData.topicWise.map(t => `Topic ${t.topicId}: ${t.correct}/${t.total} (${Math.round((t.correct/t.total)*100)}%)`).join('\n')}
      
      Provide analysis in JSON format with:
      - overallAnalysis: String summary of performance
      - strengths: Array of subject/topic strengths
      - weaknesses: Array of areas needing improvement
      - recommendations: Array of specific study recommendations`;

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error("Test analysis error:", error);
      throw new Error("Failed to analyze test performance");
    }
  }

  async generateStudyPlan(userProfile: {
    age: number;
    educationStream: string;
    targetExam?: string;
    weakSubjects: string[];
    timeAvailable: number; // hours per day
  }): Promise<{
    dailyPlan: { subject: string; topics: string[]; duration: number; }[];
    weeklyGoals: string[];
    longTermObjectives: string[];
  }> {
    try {
      const prompt = `Create a personalized study plan for a student with these details:
      
      Age: ${userProfile.age}
      Education Stream: ${userProfile.educationStream}
      Target Exam: ${userProfile.targetExam || 'General'}
      Weak Subjects: ${userProfile.weakSubjects.join(', ')}
      Daily Study Time Available: ${userProfile.timeAvailable} hours
      
      Generate a comprehensive study plan in JSON format with:
      - dailyPlan: Array of daily study sessions with subject, topics, and duration
      - weeklyGoals: Array of weekly learning objectives
      - longTermObjectives: Array of long-term academic goals`;

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error("Study plan generation error:", error);
      throw new Error("Failed to generate study plan");
    }
  }

  async analyzeImage(base64Image: string, context?: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: context || "Analyze this educational image and explain the concepts shown. If it's a math problem or question, provide a detailed solution."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "I couldn't analyze this image.";
    } catch (error) {
      console.error("Image analysis error:", error);
      throw new Error("Failed to analyze image");
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Note: In a real implementation, you'd save the buffer to a temporary file
      // For now, we'll return a placeholder
      return "Audio transcription would be implemented here with actual file handling";
    } catch (error) {
      console.error("Audio transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  private buildSystemPrompt(context?: {
    currentSubject?: string;
    currentTopic?: string;
    recentTest?: string;
  }): string {
    let prompt = `You are an AI tutor for an educational platform supporting students aged 8-28 across all educational streams including CBSE, ICSE, State Boards, NEET, JEE, and other competitive exams.

Your role is to:
1. Provide clear, age-appropriate explanations
2. Offer step-by-step solutions to problems
3. Suggest study strategies and learning paths
4. Encourage and motivate students
5. Adapt your teaching style to the student's level

Always be encouraging, patient, and focus on building understanding rather than just providing answers.`;

    if (context?.currentSubject) {
      prompt += ` The student is currently studying ${context.currentSubject}.`;
    }
    
    if (context?.currentTopic) {
      prompt += ` They are working on the topic: ${context.currentTopic}.`;
    }
    
    if (context?.recentTest) {
      prompt += ` They recently took a test: ${context.recentTest}.`;
    }

    return prompt;
  }
}

export const aiTutorService = new AITutorService();
