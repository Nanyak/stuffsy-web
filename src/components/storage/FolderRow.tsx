import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIMARY   = 'oklch(0.545 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'

interface FolderRowProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderRow({ name, onOpen, onDelete }: FolderRowProps) {
  return (
    <tr
      className="border-b border-border/60 transition-colors duration-150 cursor-pointer group hover:bg-[oklch(0.545_0.185_268_/_0.04)]"
      onDoubleClick={() => onOpen(name)}
    >
      <td className="py-3 px-4">
        <button
          className="flex items-center gap-3 w-full text-left cursor-pointer"
          onClick={() => onOpen(name)}
        >
          <div className="p-1.5 rounded-lg transition-colors duration-150" style={{
            background: 'oklch(0.545 0.185 268 / 0.09)',
            border: '1px solid oklch(0.545 0.185 268 / 0.20)',
          }}>
            <Folder className="h-4 w-4" style={{ color: PRIMARY }} />
          </div>
          <span className="font-semibold text-sm flex items-center gap-1" style={{ color: TEXT_HI }}>
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
