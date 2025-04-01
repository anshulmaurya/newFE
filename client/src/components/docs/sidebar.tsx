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

  const categories: DocCategory[] = [
    {
      name: "getting-started",
      title: "Getting Started",
      icon: <Book className="h-5 w-5" />,
      docs: [
        { title: "Introduction", path: "/docs/getting-started/intro" },
        { title: "Quick Setup", path: "/docs/getting-started/setup" },
        { title: "Interview Tips", path: "/docs/getting-started/interview-tips" },
      ],
    },
    {
      name: "communication-protocols",
      title: "Communication Protocols",
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
      title: "Data Structures",
      icon: <Layers className="h-5 w-5" />,
      docs: [
        { title: "Linked Lists", path: "/docs/data-structures/linked-list" },
        { title: "Queues", path: "/docs/data-structures/queue" },
        { title: "Circular Buffers", path: "/docs/data-structures/circular-buffer" },
      ],
    },
    {
      name: "memory-management",
      title: "Memory Management",
      icon: <Cpu className="h-5 w-5" />,
      docs: [
        { title: "Stack vs Heap", path: "/docs/memory-management/stack-vs-heap" },
        { title: "Memory Allocation", path: "/docs/memory-management/allocation" },
        { title: "Memory Leaks", path: "/docs/memory-management/leaks" },
      ],
    },
    {
      name: "rtos-concepts",
      title: "RTOS Concepts",
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
      title: "Debugging Techniques",
      icon: <Code className="h-5 w-5" />,
      docs: [
        { title: "Debugging Tools", path: "/docs/debugging-techniques/tools" },
        { title: "Common Bugs", path: "/docs/debugging-techniques/common-bugs" },
        { title: "Optimization", path: "/docs/debugging-techniques/optimization" },
      ],
    },
    {
      name: "mdx-examples",
      title: "MDX Examples",
      icon: <FileCode className="h-5 w-5" />,
      docs: [
        { title: "Basic MDX", path: "/docs/mdx-examples/basic" },
      ],
    },
  ];

  return (
    <div className="w-64 h-[calc(100vh-60px)] overflow-y-auto border-r border-border bg-background flex flex-col">
      <div className="p-4">
        <h2 className="font-semibold text-xl mb-4">Documentation</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-between px-2 py-1.5 h-auto text-base"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.title}</span>
                </div>
                {expandedCategories[category.name] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {expandedCategories[category.name] && (
                <div className="ml-8 mt-1 space-y-1">
                  {category.docs.map((doc) => {
                    const isActive = location === doc.path;
                    return (
                      <Link key={doc.path} href={doc.path}>
                        <a
                          className={cn(
                            "text-sm flex items-center py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {doc.title}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}