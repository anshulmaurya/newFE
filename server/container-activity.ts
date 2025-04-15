import { deleteUserContainer } from './container-api';

// Interface for storing container activity data
interface ContainerActivity {
  username: string;
  lastActive: Date;
  containerCreatedAt: Date;
}

// Map to track active containers by username
const activeContainers = new Map<string, ContainerActivity>();

// The inactivity timeout (in milliseconds) - default 30 minutes
const DEFAULT_INACTIVITY_TIMEOUT = 30 * 60 * 1000;
let inactivityTimeout = DEFAULT_INACTIVITY_TIMEOUT;

// Interval handle for cleanup
let cleanupIntervalHandle: NodeJS.Timeout | null = null;

/**
 * Set the inactivity timeout for container deletion
 * @param timeoutMs Timeout in milliseconds
 */
export function setContainerInactivityTimeout(timeoutMs: number): void {
  inactivityTimeout = timeoutMs;
  console.log(`Container inactivity timeout set to ${timeoutMs}ms`);
}

/**
 * Register a container for a user
 * @param username The user's username
 */
export function registerUserContainer(username: string): void {
  if (!username) return;

  const now = new Date();
  activeContainers.set(username, {
    username,
    lastActive: now,
    containerCreatedAt: now
  });
  
  console.log(`Container registered for user: ${username}`);
  
  // Ensure the cleanup interval is running
  startCleanupInterval();
}

/**
 * Record a heartbeat for a user's container to keep it active
 * @param username The user's username
 */
export function recordContainerHeartbeat(username: string): void {
  if (!username) return;
  
  const activity = activeContainers.get(username);
  
  if (activity) {
    // Update the last active timestamp
    activity.lastActive = new Date();
    activeContainers.set(username, activity);
    console.log(`Heartbeat recorded for user container: ${username}`);
  } else {
    // If no activity record exists, create one
    registerUserContainer(username);
  }
}

/**
 * Remove a container from activity tracking
 * @param username The user's username
 */
export function unregisterUserContainer(username: string): void {
  if (!username) return;
  
  activeContainers.delete(username);
  console.log(`Container unregistered for user: ${username}`);
}

/**
 * Start the cleanup interval to check for inactive containers
 */
function startCleanupInterval(): void {
  if (cleanupIntervalHandle) return; // Already running
  
  // Check for inactive containers every minute
  cleanupIntervalHandle = setInterval(cleanupInactiveContainers, 60 * 1000);
  console.log('Container activity cleanup interval started');
}

/**
 * Stop the cleanup interval
 */
export function stopCleanupInterval(): void {
  if (cleanupIntervalHandle) {
    clearInterval(cleanupIntervalHandle);
    cleanupIntervalHandle = null;
    console.log('Container activity cleanup interval stopped');
  }
}

/**
 * Check for and delete inactive containers
 */
function cleanupInactiveContainers(): void {
  console.log('Checking for inactive containers...');
  const now = new Date();
  
  activeContainers.forEach((activity, username) => {
    const inactiveTime = now.getTime() - activity.lastActive.getTime();
    
    if (inactiveTime > inactivityTimeout) {
      console.log(`Container for user ${username} has been inactive for ${inactiveTime}ms, deleting...`);
      
      // Delete the container
      deleteUserContainer(username)
        .then(() => {
          console.log(`Inactive container for user ${username} deleted successfully`);
          // Remove from our tracking map
          activeContainers.delete(username);
        })
        .catch(err => {
          console.error(`Error deleting inactive container for user ${username}:`, err);
        });
    }
  });
}

/**
 * Get current statistics about active containers
 */
export function getContainerActivityStats(): {
  totalActive: number;
  containers: Array<{
    username: string;
    lastActiveMinutesAgo: number;
    ageMinutes: number;
  }>;
} {
  const now = new Date();
  const containers = Array.from(activeContainers.entries()).map(([username, activity]) => {
    const lastActiveMinutesAgo = Math.round((now.getTime() - activity.lastActive.getTime()) / (60 * 1000));
    const ageMinutes = Math.round((now.getTime() - activity.containerCreatedAt.getTime()) / (60 * 1000));
    
    return {
      username,
      lastActiveMinutesAgo,
      ageMinutes
    };
  });
  
  return {
    totalActive: activeContainers.size,
    containers
  };
}