import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiTutorService } from "./services/openai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  // User login
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get user dashboard data
  app.get("/api/users/:id/dashboard", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [stats, progress, streak, recommendedVideos, practiceTests] = await Promise.all([
        storage.getUserStats(id),
        storage.getUserProgress(id),
        storage.getStudyStreak(id),
        storage.getRecommendedVideos(id),
        storage.getPracticeTests()
      ]);

      res.json({
        user: { ...user, password: undefined },
        stats,
        progress,
        streak,
        recommendedVideos,
        availableTests: practiceTests.slice(0, 3)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  });

  // Get subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const { stream } = req.query;
      const subjects = stream 
        ? await storage.getSubjectsByStream(stream as string)
        : await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to load subjects" });
    }
  });

  // Get video lectures
  app.get("/api/video-lectures", async (req, res) => {
    try {
      const { subjectId } = req.query;
      const videos = subjectId 
        ? await storage.getVideoLecturesBySubject(subjectId as string)
        : await storage.getVideoLectures();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to load video lectures" });
    }
  });

  // Get practice tests
  app.get("/api/practice-tests", async (req, res) => {
    try {
      const { examType } = req.query;
      const tests = examType 
        ? await storage.getPracticeTestsByExamType(examType as string)
        : await storage.getPracticeTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to load practice tests" });
    }
  });

  // Get test details
  app.get("/api/practice-tests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [test, questions] = await Promise.all([
        storage.getPracticeTest(id),
        storage.getQuestionsByTest(id)
      ]);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json({ test, questions });
    } catch (error) {
      res.status(500).json({ message: "Failed to load test details" });
    }
  });

  // Submit test attempt
  app.post("/api/test-attempts", async (req, res) => {
    try {
      const attemptData = z.object({
        userId: z.string(),
        testId: z.string(),
        responses: z.array(z.object({
          questionId: z.string(),
          selectedAnswer: z.number(),
          timeSpent: z.number()
        })),
        timeSpent: z.number()
      }).parse(req.body);

      // Calculate score and analysis
      const questions = await storage.getQuestionsByTest(attemptData.testId);
      let score = 0;
      const subjectWise: { [key: string]: { correct: number; total: number } } = {};
      const topicWise: { [key: string]: { correct: number; total: number } } = {};

      attemptData.responses.forEach(response => {
        const question = questions.find(q => q.id === response.questionId);
        if (!question) return;

        const isCorrect = question.correctAnswer === response.selectedAnswer;
        if (isCorrect) score++;

        // Track subject-wise performance
        const subjectId = question.subjectId || 'unknown';
        if (!subjectWise[subjectId]) {
          subjectWise[subjectId] = { correct: 0, total: 0 };
        }
        subjectWise[subjectId].total++;
        if (isCorrect) subjectWise[subjectId].correct++;

        // Track topic-wise performance
        const topicId = question.topicId || 'unknown';
        if (!topicWise[topicId]) {
          topicWise[topicId] = { correct: 0, total: 0 };
        }
        topicWise[topicId].total++;
        if (isCorrect) topicWise[topicId].correct++;
      });

      const analysis = {
        subjectWise: Object.entries(subjectWise).map(([subjectId, data]) => ({
          subjectId,
          ...data
        })),
        topicWise: Object.entries(topicWise).map(([topicId, data]) => ({
          topicId,
          ...data
        })),
        difficultyWise: [] // TODO: Implement difficulty-wise analysis
      };

      const attempt = await storage.createTestAttempt({
        userId: attemptData.userId,
        testId: attemptData.testId,
        score,
        totalQuestions: questions.length,
        timeSpent: attemptData.timeSpent,
        responses: attemptData.responses,
        analysis
      });

      // Generate AI analysis
      try {
        const aiAnalysis = await aiTutorService.analyzeTestPerformance({
          score,
          totalQuestions: questions.length,
          subjectWise: analysis.subjectWise,
          topicWise: analysis.topicWise
        });
        
        res.json({ attempt, aiAnalysis });
      } catch (aiError) {
        console.error("AI analysis failed:", aiError);
        res.json({ attempt, aiAnalysis: null });
      }
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to submit test" });
    }
  });

  // Get test attempts for user
  app.get("/api/users/:id/test-attempts", async (req, res) => {
    try {
      const { id } = req.params;
      const attempts = await storage.getTestAttemptsByUser(id);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to load test attempts" });
    }
  });

  // AI Chat endpoints
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { userId, message, context } = req.body;
      
      // Get or create chat session
      let sessions = await storage.getUserChatSessions(userId);
      let currentSession = sessions[0]; // Use most recent session
      
      if (!currentSession) {
        currentSession = await storage.createChatSession({
          userId,
          messages: [],
          context: context || {}
        });
      }

      // Add user message
      const updatedMessages = [
        ...(currentSession.messages || []),
        {
          role: "user" as const,
          content: message,
          timestamp: new Date(),
          type: "text" as const
        }
      ];

      // Get AI response
      const aiResponse = await aiTutorService.generateResponse(
        updatedMessages.map(msg => ({ role: msg.role, content: msg.content })),
        currentSession.context || undefined
      );

      // Add AI response
      updatedMessages.push({
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
        type: "text" as const
      });

      // Update session
      const updatedSession = await storage.updateChatSession(currentSession.id, updatedMessages);
      
      res.json({ session: updatedSession, response: aiResponse });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Get user chat sessions
  app.get("/api/users/:id/chat-sessions", async (req, res) => {
    try {
      const { id } = req.params;
      const sessions = await storage.getUserChatSessions(id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to load chat sessions" });
    }
  });

  // Image analysis endpoint
  app.post("/api/ai-chat/analyze-image", async (req, res) => {
    try {
      const { image, context } = req.body;
      
      if (!image) {
        return res.status(400).json({ message: "No image provided" });
      }

      const analysis = await aiTutorService.analyzeImage(image, context);
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Get content library
  app.get("/api/content-library", async (req, res) => {
    try {
      const { subjectId, topicId } = req.query;
      
      let content;
      if (topicId) {
        content = await storage.getContentByTopic(topicId as string);
      } else if (subjectId) {
        content = await storage.getContentBySubject(subjectId as string);
      } else {
        content = await storage.getContentLibrary();
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to load content library" });
    }
  });

  // Generate study plan
  app.post("/api/ai/study-plan", async (req, res) => {
    try {
      const userProfile = z.object({
        age: z.number(),
        educationStream: z.string(),
        targetExam: z.string().optional(),
        weakSubjects: z.array(z.string()),
        timeAvailable: z.number()
      }).parse(req.body);

      const studyPlan = await aiTutorService.generateStudyPlan(userProfile);
      res.json(studyPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate study plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
