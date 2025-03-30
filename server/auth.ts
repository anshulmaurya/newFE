import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";

// Create type declaration for Express User
declare global {
  namespace Express {
    // Define User interface to avoid recursive reference
    interface User {
      id: number;
      username: string;
      password?: string;
      githubId?: string;
      displayName?: string;
      profileUrl?: string;
      avatarUrl?: string;
      email?: string;
      accessToken?: string;
      createdAt?: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
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
    }
  };
  
  // Use the exact callback URL configured in GitHub OAuth settings
  const callbackURL = "https://97332a4d-a72c-4bed-9d97-03b0350ae447-00-2lw03c0sn2pc2.kirk.replit.dev/api/auth/github/callback";
  
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
      },
      async function(
        accessToken: string, 
        _refreshToken: string, 
        profile: { 
          id: string;
          username?: string;
          displayName?: string;
          emails?: { value: string; }[];
          photos?: { value: string; }[];
        }, 
        done: (error: Error | null, user?: any) => void
      ) {
        try {
          console.log("GitHub profile received:", {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos
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
                avatarUrl: profile.photos?.[0]?.value,
                email: profile.emails?.[0]?.value || `github_${profile.id}@example.com`, // Provide fallback email
                password: await hashPassword(randomBytes(16).toString("hex")), // Random password for GitHub users
              });
              console.log("New user created:", user);
            } catch (createError) {
              console.error("Error creating user:", createError);
              return done(createError as Error);
            }
          }
          
          return done(null, user);
        } catch (error) {
          console.error("Error in GitHub strategy:", error);
          return done(error as Error);
        }
      }
    )
  );

  // Local authentication strategy (optional - for username/password login)
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    })
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
  app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
  
  app.get(
    "/api/auth/github/callback",
    (req: Request, res: Response, next: NextFunction) => {
      console.log("GitHub callback received, query params:", req.query);
      passport.authenticate("github", { 
        failureRedirect: "/auth",
        failWithError: true
      })(req, res, next);
    },
    (req: Request, res: Response) => {
      console.log("GitHub authentication successful, user:", req.user);
      res.redirect("/dashboard");
    },
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("GitHub authentication error:", err);
      res.redirect("/auth?error=github_auth_failed");
    }
  );

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}