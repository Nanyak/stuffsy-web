import { useState, useEffect, useMemo } from "react";
import { Cloud, HardDrive, FileText, FileImage, FileVideo, File as FileIcon, Upload, AlertCircle, X, CheckCircle2, Download, Trash2 } from "lucide-react";
import { FileStagingArea } from "@/components/storage/FileStagingArea";
import { FileBrowser } from "@/components/storage/FileBrowser";
import { FilePreviewModal } from "@/components/storage/FilePreviewModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { StagedFile, FileInfo } from "@/types/storage";
import { uploadFile, listFiles, deleteFile, getDownloadUrl } from "@/services/storage_service";
import { generateFileId, createImagePreview, getFolderContents, formatFileSize, getFileIcon, KEEP_FILE } from "@/lib/storageUtils";

type FilterType = 'all' | 'documents' | 'images' | 'videos' | 'other'

const NAV_ITEMS: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all',       label: 'All Files',  icon: HardDrive  },
  { id: 'documents', label: 'Documents',  icon: FileText   },
  { id: 'images',    label: 'Images',     icon: FileImage  },
  { id: 'videos',    label: 'Videos',     icon: FileVideo  },
  { id: 'other',     label: 'Other',      icon: FileIcon   },
]

function filterFiles(files: FileInfo[], filter: FilterType): FileInfo[] {
  if (filter === 'all') return files
  if (filter === 'documents') return files.filter(f =>
    f.content_type.startsWith('text/') ||
    f.content_type.includes('pdf') ||
    f.content_type.includes('word') ||
    f.content_type.includes('spreadsheet') ||
    f.content_type.includes('presentation')
  )
  if (filter === 'images') return files.filter(f => f.content_type.startsWith('image/'))
  if (filter === 'videos') return files.filter(f => f.content_type.startsWith('video/'))
  return files.filter(f =>
    !f.content_type.startsWith('text/') &&
    !f.content_type.startsWith('image/') &&
    !f.content_type.startsWith('video/') &&
    !f.content_type.includes('pdf')
  )
}

/* ── Notification banner ───────────────────────────────────── */
type Notification = { type: 'error' | 'success'; message: string }

/* ── Confirm dialog state ──────────────────────────────────── */
type ConfirmState = {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
}

