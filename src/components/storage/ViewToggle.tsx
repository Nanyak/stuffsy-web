import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/types/storage";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("grid")}
        aria-label="Grid view"
        className={`cursor-pointer transition-all duration-200 h-8 w-8 ${
          viewMode === "grid" ? "" : "hover:bg-muted/80"
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("list")}
        aria-label="List view"
        className={`cursor-pointer transition-all duration-200 h-8 w-8 ${
          viewMode === "list" ? "" : "hover:bg-muted/80"
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
