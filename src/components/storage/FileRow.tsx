import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";

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
    <tr className="border-b hover:bg-primary/5 transition-colors duration-200 cursor-pointer group">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors duration-200">
            <FileIcon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors duration-200" />
          </div>
          <span className="font-medium text-sm text-slate-900 truncate max-w-xs" title={fileName}>
            {fileName}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">
        {formatFileSize(file.size)}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 capitalize">
        {fileType}
      </td>
      <td className="py-3 px-4 text-sm text-slate-500">
        {formattedDate}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
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
