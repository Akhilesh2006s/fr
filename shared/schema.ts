import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  educationStream: text("education_stream").notNull(),
  grade: text("grade"),
  targetExam: text("target_exam"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  stream: text("stream").notNull(),
  grade: text("grade"),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subjectId: varchar("subject_id").references(() => subjects.id),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(),
});

export const videoLectures = pgTable("video_lectures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  subjectId: varchar("subject_id").references(() => subjects.id),
  topicId: varchar("topic_id").references(() => topics.id),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"),
  difficulty: text("difficulty").notNull(),
  language: text("language").default("English"),
  aiFeatures: jsonb("ai_features").$type<{
    hasAutoNotes: boolean;
    hasVisualMaps: boolean;
    hasVoiceQA: boolean;
  }>(),
});

export const practiceTests = pgTable("practice_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  subjectIds: text("subject_ids").array(),
  examType: text("exam_type").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  duration: integer("duration").notNull(),
  difficulty: text("difficulty").notNull(),
  isActive: boolean("is_active").default(true),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testId: varchar("test_id").references(() => practiceTests.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  topicId: varchar("topic_id").references(() => topics.id),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<string[]>(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: text("difficulty").notNull(),
});

export const testAttempts = pgTable("test_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  testId: varchar("test_id").references(() => practiceTests.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent"),
  responses: jsonb("responses").$type<{
    questionId: string;
    selectedAnswer: number;
    timeSpent: number;
  }[]>(),
  analysis: jsonb("analysis").$type<{
    subjectWise: { subjectId: string; correct: number; total: number; }[];
    topicWise: { topicId: string; correct: number; total: number; }[];
    difficultyWise: { difficulty: string; correct: number; total: number; }[];
  }>(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  topicId: varchar("topic_id").references(() => topics.id),
  progressPercentage: integer("progress_percentage").default(0),
  lastStudied: timestamp("last_studied").defaultNow(),
});

export const aiChatSessions = pgTable("ai_chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  messages: jsonb("messages").$type<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    type?: "text" | "voice" | "image";
  }[]>(),
  context: jsonb("context").$type<{
    currentSubject?: string;
    currentTopic?: string;
    recentTest?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyStreaks = pgTable("study_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastStudyDate: timestamp("last_study_date"),
});

export const contentLibrary = pgTable("content_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // "text", "pdf", "interactive"
  subjectId: varchar("subject_id").references(() => subjects.id),
  topicId: varchar("topic_id").references(() => topics.id),
  content: text("content"),
  fileUrl: text("file_url"),
  difficulty: text("difficulty").notNull(),
  isDownloadable: boolean("is_downloadable").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVideoLectureSchema = createInsertSchema(videoLectures).omit({
  id: true,
});

export const insertPracticeTestSchema = createInsertSchema(practiceTests).omit({
  id: true,
});

export const insertTestAttemptSchema = createInsertSchema(testAttempts).omit({
  id: true,
  completedAt: true,
});

export const insertAiChatSessionSchema = createInsertSchema(aiChatSessions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type VideoLecture = typeof videoLectures.$inferSelect;
export type PracticeTest = typeof practiceTests.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type TestAttempt = typeof testAttempts.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type StudyStreak = typeof studyStreaks.$inferSelect;
export type ContentLibrary = typeof contentLibrary.$inferSelect;
export type InsertVideoLecture = z.infer<typeof insertVideoLectureSchema>;
export type InsertPracticeTest = z.infer<typeof insertPracticeTestSchema>;
export type InsertTestAttempt = z.infer<typeof insertTestAttemptSchema>;
export type InsertAiChatSession = z.infer<typeof insertAiChatSessionSchema>;
