import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StagedFile } from "@/types/storage";
import { getFileIcon, formatFileSize } from "@/lib/storageUtils";

const AMBER      = '#E7C59A'
const NEON_GREEN = '#00AC5C'
const TEXT_HI    = '#F3F3F3'
const TEXT_MID   = '#949494'
const SURFACE    = '#141414'
const BORDER     = '#333333'

interface StagedFileCardProps {
  stagedFile: StagedFile;
  onRemove: (id: string) => void;
  uploadProgress?: number;
}

export function StagedFileCard({ stagedFile, onRemove, uploadProgress }: StagedFileCardProps) {
  const { file, id, preview } = stagedFile;
  const isUploading = uploadProgress !== undefined;
  const isComplete = uploadProgress === 100;
  const FileIcon = getFileIcon(file.type);

  return (
    <div className="flex gap-4 relative p-4 rounded-xl transition-all duration-200" style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
    }}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-7 w-7 p-0 hover:bg-destructive hover:text-white transition-all duration-200 cursor-pointer"
        onClick={() => onRemove(id)}
        disabled={isUploading && !isComplete}
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>

      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
          style={{ border: `1px solid ${BORDER}` }}
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center rounded-xl flex-shrink-0" style={{
          background: 'rgba(231,197,154,0.08)',
          border: `1px solid ${BORDER}`,
        }}>
          <FileIcon className="h-7 w-7" style={{ color: AMBER }} />
        </div>
      )}

      <div className="flex-1 min-w-0 pr-8">
        <p className="font-semibold text-sm truncate" style={{ color: TEXT_HI, letterSpacing: '-0.011em' }}>{file.name}</p>
        <p className="text-xs mt-0.5" style={{ color: TEXT_MID }}>
          {formatFileSize(file.size)} · {file.type || 'Unknown type'}
        </p>

        {isUploading && (
          <div className="mt-2.5">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${uploadProgress}%`,
                  background: isComplete ? NEON_GREEN : AMBER,
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {isComplete ? (
                <>
                  <CheckCircle2 className="h-3 w-3" style={{ color: NEON_GREEN }} />
                  <p className="text-xs font-medium" style={{ color: NEON_GREEN }}>Upload complete</p>
                </>
              ) : (
                <p className="text-xs font-medium" style={{ color: AMBER }}>{uploadProgress}% uploaded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
