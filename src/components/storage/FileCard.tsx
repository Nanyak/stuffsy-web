import { Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize, getFileIcon } from "@/lib/storageUtils";

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
    <Card className="p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group border-2 border-transparent bg-white">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-primary/10 transition-colors duration-200">
          <FileIcon className="h-10 w-10 text-slate-500 group-hover:text-primary transition-colors duration-200" />
        </div>

        <div className="w-full space-y-1">
          <p className="font-medium text-sm text-slate-900 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-slate-500">
            {formatFileSize(file.size)}
          </p>
          <p className="text-xs text-slate-400">
            {formattedDate}
          </p>
        </div>

        <div className="flex gap-2 w-full pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); onDownload(file.key); }}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); onDelete(file.key); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
