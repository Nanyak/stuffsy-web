import { Cloud } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="text-center py-20 rounded-2xl"
      style={{ background: '#080808', border: '1px solid #333333' }}
    >
      <Cloud
        className="h-12 w-12 mx-auto mb-4"
        style={{ color: '#949494' }}
      />
      <h3 style={{
        color: '#F3F3F3',
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
        letterSpacing: '-0.011em',
      }}>
        No files yet
      </h3>
      <p style={{ color: '#949494', fontSize: '14px' }}>
        Upload your first file to get started
      </p>
    </div>
  );
}
