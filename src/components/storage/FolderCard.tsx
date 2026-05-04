import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { T } from "@/lib/tokens";

interface FolderCardProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderCard({ name, onOpen, onDelete }: FolderCardProps) {
  return (
    <div
      className="interactive-card group p-4 rounded-2xl flex flex-col items-center text-center space-y-3 cursor-default transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: T.surface, border: '1px solid #333333' }}
      onDoubleClick={() => onOpen(name)}
    >
      <div className="p-3 rounded-xl transition-colors duration-200" style={{
        background: 'rgba(231,197,154,0.08)',
        border: '1px solid rgba(231,197,154,0.20)',
      }}>
        <Folder className="h-9 w-9" style={{ color: '#E7C59A' }} />
      </div>

      <div className="w-full space-y-0.5">
        <p className="font-semibold text-sm truncate" title={name} style={{ color: T.textHi, letterSpacing: '-0.011em' }}>{name}</p>
        <p className="text-xs" style={{ color: T.textLo }}>Folder</p>
      </div>

      <div className="flex gap-2 w-full pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer transition-all duration-200 text-xs gap-1"
          style={{ color: T.primaryL }}
          aria-label={`Open folder ${name}`}
          onClick={(e) => { e.stopPropagation(); onOpen(name); }}
        >
          Open
          <ChevronRight className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200"
          aria-label={`Delete folder ${name}`}
          onClick={(e) => { e.stopPropagation(); onDelete(name); }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
