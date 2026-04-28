import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FolderCardProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderCard({ name, onOpen, onDelete }: FolderCardProps) {
  return (
    <Card
      className="p-4 hover:shadow-lg hover:border-amber-300 transition-all duration-200 cursor-pointer group border-2 border-transparent bg-white"
      onDoubleClick={() => onOpen(name)}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors duration-200">
          <Folder className="h-10 w-10 text-amber-500" />
        </div>
        <div className="w-full space-y-1">
          <p className="font-medium text-sm text-slate-900 truncate" title={name}>
            {name}
          </p>
          <p className="text-xs text-slate-400">Folder</p>
        </div>
        <div className="flex gap-2 w-full pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-xs gap-1"
            onClick={(e) => { e.stopPropagation(); onOpen(name); }}
          >
            Open
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); onDelete(name); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
