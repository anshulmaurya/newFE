import { useState, useEffect } from 'react';

// Define a cache to avoid redundant fetch operations
const mdxCache: Record<string, string> = {};

/**
 * Loads an MDX file from the specified path
 * @param path Path to the MDX file
 * @returns The MDX content as a string
 */
export async function loadMdxFile(path: string): Promise<string> {
  // Check if the file is already in the cache
  if (mdxCache[path]) {
    return mdxCache[path];
  }

  try {
    // Fetch the raw content of the MDX file
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to load MDX file: ${path}`);
    }
    
    const content = await response.text();
    
    // Cache the content for future use
    mdxCache[path] = content;
    
    return content;
  } catch (error) {
    console.error(`Error loading MDX file ${path}:`, error);
    throw error;
  }
}

/**
 * A hook that loads an MDX file and returns its content
 * @param path Path to the MDX file 
 * @returns Object containing the MDX content, loading state, and error
 */
export function useMdxFile(path: string) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMdx() {
      try {
        setLoading(true);
        const mdxContent = await loadMdxFile(path);
        
        if (isMounted) {
          setContent(mdxContent);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setContent(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMdx();

    return () => {
      isMounted = false;
    };
  }, [path]);

  return { content, loading, error };
}