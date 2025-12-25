import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="p-4 rounded-full bg-white/5 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold font-display mb-4">404 Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-xl">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
