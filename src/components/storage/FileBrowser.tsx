import { useState, useRef } from "react";
import { ViewToggle } from "./ViewToggle";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { EmptyState } from "./EmptyState";
import { Breadcrumb } from "./Breadcrumb";
import type { FileInfo, ViewMode } from "@/types/storage";
import { FolderPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileBrowserProps {
  folders: string[];
  files: FileInfo[];
  currentPath: string[];
  onNavigate: (path: string[]) => void;
  onOpenFolder: (name: string) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onDeleteFolder: (name: string) => void;
  onCreateFolder: (name: string) => Promise<void>;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
  isLoading?: boolean;
}

export function FileBrowser({
  folders,
  files,
  currentPath,
  onNavigate,
  onOpenFolder,
  onDownload,
  onDelete,
  onDeleteFolder,
  onCreateFolder,
  onGetPreviewUrl,
  onPreview,
  isLoading,
}: FileBrowserProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setCreatingFolder(true);
    setNewFolderName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelCreate = () => {
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const confirmCreate = async () => {
    const name = newFolderName.trim().replace(/[/\\<>:"|?*]/g, "");
    if (!name) { cancelCreate(); return; }
    setIsCreating(true);
    await onCreateFolder(name);
    setIsCreating(false);
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmCreate();
    if (e.key === "Escape") cancelCreate();
  };

  const isEmpty = folders.length === 0 && files.length === 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8" />
        <div className="surface-card rounded-2xl overflow-hidden p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div style={{
                  height: '180px',
                  background: '#1a1a1a',
                  borderRadius: '16px',
                  border: '1px solid #333333',
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Breadcrumb path={currentPath} onNavigate={onNavigate} />
          {(folders.length > 0 || files.length > 0) && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {folders.length + files.length} item{folders.length + files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {creatingFolder ? (
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Folder name"
                className="h-8 w-40 text-sm"
                disabled={isCreating}
              />
              <Button
                size="sm"
                className="h-8 cursor-pointer"
                onClick={confirmCreate}
                disabled={isCreating || !newFolderName.trim()}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 cursor-pointer"
                onClick={cancelCreate}
                disabled={isCreating}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={startCreate}
              className="cursor-pointer gap-1.5"
            >
              <FolderPlus className="h-4 w-4" />
              New folder
            </Button>
          )}
          {!isEmpty && <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />}
        </div>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="surface-card rounded-2xl overflow-hidden">
          {viewMode === "grid" ? (
            <div className="p-4"><FileGrid
              folders={folders}
              files={files}
              onDownload={onDownload}
              onDelete={onDelete}
              onOpenFolder={onOpenFolder}
              onDeleteFolder={onDeleteFolder}
              onGetPreviewUrl={onGetPreviewUrl}
              onPreview={onPreview}
            /></div>
          ) : (
            <FileList
              folders={folders}
              files={files}
              onDownload={onDownload}
              onDelete={onDelete}
              onOpenFolder={onOpenFolder}
              onDeleteFolder={onDeleteFolder}
              onGetPreviewUrl={onGetPreviewUrl}
              onPreview={onPreview}
            />
          )}
        </div>
      )}
    </div>
  );
}
