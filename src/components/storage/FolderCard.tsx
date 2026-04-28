import { Folder, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const SURFACE   = 'oklch(1 0 0)'
const BORDER    = 'rgba(0,0,0,0.07)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.25)'

interface FolderCardProps {
  name: string;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

export function FolderCard({ name, onOpen, onDelete }: FolderCardProps) {
  return (
    <div
      className="group p-4 rounded-2xl flex flex-col items-center text-center space-y-3 cursor-pointer transition-all duration-200"
      style={{ background: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      onDoubleClick={() => onOpen(name)}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${BORDER_EM}`
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = `1px solid ${BORDER}`
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      <div className="p-3 rounded-xl transition-colors duration-200" style={{
        background: 'oklch(0.545 0.185 268 / 0.09)',
        border: `1px solid ${BORDER_EM}`,
      }}>
        <Folder className="h-9 w-9" style={{ color: PRIMARY }} />
      </div>
      <div className="w-full space-y-0.5">
        <p className="font-semibold text-sm truncate" title={name} style={{ color: TEXT_HI }}>{name}</p>
        <p className="text-xs" style={{ color: TEXT_LO }}>Folder</p>
      </div>
      <div className="flex gap-2 w-full pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer transition-all duration-200 text-xs gap-1"
          style={{ color: PRIMARY_L }}
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
  );
}
