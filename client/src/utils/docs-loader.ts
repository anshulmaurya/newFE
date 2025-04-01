/**
 * This utility handles loading documentation files (Markdown and MDX)
 */

import { MDXProvider } from '@mdx-js/react';

// Define documentation metadata structure
export interface DocMetadata {
  title: string;
  description: string;
  category: string;
  slug: string;
  order: number;
  format?: 'md' | 'mdx'; // Format of the document
}

// Types of documentation
export type DocCategory = 
  | 'getting-started'
  | 'communication-protocols'
  | 'data-structures'
  | 'memory-management'
  | 'rtos-concepts'
  | 'debugging-techniques'
  | 'mdx-examples';

// Cache for documentation content to avoid repeated fetching
const docCache: Record<string, string> = {};

/**
 * Creates a map of available documentation
 * In a real implementation, this would dynamically scan for available docs
 */
export function getAvailableDocs(): Record<DocCategory, DocMetadata[]> {
  return {
    'getting-started': [
      {
        title: 'Introduction',
        description: 'Get started with DSPCoder',
        category: 'getting-started',
        slug: 'intro',
        order: 1,
        format: 'md',
      },
      {
        title: 'Quick Setup',
        description: 'Set up your environment',
        category: 'getting-started',
        slug: 'setup',
        order: 2,
        format: 'md',
      },
      {
        title: 'Interview Tips',
        description: 'Prepare for embedded systems interviews',
        category: 'getting-started',
        slug: 'interview-tips',
        order: 3,
        format: 'md',
      },
    ],
    'communication-protocols': [
      {
        title: 'UART',
        description: 'Universal Asynchronous Receiver-Transmitter',
        category: 'communication-protocols',
        slug: 'uart',
        order: 1,
        format: 'md',
      },
      {
        title: 'I2C',
        description: 'Inter-Integrated Circuit',
        category: 'communication-protocols',
        slug: 'i2c',
        order: 2,
        format: 'md',
      },
      {
        title: 'SPI',
        description: 'Serial Peripheral Interface',
        category: 'communication-protocols',
        slug: 'spi',
        order: 3,
        format: 'md',
      },
      {
        title: 'CAN',
        description: 'Controller Area Network',
        category: 'communication-protocols',
        slug: 'can',
        order: 4,
        format: 'md',
      },
    ],
    'data-structures': [
      {
        title: 'Linked Lists',
        description: 'Linked data structures in embedded systems',
        category: 'data-structures',
        slug: 'linked-list',
        order: 1,
        format: 'md',
      },
      {
        title: 'Queues',
        description: 'Queue implementations for embedded systems',
        category: 'data-structures',
        slug: 'queue',
        order: 2,
        format: 'md',
      },
      {
        title: 'Circular Buffers',
        description: 'Efficient ring buffers for embedded systems',
        category: 'data-structures',
        slug: 'circular-buffer',
        order: 3,
        format: 'md',
      },
    ],
    'memory-management': [
      {
        title: 'Stack vs Heap',
        description: 'Understanding memory types in embedded systems',
        category: 'memory-management',
        slug: 'stack-vs-heap',
        order: 1,
        format: 'md',
      },
      {
        title: 'Memory Allocation',
        description: 'Allocation strategies for embedded systems',
        category: 'memory-management',
        slug: 'allocation',
        order: 2,
        format: 'md',
      },
      {
        title: 'Memory Leaks',
        description: 'Detecting and preventing memory leaks',
        category: 'memory-management',
        slug: 'leaks',
        order: 3,
        format: 'md',
      },
    ],
    'rtos-concepts': [
      {
        title: 'Tasks & Scheduling',
        description: 'Understanding RTOS task scheduling',
        category: 'rtos-concepts',
        slug: 'tasks',
        order: 1,
        format: 'md',
      },
      {
        title: 'Semaphores',
        description: 'Using semaphores for synchronization',
        category: 'rtos-concepts',
        slug: 'semaphores',
        order: 2,
        format: 'md',
      },
      {
        title: 'Mutexes',
        description: 'Mutual exclusion in RTOS',
        category: 'rtos-concepts',
        slug: 'mutexes',
        order: 3,
        format: 'md',
      },
      {
        title: 'Message Queues',
        description: 'Inter-task communication with message queues',
        category: 'rtos-concepts',
        slug: 'queues',
        order: 4,
        format: 'md',
      },
    ],
    'debugging-techniques': [
      {
        title: 'Debugging Tools',
        description: 'Tools for embedded systems debugging',
        category: 'debugging-techniques',
        slug: 'tools',
        order: 1,
        format: 'md',
      },
      {
        title: 'Common Bugs',
        description: 'Common bugs in embedded systems',
        category: 'debugging-techniques',
        slug: 'common-bugs',
        order: 2,
        format: 'md',
      },
      {
        title: 'Optimization',
        description: 'Performance optimization techniques',
        category: 'debugging-techniques',
        slug: 'optimization',
        order: 3,
        format: 'md',
      },
    ],
    'mdx-examples': [
      {
        title: 'Basic MDX',
        description: 'Basic MDX examples',
        category: 'mdx-examples',
        slug: 'basic',
        order: 1,
        format: 'mdx',
      }
    ],
  };
}

