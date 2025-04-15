/**
 * Container Activity Tracking System
 * 
 * This module manages container activity tracking and automatic cleanup of inactive containers.
 * It maintains a registry of active containers with their last activity timestamp and
 * periodically checks for containers that have been inactive beyond a specified timeout.
 */

import { log } from './vite';

// Map to track container activity - username -> last activity timestamp
const containerActivity: Map<string, Date> = new Map();

// Default inactivity timeout (5 minutes in milliseconds for testing purposes)
// Note: In production, this would typically be set to 30 minutes or more
const DEFAULT_INACTIVITY_TIMEOUT = 5 * 60 * 1000;

// The current inactivity timeout setting
let containerInactivityTimeout = DEFAULT_INACTIVITY_TIMEOUT;

// Interval ID for the cleanup task
let cleanupIntervalId: NodeJS.Timeout | null = null;

/**
 * Set the inactivity timeout for container cleanup
 * @param timeoutMs Timeout in milliseconds
 */
export function setContainerInactivityTimeout(timeoutMs: number): void {
  containerInactivityTimeout = timeoutMs;
  log(`Container inactivity timeout set to ${timeoutMs}ms (${timeoutMs / 60000} minutes)`);
  
  // Start or restart the cleanup interval
  startCleanupInterval();
}

/**
 * Register a new container when a user logs in
 * @param username The username of the user who owns the container
 */
export function registerContainer(username: string): void {
  containerActivity.set(username, new Date());
  log(`Container registered for user: ${username}`);
}

/**
 * Unregister a container when a user logs out
 * @param username The username of the user who owns the container
 */
export function unregisterContainer(username: string): void {
  if (containerActivity.has(username)) {
    containerActivity.delete(username);
    log(`Container unregistered for user: ${username}`);
  }
}

/**
 * Record container heartbeat to keep it alive
 * @param username The username of the user who owns the container
 */
export function recordContainerHeartbeat(username: string): void {
  containerActivity.set(username, new Date());
  log(`Container heartbeat recorded for user: ${username}`);
}

/**
 * Get container activity statistics (for monitoring/debugging)
 * @returns Object with activity stats
 */
export function getContainerActivityStats(): object {
  const containers: Record<string, string> = {};
  
  containerActivity.forEach((timestamp, username) => {
    containers[username] = timestamp.toISOString();
  });
  
  return {
    totalContainers: containerActivity.size,
    inactivityTimeoutMinutes: containerInactivityTimeout / 60000,
    containers
  };
}

/**
 * Start the cleanup interval for inactive containers
 */
function startCleanupInterval(): void {
  // Clear existing interval if it exists
  if (cleanupIntervalId !== null) {
    clearInterval(cleanupIntervalId);
  }
  
  // For testing purposes, we'll check more frequently (every 1 minute)
  // In production, this would typically be 5-15 minutes
  cleanupIntervalId = setInterval(checkInactiveContainers, 60 * 1000);
  log('Container cleanup interval started (checking every minute for testing)');
}

/**
 * Check for inactive containers and clean them up
 */
function checkInactiveContainers(): void {
  const now = new Date();
  let inactiveCount = 0;
  
  containerActivity.forEach((lastActivity, username) => {
    const inactiveTime = now.getTime() - lastActivity.getTime();
    
    if (inactiveTime > containerInactivityTimeout) {
      // Container has been inactive beyond the timeout
      cleanupContainer(username);
      inactiveCount++;
    }
  });
  
  if (inactiveCount > 0) {
    log(`Cleaned up ${inactiveCount} inactive containers`);
  }
}

/**
 * Clean up an inactive container
 * @param username The username of the user who owns the container
 */
function cleanupContainer(username: string): void {
  // Remove from tracking
  containerActivity.delete(username);
  
  // Log the cleanup action
  log(`Container for user ${username} has been cleaned up due to inactivity`);
  
  try {
    // In a production environment, you would call an API to delete the container
    // This could be implemented by importing deleteUserContainer from container-api.ts:
    // 
    // import { deleteUserContainer } from './container-api';
    // deleteUserContainer(username).catch(err => {
    //   log(`Error deleting container for ${username}: ${err.message}`);
    // });
    //
    // For this test implementation, we're just logging the action
    log(`Container deletion would be triggered here for user: ${username}`);
  } catch (error) {
    log(`Error in container cleanup for ${username}: ${error}`);
  }
}