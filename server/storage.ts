import { type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist methods
  addWaitlistEntry(entry: InsertWaitlistEntry & { createdAt: string }): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private currentUserId: number;
  private currentWaitlistId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Waitlist methods
  async addWaitlistEntry(entry: InsertWaitlistEntry & { createdAt: string }): Promise<WaitlistEntry> {
    // Check if email already exists
    const existingEntry = await this.getWaitlistEntryByEmail(entry.email);
    if (existingEntry) {
      throw new Error("Email already registered on waitlist");
    }

    // Add new entry
    const id = this.currentWaitlistId++;
    
    // Create a proper WaitlistEntry with all required fields
    const waitlistEntry: WaitlistEntry = {
      id,
      firstName: entry.firstName,
      lastName: entry.lastName,
      email: entry.email,
      experience: entry.experience,
      newsletter: entry.newsletter === undefined ? null : entry.newsletter,
      createdAt: entry.createdAt
    };
    
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    );
  }
}

// Export instance of storage
export const storage = new MemStorage();
