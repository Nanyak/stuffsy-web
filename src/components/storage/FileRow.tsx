import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";

const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'

interface FileRowProps {
  file: FileInfo;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
}

export function FileRow({ file, onDownload, onDelete }: FileRowProps) {
  const FileIcon = getFileIcon(file.content_type);
  const fileName = file.key.split('/').pop() || file.key;
  const formattedDate = new Date(file.last_modified).toLocaleDateString();
  const fileType = file.content_type.split('/')[0] || 'file';

  return (
    <tr className="border-b border-border/60 transition-colors duration-150 cursor-pointer group hover:bg-[oklch(0.545_0.185_268_/_0.04)]">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg transition-colors duration-150" style={{
            background: 'oklch(0.545 0.185 268 / 0.07)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <FileIcon className="h-4 w-4" style={{ color: '#7C3AED' }} />
          </div>
          <span className="font-medium text-sm truncate max-w-xs" title={fileName} style={{ color: TEXT_HI }}>
            {fileName}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{formatFileSize(file.size)}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{fileType}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{formattedDate}</td>
      <td className="py-3 px-4">
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer transition-all duration-200"
            style={{ color: PRIMARY_L }}
            onClick={(e) => { e.stopPropagation(); onDownload(file.key); }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-destructive hover:text-white transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); onDelete(file.key); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
