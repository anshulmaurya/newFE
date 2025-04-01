import React from 'react';
import { useDarkMode } from '../../hooks/use-dark-mode';
import { Link, useLocation } from 'wouter';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, ExternalLinkIcon } from 'lucide-react';

// Custom components for MDX
export const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mt-10 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const [location] = useLocation();
    
    // Check if it's an internal link
    const isInternalLink = href?.startsWith('/') || href?.startsWith('#');
    
    if (isInternalLink && href?.startsWith('/')) {
      return (
        <Link href={href} {...props} className="font-medium text-primary hover:underline" />
      );
    }
    
    return (
      <a
        href={href}
        className="font-medium text-primary hover:underline inline-flex items-center gap-1"
        target={!isInternalLink ? "_blank" : undefined}
        rel={!isInternalLink ? "noopener noreferrer" : undefined}
        {...props}
      >
        {props.children}
        {!isInternalLink && <ExternalLinkIcon className="h-3 w-3" />}
      </a>
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="rounded-md my-8" alt={alt} {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <Separator className="my-8" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <Table className="my-6" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <TableRow {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <TableHead {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <TableCell {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    const { darkMode } = useDarkMode();
    return (
      <pre
        className={`my-6 rounded-lg p-4 overflow-x-auto ${
          darkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}
        {...props}
      />
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { darkMode } = useDarkMode();
    const isInlineCode = typeof props.children === 'string';
    
    if (isInlineCode) {
      return (
        <code
          className={`relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm ${
            darkMode 
              ? 'bg-gray-800 text-gray-200' 
              : 'bg-gray-100 text-gray-900'
          }`}
          {...props}
        />
      );
    }
    
    return (
      <code
        className="font-mono text-sm"
        {...props}
      />
    );
  },

  // Custom components
  Alert: ({ children, title, variant = "default" }: { 
    children: React.ReactNode; 
    title?: string;
    variant?: "default" | "warning" | "success"; 
  }) => {
    const icons = {
      default: <InfoIcon className="h-4 w-4" />,
      warning: <AlertTriangleIcon className="h-4 w-4" />,
      success: <CheckCircleIcon className="h-4 w-4" />
    };
    
    return (
      <Alert className="my-6" variant={variant as any}>
        {icons[variant]}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  },
  
  Badge: ({ children, variant = "default" }: { 
    children: React.ReactNode; 
    variant?: "default" | "secondary" | "outline" | "destructive"; 
  }) => (
    <Badge variant={variant} className="align-middle">{children}</Badge>
  ),
  
  Card: ({ children, title, description, footer }: { 
    children: React.ReactNode; 
    title?: string;
    description?: string;
    footer?: React.ReactNode;
  }) => (
    <Card className="my-6">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  ),
  
  Tabs: ({ children, defaultValue }: { 
    children: React.ReactNode; 
    defaultValue: string;
  }) => (
    <Tabs defaultValue={defaultValue} className="my-6">
      {children}
    </Tabs>
  ),
  
  TabsList: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <TabsList className="grid w-full grid-cols-2" {...props} />
  ),
  
  TabsTrigger: ({ children, value }: { 
    children: React.ReactNode; 
    value: string;
  }) => (
    <TabsTrigger value={value}>{children}</TabsTrigger>
  ),
  
  TabsContent: ({ children, value }: { 
    children: React.ReactNode; 
    value: string;
  }) => (
    <TabsContent value={value}>{children}</TabsContent>
  ),
  
  Button: ({ children, variant = "default", ...props }: React.ComponentProps<typeof Button>) => (
    <Button variant={variant} {...props}>{children}</Button>
  )
};