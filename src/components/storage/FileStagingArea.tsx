import { useRef, useState } from "react";
import { Upload, CloudUpload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StagedFile } from "@/types/storage";
import { StagedFileCard } from "./StagedFileCard";

interface FileStagingAreaProps {
  stagedFiles: StagedFile[];
  currentPath: string[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onUploadAll: () => void;
  isUploading: boolean;
  uploadProgress: Record<string, number>;
}

export function FileStagingArea({
  stagedFiles,
  currentPath,
  onAddFiles,
  onRemoveFile,
  onUploadAll,
  isUploading,
  uploadProgress,
}: FileStagingAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone completely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    // Support folder drops via FileSystem API
    await Promise.all(items.map(async (item) => {
      const entry = item.webkitGetAsEntry?.();
      if (!entry) {
        const f = item.getAsFile();
        if (f) files.push(f);
        return;
      }
      if (entry.isFile) {
        const f = item.getAsFile();
        if (f) files.push(f);
      } else if (entry.isDirectory) {
        const dirFiles = await readDirectoryEntry(entry as FileSystemDirectoryEntry);
        files.push(...dirFiles);
      }
    }));

    if (files.length > 0) onAddFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onAddFiles(files);
    e.target.value = "";
  };

  const currentPathLabel = currentPath.length > 0 ? currentPath.join(" / ") : "My Drive";

  return (
    <div className="space-y-4">
      {/* Full-screen drag overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className="border-4 border-dashed rounded-3xl p-16 text-center animate-pulse"
            style={{
              borderColor: '#E7C59A',
              background: 'rgba(231, 197, 154, 0.1)',
              maxWidth: '600px',
            }}
          >
            <Upload className="h-20 w-20 mx-auto mb-6" style={{ color: '#E7C59A' }} />
            <p style={{ color: '#F3F3F3', fontSize: '24px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.011em' }}>
              Drop files here
            </p>
            <p style={{ color: '#949494', fontSize: '16px' }}>
              Upload to: <span style={{ color: '#E7C59A', fontWeight: 600 }}>{currentPathLabel}</span>
            </p>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer"
        style={{
          borderColor: '#333333',
          background: '#080808',
        }}
      >
        <div className="p-4 rounded-full inline-block mb-4" style={{ background: '#1a1a1a' }}>
          <Upload className="h-8 w-8" style={{ color: '#949494' }} />
        </div>
        <p style={{ color: '#F3F3F3', fontWeight: 500, marginBottom: '8px' }}>
          Drag and drop files or folders here
        </p>
        <p style={{ color: '#949494', fontSize: '14px', marginBottom: '4px' }}>
          or click to browse your computer
        </p>
        <p style={{ color: '#949494', fontSize: '12px', marginBottom: '16px' }}>
          Uploading to: <span style={{ color: '#F3F3F3', fontWeight: 500 }}>{currentPathLabel}</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            disabled={isUploading}
            className="cursor-pointer"
            style={{ borderColor: '#333333', color: '#949494' }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
            disabled={isUploading}
            className="cursor-pointer"
            style={{ borderColor: '#333333', color: '#949494' }}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Upload Folder
          </Button>
        </div>
      </div>

      {stagedFiles.length > 0 && (
        <div className="space-y-4 p-4 rounded-2xl" style={{ background: '#080808', border: '1px solid #333333' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: '#F3F3F3', letterSpacing: '-0.011em' }}>
              {stagedFiles.length} file{stagedFiles.length !== 1 ? "s" : ""} ready to upload
            </p>
            <Button
              onClick={onUploadAll}
              disabled={isUploading || stagedFiles.length === 0}
              className="cursor-pointer transition-all duration-200"
              style={{
                background: isUploading ? '#1a1a1a' : '#E7C59A',
                color: isUploading ? '#949494' : '#101010',
                border: 'none',
              }}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload All"}
            </Button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {stagedFiles.map((stagedFile) => (
              <StagedFileCard
                key={stagedFile.id}
                stagedFile={stagedFile}
                onRemove={onRemoveFile}
                uploadProgress={uploadProgress[stagedFile.id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function readDirectoryEntry(dirEntry: FileSystemDirectoryEntry): Promise<File[]> {
  const files: File[] = [];
  const reader = dirEntry.createReader();

  const readEntries = (): Promise<FileSystemEntry[]> =>
    new Promise((resolve) => reader.readEntries(resolve, () => resolve([])));

  let entries: FileSystemEntry[] = [];
  let batch: FileSystemEntry[];
  do {
    batch = await readEntries();
    entries = entries.concat(batch);
  } while (batch.length > 0);

  await Promise.all(entries.map(async (entry) => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject)
      );
      // Attach relative path info via a custom property
      Object.defineProperty(file, 'webkitRelativePath', {
        value: entry.fullPath.replace(/^\//, ''),
        writable: false,
      });
      files.push(file);
    } else if (entry.isDirectory) {
      const nested = await readDirectoryEntry(entry as FileSystemDirectoryEntry);
      files.push(...nested);
    }
  }));

  return files;
}
