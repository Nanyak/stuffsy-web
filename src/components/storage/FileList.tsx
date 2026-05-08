import { FileRow } from "./FileRow";
import { FolderRow } from "./FolderRow";
import type { FileInfo } from "@/types/storage";
import { Check } from "lucide-react";

interface FileListProps {
  folders: string[];
  files: FileInfo[];
  selectedFiles: Set<string>;
  selectedFolders: Set<string>;
  onSelectFile: (key: string) => void;
  onSelectFolder: (name: string) => void;
  onSelectAll: () => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onOpenFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileList({ folders, files, selectedFiles, selectedFolders, onSelectFile, onSelectFolder, onSelectAll, onDownload, onDelete, onOpenFolder, onDeleteFolder, onGetPreviewUrl, onPreview }: FileListProps) {
  const totalItems = folders.length + files.length;
  const totalSelected = selectedFiles.size + selectedFolders.size;
  const allSelected = totalItems > 0 && totalSelected === totalItems;
  const someSelected = totalSelected > 0 && !allSelected;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border/60">
          <tr>
            <th className="py-2.5 pl-3 pr-1 w-10">
              <button
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer"
                style={{
                  background: allSelected ? '#5B8DEF' : someSelected ? 'rgba(91,141,239,0.3)' : 'transparent',
                  border: allSelected || someSelected ? '1.5px solid #5B8DEF' : '1.5px solid #555555',
                }}
                onClick={onSelectAll}
                aria-label={allSelected ? 'Deselect all' : 'Select all'}
              >
                {allSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                {someSelected && <div className="w-2 h-0.5 rounded-full bg-white" />}
              </button>
            </th>
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
              isSelected={selectedFolders.has(name)}
              onToggleSelect={onSelectFolder}
              onOpen={onOpenFolder}
              onDelete={onDeleteFolder}
            />
          ))}
          {files.map((file) => (
            <FileRow
              key={file.key}
              file={file}
              isSelected={selectedFiles.has(file.key)}
              onToggleSelect={onSelectFile}
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
