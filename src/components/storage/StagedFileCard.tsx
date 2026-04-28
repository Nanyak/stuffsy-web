import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StagedFile } from "@/types/storage";
import { getFileIcon, formatFileSize } from "@/lib/storageUtils";

const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const SURFACE   = 'oklch(1 0 0)'
const BORDER    = 'rgba(0,0,0,0.07)'

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
    <div className="flex gap-4 relative p-4 rounded-xl transition-all duration-200" style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
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
          className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
          style={{ border: `1px solid ${BORDER}` }}
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0" style={{
          background: 'oklch(0.545 0.185 268 / 0.08)',
          border: '1px solid oklch(0.545 0.185 268 / 0.20)',
        }}>
          <FileIcon className="h-7 w-7" style={{ color: '#7C3AED' }} />
        </div>
      )}

      <div className="flex-1 min-w-0 pr-8">
        <p className="font-semibold text-sm truncate" style={{ color: TEXT_HI }}>{file.name}</p>
        <p className="text-xs mt-0.5" style={{ color: TEXT_LO }}>
          {formatFileSize(file.size)} · {file.type || 'Unknown type'}
        </p>

        {isUploading && (
          <div className="mt-2.5">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${uploadProgress}%`,
                  background: `linear-gradient(90deg, ${PRIMARY}, oklch(0.620 0.185 268))`,
                }}
              />
            </div>
            <p className="text-xs font-medium mt-1" style={{ color: PRIMARY_L }}>{uploadProgress}% uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
