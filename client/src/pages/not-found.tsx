import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[rgb(24,24,26)]">
      <Card className="w-full max-w-md mx-4 bg-[rgb(18,18,20)] border-[rgb(214,251,65)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[rgb(214,251,65)]" />
            <h1 className="text-2xl font-bold text-gray-300">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
