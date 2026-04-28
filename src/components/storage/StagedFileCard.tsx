import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { StagedFile } from "@/types/storage";
import { getFileIcon, formatFileSize } from "@/lib/storageUtils";

interface StagedFileCardProps {
  stagedFile: StagedFile;
  onRemove: (id: string) => void;
  uploadProgress?: number;
}

export function StagedFileCard({ stagedFile, onRemove, uploadProgress }: StagedFileCardProps) {
  const { file, id, preview } = stagedFile;
  const isUploading = uploadProgress !== undefined;
  const FileIcon = getFileIcon(file.type);

  return (
    <Card className="p-4 flex gap-4 relative hover:shadow-sm transition-all duration-200 border border-border bg-card">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-7 w-7 p-0 hover:bg-destructive hover:text-white transition-all duration-200 cursor-pointer"
        onClick={() => onRemove(id)}
        disabled={isUploading}
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>

      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="w-16 h-16 object-cover rounded-lg border border-border"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-lg">
          <FileIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0 pr-8">
        <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
        </p>

        {isUploading && (
          <div className="mt-3">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-primary font-medium mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
      </div>
    </Card>
  );
}
