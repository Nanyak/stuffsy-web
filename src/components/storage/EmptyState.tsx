import { FolderOpen, Upload } from "lucide-react";

const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_MID  = 'oklch(0.430 0.010 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.25)'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{
        background: 'oklch(0.545 0.185 268 / 0.09)',
        border: `1px solid ${BORDER_EM}`,
      }}>
        <FolderOpen className="h-7 w-7" style={{ color: PRIMARY }} />
      </div>
      <p className="text-base font-semibold mb-1.5" style={{ color: TEXT_MID }}>No files here yet</p>
      <p className="text-sm flex items-center gap-1.5" style={{ color: TEXT_LO }}>
        <Upload className="h-3.5 w-3.5" style={{ color: PRIMARY_L }} />
        Upload files above to get started
      </p>
    </div>
  );
}
