import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";
import type { FileInfo } from "@/types/storage";

interface FileGridProps {
  folders: string[];
  files: FileInfo[];
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onOpenFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileGrid({ folders, files, onDownload, onDelete, onOpenFolder, onDeleteFolder, onGetPreviewUrl, onPreview }: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((name) => (
        <FolderCard
          key={`folder-${name}`}
          name={name}
          onOpen={onOpenFolder}
          onDelete={onDeleteFolder}
        />
      ))}
      {files.map((file) => (
        <FileCard
          key={file.key}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
          onGetPreviewUrl={onGetPreviewUrl}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
