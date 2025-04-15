/**
 * Utility to send heartbeat signals to keep user containers alive
 * 
 * This implementation includes both regular interval heartbeats and 
 * user activity-based heartbeats to ensure containers stay alive 
 * while the user is active on the site.
 */

// Track if heartbeat is already running to prevent multiple intervals
let heartbeatIntervalId: number | null = null;

// Track user activity event listeners
let activityListenersActive = false;

// Throttling timeout for activity-based heartbeats
let activityThrottleTimeout: number | null = null;

// Default heartbeat interval in milliseconds (5 minutes)
const DEFAULT_HEARTBEAT_INTERVAL = 5 * 60 * 1000;

// Minimum time between activity-based heartbeats (1 minute)
const ACTIVITY_THROTTLE_INTERVAL = 60 * 1000;

// Track last heartbeat time
let lastHeartbeatTime = 0;

/**
 * Start sending heartbeat signals to the server to keep container alive
 * @param intervalMs Optional override for heartbeat interval (default: 5 minutes)
 */
export function startContainerHeartbeat(intervalMs: number = DEFAULT_HEARTBEAT_INTERVAL): void {
  // If already running, stop it first
  if (heartbeatIntervalId !== null) {
    stopContainerHeartbeat();
  }
  
  // Send immediate heartbeat
  sendHeartbeat();
  
  // Set up interval for regular heartbeats
  heartbeatIntervalId = window.setInterval(sendHeartbeat, intervalMs);
  console.log(`Container heartbeat started with interval of ${intervalMs}ms`);
  
  // Set up activity-based heartbeats if not already active
  if (!activityListenersActive) {
    setupActivityHeartbeats();
  }
}

/**
 * Stop sending heartbeat signals and remove all event listeners
 */
export function stopContainerHeartbeat(): void {
  // Clear the regular interval
  if (heartbeatIntervalId !== null) {
    window.clearInterval(heartbeatIntervalId);
    heartbeatIntervalId = null;
  }
  
  // Clear any pending activity throttle
  if (activityThrottleTimeout !== null) {
    window.clearTimeout(activityThrottleTimeout);
    activityThrottleTimeout = null;
  }
  
  // Remove activity listeners
  if (activityListenersActive) {
    removeActivityListeners();
  }
  
  console.log('Container heartbeat stopped');
}

/**
 * Set up event listeners for user activity to trigger heartbeats
 */
function setupActivityHeartbeats(): void {
  window.addEventListener('mousemove', handleUserActivity);
  window.addEventListener('keydown', handleUserActivity);
  window.addEventListener('click', handleUserActivity);
  window.addEventListener('scroll', handleUserActivity);
  // Also listen for visibility changes to ensure heartbeats when user returns to tab
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  activityListenersActive = true;
  console.log('Activity-based heartbeats enabled');
}

/**
 * Remove all activity event listeners
 */
function removeActivityListeners(): void {
  window.removeEventListener('mousemove', handleUserActivity);
  window.removeEventListener('keydown', handleUserActivity);
  window.removeEventListener('click', handleUserActivity);
  window.removeEventListener('scroll', handleUserActivity);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  activityListenersActive = false;
}

/**
 * Handle visibility change events to send heartbeat when user returns to tab
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === 'visible') {
    // User has returned to the tab - send a heartbeat if it's been a while
    const now = Date.now();
    if (now - lastHeartbeatTime > ACTIVITY_THROTTLE_INTERVAL) {
      sendHeartbeat();
    }
  }
}

/**
 * Handle user activity events in a throttled manner
 */
function handleUserActivity(): void {
  // Only handle if heartbeat is active and we're not already throttled
  if (heartbeatIntervalId !== null && activityThrottleTimeout === null) {
    const now = Date.now();
    
    // Only send a new heartbeat if enough time has passed since the last one
    if (now - lastHeartbeatTime > ACTIVITY_THROTTLE_INTERVAL) {
      // Set throttle timeout to prevent multiple rapid heartbeats
      activityThrottleTimeout = window.setTimeout(() => {
        sendHeartbeat();
        activityThrottleTimeout = null;
      }, 250); // Short delay to batch rapid events
    }
  }
}

/**
 * Send a single heartbeat signal to the server
 */
async function sendHeartbeat(): Promise<void> {
  try {
    lastHeartbeatTime = Date.now();
    
    const response = await fetch('/api/container-heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    });
    
    if (response.ok) {
      // Update last successful heartbeat time
      console.log('Container heartbeat sent successfully');
    } else {
      // If unauthorized or other error, stop sending heartbeats
      if (response.status === 401) {
        console.warn('User not authenticated, stopping container heartbeat');
        stopContainerHeartbeat();
      } else {
        console.error('Failed to send container heartbeat', await response.text());
      }
    }
  } catch (error) {
    console.error('Error sending container heartbeat:', error);
  }
}