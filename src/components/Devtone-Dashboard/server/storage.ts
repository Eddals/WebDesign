import {
  users,
  projects,
  messages,
  feedback,
  projectComments,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Message,
  type InsertMessage,
  type Feedback,
  type InsertFeedback,
  type ProjectComment,
  type InsertProjectComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Project operations
  getProjects(clientId?: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Message operations
  getMessages(projectId?: number): Promise<(Message & { sender: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Feedback operations
  getFeedback(projectId: number): Promise<(Feedback & { author: User })[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  markFeedbackAsRead(id: number): Promise<void>;

  // Project comments operations
  getProjectComments(projectId: number): Promise<(ProjectComment & { author: User })[]>;
  createProjectComment(comment: InsertProjectComment): Promise<ProjectComment>;

  // Analytics
  getClientAnalytics(): Promise<{
    totalClients: number;
    activeProjects: number;
    completedProjects: number;
    pendingFeedback: number;
    unreadMessages: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Project operations
  async getProjects(clientId?: string): Promise<Project[]> {
    const query = db.select().from(projects);
    if (clientId) {
      return await query.where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
    }
    return await query.orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Message operations
  async getMessages(projectId?: number): Promise<(Message & { sender: User })[]> {
    const query = db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        projectId: messages.projectId,
        isSystemMessage: messages.isSystemMessage,
        createdAt: messages.createdAt,
        sender: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id));

    if (projectId) {
      return await query.where(eq(messages.projectId, projectId)).orderBy(desc(messages.createdAt)) as any;
    }
    return await query.orderBy(desc(messages.createdAt)) as any;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Feedback operations
  async getFeedback(projectId: number): Promise<(Feedback & { author: User })[]> {
    return await db
      .select({
        id: feedback.id,
        content: feedback.content,
        projectId: feedback.projectId,
        authorId: feedback.authorId,
        type: feedback.type,
        isRead: feedback.isRead,
        createdAt: feedback.createdAt,
        author: users,
      })
      .from(feedback)
      .innerJoin(users, eq(feedback.authorId, users.id))
      .where(eq(feedback.projectId, projectId))
      .orderBy(desc(feedback.createdAt)) as any;
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackData)
      .returning();
    return newFeedback;
  }

  async markFeedbackAsRead(id: number): Promise<void> {
    await db
      .update(feedback)
      .set({ isRead: true })
      .where(eq(feedback.id, id));
  }

  // Project comments operations
  async getProjectComments(projectId: number): Promise<(ProjectComment & { author: User })[]> {
    return await db
      .select({
        id: projectComments.id,
        content: projectComments.content,
        projectId: projectComments.projectId,
        authorId: projectComments.authorId,
        createdAt: projectComments.createdAt,
        author: users,
      })
      .from(projectComments)
      .innerJoin(users, eq(projectComments.authorId, users.id))
      .where(eq(projectComments.projectId, projectId))
      .orderBy(desc(projectComments.createdAt)) as any;
  }

  async createProjectComment(comment: InsertProjectComment): Promise<ProjectComment> {
    const [newComment] = await db
      .insert(projectComments)
      .values(comment)
      .returning();
    return newComment;
  }

  // Analytics
  async getClientAnalytics(): Promise<{
    totalClients: number;
    activeProjects: number;
    completedProjects: number;
    pendingFeedback: number;
    unreadMessages: number;
  }> {
    const [totalClientsResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "client"));

    const [activeProjectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(or(eq(projects.status, "in_progress"), eq(projects.status, "review")));

    const [completedProjectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, "completed"));

    const [pendingFeedbackResult] = await db
      .select({ count: count() })
      .from(feedback)
      .where(and(eq(feedback.isRead, false), eq(feedback.type, "client_feedback")));

    const [unreadMessagesResult] = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.isSystemMessage, false));

    return {
      totalClients: totalClientsResult.count,
      activeProjects: activeProjectsResult.count,
      completedProjects: completedProjectsResult.count,
      pendingFeedback: pendingFeedbackResult.count,
      unreadMessages: unreadMessagesResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
