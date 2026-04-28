import { FolderOpen, Upload } from "lucide-react";
import { T } from "@/lib/tokens";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{
        background: T.primaryBg,
        border: '1px solid var(--c-border-primary)',
      }}>
        <FolderOpen className="h-7 w-7" style={{ color: T.primary }} />
      </div>
      <p className="text-base font-semibold mb-1.5" style={{ color: T.textMid }}>No files here yet</p>
      <p className="text-sm flex items-center gap-1.5" style={{ color: T.textLo }}>
        <Upload className="h-3.5 w-3.5" style={{ color: T.primaryL }} />
        Upload files above to get started
      </p>
    </div>
  );
}
