import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType, insertUserStatsSchema } from "@shared/schema";
import { createUserContainer, deleteUserContainer } from "./container-api";
import cookie from "cookie";

// Create type declaration for Express User
declare global {
  namespace Express {
    // Define User interface to match the database schema
    interface User {
      id: number;
      username: string;
      password?: string | null;
      githubId?: string | null;
      displayName?: string | null;
      profileUrl?: string | null;
      avatarUrl?: string | null;
      email?: string | null;
      accessToken?: string | null;
      createdAt?: Date | null;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(
  supplied: string,
  stored: string | null | undefined,
): Promise<boolean> {
  if (!stored) return false;

  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;

  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dspcoder-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
    },
  };

  // Use the exact callback URL configured in GitHub OAuth settings
  const callbackURL =
    process.env.NODE_ENV === "production" 
      ? "https://dspcoder.replit.app/api/auth/github/callback"
      : "https://97332a4d-a72c-4bed-9d97-03b0350ae447-00-2lw03c0sn2pc2.kirk.replit.dev/api/auth/github/callback";

  console.log("GitHub Auth Callback URL:", callbackURL);

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // GitHub authentication strategy
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: callbackURL,
        scope: ["user:email", "read:user"],
      },
      async function (
        accessToken: string,
        _refreshToken: string,
        profile: {
          id: string;
          username?: string;
          displayName?: string;
          emails?: { value: string }[];
          photos?: { value: string }[];
        },
        done: (error: Error | null, user?: any) => void,
      ) {
        try {
          console.log("GitHub profile received:", {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos,
          });

          // Check if user exists
          let user = await storage.getUserByGithubId(profile.id);
          console.log("Existing user found:", user);

          if (!user) {
            console.log("Creating new user for GitHub id:", profile.id);
            // Create new user if not found
            try {
              user = await storage.createUser({
                username: profile.username || `github_${profile.id}`,
                githubId: profile.id,
                displayName: profile.displayName || profile.username,
                avatarUrl: profile.photos?.[0]?.value,
                email:
                  profile.emails?.[0]?.value ||
                  `github_${profile.id}@example.com`, // Provide fallback email
                password: await hashPassword(randomBytes(16).toString("hex")), // Random password for GitHub users
              });
              console.log("New user created:", user);

              // Initialize user stats
              await storage.createUserStats({
                userId: user.id,
                lastActiveDate: new Date(),
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                totalAttempted: 0,
                currentStreak: 0,
                longestStreak: 0,
              });
            } catch (createError) {
              console.error("Error creating user:", createError);
              return done(createError as Error);
            }
          } else {
            // Update user's displayName and avatar if they've changed
            if (
              profile.displayName &&
              (!user.displayName || user.displayName !== profile.displayName)
            ) {
              try {
                await storage.updateUser(user.id, {
                  displayName: profile.displayName,
                });
                user.displayName = profile.displayName;
              } catch (updateError) {
                console.error("Error updating user displayName:", updateError);
              }
            }

            // Update avatar if available
            if (
              profile.photos?.[0]?.value &&
              profile.photos[0].value !== user.avatarUrl
            ) {
              try {
                await storage.updateUser(user.id, {
                  avatarUrl: profile.photos[0].value,
                });
                user.avatarUrl = profile.photos[0].value;
              } catch (updateError) {
                console.error("Error updating user avatar:", updateError);
              }
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("Error in GitHub strategy:", error);
          return done(error as Error);
        }
      },
    ),
  );

  // Local authentication strategy (optional - for username/password login)
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);

        if (
          !user ||
          !user.password ||
          !(await comparePasswords(password, user.password))
        ) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }),
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.get(
    "/api/auth/github",
    passport.authenticate("github", { scope: ["user:email", "read:user"] }),
  );

  app.get(
    "/api/auth/github/callback",
    (req: Request, res: Response, next: NextFunction) => {
      console.log("GitHub callback received, query params:", req.query);
      passport.authenticate("github", {
        failureRedirect: "/auth",
        failWithError: true,
      })(req, res, next);
    },
    async (req: Request, res: Response) => {
      console.log("GitHub authentication successful, user:", req.user);

      // Create container for user if they have a username
      if (req.user && req.user.username) {
        await createUserContainer(req.user.username);
      }

      res.redirect("/dashboard");
    },
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("GitHub authentication error:", err);
      res.redirect("/auth?error=github_auth_failed");
    },
  );

  app.post("/api/login", passport.authenticate("local"), async (req, res) => {
    // Create container for user if they have a username
    if (req.user && req.user.username) {
      await createUserContainer(req.user.username);
    }

    res.json(req.user);
  });

  app.post("/api/logout", async (req, res, next) => {
    // Store the username before logging out
    const username = req.user?.username;

    req.logout(async (err) => {
      if (err) return next(err);

      // Delete container for the user if they have a username
      if (username) {
        await deleteUserContainer(username);
      }

      res.sendStatus(200);
    });
  });

  // Local registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Initialize user stats
      await storage.createUserStats({
        userId: user.id,
        lastActiveDate: new Date(),
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalAttempted: 0,
        currentStreak: 0,
        longestStreak: 0,
      });

      // Log user in
      req.login(user, async (err) => {
        if (err) return next(err);

        // Create container for the new user
        await createUserContainer(user.username);

        // Return user without password
        const { password, ...userData } = user;
        return res.status(201).json(userData);
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}

/**
 * Helper function to get user from a session cookie string
 * @param cookieHeader The cookie header string from a request
 * @returns Promise resolving to the user object or undefined if not authenticated
 */
export async function getUserFromSession(cookieHeader: string): Promise<Express.User | undefined> {
  try {
    // Parse cookies
    const cookies = cookie.parse(cookieHeader);
    
    // Extract session ID - adjust cookie name if different in your app
    const sessionCookie = cookies['connect.sid'];
    if (!sessionCookie) {
      return undefined;
    }
    
    // Decode the signed cookie
    const signedCookie = sessionCookie.slice(2); // Remove s: prefix
    
    // Fast return for invalid session cookies
    if (!signedCookie || signedCookie.length < 10) {
      return undefined;
    }
    
    // Find session in database by session ID
    // This uses direct database access for faster performance (avoids passport overhead)
    try {
      // Query the session store
      // Note: The actual session ID might be encoded differently depending on your session store
      const userId = await new Promise<number | undefined>((resolve) => {
        storage.sessionStore.get(signedCookie, (err, session) => {
          if (err || !session) {
            resolve(undefined);
            return;
          }
          
          // TypeScript doesn't know that our sessions have a passport property
          // Cast to any to access the property safely
          const sessionData = session as any;
          if (!sessionData.passport || !sessionData.passport.user) {
            resolve(undefined);
            return;
          }
          
          resolve(sessionData.passport.user as number);
        });
      });
      
      if (!userId) {
        return undefined;
      }
      
      // Get user by ID
      return await storage.getUser(userId);
    } catch (err) {
      console.error('Error getting session from store:', err);
      return undefined;
    }
  } catch (err) {
    console.error('Error parsing session cookie:', err);
    return undefined;
  }
}
