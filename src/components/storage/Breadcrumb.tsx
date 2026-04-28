import { ChevronRight, HardDrive } from "lucide-react";

interface BreadcrumbProps {
  path: string[];
  onNavigate: (path: string[]) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-0.5 text-sm flex-wrap">
      <button
        onClick={() => onNavigate([])}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
      >
        <HardDrive className="h-4 w-4" />
        <span>My Drive</span>
      </button>
      {path.map((segment, index) => (
        <span key={index} className="flex items-center gap-0.5">
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className={`px-2 py-1 rounded-md transition-colors duration-150 cursor-pointer max-w-[180px] truncate ${
              index === path.length - 1
                ? "text-foreground font-semibold pointer-events-none"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={segment}
          >
            {segment}
          </button>
        </span>
      ))}
    </nav>
  );
}
