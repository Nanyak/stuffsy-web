import { useState, useEffect } from "react";
import { Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";
import { T } from "@/lib/tokens";

const PREVIEWABLE = (ct: string) => ct.includes('pdf') || ct.startsWith('video/') || ct.startsWith('image/');

interface FileCardProps {
  file: FileInfo;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileCard({ file, onDownload, onDelete, onGetPreviewUrl, onPreview }: FileCardProps) {
  const FileIcon = getFileIcon(file.content_type);
  const fileName = file.key.split('/').pop() || file.key;
  const formattedDate = new Date(file.last_modified).toLocaleDateString();
  const isImage = file.content_type.startsWith('image/');
  const isVideo = file.content_type.startsWith('video/');
  const canPreview = PREVIEWABLE(file.content_type);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if ((isImage || isVideo) && onGetPreviewUrl) {
      onGetPreviewUrl(file.key).then(setPreviewUrl).catch(() => {});
    }
  }, [file.key]);

  return (
    <div
      className="interactive-card group p-4 rounded-2xl flex flex-col items-center text-center space-y-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: T.surface, border: '1px solid #333333', cursor: canPreview ? 'pointer' : 'default' }}
      onClick={() => canPreview && onPreview?.(file)}
    >
      <div className="relative w-full rounded-xl overflow-hidden transition-colors duration-200 flex items-center justify-center" style={{
        background: T.primaryBg,
        border: '1px solid var(--c-border-subtle)',
        height: '96px',
      }}>
        {previewUrl && isImage ? (
          <img src={previewUrl} alt={fileName} className="w-full h-full object-cover" />
        ) : previewUrl && isVideo ? (
          <video src={previewUrl} className="w-full h-full object-cover" muted preload="metadata" />
        ) : (
          <FileIcon className="h-9 w-9" style={{ color: T.primaryL }} />
        )}
        {canPreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <Eye className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="w-full space-y-0.5">
        <p className="font-semibold text-sm truncate" title={fileName} style={{ color: T.textHi, letterSpacing: '-0.011em' }}>{fileName}</p>
        <p className="text-xs" style={{ color: T.textLo }}>{formatFileSize(file.size)}</p>
        <p className="text-xs" style={{ color: T.textLo }}>{formattedDate}</p>
      </div>

      <div className="flex gap-2 w-full pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer transition-all duration-200"
          style={{ color: T.primaryL }}
          aria-label={`Download ${fileName}`}
          onClick={(e) => { e.stopPropagation(); onDownload(file.key); }}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200"
          aria-label={`Delete ${fileName}`}
          onClick={(e) => { e.stopPropagation(); onDelete(file.key); }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
