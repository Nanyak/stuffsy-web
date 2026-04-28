import { FolderOpen, Upload } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 bg-muted rounded-full mb-4">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold text-foreground mb-2">
        No files uploaded yet
      </p>
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <Upload className="h-4 w-4" />
        Upload files above to get started
      </p>
    </div>
  );
}
