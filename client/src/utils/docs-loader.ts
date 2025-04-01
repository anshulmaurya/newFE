/**
 * This utility handles loading documentation markdown files
 */

interface DocMetadata {
  title: string;
  description: string;
  category: string;
  slug: string;
  order: number;
}

// In-memory cache for doc content
const docCache: Record<string, string> = {};

/**
 * Load documentation content by category and slug
 */
export async function loadDocContent(category: string, slug: string): Promise<string> {
  const cacheKey = `${category}/${slug}`;
  
  // Check cache first
  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }
  
  try {
    // In a real implementation, we would dynamically import markdown files
    // For now, we'll use hard-coded content for demo purposes
    let content = `# Documentation Not Found\n\nSorry, we couldn't find the documentation for "${category}/${slug}".\n\nPlease check the URL or browse the available documentation through the sidebar.`;
    
    // Store in cache for future requests
    docCache[cacheKey] = content;
    
    return content;
  } catch (error) {
    console.error('Error loading doc content:', error);
    throw new Error(`Failed to load documentation for ${category}/${slug}`);
  }
}