/**
 * Gets document metadata
 */
export function getDocMetadata(category: string, slug: string): DocMetadata | undefined {
  const availableDocs = getAvailableDocs();
  const categoryDocs = availableDocs[category as DocCategory];
  
  if (!categoryDocs) return undefined;
  
  return categoryDocs.find(doc => doc.slug === slug);
}

/**
 * Check if a document is MDX format
 */
export function isDocMdx(category: string, slug: string): boolean {
  const metadata = getDocMetadata(category, slug);
  return metadata?.format === 'mdx';
}

/**
 * Load documentation content by category and slug
 */
export async function loadDocContent(category: string, slug: string): Promise<string> {
  const cacheKey = `${category}/${slug}`;
  
  // Check if content is already cached
  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }
  
  try {
    // In a real implementation, this would dynamically import markdown files
    // For now, we'll use hard-coded content for demo purposes
    let content = "";
    
    const docMetadata = getDocMetadata(category, slug);
    
    if (docMetadata) {
      switch (`${category}/${slug}`) {
        case 'getting-started/intro':
          content = `# Introduction to DSPCoder

Welcome to DSPCoder, your comprehensive learning platform for embedded systems development and technical interviews. This platform is designed to provide practical knowledge, hands-on coding experience, and interview preparation specifically tailored for embedded systems engineers.

## What is DSPCoder?

DSPCoder combines:

1. **Structured Learning**: Comprehensive documentation on embedded systems concepts
2. **Interactive Coding**: Practice coding challenges specific to embedded systems
3. **Interview Preparation**: Tips and common questions for technical interviews

## Key Features

### Documentation Library

Our documentation covers essential embedded systems topics:

- Communication protocols (UART, I2C, SPI)
- Data structures optimized for embedded environments
- Memory management techniques
- RTOS concepts and implementation
- Debugging methodologies

### Code Challenges

Practice with realistic embedded systems coding challenges:

- Driver development
- Interrupt handling
- Bit manipulation
- Protocol implementation
- Resource optimization

### Embedded Simulator

Test your code in a simulated environment:

- See how your code interacts with virtual hardware
- Observe timing and resource usage
- Debug your solutions in a controlled setting

## Getting Started

1. **Browse Documentation**: Start by exploring our comprehensive guides
2. **Try Coding Challenges**: Apply your knowledge to practical problems
3. **Practice Interview Questions**: Prepare for technical interviews

## Target Audience

DSPCoder is designed for:

- Students studying embedded systems or computer engineering
- Experienced developers transitioning to embedded development
- Engineers preparing for technical interviews in the embedded systems field
- Professionals looking to refresh their knowledge

## Support and Community

Join our community to:

- Get help with difficult concepts
- Share insights and solutions
- Connect with other embedded systems developers
- Provide feedback to improve the platform`;
          break;
        case 'mdx-examples/basic':
          content = `# Basic MDX Example

This is a simple MDX document that demonstrates some basic features.

## Using JSX in Markdown

MDX allows you to use JSX directly in your markdown:

<div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
  <h3>This is a custom component</h3>
  <p>You can style it directly with inline styles.</p>
</div>

## Import and Use React Components

In a real implementation, you could import and use React components:

\`\`\`jsx
import { Button } from '@/components/ui/button'

<Button variant="primary">Click Me</Button>
\`\`\`

## Math Equations with KaTeX

MDX can be extended to support mathematical equations:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

## Interactive Code Examples

You could create interactive code examples:

\`\`\`c live
#include <stdio.h>

int main() {
  printf("Hello, MDX World!\\n");
  return 0;
}
\`\`\`

## Using Variables and Expressions

You can use JavaScript expressions directly:

{2 + 3 === 5 ? 'Math still works!' : 'Uh oh, math is broken!'}

## Custom Callouts

> **Note:** This is a special callout that could be styled differently.

> **Warning:** This is a warning callout that could be highlighted in red.

## Tabs and Other Interactive Elements

You can create tabbed interfaces for showing different code examples or content sections.`;
          break;
        default:
          content = `# Documentation Not Found

Sorry, we couldn't find the documentation for "${category}/${slug}".

Please check the URL or browse the available documentation through the sidebar.`;
      }
    } else {
      content = `# Documentation Not Found

Sorry, we couldn't find the documentation for "${category}/${slug}".

Please check the URL or browse the available documentation through the sidebar.`;
    }
    
    // Store in cache for future requests
    docCache[cacheKey] = content;
    
    return content;
  } catch (error) {
    console.error('Error loading doc content:', error);
    throw new Error(`Failed to load documentation for ${category}/${slug}`);
  }
}