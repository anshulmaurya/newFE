// Type declarations for Express session
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    returnTo?: string;
  }
}