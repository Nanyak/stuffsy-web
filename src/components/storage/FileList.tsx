import { FileRow } from "./FileRow";
import { FolderRow } from "./FolderRow";
import type { FileInfo } from "@/types/storage";

interface FileListProps {
  folders: string[];
  files: FileInfo[];
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onOpenFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileList({ folders, files, onDownload, onDelete, onOpenFolder, onDeleteFolder, onGetPreviewUrl, onPreview }: FileListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <tr>
            <th className="py-2.5 px-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
            <th className="py-2.5 px-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Size</th>
            <th className="py-2.5 px-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
            <th className="py-2.5 px-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Modified</th>
            <th className="py-2.5 px-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((name) => (
            <FolderRow
              key={`folder-${name}`}
              name={name}
              onOpen={onOpenFolder}
              onDelete={onDeleteFolder}
            />
          ))}
          {files.map((file) => (
            <FileRow
              key={file.key}
              file={file}
              onDownload={onDownload}
              onDelete={onDelete}
              onGetPreviewUrl={onGetPreviewUrl}
              onPreview={onPreview}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
