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
}

export function FileList({ folders, files, onDownload, onDelete, onOpenFolder, onDeleteFolder }: FileListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Size</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Modified</th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
