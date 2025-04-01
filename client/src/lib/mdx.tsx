import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { components as mdxComponents } from '../components/mdx/index';

// Helper function to fetch MDX/Markdown content from a file path
export async function getDocContent(section: string, subsection?: string): Promise<string> {
  try {
    let filePath;
    if (subsection) {
      filePath = `/src/docs/${section}/${subsection}.mdx`;
    } else {
      filePath = `/src/docs/${section}/index.mdx`;
    }

    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load document at ${filePath}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading document file:', error);
    return '';
  }
}

// We're using ReactMarkdown instead of MDX bundler for browser compatibility
export async function parseMarkdown(source: string) {
  if (!source || source.trim() === '') {
    return { content: '' };
  }
  
  // Preprocess the MDX to convert custom component tags to React components
  const processedContent = processCustomComponents(source);

  // Return the processed content since ReactMarkdown will handle the parsing
  return { content: processedContent };
}

// Process custom component tags to make them compatible with ReactMarkdown
function processCustomComponents(content: string): string {
  // This is a simplistic approach - in a real implementation, we'd use a proper parser
  
  // First, let's handle self-closing custom components like <Alert />
  let processedContent = content.replace(
    /<(Alert|Card|Badge|Button|Tabs|TabsList|TabsTrigger|TabsContent)\s+([^>]*)\s*\/>/g,
    (match, component, props) => {
      return `\n\n<div data-custom-component="${component}" data-props="${encodeURIComponent(props)}"></div>\n\n`;
    }
  );
  
  // Now handle components with children - this is more complex and would be better with a proper parser
  const componentRegex = /<(Alert|Card|Badge|Button|Tabs|TabsList|TabsTrigger|TabsContent)\s+([^>]*)>([\s\S]*?)<\/\1>/g;
  processedContent = processedContent.replace(
    componentRegex,
    (match, component, props, children) => {
      return `\n\n<div data-custom-component="${component}" data-props="${encodeURIComponent(props)}">
${children}
</div>\n\n`;
    }
  );
  
  return processedContent;
}

interface MarkdownContentProps {
  content: string;
}

// Custom renderer for ReactMarkdown to handle special divs that represent our custom components
const CustomComponentRenderer = ({ node, ...props }: any) => {
  if (node.tagName === 'div' && node.properties['data-custom-component']) {
    const componentType = node.properties['data-custom-component'];
    const propsString = node.properties['data-props'] || '';
    const componentProps = parseProps(propsString);
    
    // Extract the content inside the div as the children prop
    const children = props.children;
    
    // Find the matching custom component
    const CustomComponent = mdxComponents[componentType as keyof typeof mdxComponents];
    
    if (CustomComponent) {
      return <CustomComponent {...componentProps}>{children}</CustomComponent>;
    }
    
    return <div>Unsupported component: {componentType}</div>;
  }
  
  // For normal divs, just render them normally
  return <div {...props} />;
};

// Helper to parse the props string into an object
function parseProps(propsString: string): Record<string, any> {
  if (!propsString) return {};
  
  try {
    const decoded = decodeURIComponent(propsString);
    const props: Record<string, any> = {};
    
    // Extract prop="value" pairs - this is simplistic and would be better with a proper parser
    const matches = decoded.matchAll(/(\w+)=["']([^"']*?)["']/g);
    for (const match of matches) {
      props[match[1]] = match[2];
    }
    
    return props;
  } catch (e) {
    console.error('Error parsing props:', e);
    return {};
  }
}

// Map our custom MDX components to React Markdown components
const getCustomComponents = () => {
  return {
    h1: mdxComponents.h1,
    h2: mdxComponents.h2,
    h3: mdxComponents.h3,
    h4: mdxComponents.h4,
    p: mdxComponents.p,
    a: mdxComponents.a,
    ul: mdxComponents.ul,
    ol: mdxComponents.ol,
    li: mdxComponents.li,
    blockquote: mdxComponents.blockquote,
    img: mdxComponents.img,
    pre: mdxComponents.pre,
    code: mdxComponents.code,
    table: mdxComponents.table,
    tr: mdxComponents.tr,
    th: mdxComponents.th,
    td: mdxComponents.td,
    div: CustomComponentRenderer,
  };
};

// Component to render Markdown content with our custom components
export function MDXContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <div>No content available</div>;
  }
  
  return (
    <div className="mdx-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={getCustomComponents()}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}