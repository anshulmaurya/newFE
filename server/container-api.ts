import fetch from 'node-fetch';

const BACKEND_BASE_URL = 'https://dspcoder-backend-prod.azurewebsites.net/api';

/**
 * Creates a container for a user in the cloud
 * @param username The GitHub username of the user
 * @returns Promise that resolves when the container is created
 */
export async function createUserContainer(username: string): Promise<void> {
  try {
    console.log(`Creating container for user: ${username}`);
    const response = await fetch(`${BACKEND_BASE_URL}/create_container?username=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to create container: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.text();
    console.log(`Container created successfully for ${username}, response: ${result}`);
  } catch (error) {
    console.error('Error creating container:', error);
    // We don't throw here to prevent login failures if container creation fails
  }
}

/**
 * Deletes a container for a user in the cloud
 * @param username The GitHub username of the user
 * @returns Promise that resolves when the container is deleted
 */
export async function deleteUserContainer(username: string): Promise<void> {
  try {
    console.log(`Deleting container for user: ${username}`);
    const response = await fetch(`${BACKEND_BASE_URL}/delete_container?username=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to delete container: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.text();
    console.log(`Container deleted successfully for ${username}, response: ${result}`);
  } catch (error) {
    console.error('Error deleting container:', error);
    // We don't throw here to prevent logout failures if container deletion fails
  }
}