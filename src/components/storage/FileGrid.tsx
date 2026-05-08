import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";
import type { FileInfo } from "@/types/storage";

interface FileGridProps {
  folders: string[];
  files: FileInfo[];
  selectedFiles: Set<string>;
  selectedFolders: Set<string>;
  selectionActive: boolean;
  onSelectFile: (key: string) => void;
  onSelectFolder: (name: string) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onOpenFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileGrid({ folders, files, selectedFiles, selectedFolders, selectionActive, onSelectFile, onSelectFolder, onDownload, onDelete, onOpenFolder, onDeleteFolder, onGetPreviewUrl, onPreview }: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((name) => (
        <FolderCard
          key={`folder-${name}`}
          name={name}
          isSelected={selectedFolders.has(name)}
          selectionActive={selectionActive}
          onToggleSelect={onSelectFolder}
          onOpen={onOpenFolder}
          onDelete={onDeleteFolder}
        />
      ))}
      {files.map((file) => (
        <FileCard
          key={file.key}
          file={file}
          isSelected={selectedFiles.has(file.key)}
          selectionActive={selectionActive}
          onToggleSelect={onSelectFile}
          onDownload={onDownload}
          onDelete={onDelete}
          onGetPreviewUrl={onGetPreviewUrl}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
