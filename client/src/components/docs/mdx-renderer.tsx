import React, { useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Loader2 } from 'lucide-react';

// Custom MDX components
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-6 mb-3 border-b pb-1" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4 leading-7" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-primary hover:underline"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-border" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-muted" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-border" {...props} />,
  th: (props: any) => <th className="px-4 py-2 text-left font-semibold" {...props} />,
  td: (props: any) => <td className="px-4 py-2" {...props} />,
  code: (props: any) => {
    const { className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    
    return match ? (
      <pre className="p-4 rounded-md bg-muted overflow-x-auto my-4">
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-muted px-1 py-0.5 rounded-md text-sm font-mono" {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: any) => <div {...props} />,
  inlineCode: (props: any) => (
    <code className="bg-muted px-1 py-0.5 rounded-md text-sm font-mono" {...props} />
  ),
};

interface MDXRendererProps {
  content: string;
  className?: string;
}

export function MDXRenderer({ content, className = '' }: MDXRendererProps) {
  const { isDarkMode } = useDarkMode();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function compileMDX() {
      try {
        setLoading(true);
        setError(null);

        // Compile MDX to React components
        const code = String(
          await compile(content, {
            outputFormat: 'function-body',
            development: process.env.NODE_ENV !== 'production',
            // Add any plugins if needed here
          })
        );

        // Create a component from the compiled code
        const scope = { ...runtime };
        const fn = new Function(...Object.keys(scope), `${code}; return MDXContent`);
        const MDXComponent = fn(...Object.values(scope));
        setComponent(() => MDXComponent);
      } catch (err) {
        console.error('Error compiling MDX:', err);
        setError('Failed to render documentation. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    compileMDX();
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  if (!Component) {
    return <div>No content available</div>;
  }

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </div>
  );
}