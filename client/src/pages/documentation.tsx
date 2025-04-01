import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { useDarkMode } from '../hooks/use-dark-mode';
import { getDocContent, parseMarkdown, MDXContent } from '../lib/mdx';
import { useParams, useLocation } from 'wouter';
import { BookOpen, Network, Cpu, Database, ServerCrash, Layers, Timer, Code, ChevronRight, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { useToast } from '@/hooks/use-toast';

interface Subsection {
  id: string;
  label: string;
  path?: string;
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  expandable?: boolean;
  expanded?: boolean;
  subsections?: Subsection[];
}

interface Topic {
  id: string;
  label: string;
  category?: boolean;
  subsections: Section[];
}

const DEFAULT_SECTION = 'getting-started';

// Function to load markdown content using our new approach
async function loadMarkdownContent(section: string, subsection?: string) {
  try {
    const rawContent = await getDocContent(section, subsection);
    const { content } = await parseMarkdown(rawContent);
    return content || '';
  } catch (error) {
    console.error('Error loading markdown content:', error);
    return '';
  }
}

// Map of documentation structure
const documentationMap: Record<string, Topic> = {
  docs: {
    id: 'docs',
    label: 'Documentation',
    subsections: [
      {
        id: 'getting-started',
        label: 'Getting Started',
        icon: <BookOpen className="w-4 h-4" />,
        path: '/docs/getting-started',
      },
      {
        id: 'communication-protocols',
        label: 'Communication Protocols',
        icon: <Network className="w-4 h-4" />,
        path: '/docs/communication-protocols',
        expandable: true,
        subsections: [
          { id: 'uart', label: 'UART', path: '/docs/communication-protocols/uart' },
          { id: 'spi', label: 'SPI', path: '/docs/communication-protocols/spi' },
          { id: 'i2c', label: 'I2C', path: '/docs/communication-protocols/i2c' },
        ],
      },
      {
        id: 'data-structures',
        label: 'Data Structures',
        icon: <Database className="w-4 h-4" />,
        path: '/docs/data-structures',
        expandable: true,
        subsections: [
          { id: 'array', label: 'Arrays', path: '/docs/data-structures/array' },
          { id: 'linked-list', label: 'Linked Lists', path: '/docs/data-structures/linked-list' },
          { id: 'string', label: 'Strings', path: '/docs/data-structures/string' },
        ],
      },
      {
        id: 'microcontrollers',
        label: 'Microcontrollers',
        icon: <Cpu className="w-4 h-4" />,
        path: '/docs/microcontrollers',
      },
      {
        id: 'rtos',
        label: 'Real-Time OS',
        icon: <Timer className="w-4 h-4" />,
        path: '/docs/rtos',
      },
      {
        id: 'memory-management',
        label: 'Memory Management',
        icon: <Layers className="w-4 h-4" />,
        path: '/docs/memory-management',
      },
      {
        id: 'debugging',
        label: 'Debugging Techniques',
        icon: <ServerCrash className="w-4 h-4" />,
        path: '/docs/debugging',
      },
      {
        id: 'coding-standards',
        label: 'Coding Standards',
        icon: <Code className="w-4 h-4" />,
        path: '/docs/coding-standards',
      },
    ],
  },
};

// Expanded section tracking
const initialExpandedSections = documentationMap.docs.subsections
  .filter(section => section.expandable)
  .reduce((acc, section) => {
    acc[section.id] = false;
    return acc;
  }, {} as Record<string, boolean>);

const Documentation: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams<{ section?: string; subsection?: string }>();
  
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialExpandedSections);
  
  // Get current section and subsection from URL parameters
  const currentSection = params.section || DEFAULT_SECTION;
  const currentSubsection = params.subsection;
  
  // Find current section in the documentation map
  const currentSectionData = documentationMap.docs.subsections.find(
    section => section.id === currentSection
  );
  
  // Load markdown content when section or subsection changes
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const content = await loadMarkdownContent(currentSection, currentSubsection);
        if (content) {
          setMarkdownContent(content);
        } else {
          toast({
            title: 'Error loading document',
            description: `The document for ${currentSection}${currentSubsection ? `/${currentSubsection}` : ''} could not be loaded.`,
            variant: 'destructive',
          });
          setMarkdownContent('');
        }
      } catch (error) {
        console.error('Error loading document:', error);
        toast({
          title: 'Error loading document',
          description: 'There was a problem loading the document. Please try again.',
          variant: 'destructive',
        });
        setMarkdownContent('');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [currentSection, currentSubsection, toast]);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };
  
  // Navigate to a documentation page
  const navigateTo = (path: string) => {
    setLocation(path);
  };
  
  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Documentation', path: '/docs' },
    ];
    
    if (currentSection && currentSection !== DEFAULT_SECTION) {
      const sectionData = documentationMap.docs.subsections.find(
        s => s.id === currentSection
      );
      if (sectionData) {
        items.push({
          label: sectionData.label,
          path: sectionData.path || `/docs/${currentSection}`,
        });
      }
    }
    
    if (currentSubsection) {
      const sectionData = documentationMap.docs.subsections.find(
        s => s.id === currentSection
      );
      const subsectionData = sectionData?.subsections?.find(
        s => s.id === currentSubsection
      );
      if (subsectionData) {
        items.push({
          label: subsectionData.label,
          path: subsectionData.path || `/docs/${currentSection}/${currentSubsection}`,
        });
      }
    }
    
    return items;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} showSidebar={false}>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left sidebar */}
        <div className={`border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'} w-64 overflow-y-auto flex-shrink-0 hidden md:block`}>
          <ScrollArea className="h-full py-6 px-4">
            <div className="space-y-1">
              {documentationMap.docs.subsections.map((section: Section) => (
                <div key={section.id} className="mb-2">
                  <Button
                    variant={currentSection === section.id && !currentSubsection ? 'default' : 'ghost'}
                    className={`w-full justify-between ${
                      currentSection === section.id && !currentSubsection
                        ? 'bg-[#c2ee4a] text-black hover:bg-[#b8e248] hover:text-black'
                        : ''
                    }`}
                    onClick={() => {
                      if (section.expandable) {
                        toggleSection(section.id);
                      }
                      navigateTo(section.path || `/docs/${section.id}`);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {section.icon}
                      {section.label}
                    </span>
                    {section.expandable && (
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          expandedSections[section.id] ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </Button>
                  
                  {section.expandable && expandedSections[section.id] && section.subsections && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.subsections.map((subsection: Subsection) => (
                        <Button
                          key={subsection.id}
                          variant="ghost"
                          className={`w-full justify-start pl-6 ${
                            currentSection === section.id && 
                            currentSubsection === subsection.id
                              ? 'bg-[#c2ee4a] text-black hover:bg-[#b8e248] hover:text-black'
                              : ''
                          }`}
                          onClick={() => navigateTo(subsection.path || `/docs/${section.id}/${subsection.id}`)}
                        >
                          {subsection.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm mb-6">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => navigateTo(crumb.path)}
                  >
                    {index === 0 && <Home className="h-3 w-3 mr-1" />}
                    {crumb.label}
                  </Button>
                </React.Fragment>
              ))}
            </nav>
            
            <Separator className="mb-6" />
            
            {/* Markdown Content */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
                <MDXContent content={markdownContent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;