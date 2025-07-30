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
  }

  private initializeData() {
    // Initialize subjects
    const subjects: Subject[] = [
      { id: "1", name: "Physics", stream: "JEE", grade: "11-12" },
      { id: "2", name: "Chemistry", stream: "JEE", grade: "11-12" },
      { id: "3", name: "Mathematics", stream: "JEE", grade: "11-12" },
      { id: "4", name: "Biology", stream: "NEET", grade: "11-12" },
      { id: "5", name: "English", stream: "CBSE", grade: "1-12" },
    ];
    subjects.forEach(subject => this.subjects.set(subject.id, subject));

    // Initialize topics
    const topics: Topic[] = [
      { id: "1", subjectId: "1", name: "Mechanics", description: "Laws of Motion, Work Energy", difficulty: "Medium" },
      { id: "2", subjectId: "1", name: "Rotational Motion", description: "Angular motion, Moment of Inertia", difficulty: "Hard" },
      { id: "3", subjectId: "2", name: "Organic Chemistry", description: "Alcohols, Ethers, Aldehydes", difficulty: "Medium" },
      { id: "4", subjectId: "3", name: "Calculus", description: "Integration, Differentiation", difficulty: "Hard" },
    ];
    topics.forEach(topic => this.topics.set(topic.id, topic));

    // Initialize video lectures
    const videos: VideoLecture[] = [
      {
        id: "1",
        title: "Rotational Motion - Part 1",
        description: "Introduction to rotational motion concepts",
        subjectId: "1",
        topicId: "2",
        videoUrl: "https://example.com/video1",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        duration: 765, // 12:45 in seconds
        difficulty: "Medium",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      },
      {
        id: "2",
        title: "Alcohols & Ethers",
        description: "Organic chemistry concepts for alcohols and ethers",
        subjectId: "2",
        topicId: "3",
        videoUrl: "https://example.com/video2",
        thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
        duration: 1102, // 18:22 in seconds
        difficulty: "Medium",
        language: "English",
        aiFeatures: {
          hasAutoNotes: true,
          hasVisualMaps: true,
          hasVoiceQA: true
        }
      }
    ];
    videos.forEach(video => this.videoLectures.set(video.id, video));

    // Initialize practice tests
    const tests: PracticeTest[] = [
      {
        id: "1",
        title: "JEE Main Mock Test - 15",
        description: "Comprehensive test covering Physics, Chemistry, and Mathematics",
        subjectIds: ["1", "2", "3"],
        examType: "JEE_MAIN",
        totalQuestions: 180,
        duration: 10800, // 3 hours in seconds
        difficulty: "Medium",
        isActive: true
      },
      {
        id: "2",
        title: "Physics Chapter Test - Mechanics",
        description: "Focused test on mechanics concepts",
        subjectIds: ["1"],
        examType: "CHAPTER_TEST",
        totalQuestions: 30,
        duration: 3600, // 1 hour in seconds
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
}

export const storage = new MemStorage();