export function StoragePage() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [allFiles, setAllFiles] = useState<FileInfo[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false, title: '', description: '', onConfirm: () => {},
  });
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);

  const { folders, files: currentFiles } = getFolderContents(allFiles, currentPath);
  const displayedFiles = filterFiles(currentFiles, filterType);

  const recentFiles = useMemo(() =>
    [...allFiles]
      .filter(f => !f.key.endsWith(KEEP_FILE))
      .sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())
      .slice(0, 5),
    [allFiles]
  );

  useEffect(() => { fetchFiles(); }, []);

  useEffect(() => {
    return () => {
      stagedFiles.forEach(sf => { if (sf.preview) URL.revokeObjectURL(sf.preview); });
    };
  }, [stagedFiles]);

  const notify = (type: Notification['type'], message: string, duration = 4000) => {
    setNotification({ type, message })
    if (duration > 0) setTimeout(() => setNotification(null), duration)
  }

  const openConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmState({ open: true, title, description, onConfirm })
  }

  const closeConfirm = () => setConfirmState(s => ({ ...s, open: false }))

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await listFiles();
      setAllFiles(response.files ?? []);
    } catch {
      notify('error', 'Failed to load files. Check your connection and try refreshing.')
      setAllFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFiles = async (files: File[]) => {
    const currentFolderPath = currentPath.join("/");
    const newStagedFiles: StagedFile[] = [];
    for (const file of files) {
      const id = generateFileId();
      const preview = await createImagePreview(file);
      const relPath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
      let uploadPath = currentFolderPath;
      let displayRelPath: string | undefined;
      if (relPath) {
        const dirPart = relPath.split("/").slice(0, -1).join("/");
        uploadPath = currentFolderPath ? `${currentFolderPath}/${dirPart}` : dirPart;
        displayRelPath = relPath;
      }
      newStagedFiles.push({ file, id, preview: preview || undefined, path: uploadPath || undefined, relativePath: displayRelPath });
    }
    setStagedFiles(prev => [...prev, ...newStagedFiles]);
    setShowUpload(true);
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter(f => f.id !== id);
    });
    setUploadProgress(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;
    setIsUploading(true);
    const total = stagedFiles.length
    let succeeded = 0
    const batchSize = 3;
    const chunks = [];
    for (let i = 0; i < stagedFiles.length; i += batchSize) chunks.push(stagedFiles.slice(i, i + batchSize));
    for (const chunk of chunks) {
      await Promise.all(chunk.map(async sf => {
        try {
          setUploadProgress(prev => ({ ...prev, [sf.id]: 0 }));
          await uploadFile(sf.file, sf.path);
          setUploadProgress(prev => ({ ...prev, [sf.id]: 100 }));
          succeeded++
        } catch {
          setUploadProgress(prev => { const next = { ...prev }; delete next[sf.id]; return next; });
        }
      }));
    }
    setStagedFiles([]);
    setUploadProgress({});
    setIsUploading(false);
    setShowUpload(false);
    await fetchFiles();
    if (succeeded === total) {
      notify('success', `${succeeded} file${succeeded !== 1 ? 's' : ''} uploaded successfully`)
    } else if (succeeded > 0) {
      notify('error', `${succeeded} of ${total} files uploaded — some failed. Please retry.`)
    } else {
      notify('error', 'Upload failed. Please check your connection and try again.')
    }
  };

  const handleDownload = async (key: string) => {
    try {
      const { url } = await getDownloadUrl(key);
      const blob = await fetch(url).then(r => r.blob());
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = key.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      notify('error', 'Failed to download file. Please try again.')
    }
  };

  const handleDelete = (key: string) => {
    const fileName = key.split("/").pop() || key;
    openConfirm(
      `Delete "${fileName}"?`,
      'This file will be permanently deleted and cannot be recovered.',
      async () => {
        closeConfirm()
        try {
          await deleteFile(key);
          await fetchFiles();
        } catch {
          notify('error', `Failed to delete "${fileName}". Please try again.`)
        }
      }
    )
  };

  const handleOpenFolder = (name: string) => setCurrentPath(prev => [...prev, name]);
  const handleNavigate  = (path: string[]) => setCurrentPath(path);

  const handleDeleteFolder = (name: string) => {
    openConfirm(
      `Delete folder "${name}"?`,
      'All files inside this folder will be permanently deleted.',
      async () => {
        closeConfirm()
        const folderPrefix = currentPath.length > 0 ? `${currentPath.join("/")}/${name}/` : `${name}/`;
        const toDelete = allFiles.filter(f => f.key.startsWith(folderPrefix));
        try {
          await Promise.all(toDelete.map(f => deleteFile(f.key)));
          await fetchFiles();
        } catch {
          notify('error', `Failed to delete folder "${name}". Please try again.`)
        }
      }
    )
  };

  const handleCreateFolder = async (name: string) => {
    const folderPath = currentPath.length > 0 ? `${currentPath.join("/")}/${name}` : name;
    const keepFile = new File([], KEEP_FILE, { type: "application/octet-stream" });
    try {
      await uploadFile(keepFile, folderPath);
      await fetchFiles();
    } catch {
      notify('error', `Failed to create folder "${name}". Please try again.`)
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="relative overflow-hidden mb-6">
        <div className="relative py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#949494' }}>Tool</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl flex-shrink-0" style={{
              background: 'rgba(231,197,154,0.08)',
              border: '1px solid rgba(231,197,154,0.20)',
            }}>
              <Cloud className="h-7 w-7" style={{ color: '#E7C59A' }} />
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight mb-2" style={{
                color: '#F3F3F3',
                letterSpacing: '-0.011em',
              }}>
                Cloud Storage
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: '#949494' }}>
                Upload, organize, and share your files securely in the cloud.
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: '1px', background: '#333333' }} />
      </div>

      {/* ── Notification banner ────────────────────────────── */}
      {notification && (
        <div
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
          className="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm"
          style={notification.type === 'error' ? {
            background: 'oklch(0.580 0.220 27 / 0.08)',
            border: '1px solid oklch(0.580 0.220 27 / 0.22)',
            color: 'var(--destructive)',
          } : {
            background: 'oklch(0.55 0.150 145 / 0.08)',
            border: '1px solid oklch(0.55 0.150 145 / 0.22)',
            color: 'oklch(0.38 0.120 145)',
          }}
        >
          {notification.type === 'error'
            ? <AlertCircle className="h-4 w-4 shrink-0" />
            : <CheckCircle2 className="h-4 w-4 shrink-0" />
          }
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-150"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Mobile filter pills (hidden on md+) ───────────── */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        {NAV_ITEMS.map(item => {
          const isActive = filterType === item.id
          return (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0"
              style={{
                background: isActive ? '#E7C59A' : '#080808',
                color: isActive ? '#101010' : '#949494',
                border: `1px solid ${isActive ? '#E7C59A' : '#333333'}`,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* ── Body: sidebar + main ──────────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-48 shrink-0 sticky top-20" aria-label="File type filter">
          <div className="rounded-2xl overflow-hidden" style={{
            background: '#080808',
            border: '1px solid #333333',
          }}>
            {/* Upload button */}
            <div className="p-3">
              <button
                onClick={() => setShowUpload(v => !v)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                style={{
                  background: '#333333',
                  color: '#FFFFFF',
                }}
                aria-expanded={showUpload}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Files
              </button>
            </div>

            {/* Nav */}
            <nav className="px-2 pb-3 space-y-0.5" aria-label="Filter files by type">
              {NAV_ITEMS.map(item => {
                const isActive = filterType === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilterType(item.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left"
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      background: isActive ? 'rgba(231,197,154,0.08)' : 'transparent',
                      color: isActive ? '#E7C59A' : '#949494',
                      border: isActive ? '1px solid rgba(231,197,154,0.20)' : '1px solid transparent',
                    }}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Mobile upload button - sticky at bottom */}
          <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
            <button
              onClick={() => setShowUpload(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg"
              style={{ background: '#333333', color: '#FFFFFF' }}
              aria-expanded={showUpload}
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </button>
          </div>

          {/* Upload staging area */}
          {showUpload && (
            <FileStagingArea
              stagedFiles={stagedFiles}
              currentPath={currentPath}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onUploadAll={handleUploadAll}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}

          {/* Recent Files — only at root with "all" filter */}
          {filterType === 'all' && currentPath.length === 0 && recentFiles.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #333333' }}>
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#949494', letterSpacing: '0.06em' }}>Recent Files</p>
                <div className="space-y-1" role="list" aria-label="Recent files">
                  {recentFiles.map(f => {
                    const FileIcon = getFileIcon(f.content_type)
                    const name = f.key.split('/').pop() || f.key
                    return (
                      <div
                        key={f.key}
                        role="listitem"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors duration-150"
                        style={{ cursor: 'default' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{
                          background: 'rgba(91,141,239,0.08)',
                          border: '1px solid #333333',
                        }}>
                          <FileIcon className="h-3.5 w-3.5" style={{ color: '#5B8DEF' }} />
                        </div>
                        <span className="flex-1 text-sm truncate" style={{ color: '#949494', letterSpacing: '-0.011em' }}>{name}</span>
                        <span className="text-xs shrink-0" style={{ color: '#949494' }}>{formatFileSize(f.size)}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                          <button
                            className="h-7 w-7 p-0 cursor-pointer rounded-md flex items-center justify-center transition-colors duration-150"
                            style={{ color: '#5B8DEF' }}
                            aria-label={`Download ${name}`}
                            onClick={() => handleDownload(f.key)}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="h-7 w-7 p-0 cursor-pointer rounded-md flex items-center justify-center transition-colors duration-150"
                            style={{ color: '#949494' }}
                            aria-label={`Delete ${name}`}
                            onClick={() => handleDelete(f.key)}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#dc2626'
                              e.currentTarget.style.color = '#FFFFFF'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = '#949494'
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* File browser */}
          <FileBrowser
            folders={folders}
            files={displayedFiles}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onOpenFolder={handleOpenFolder}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onDeleteFolder={handleDeleteFolder}
            onCreateFolder={handleCreateFolder}
            onGetPreviewUrl={async (key) => { const r = await getDownloadUrl(key); return r.url; }}
            onPreview={setPreviewFile}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── File preview modal ───────────────────────────── */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleDownload}
          onGetPreviewUrl={async (key) => { const r = await getDownloadUrl(key); return r.url; }}
        />
      )}

      {/* ── Confirm dialog ────────────────────────────────── */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
