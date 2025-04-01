import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Book,
  Cpu,
  Layers,
  Settings,
  MessageSquare,
  Code,
  ChevronDown,
  ChevronRight,
  FileCode,
  Search,
  FileText,
  GitBranch,
  Download,
  GitMerge,
  Layout,
  Boxes,
  LinkIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DocLink {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

interface DocCategory {
  name: string;
  title: string;
  icon: React.ReactNode;
  docs: DocLink[];
}

export function DocsSidebar() {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "getting-started": true, // Open by default
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Main categories with GitBook-style organization
  const categories: DocCategory[] = [
    {
      name: "getting-started",
      title: "GETTING STARTED",
      icon: <Book className="h-5 w-5" />,
      docs: [
        { title: "GitBook Documentation", path: "/docs/getting-started/intro", icon: <FileText className="h-4 w-4 mr-2" /> },
        { title: "Quickstart", path: "/docs/getting-started/setup", icon: <Settings className="h-4 w-4 mr-2" /> },
        { title: "Importing content", path: "/docs/getting-started/interview-tips", icon: <Download className="h-4 w-4 mr-2" /> },
        { 
          title: "GitHub & GitLab Sync", 
          path: "/docs/getting-started/github-sync", 
          icon: <GitBranch className="h-4 w-4 mr-2" />
        },
      ],
    },
    {
      name: "creating-content",
      title: "CREATING CONTENT",
      icon: <FileText className="h-5 w-5" />,
      docs: [
        { 
          title: "Formatting your content", 
          path: "/docs/creating-content/formatting", 
          icon: <FileText className="h-4 w-4 mr-2" />
        },
        { 
          title: "Content structure", 
          path: "/docs/creating-content/structure", 
          icon: <Layout className="h-4 w-4 mr-2" />
        },
        { 
          title: "Blocks", 
          path: "/docs/creating-content/blocks", 
          icon: <Boxes className="h-4 w-4 mr-2" />
        },
        { 
          title: "Reusable content", 
          path: "/docs/creating-content/reusable", 
          icon: <FileCode className="h-4 w-4 mr-2" />
        },
        { 
          title: "Broken links", 
          path: "/docs/creating-content/broken-links", 
          icon: <LinkIcon className="h-4 w-4 mr-2" />
        },
        { 
          title: "Searching content", 
          path: "/docs/creating-content/search", 
          icon: <Search className="h-4 w-4 mr-2" />
        },
      ],
    },
    {
      name: "communication-protocols",
      title: "COMMUNICATION PROTOCOLS",
      icon: <MessageSquare className="h-5 w-5" />,
      docs: [
        { title: "UART", path: "/docs/communication-protocols/uart" },
        { title: "I2C", path: "/docs/communication-protocols/i2c" },
        { title: "SPI", path: "/docs/communication-protocols/spi" },
        { title: "CAN", path: "/docs/communication-protocols/can" },
      ],
    },
    {
      name: "data-structures",
      title: "DATA STRUCTURES",
      icon: <Layers className="h-5 w-5" />,
      docs: [
        { title: "Linked Lists", path: "/docs/data-structures/linked-list" },
        { title: "Queues", path: "/docs/data-structures/queue" },
        { title: "Circular Buffers", path: "/docs/data-structures/circular-buffer" },
      ],
    },
    {
      name: "memory-management",
      title: "MEMORY MANAGEMENT",
      icon: <Cpu className="h-5 w-5" />,
      docs: [
        { title: "Stack vs Heap", path: "/docs/memory-management/stack-vs-heap" },
        { title: "Memory Allocation", path: "/docs/memory-management/allocation" },
        { title: "Memory Leaks", path: "/docs/memory-management/leaks" },
      ],
    },
    {
      name: "rtos-concepts",
      title: "RTOS CONCEPTS",
      icon: <Settings className="h-5 w-5" />,
      docs: [
        { title: "Tasks & Scheduling", path: "/docs/rtos-concepts/tasks" },
        { title: "Semaphores", path: "/docs/rtos-concepts/semaphores" },
        { title: "Mutexes", path: "/docs/rtos-concepts/mutexes" },
        { title: "Message Queues", path: "/docs/rtos-concepts/queues" },
      ],
    },
    {
      name: "debugging-techniques",
      title: "DEBUGGING TECHNIQUES",
      icon: <Code className="h-5 w-5" />,
      docs: [
        { title: "Debugging Tools", path: "/docs/debugging-techniques/tools" },
        { title: "Common Bugs", path: "/docs/debugging-techniques/common-bugs" },
        { title: "Optimization", path: "/docs/debugging-techniques/optimization" },
      ],
    },
    {
      name: "mdx-examples",
      title: "MDX EXAMPLES",
      icon: <FileCode className="h-5 w-5" />,
      docs: [
        { title: "Basic MDX", path: "/docs/mdx-examples/basic" },
      ],
    },
  ];

  return (
    <div className="w-64 h-[calc(100vh-60px)] overflow-y-auto border-r border-border bg-background flex flex-col">
      <div className="p-4">
        {/* Search box at the top */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search docs..."
            className="w-full py-2 pl-8 pr-2 rounded-md bg-muted/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">{category.title}</h3>
              <div className="space-y-1">
                {category.docs.map((doc) => {
                  const isActive = location === doc.path;
                  const hasIcon = !!doc.icon;
                  
                  if (doc.title === "GitHub & GitLab Sync") {
                    return (
                      <div key={doc.path}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between px-2 py-1.5 h-auto text-sm",
                            isActive ? "bg-accent text-accent-foreground" : ""
                          )}
                          onClick={() => toggleCategory(`${category.name}-sync`)}
                        >
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            <span>GitHub & GitLab Sync</span>
                          </div>
                          {expandedCategories[`${category.name}-sync`] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {expandedCategories[`${category.name}-sync`] && (
                          <div className="ml-6 mt-1 space-y-1 border-l border-muted pl-2">
                            <Link href="/docs/getting-started/github-sync/enable">
                              <a className="text-sm block py-1 px-2 hover:text-primary text-muted-foreground">
                                Enabling GitHub Sync
                              </a>
                            </Link>
                            <Link href="/docs/getting-started/github-sync/gitlab">
                              <a className="text-sm block py-1 px-2 hover:text-primary text-muted-foreground">
                                Enabling GitLab Sync
                              </a>
                            </Link>
                            <Link href="/docs/getting-started/github-sync/config">
                              <a className="text-sm block py-1 px-2 hover:text-primary text-muted-foreground">
                                Content configuration
                              </a>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  if (doc.title === "Formatting your content" || doc.title === "Content structure" || doc.title === "Searching content") {
                    return (
                      <div key={doc.path}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between px-2 py-1.5 h-auto text-sm",
                            isActive ? "bg-accent text-accent-foreground" : ""
                          )}
                          onClick={() => toggleCategory(`${category.name}-${doc.title.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <div className="flex items-center gap-2">
                            {doc.icon}
                            <span>{doc.title}</span>
                          </div>
                          {expandedCategories[`${category.name}-${doc.title.toLowerCase().replace(/\s+/g, '-')}`] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  }
                  
                  return (
                    <Link key={doc.path} href={doc.path}>
                      <a
                        className={cn(
                          "text-sm flex items-center py-1.5 px-2 rounded-md hover:text-primary",
                          isActive
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {hasIcon ? doc.icon : null}
                        {doc.title}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}