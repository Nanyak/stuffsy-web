import { useState } from "react";
import { ViewToggle } from "./ViewToggle";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { EmptyState } from "./EmptyState";
import type { FileInfo, ViewMode } from "@/types/storage";
import { Loader2, FolderOpen } from "lucide-react";

interface FileBrowserProps {
  files: FileInfo[];
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  isLoading?: boolean;
}

export function FileBrowser({ files = [], onDownload, onDelete, isLoading }: FileBrowserProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm text-slate-500">Loading your files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 font-heading">
              Your Files
            </h2>
            {files.length > 0 && (
              <p className="text-sm text-slate-500">{files.length} file{files.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        {files.length > 0 && (
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        )}
      </div>

      {files.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {viewMode === "grid" ? (
            <FileGrid files={files} onDownload={onDownload} onDelete={onDelete} />
          ) : (
            <FileList files={files} onDownload={onDownload} onDelete={onDelete} />
          )}
        </div>
      )}
    </div>
  );
}
