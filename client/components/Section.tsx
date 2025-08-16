import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: ReactNode;
  viewAllLink?: string;
  className?: string;
}

export function Section({
  title,
  children,
  viewAllLink,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
