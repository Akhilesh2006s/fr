import { 
  type User, 
  type InsertUser, 
  type Subject, 
  type Topic, 
  type VideoLecture, 
  type InsertVideoLecture,
  type PracticeTest, 
  type InsertPracticeTest,
  type Question,
  type TestAttempt,
  type InsertTestAttempt,
  type UserProgress,
  type AiChatSession,
  type InsertAiChatSession,
  type StudyStreak,
  type ContentLibrary
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Subjects and Topics
  getSubjects(): Promise<Subject[]>;
  getSubjectsByStream(stream: string): Promise<Subject[]>;
  getTopicsBySubject(subjectId: string): Promise<Topic[]>;

  // Video Lectures
  getVideoLectures(): Promise<VideoLecture[]>;
  getVideoLecturesBySubject(subjectId: string): Promise<VideoLecture[]>;
  getRecommendedVideos(userId: string): Promise<VideoLecture[]>;
  createVideoLecture(video: InsertVideoLecture): Promise<VideoLecture>;

  // Practice Tests
  getPracticeTests(): Promise<PracticeTest[]>;
  getPracticeTestsByExamType(examType: string): Promise<PracticeTest[]>;
  getPracticeTest(id: string): Promise<PracticeTest | undefined>;
  getQuestionsByTest(testId: string): Promise<Question[]>;
  createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest>;

  // Test Attempts
  createTestAttempt(attempt: InsertTestAttempt): Promise<TestAttempt>;
  getTestAttemptsByUser(userId: string): Promise<TestAttempt[]>;
  getTestAttempt(id: string): Promise<TestAttempt | undefined>;

  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(userId: string, subjectId: string, topicId: string, progress: number): Promise<UserProgress>;

  // AI Chat
  createChatSession(session: InsertAiChatSession): Promise<AiChatSession>;
  getChatSession(id: string): Promise<AiChatSession | undefined>;
  updateChatSession(id: string, messages: AiChatSession['messages']): Promise<AiChatSession>;
  getUserChatSessions(userId: string): Promise<AiChatSession[]>;

  // Study Streaks
  getStudyStreak(userId: string): Promise<StudyStreak | undefined>;
  updateStudyStreak(userId: string, currentStreak: number, longestStreak: number): Promise<StudyStreak>;

  // Content Library
  getContentLibrary(): Promise<ContentLibrary[]>;
  getContentBySubject(subjectId: string): Promise<ContentLibrary[]>;
  getContentByTopic(topicId: string): Promise<ContentLibrary[]>;

  // Analytics
  getUserStats(userId: string): Promise<{
    streak: number;
    questionsAnswered: number;
    accuracyRate: number;
    rank: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private subjects: Map<string, Subject> = new Map();
  private topics: Map<string, Topic> = new Map();
  private videoLectures: Map<string, VideoLecture> = new Map();
  private practiceTests: Map<string, PracticeTest> = new Map();
  private questions: Map<string, Question> = new Map();
  private testAttempts: Map<string, TestAttempt> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private aiChatSessions: Map<string, AiChatSession> = new Map();
  private studyStreaks: Map<string, StudyStreak> = new Map();
  private contentLibrary: Map<string, ContentLibrary> = new Map();

  constructor() {
    this.initializeData();
    this.createSampleUsers();
  }

  private initializeData() {
    // Initialize subjects - Include Class 10 CBSE and JEE preparation
    const subjects: Subject[] = [
      { id: "1", name: "Physics", stream: "CBSE", grade: "10" },
      { id: "2", name: "Chemistry", stream: "CBSE", grade: "10" },
      { id: "3", name: "Mathematics", stream: "CBSE", grade: "10" },
      { id: "4", name: "Science", stream: "CBSE", grade: "10" },
      { id: "5", name: "English", stream: "CBSE", grade: "10" },
      { id: "6", name: "Physics", stream: "JEE", grade: "11-12" },
      { id: "7", name: "Chemistry", stream: "JEE", grade: "11-12" },
      { id: "8", name: "Mathematics", stream: "JEE", grade: "11-12" },
    ];
    subjects.forEach(subject => this.subjects.set(subject.id, subject));

    // Initialize topics - Class 10 CBSE focused topics
    const topics: Topic[] = [
      { id: "1", subjectId: "1", name: "Light & Reflection", description: "Mirrors, Refraction, Lenses", difficulty: "Easy" },
      { id: "2", subjectId: "1", name: "Electricity", description: "Current, Resistance, Ohm's Law", difficulty: "Medium" },
      { id: "3", subjectId: "2", name: "Acids & Bases", description: "pH, Neutralization, Salts", difficulty: "Easy" },
      { id: "4", subjectId: "2", name: "Metals & Non-Metals", description: "Properties, Reactions, Extraction", difficulty: "Medium" },
      { id: "5", subjectId: "3", name: "Quadratic Equations", description: "Solving, Factorization, Roots", difficulty: "Medium" },
      { id: "6", subjectId: "3", name: "Coordinate Geometry", description: "Distance Formula, Section Formula", difficulty: "Easy" },
      { id: "7", subjectId: "6", name: "Mechanics", description: "JEE Advanced Motion Concepts", difficulty: "Hard" },
      { id: "8", subjectId: "6", name: "Rotational Motion", description: "Angular motion, Moment of Inertia", difficulty: "Hard" },
    ];
    topics.forEach(topic => this.topics.set(topic.id, topic));

    // Initialize video lectures - Class 10 CBSE content appropriate for Harish
    const videos: VideoLecture[] = [
      {
        id: "1",
        title: "Light - Reflection and Refraction",
        description: "Class 10 Physics - Understanding mirrors, lenses, and light behavior",
        subjectId: "1",
        topicId: "1",
        videoUrl: "https://example.com/cbse10-light",
        thumbnailUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
        duration: 720, // 12:00 minutes
        difficulty: "Easy",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      },
      {
        id: "2",
        title: "Electricity - Current & Resistance",
        description: "Class 10 Physics - Ohm's Law, circuits, and electrical basics for JEE foundation",
        subjectId: "1",
        topicId: "2",
        videoUrl: "https://example.com/cbse10-electricity",
        thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
        duration: 900, // 15:00 minutes
        difficulty: "Medium",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      },
      {
        id: "3",
        title: "Quadratic Equations - Problem Solving",
        description: "Class 10 Math - Master quadratic equations for strong JEE foundation",
        subjectId: "3",
        topicId: "5",
        videoUrl: "https://example.com/cbse10-quadratic",
        thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904",
        duration: 960, // 16:00 minutes
        difficulty: "Medium",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      },
      {
        id: "4",
        title: "Acids, Bases & Salts",
        description: "Class 10 Chemistry - pH, indicators, and chemical reactions",
        subjectId: "2",
        topicId: "3",
        videoUrl: "https://example.com/cbse10-acids",
        thumbnailUrl: "https://images.unsplash.com/photo-1532634883-2b4242a0e90b",
        duration: 840, // 14:00 minutes
        difficulty: "Easy",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      }
    ];
    videos.forEach(video => this.videoLectures.set(video.id, video));

    // Initialize practice tests - Class 10 CBSE and JEE foundation tests
    const tests: PracticeTest[] = [
      {
        id: "1",
        title: "CBSE Class 10 - Science Mock Test",
        description: "Complete Class 10 Science practice test covering Physics, Chemistry, Biology",
        subjectIds: ["1", "2", "4"],
        examType: "CBSE_BOARD",
        totalQuestions: 40,
        duration: 5400, // 90 minutes
        difficulty: "Easy",
        isActive: true
      },
      {
        id: "2",
        title: "Mathematics - Chapter Test",
        description: "Class 10 Math test on Quadratic Equations and Coordinate Geometry",
        subjectIds: ["3"],
        examType: "CHAPTER_TEST",
        totalQuestions: 25,
        duration: 3600, // 60 minutes
        difficulty: "Medium",
        isActive: true
      },
      {
        id: "3",
        title: "JEE Foundation - Physics Basics",
        description: "Early JEE preparation test for Class 10 students",
        subjectIds: ["1"],
        examType: "JEE_FOUNDATION",
        totalQuestions: 20,
        duration: 2400, // 40 minutes
        difficulty: "Medium",
        isActive: true
      }
    ];
    tests.forEach(test => this.practiceTests.set(test.id, test));

    // Initialize content library
    const content: ContentLibrary[] = [
      {
        id: "1",
        title: "Physics Formula Sheet",
        type: "pdf",
        subjectId: "1",
        topicId: "1",
        content: null,
        fileUrl: "https://example.com/physics-formulas.pdf",
        difficulty: "Easy",
        isDownloadable: true
      },
      {
        id: "2",
        title: "Integration Techniques Guide",
        type: "text",
        subjectId: "3",
        topicId: "4",
        content: "Comprehensive guide to integration techniques...",
        fileUrl: null,
        difficulty: "Hard",
        isDownloadable: false
      }
    ];
    content.forEach(item => this.contentLibrary.set(item.id, item));
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      targetExam: insertUser.targetExam || null,
      grade: insertUser.grade || null
    };
    this.users.set(id, user);
    
    // Initialize study streak
    const streak: StudyStreak = {
      id: randomUUID(),
      userId: id,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null
    };
    this.studyStreaks.set(id, streak);
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Subjects and Topics
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubjectsByStream(stream: string): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(subject => subject.stream === stream);
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    return Array.from(this.topics.values()).filter(topic => topic.subjectId === subjectId);
  }

  // Video Lectures
  async getVideoLectures(): Promise<VideoLecture[]> {
    return Array.from(this.videoLectures.values());
  }

  async getVideoLecturesBySubject(subjectId: string): Promise<VideoLecture[]> {
    return Array.from(this.videoLectures.values()).filter(video => video.subjectId === subjectId);
  }

  async getRecommendedVideos(userId: string): Promise<VideoLecture[]> {
    // Simple recommendation: return all videos for now
    return Array.from(this.videoLectures.values()).slice(0, 4);
  }

  async createVideoLecture(video: InsertVideoLecture): Promise<VideoLecture> {
    const id = randomUUID();
    const newVideo: VideoLecture = { 
      ...video, 
      id,
      duration: video.duration || null,
      description: video.description || null,
      subjectId: video.subjectId || null,
      topicId: video.topicId || null,
      thumbnailUrl: video.thumbnailUrl || null,
      language: video.language || null,
      aiFeatures: video.aiFeatures || null
    };
    this.videoLectures.set(id, newVideo);
    return newVideo;
  }

  // Practice Tests
  async getPracticeTests(): Promise<PracticeTest[]> {
    return Array.from(this.practiceTests.values());
  }

  async getPracticeTestsByExamType(examType: string): Promise<PracticeTest[]> {
    return Array.from(this.practiceTests.values()).filter(test => test.examType === examType);
  }

  async getPracticeTest(id: string): Promise<PracticeTest | undefined> {
    return this.practiceTests.get(id);
  }

  async getQuestionsByTest(testId: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(question => question.testId === testId);
  }

  async createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest> {
    const id = randomUUID();
    const newTest: PracticeTest = { 
      ...test, 
      id,
      description: test.description || null,
      subjectIds: test.subjectIds || null,
      isActive: test.isActive !== undefined ? test.isActive : null
    };
    this.practiceTests.set(id, newTest);
    return newTest;
  }

  // Test Attempts
  async createTestAttempt(attempt: InsertTestAttempt): Promise<TestAttempt> {
    const id = randomUUID();
    const newAttempt: TestAttempt = { 
      ...attempt, 
      id, 
      completedAt: new Date(),
      userId: attempt.userId || null,
      testId: attempt.testId || null,
      responses: attempt.responses || null,
      timeSpent: attempt.timeSpent || null,
      analysis: attempt.analysis || null
    };
    this.testAttempts.set(id, newAttempt);
    return newAttempt;
  }

  async getTestAttemptsByUser(userId: string): Promise<TestAttempt[]> {
    return Array.from(this.testAttempts.values()).filter(attempt => attempt.userId === userId);
  }

  async getTestAttempt(id: string): Promise<TestAttempt | undefined> {
    return this.testAttempts.get(id);
  }

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async updateUserProgress(userId: string, subjectId: string, topicId: string, progress: number): Promise<UserProgress> {
    const id = randomUUID();
    const userProgress: UserProgress = {
      id,
      userId,
      subjectId,
      topicId,
      progressPercentage: progress,
      lastStudied: new Date()
    };
    this.userProgress.set(id, userProgress);
    return userProgress;
  }

  // AI Chat
  async createChatSession(session: InsertAiChatSession): Promise<AiChatSession> {
    const id = randomUUID();
    const newSession: AiChatSession = { 
      ...session, 
      id, 
      createdAt: new Date(),
      userId: session.userId || null,
      messages: session.messages || null,
      context: session.context || null
    };
    this.aiChatSessions.set(id, newSession);
    return newSession;
  }

  async getChatSession(id: string): Promise<AiChatSession | undefined> {
    return this.aiChatSessions.get(id);
  }

  async updateChatSession(id: string, messages: AiChatSession['messages']): Promise<AiChatSession> {
    const session = this.aiChatSessions.get(id);
    if (!session) throw new Error("Chat session not found");
    
    const updatedSession = { ...session, messages };
    this.aiChatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserChatSessions(userId: string): Promise<AiChatSession[]> {
    return Array.from(this.aiChatSessions.values()).filter(session => session.userId === userId);
  }

  // Study Streaks
  async getStudyStreak(userId: string): Promise<StudyStreak | undefined> {
    return this.studyStreaks.get(userId);
  }

  async updateStudyStreak(userId: string, currentStreak: number, longestStreak: number): Promise<StudyStreak> {
    const existing = this.studyStreaks.get(userId);
    const streak: StudyStreak = {
      id: existing?.id || randomUUID(),
      userId,
      currentStreak,
      longestStreak,
      lastStudyDate: new Date()
    };
    this.studyStreaks.set(userId, streak);
    return streak;
  }

  // Content Library
  async getContentLibrary(): Promise<ContentLibrary[]> {
    return Array.from(this.contentLibrary.values());
  }

  async getContentBySubject(subjectId: string): Promise<ContentLibrary[]> {
    return Array.from(this.contentLibrary.values()).filter(content => content.subjectId === subjectId);
  }

  async getContentByTopic(topicId: string): Promise<ContentLibrary[]> {
    return Array.from(this.contentLibrary.values()).filter(content => content.topicId === topicId);
  }

  // Analytics
  async getUserStats(userId: string): Promise<{
    streak: number;
    questionsAnswered: number;
    accuracyRate: number;
    rank: number;
  }> {
    const streak = await this.getStudyStreak(userId);
    const attempts = await this.getTestAttemptsByUser(userId);
    
    const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    return {
      streak: streak?.currentStreak || 0,
      questionsAnswered: totalQuestions,
      accuracyRate,
      rank: Math.floor(Math.random() * 10000) + 1 // Mock rank for now
    };
  }

  private async createSampleUsers() {
    // Create sample user with ID "user-1" that frontend expects - Harish, Class 10 CBSE preparing for IIT JEE
    const sampleUser = await this.createUser({
      username: "harish_student",
      email: "harish.kumar@gmail.com",
      password: "password123",
      fullName: "Harish Kumar",
      age: 15,
      educationStream: "CBSE",
      grade: "10th",
      targetExam: "IIT JEE"
    });

    // Override the ID to match frontend expectations
    const userWithFixedId: User = {
      ...sampleUser,
      id: "user-1"
    };
    this.users.set("user-1", userWithFixedId);

    // Create realistic test attempts for Harish - Class 10 level performance
    await this.createTestAttempt({
      userId: "user-1",
      testId: "2", // Physics Chapter Test - Mechanics (more appropriate for Class 10)
      score: 22,
      totalQuestions: 30,
      timeSpent: 2700, // 45 minutes
      responses: [
        { questionId: "3", selectedAnswer: 1, timeSpent: 90 },
        { questionId: "4", selectedAnswer: 2, timeSpent: 75 },
        { questionId: "5", selectedAnswer: 3, timeSpent: 120 }
      ],
      analysis: {
        subjectWise: [
          { subjectId: "1", correct: 22, total: 30 } // Physics only
        ],
        topicWise: [
          { topicId: "1", correct: 15, total: 20 }, // Mechanics - stronger area
          { topicId: "2", correct: 7, total: 10 }   // Rotational Motion - needs work
        ],
        difficultyWise: [
          { difficulty: "Easy", correct: 12, total: 15 },   // 80% on easy
          { difficulty: "Medium", correct: 8, total: 12 },  // 67% on medium  
          { difficulty: "Hard", correct: 2, total: 3 }      // 67% on hard
        ]
      }
    });

    // Add foundational progress tracking for Class 10 student
    await this.updateUserProgress("user-1", "1", "1", 75); // Physics - Mechanics: 75% complete
    await this.updateUserProgress("user-1", "1", "2", 45); // Physics - Rotational Motion: 45% complete
    await this.updateUserProgress("user-1", "3", "4", 60); // Mathematics - Calculus basics: 60% complete
  }
}

export const storage = new MemStorage();
