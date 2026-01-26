import { FileCard } from "./FileCard";
import type { FileInfo } from "@/types/storage";

interface FileGridProps {
  files: FileInfo[];
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
}

export function FileGrid({ files, onDownload, onDelete }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.key}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
