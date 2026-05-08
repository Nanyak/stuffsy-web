import { useState, useEffect } from "react";
import { Download, Trash2, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";
import { T } from "@/lib/tokens";

const PREVIEWABLE = (ct: string) => ct.includes('pdf') || ct.startsWith('video/') || ct.startsWith('image/');

interface FileRowProps {
  file: FileInfo;
  isSelected: boolean;
  onToggleSelect: (key: string) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onGetPreviewUrl?: (key: string) => Promise<string>;
  onPreview?: (file: FileInfo) => void;
}

export function FileRow({ file, isSelected, onToggleSelect, onDownload, onDelete, onGetPreviewUrl, onPreview }: FileRowProps) {
  const FileIcon = getFileIcon(file.content_type);
  const fileName = file.key.split('/').pop() || file.key;
  const formattedDate = new Date(file.last_modified).toLocaleDateString();
  const fileType = file.content_type.split('/')[0] || 'file';
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
    <tr
      className="border-b border-border/60 transition-colors duration-150 group"
      style={{ background: isSelected ? 'rgba(91,141,239,0.06)' : undefined }}
    >
      <td className="py-3 pl-3 pr-1 w-10">
        <button
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          style={{
            background: isSelected ? '#5B8DEF' : 'transparent',
            border: isSelected ? '1.5px solid #5B8DEF' : '1.5px solid #555555',
          }}
          onClick={(e) => { e.stopPropagation(); onToggleSelect(file.key); }}
          aria-label={isSelected ? `Deselect ${fileName}` : `Select ${fileName}`}
        >
          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg overflow-hidden flex items-center justify-center shrink-0" style={{
            background: T.primaryBg,
            border: '1px solid var(--c-border-subtle)',
            width: '32px',
            height: '32px',
          }}>
            {previewUrl && isImage ? (
              <img src={previewUrl} alt={fileName} className="w-full h-full object-cover" />
            ) : previewUrl && isVideo ? (
              <video src={previewUrl} className="w-full h-full object-cover" muted preload="metadata" />
            ) : (
              <FileIcon className="h-4 w-4 m-1.5" style={{ color: T.primaryL }} />
            )}
          </div>
          <span className="font-medium text-sm truncate max-w-xs" title={fileName} style={{ color: T.textHi }}>
            {fileName}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{formatFileSize(file.size)}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{fileType}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{formattedDate}</td>
      <td className="py-3 px-4">
        <div className="flex gap-1 justify-end">
          {canPreview && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer transition-all duration-200"
              style={{ color: T.primaryL }}
              aria-label={`Preview ${fileName}`}
              onClick={(e) => { e.stopPropagation(); onPreview?.(file); }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer transition-all duration-200"
            style={{ color: T.primaryL }}
            aria-label={`Download ${fileName}`}
            onClick={(e) => { e.stopPropagation(); onDownload(file.key); }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-destructive hover:text-white transition-all duration-200"
            aria-label={`Delete ${fileName}`}
            onClick={(e) => { e.stopPropagation(); onDelete(file.key); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
