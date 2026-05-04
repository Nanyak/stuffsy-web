import { useEffect, useState } from "react";
import { X, Download, FileText, FileVideo, FileImage, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileInfo } from "@/types/storage";
import { formatFileSize } from "@/lib/storageUtils";
import { T } from "@/lib/tokens";

const PDF_SIZE_LIMIT   = 50 * 1024 * 1024;          // 50 MB
const VIDEO_SIZE_LIMIT =  2 * 1024 * 1024 * 1024;   // 2 GB
const IMAGE_SIZE_LIMIT = 25 * 1024 * 1024;           // 25 MB

type PreviewType = 'pdf' | 'video' | 'image' | 'unsupported';

function getPreviewType(contentType: string): PreviewType {
  if (contentType.includes('pdf')) return 'pdf';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('image/')) return 'image';
  return 'unsupported';
}

function isTooLarge(file: FileInfo, type: PreviewType): boolean {
  if (type === 'pdf'   && file.size > PDF_SIZE_LIMIT)   return true;
  if (type === 'video' && file.size > VIDEO_SIZE_LIMIT) return true;
  if (type === 'image' && file.size > IMAGE_SIZE_LIMIT) return true;
  return false;
}

interface FilePreviewModalProps {
  file: FileInfo;
  onClose: () => void;
  onDownload: (key: string) => void;
  onGetPreviewUrl: (key: string) => Promise<string>;
}

export function FilePreviewModal({ file, onClose, onDownload, onGetPreviewUrl }: FilePreviewModalProps) {
  const fileName = file.key.split('/').pop() || file.key;
  const previewType = getPreviewType(file.content_type);
  const tooLarge = isTooLarge(file, previewType);

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!tooLarge);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (tooLarge) return;
    setLoading(true);
    onGetPreviewUrl(file.key)
      .then(setUrl)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [file.key]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}
      >
        <div className="p-1.5 rounded-lg shrink-0" style={{ background: T.primaryBg }}>
          {previewType === 'video'
            ? <FileVideo className="h-4 w-4" style={{ color: T.primaryL }} />
            : previewType === 'image'
            ? <FileImage className="h-4 w-4" style={{ color: T.primaryL }} />
            : <FileText  className="h-4 w-4" style={{ color: T.primaryL }} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: T.textHi }}>{fileName}</p>
          <p className="text-xs" style={{ color: T.textLo }}>{formatFileSize(file.size)}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer gap-1.5 text-xs"
            style={{ color: T.primaryL, borderColor: '#333' }}
            onClick={() => onDownload(file.key)}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150"
            style={{ color: T.textLo }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#222'; (e.currentTarget as HTMLElement).style.color = T.textHi; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.textLo; }}
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        {tooLarge ? (
          <TooLargeState fileName={fileName} size={file.size} onDownload={() => onDownload(file.key)} />
        ) : loading ? (
          <div className="flex flex-col items-center gap-3" style={{ color: T.textLo }}>
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: T.primaryL }} />
            <p className="text-sm">Loading preview…</p>
          </div>
        ) : error ? (
          <ErrorState onDownload={() => onDownload(file.key)} />
        ) : url && previewType === 'pdf' ? (
          <iframe
            src={url}
            className="w-full h-full rounded-xl"
            style={{ maxWidth: '960px', background: '#fff' }}
            title={fileName}
          />
        ) : url && previewType === 'video' ? (
          <video
            src={url}
            controls
            autoPlay={false}
            className="max-w-full max-h-full rounded-xl"
            style={{ maxWidth: '960px', background: '#000' }}
          />
        ) : url && previewType === 'image' ? (
          <img
            src={url}
            alt={fileName}
            className="max-w-full max-h-full rounded-xl object-contain"
            style={{ maxWidth: '960px' }}
          />
        ) : null}
      </div>
    </div>
  );
}

function TooLargeState({ fileName, size, onDownload }: { fileName: string; size: number; onDownload: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(231,197,154,0.08)', border: '1px solid rgba(231,197,154,0.20)' }}>
        <AlertTriangle className="h-8 w-8" style={{ color: '#E7C59A' }} />
      </div>
      <div>
        <p className="font-semibold mb-1" style={{ color: T.textHi }}>File too large to preview</p>
        <p className="text-sm" style={{ color: T.textLo }}>
          <span style={{ color: T.textMid }}>{fileName}</span> is {formatFileSize(size)} — too large to display in the browser.
        </p>
      </div>
      <Button
        className="cursor-pointer gap-2"
        style={{ background: T.primary, color: '#fff' }}
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
        Download instead
      </Button>
    </div>
  );
}

function ErrorState({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.20)' }}>
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <p className="font-semibold mb-1" style={{ color: T.textHi }}>Preview unavailable</p>
        <p className="text-sm" style={{ color: T.textLo }}>Something went wrong loading this file. You can still download it.</p>
      </div>
      <Button
        className="cursor-pointer gap-2"
        style={{ background: T.primary, color: '#fff' }}
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
        Download instead
      </Button>
    </div>
  );
}
