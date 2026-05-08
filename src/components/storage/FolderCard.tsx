import { Folder, Trash2, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { T } from "@/lib/tokens";

interface FolderCardProps {
  name: string;
  isSelected: boolean;
  selectionActive: boolean;
  onToggleSelect: (name: string) => void;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderCard({ name, isSelected, selectionActive, onToggleSelect, onOpen, onDelete }: FolderCardProps) {
  const handleCardClick = () => {
    if (selectionActive) {
      onToggleSelect(name);
    }
  };

  return (
    <div
      className="interactive-card group p-4 rounded-2xl flex flex-col items-center text-center space-y-3 transition-all duration-200 hover:-translate-y-0.5 relative"
      style={{
        background: isSelected ? 'rgba(231,197,154,0.08)' : T.surface,
        border: isSelected ? '1px solid rgba(231,197,154,0.40)' : '1px solid #333333',
        cursor: selectionActive ? 'pointer' : 'default',
      }}
      onDoubleClick={() => !selectionActive && onOpen(name)}
      onClick={handleCardClick}
    >
      {/* Checkbox */}
      <button
        className="absolute top-2 left-2 z-10 transition-opacity duration-150 cursor-pointer"
        style={{ opacity: isSelected ? 1 : undefined }}
        onClick={(e) => { e.stopPropagation(); onToggleSelect(name); }}
        aria-label={isSelected ? `Deselect folder ${name}` : `Select folder ${name}`}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 group-hover:opacity-100"
          style={{
            opacity: isSelected ? 1 : 0,
            background: isSelected ? '#E7C59A' : 'rgba(0,0,0,0.55)',
            border: isSelected ? '1.5px solid #E7C59A' : '1.5px solid rgba(255,255,255,0.5)',
          }}
        >
          {isSelected && <Check className="h-3 w-3" style={{ color: '#101010' }} strokeWidth={3} />}
        </div>
      </button>

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
