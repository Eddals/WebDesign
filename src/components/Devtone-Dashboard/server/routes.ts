import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertMessageSchema, insertFeedbackSchema, insertProjectCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Custom authentication middleware
  const customAuth = async (req: any, res: any, next: any) => {
    // Check for OAuth session first
    if (req.customAuth && req.customAuth() && req.user?.claims?.sub) {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      req.currentUser = user;
      return next();
    }
    
    // Check for custom session
    if (req.session?.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.currentUser = user;
        return next();
      }
    }
    
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.get('/api/auth/user', customAuth, async (req: any, res) => {
    try {
      res.json(req.currentUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Custom signin route
  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
      };

      res.json({ 
        message: "Sign in successful", 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
        }
      });
    } catch (error) {
      console.error("Sign in error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Signup route
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, company, projectDescription, role, adminCode, password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // Validate admin code for admin registration
      if (role === 'admin' && adminCode !== 'DEVTONEADMINS') {
        return res.status(400).json({ message: "Invalid admin code" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate user ID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const userData = {
        id: userId,
        email,
        firstName,
        lastName,
        role: role || 'client',
        company: company || null,
        password: hashedPassword,
      };

      // Store user data
      await storage.upsertUser(userData);

      res.status(201).json({ 
        message: "Registration successful. Please proceed to login.",
        redirectToLogin: true 
      });
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Project routes
  app.get('/api/projects', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If client, only get their projects. If admin, get all projects
      const clientId = user.role === "client" ? user.id : undefined;
      const projects = await storage.getProjects(clientId);
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', customAuth, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = req.currentUser;
      
      // Check if user has access to this project
      if (user?.role === "client" && project.clientId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create projects" });
      }

      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', customAuth, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const user = req.currentUser;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can update projects" });
      }

      const updateData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(projectId, updateData);
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Message routes
  app.get('/api/messages', customAuth, async (req: any, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const messages = await storage.getMessages(projectId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: user.id,
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Feedback routes
  app.get('/api/feedback/:projectId', customAuth, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const feedback = await storage.getFeedback(projectId);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post('/api/feedback', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        authorId: user.id,
      });
      
      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      }
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  // Project comments routes
  app.get('/api/comments/:projectId', customAuth, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const comments = await storage.getProjectComments(projectId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      const commentData = insertProjectCommentSchema.parse({
        ...req.body,
        authorId: user.id,
      });
      
      const comment = await storage.createProjectComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can view analytics" });
      }

      const analytics = await storage.getClientAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // User management routes
  app.get('/api/users', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can view users" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete('/api/users/:id', customAuth, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can delete users" });
      }

      const userId = req.params.id;
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // File upload route
  app.post('/api/upload', customAuth, async (req: any, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      const fs = await import('fs').then(m => m.promises);
      
      // Ensure uploads directory exists
      const uploadsDir = 'uploads';
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }
      
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        }
      });
      
      const upload = multer.default({
        storage,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
        },
        fileFilter: (req, file, cb) => {
          const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
          const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = allowedTypes.test(file.mimetype);
          
          if (mimetype && extname) {
            return cb(null, true);
          } else {
            cb(new Error('Invalid file type'));
          }
        }
      }).single('file');
      
      upload(req, res, (err: any) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({ message: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
          url: fileUrl,
          filename: req.file.originalname,
          size: req.file.size
        });
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Serve static files for uploads
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);

  // WebSocket setup with user tracking
  const connectedUsers = new Map<string, WebSocket>();
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    let userId: string | null = null;

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'user_connect' && data.userId) {
          userId = data.userId;
          connectedUsers.set(userId, ws);
          
          // Broadcast user online status
          const onlineMessage = {
            type: 'user_online',
            userId: userId
          };
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(onlineMessage));
            }
          });
        } else if (data.type === 'get_online_users') {
          // Send current online users to requesting client
          const onlineUsers = Array.from(connectedUsers.keys());
          ws.send(JSON.stringify({
            type: 'online_users',
            userIds: onlineUsers
          }));
        } else {
          // Broadcast to all connected clients except sender
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
            }
          });
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (userId) {
        connectedUsers.delete(userId);
        
        // Broadcast user offline status
        const offlineMessage = {
          type: 'user_offline',
          userId: userId
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(offlineMessage));
          }
        });
      }
    });
  });

  return httpServer;
}
