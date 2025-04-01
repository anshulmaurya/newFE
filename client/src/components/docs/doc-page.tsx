import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { loadDocContent } from "@/utils/docs-loader";
import { MarkdownRenderer } from "./markdown-renderer";
import { Loader2 } from "lucide-react";

interface DocPageProps {
  category: string;
  slug: string;
}

export function DocPage({ category, slug }: DocPageProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);
        const mdContent = await loadDocContent(category, slug);
        setContent(mdContent);
      } catch (err) {
        console.error("Failed to load document:", err);
        setError("Failed to load documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [category, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <MarkdownRenderer content={content} />
    </div>
  );
}

export function DocPageWithParams() {
  const params = useParams();
  const category = params.category || "getting-started";
  const slug = params.slug || "intro";

  return <DocPage category={category} slug={slug} />;
}