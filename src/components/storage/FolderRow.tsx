import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { T } from "@/lib/tokens";

interface FolderRowProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderRow({ name, onOpen, onDelete }: FolderRowProps) {
  return (
    <tr
      className="border-b border-border/60 transition-colors duration-150 cursor-pointer group hover:bg-[oklch(0.545_0.185_268_/_0.04)] dark:hover:bg-[oklch(0.630_0.190_268_/_0.06)]"
      onDoubleClick={() => onOpen(name)}
    >
      <td className="py-3 px-4">
        <button
          className="flex items-center gap-3 w-full text-left cursor-pointer"
          onClick={() => onOpen(name)}
          aria-label={`Open folder ${name}`}
        >
          <div className="p-1.5 rounded-lg" style={{
            background: T.primaryBg,
            border: '1px solid var(--c-border-primary)',
          }}>
            <Folder className="h-4 w-4" style={{ color: T.primary }} />
          </div>
          <span className="font-semibold text-sm flex items-center gap-1" style={{ color: T.textHi }}>
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
            aria-label={`Delete folder ${name}`}
            onClick={(e) => { e.stopPropagation(); onDelete(name); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
