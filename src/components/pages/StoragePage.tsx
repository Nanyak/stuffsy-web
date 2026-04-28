import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import { FileStagingArea } from "@/components/storage/FileStagingArea";
import { FileBrowser } from "@/components/storage/FileBrowser";
import type { StagedFile, FileInfo } from "@/types/storage";
import { uploadFile, listFiles, deleteFile, getDownloadUrl } from "@/services/storage_service";
import { generateFileId, createImagePreview, getFolderContents, KEEP_FILE } from "@/lib/storageUtils";

export function StoragePage() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [allFiles, setAllFiles] = useState<FileInfo[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { folders, files: currentFiles } = getFolderContents(allFiles, currentPath);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    return () => {
      stagedFiles.forEach((sf) => {
        if (sf.preview) URL.revokeObjectURL(sf.preview);
      });
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

      // webkitRelativePath is set for folder uploads
      const relPath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
      let uploadPath = currentFolderPath;
      let displayRelPath: string | undefined;

      if (relPath) {
        // relPath = "FolderName/subdir/file.ext" — preserve full structure
        const dirPart = relPath.split("/").slice(0, -1).join("/");
        uploadPath = currentFolderPath ? `${currentFolderPath}/${dirPart}` : dirPart;
        displayRelPath = relPath;
      }

      newStagedFiles.push({
        file,
        id,
        preview: preview || undefined,
        path: uploadPath || undefined,
        relativePath: displayRelPath,
      });
    }

    setStagedFiles((prev) => [...prev, ...newStagedFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.id !== id);
    });
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;
    setIsUploading(true);

    const batchSize = 3;
    const chunks = [];
    for (let i = 0; i < stagedFiles.length; i += batchSize) {
      chunks.push(stagedFiles.slice(i, i + batchSize));
    }

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (sf) => {
          try {
            setUploadProgress((prev) => ({ ...prev, [sf.id]: 0 }));
            await uploadFile(sf.file, sf.path);
            setUploadProgress((prev) => ({ ...prev, [sf.id]: 100 }));
          } catch {
            setUploadProgress((prev) => {
              const next = { ...prev };
              delete next[sf.id];
              return next;
            });
          }
        })
      );
    }

    setStagedFiles([]);
    setUploadProgress({});
    setIsUploading(false);
    await fetchFiles();
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await getDownloadUrl(key);
      window.open(response.url, "_blank");
    } catch {
      // silent
    }
  };

  const handleDelete = async (key: string) => {
    const fileName = key.split("/").pop() || key;
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    try {
      await deleteFile(key);
      await fetchFiles();
    } catch {
      // silent
    }
  };

  const handleOpenFolder = (name: string) => {
    setCurrentPath((prev) => [...prev, name]);
  };

  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
  };

  const handleDeleteFolder = async (name: string) => {
    if (!window.confirm(`Delete folder "${name}" and all its contents?`)) return;
    const folderPrefix = currentPath.length > 0
      ? `${currentPath.join("/")}/${name}/`
      : `${name}/`;
    const toDelete = allFiles.filter((f) => f.key.startsWith(folderPrefix));
    try {
      await Promise.all(toDelete.map((f) => deleteFile(f.key)));
      await fetchFiles();
    } catch {
      // silent
    }
  };

  const handleCreateFolder = async (name: string) => {
    const folderPath = currentPath.length > 0
      ? `${currentPath.join("/")}/${name}`
      : name;
    // Upload a zero-byte placeholder to persist the folder in S3
    const keepFile = new File([], KEEP_FILE, { type: "application/octet-stream" });
    await uploadFile(keepFile, folderPath);
    await fetchFiles();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page header */}
      <div className="relative pb-6 border-b border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 0% 50%, oklch(0.545 0.185 268 / 0.10) 0%, transparent 70%)',
        }} />
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{
            background: 'oklch(0.545 0.185 268 / 0.14)',
            border: '1px solid oklch(0.545 0.185 268 / 0.30)',
          }}>
            <Cloud className="h-7 w-7" style={{ color: 'oklch(0.545 0.185 268)' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              color: 'oklch(0.180 0.014 260)',
            }}>Cloud Storage</h1>
            <p className="text-sm mt-0.5 text-muted-foreground">Upload and manage your files securely in the cloud</p>
          </div>
        </div>
      </div>

      <FileStagingArea
        stagedFiles={stagedFiles}
        currentPath={currentPath}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onUploadAll={handleUploadAll}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      <div className="border-t border-border pt-8">
        <FileBrowser
          folders={folders}
          files={currentFiles}
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
  );
}
