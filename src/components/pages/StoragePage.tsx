import { useState, useEffect, useMemo } from "react";
import { Cloud, HardDrive, FileText, FileImage, FileVideo, File, Upload, ChevronRight, Download, Trash2 } from "lucide-react";
import { FileStagingArea } from "@/components/storage/FileStagingArea";
import { FileBrowser } from "@/components/storage/FileBrowser";
import type { StagedFile, FileInfo } from "@/types/storage";
import { uploadFile, listFiles, deleteFile, getDownloadUrl } from "@/services/storage_service";
import { generateFileId, createImagePreview, getFolderContents, formatFileSize, getFileIcon, KEEP_FILE } from "@/lib/storageUtils";
import { Button } from "@/components/ui/button";

/* ── Design tokens ──────────────────────────────────────── */
const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_MID  = 'oklch(0.430 0.010 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const SURFACE   = 'oklch(1 0 0)'
const SURFACE2  = 'oklch(0.976 0.004 260)'
const BORDER    = 'rgba(0,0,0,0.07)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.25)'
const FONT_DISP = "'Syne', system-ui, sans-serif"

type FilterType = 'all' | 'documents' | 'images' | 'videos' | 'other'

const NAV_ITEMS: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all',       label: 'All Files',  icon: HardDrive  },
  { id: 'documents', label: 'Documents',  icon: FileText   },
  { id: 'images',    label: 'Images',     icon: FileImage  },
  { id: 'videos',    label: 'Videos',     icon: FileVideo  },
  { id: 'other',     label: 'Other',      icon: File       },
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

export function StoragePage() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [allFiles, setAllFiles] = useState<FileInfo[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');

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

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await listFiles();
      setAllFiles(response.files ?? []);
    } catch {
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
    const batchSize = 3;
    const chunks = [];
    for (let i = 0; i < stagedFiles.length; i += batchSize) chunks.push(stagedFiles.slice(i, i + batchSize));
    for (const chunk of chunks) {
      await Promise.all(chunk.map(async sf => {
        try {
          setUploadProgress(prev => ({ ...prev, [sf.id]: 0 }));
          await uploadFile(sf.file, sf.path);
          setUploadProgress(prev => ({ ...prev, [sf.id]: 100 }));
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
  };

  const handleDownload = async (key: string) => {
    try { const response = await getDownloadUrl(key); window.open(response.url, "_blank"); } catch { }
  };

  const handleDelete = async (key: string) => {
    const fileName = key.split("/").pop() || key;
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    try { await deleteFile(key); await fetchFiles(); } catch { }
  };

  const handleOpenFolder = (name: string) => setCurrentPath(prev => [...prev, name]);
  const handleNavigate  = (path: string[]) => setCurrentPath(path);

  const handleDeleteFolder = async (name: string) => {
    if (!window.confirm(`Delete folder "${name}" and all its contents?`)) return;
    const folderPrefix = currentPath.length > 0 ? `${currentPath.join("/")}/${name}/` : `${name}/`;
    const toDelete = allFiles.filter(f => f.key.startsWith(folderPrefix));
    try { await Promise.all(toDelete.map(f => deleteFile(f.key))); await fetchFiles(); } catch { }
  };

  const handleCreateFolder = async (name: string) => {
    const folderPath = currentPath.length > 0 ? `${currentPath.join("/")}/${name}` : name;
    const keepFile = new File([], KEEP_FILE, { type: "application/octet-stream" });
    await uploadFile(keepFile, folderPath);
    await fetchFiles();
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="relative overflow-hidden mb-8">
        <div className="relative py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: PRIMARY_L }}>Tool</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl flex-shrink-0" style={{
              background: 'oklch(0.545 0.185 268 / 0.10)',
              border: `1px solid ${BORDER_EM}`,
            }}>
              <Cloud className="h-7 w-7" style={{ color: PRIMARY }} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-2" style={{
                fontFamily: FONT_DISP,
                background: `linear-gradient(135deg, ${TEXT_HI} 0%, oklch(0.260 0.018 265) 50%, ${PRIMARY} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Cloud Storage
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>
                Upload, organize, and share your files securely in the cloud.
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: '1px', background: `linear-gradient(to right, ${BORDER_EM}, ${BORDER}, transparent)` }} />
      </div>

      {/* ── Body: sidebar + main ──────────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-48 shrink-0 sticky top-20">
          <div className="rounded-2xl overflow-hidden" style={{
            background: SURFACE2,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {/* Upload button */}
            <div className="p-3">
              <button
                onClick={() => setShowUpload(v => !v)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                style={{
                  background: PRIMARY,
                  color: 'white',
                  boxShadow: showUpload ? 'none' : '0 0 16px oklch(0.545 0.185 268 / 0.28)',
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Files
              </button>
            </div>

            {/* Nav */}
            <div className="px-2 pb-3 space-y-0.5">
              {NAV_ITEMS.map(item => {
                const isActive = filterType === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilterType(item.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left"
                    style={{
                      background: isActive ? 'oklch(0.545 0.185 268 / 0.10)' : 'transparent',
                      color: isActive ? PRIMARY_L : TEXT_MID,
                      border: isActive ? `1px solid ${BORDER_EM}` : '1px solid transparent',
                    }}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">

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
            <div className="rounded-2xl overflow-hidden" style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: TEXT_LO }}>Recent Files</p>
                <div className="space-y-1">
                  {recentFiles.map(f => {
                    const FileIcon = getFileIcon(f.content_type)
                    const name = f.key.split('/').pop() || f.key
                    return (
                      <div
                        key={f.key}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors duration-150"
                        style={{ background: 'rgba(0,0,0,0.01)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.545 0.185 268 / 0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                      >
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{
                          background: 'oklch(0.545 0.185 268 / 0.07)',
                          border: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          <FileIcon className="h-3.5 w-3.5" style={{ color: '#7C3AED' }} />
                        </div>
                        <span className="flex-1 text-sm truncate" style={{ color: TEXT_MID }}>{name}</span>
                        <span className="text-xs shrink-0" style={{ color: TEXT_LO }}>{formatFileSize(f.size)}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" style={{ color: PRIMARY_L }}
                            onClick={() => handleDownload(f.key)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer hover:bg-destructive hover:text-white transition-all"
                            onClick={() => handleDelete(f.key)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
