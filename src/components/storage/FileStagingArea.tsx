import { useRef, useState } from "react";
import { Upload, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StagedFile } from "@/types/storage";
import { StagedFileCard } from "./StagedFileCard";

interface FileStagingAreaProps {
  stagedFiles: StagedFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onUploadAll: () => void;
  isUploading: boolean;
  uploadProgress: Record<string, number>;
}

export function FileStagingArea({
  stagedFiles,
  onAddFiles,
  onRemoveFile,
  onUploadAll,
  isUploading,
  uploadProgress,
}: FileStagingAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onAddFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-slate-300 hover:border-primary hover:bg-slate-50'
          }
        `}
      >
        <div className={`p-4 bg-slate-100 rounded-full inline-block mb-4 transition-colors duration-200 ${isDragging ? 'bg-primary/20' : ''}`}>
          <Upload className={`h-8 w-8 transition-colors duration-200 ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
        </div>
        <p className="text-slate-700 font-medium mb-1">
          Drag and drop files here
        </p>
        <p className="text-slate-500 text-sm mb-4">
          or click to browse your computer
        </p>
        <Button
          variant="outline"
          onClick={(e) => { e.stopPropagation(); handleButtonClick(); }}
          disabled={isUploading}
          className="cursor-pointer"
        >
          Select Files
        </Button>
      </div>

      {stagedFiles.length > 0 && (
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''} ready to upload
            </p>
            <Button
              onClick={onUploadAll}
              disabled={isUploading || stagedFiles.length === 0}
              className="cursor-pointer transition-all duration-200"
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload All'}
            </Button>
          </div>

          <div className="space-y-2">
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
