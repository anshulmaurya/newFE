import { DocsSidebar } from "@/components/docs/sidebar";
import { DocPageWithParams } from "@/components/docs/doc-page";

export default function Documentation() {
  return (
    <div className="flex h-[calc(100vh-60px)]">
      <DocsSidebar />
      <div className="flex-1 overflow-y-auto">
        <DocPageWithParams />
      </div>
    </div>
  );
}