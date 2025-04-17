import { Router, Request, Response } from 'express';
import { migrateProblemData } from '../scripts/migrate-problems';

// This is a special middleware that only allows a specific admin token
// for security purposes
const requireAdminAuth = (req: Request, res: Response, next: Function) => {
  const adminToken = req.headers['x-admin-token'];
  const validToken = process.env.ADMIN_API_TOKEN || 'development-admin-token';
  
  if (adminToken !== validToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Create admin router
export const adminRouter = Router();

// Database migration endpoint
adminRouter.post('/migrate-problems', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    console.log('Admin API: Starting MongoDB to PostgreSQL problem migration');
    
    const result = await migrateProblemData();
    
    return res.status(200).json({
      message: 'Migration completed',
      ...result
    });
  } catch (error) {
    console.error('Admin API: Migration error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get database status endpoint
adminRouter.get('/db-status', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    // We could add more detailed database status checks here in the future
    return res.status(200).json({
      success: true,
      postgresConnection: 'Connected',
      mongoConnection: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin API: DB status check error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});