declare module 'react-markdown' {
  import * as React from 'react';

  interface ExtendedReactMarkdownOptions {
    children?: string;
    remarkPlugins?: any[];
    components?: any;
    className?: string;
    // Add any other props here as needed
  }

  export default function ReactMarkdown(
    props: React.PropsWithChildren<ExtendedReactMarkdownOptions>
  ): React.ReactElement;
}