import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderRowProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderRow({ name, onOpen, onDelete }: FolderRowProps) {
  return (
    <tr
      className="border-b border-border hover:bg-amber-400/5 transition-colors duration-150 cursor-pointer group"
      onDoubleClick={() => onOpen(name)}
    >
      <td className="py-3 px-4">
        <button
          className="flex items-center gap-3 w-full text-left cursor-pointer"
          onClick={() => onOpen(name)}
        >
          <div className="p-1.5 bg-amber-400/10 rounded-lg group-hover:bg-amber-400/20 transition-colors duration-150">
            <Folder className="h-5 w-5 text-amber-400" />
          </div>
          <span className="font-medium text-sm text-foreground flex items-center gap-1">
            {name}
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </span>
        </button>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">—</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">Folder</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">—</td>
      <td className="py-3 px-4">
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-destructive hover:text-white transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); onDelete(name); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
