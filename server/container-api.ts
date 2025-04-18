import fetch from 'node-fetch';

// Use the exact URL from Postman for setup_user_codebase
const BACKEND_BASE_URL = 'https://dspcoder-backend-prod.azurewebsites.net/api';
const SETUP_CODEBASE_URL = 'https://dspcoder-backend-prod.azurewebsites.net/api/setup_user_codebase';

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

/**
 * Sets up the codebase for a specific question in the user's container
 * @param username The GitHub username of the user
 * @param questionId The ID of the question - This should be the "question_id" field from MongoDB, NOT the MongoDB document ID
 * @param lang The programming language to use (default: "c")
 * @returns Promise that resolves when the codebase is set up
 */
export async function setupUserCodebase(username: string, questionId: string, lang: string = "c"): Promise<any> {
  try {
    console.log(`Setting up user codebase for ${username} with question_id: ${questionId} and lang: ${lang}`);
    
    // Format the request body exactly as shown in Postman example
    const requestBody = {
      "username": username,
      "question_id": questionId,
      "lang": lang,
      "original": "false"
    };
    
    console.log(`Making request to ${SETUP_CODEBASE_URL} with body:`, JSON.stringify(requestBody));
    console.log(`IMPORTANT: Full request details: URL=${SETUP_CODEBASE_URL}, Method=POST, username=${username}, question_id=${questionId}`);
    
    const response = await fetch(SETUP_CODEBASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Get the response text first for debugging purposes
    const responseText = await response.text();
    console.log(`Response from setup_user_codebase API (${response.status}): ${responseText}`);
    
    // Try to parse the response as JSON first
    let result;
    try {
      result = JSON.parse(responseText);
      
      // If we get a response object with a URL, format it for our frontend
      if (result.response && typeof result.response === 'string' && result.response.includes('azurecontainerapps.io')) {
        return {
          status: "success",
          message: "Codebase setup completed successfully",
          containerUrl: result.response,
          rawResponse: result
        };
      }
    } catch (jsonError) {
      console.warn(`Failed to parse response as JSON. Using text response instead.`);
      // Check if the response contains a URL we can extract
      if (responseText.includes('azurecontainerapps.io')) {
        // Simple container URL extraction (this is a fallback)
        const urlMatch = responseText.match(/(https:\/\/.*?azurecontainerapps\.io[^\s"']*)/);
        if (urlMatch && urlMatch[1]) {
          return {
            status: "success",
            message: "Codebase setup completed",
            containerUrl: urlMatch[1]
          };
        }
      }
    }
    
    // If response is not OK, still try to provide something useful
    if (!response.ok) {
      console.warn(`External API returned error: ${response.status} ${response.statusText}. Response body: ${responseText}`);
      
      // Try to extract URL from error response if possible
      let containerUrl = "";
      try {
        // Check if there's still a URL in the error response
        if (responseText.includes('azurecontainerapps.io')) {
          const urlMatch = responseText.match(/(https:\/\/.*?azurecontainerapps\.io[^\s"']*)/);
          if (urlMatch && urlMatch[1]) {
            containerUrl = urlMatch[1];
          }
        }
      } catch (err) {
        // Ignore extraction errors
      }
      
      // Use extracted URL or construct a fallback
      if (!containerUrl) {
        containerUrl = `https://${username}.ambitiousfield-760fb695.eastus.azurecontainerapps.io`;
      }
      
      return {
        status: "pending",
        message: "Server encountered an error. You can try accessing your environment directly.",
        containerUrl: containerUrl,
        error: responseText
      };
    }
    
    // If we got here, we have a successful response but couldn't extract a URL from JSON
    let containerUrl = "";
    
    // Try to extract the URL directly from the response text as a last resort
    if (responseText.includes('azurecontainerapps.io')) {
      const urlMatch = responseText.match(/(https:\/\/.*?azurecontainerapps\.io[^\s"']*)/);
      if (urlMatch && urlMatch[1]) {
        containerUrl = urlMatch[1];
      }
    }
    
    // If still no URL, use a constructed fallback
    if (!containerUrl) {
      containerUrl = `https://${username}.ambitiousfield-760fb695.eastus.azurecontainerapps.io`;
    }
    
    console.log(`Codebase set up successfully for ${username}, question: ${questionId}`);
    return {
      status: "success",
      message: "Codebase setup completed",
      containerUrl: containerUrl,
      rawResponse: result || responseText
    };
  } catch (err: unknown) {
    console.error('Error setting up codebase:', err);
    
    // Extract error message safely
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    // Construct a standard URL based on the username 
    // This is only used if everything else fails (network error, etc.)
    const fallbackUrl = `https://${username}.ambitiousfield-760fb695.eastus.azurecontainerapps.io`;
    
    // Instead of failing completely, return a response with a fallback URL
    return {
      status: "pending",
      message: "Error connecting to container service. You can still try accessing your environment directly.",
      containerUrl: fallbackUrl,
      error: errorMessage
    };
  }
}