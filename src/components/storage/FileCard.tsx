import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";
import { T } from "@/lib/tokens";

interface FileCardProps {
  file: FileInfo;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
}

export function FileCard({ file, onDownload, onDelete }: FileCardProps) {
  const FileIcon = getFileIcon(file.content_type);
  const fileName = file.key.split('/').pop() || file.key;
  const formattedDate = new Date(file.last_modified).toLocaleDateString();

  return (
    <div
      className="interactive-card group p-4 rounded-2xl flex flex-col items-center text-center space-y-3 cursor-default transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: T.surface, border: '1px solid #333333' }}
    >
      <div className="p-3 rounded-xl transition-colors duration-200" style={{
        background: T.primaryBg,
        border: '1px solid var(--c-border-subtle)',
      }}>
        <FileIcon className="h-9 w-9" style={{ color: T.primaryL }} />
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
