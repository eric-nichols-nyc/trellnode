import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BoardNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground">Board not found.</p>
      <Button asChild variant="outline">
        <Link href="/boards">Back to boards</Link>
      </Button>
    </div>
  );
}
