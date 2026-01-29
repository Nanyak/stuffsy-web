import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import { FileStagingArea } from "@/components/storage/FileStagingArea";
import { FileBrowser } from "@/components/storage/FileBrowser";
import type { StagedFile, FileInfo } from "@/types/storage";
import { uploadFile, listFiles, deleteFile, getDownloadUrl } from "@/services/storage_service";
import { generateFileId, createImagePreview } from "@/lib/storageUtils";

export function StoragePage() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch uploaded files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      stagedFiles.forEach((stagedFile) => {
        if (stagedFile.preview) {
          URL.revokeObjectURL(stagedFile.preview);
        }
      });
    };
  }, [stagedFiles]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await listFiles();
      setUploadedFiles(response.files ?? []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setUploadedFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFiles = async (files: File[]) => {
    const newStagedFiles: StagedFile[] = [];

    for (const file of files) {
      const id = generateFileId();
      const preview = await createImagePreview(file);

      newStagedFiles.push({
        file,
        id,
        preview: preview || undefined,
      });
    }

    setStagedFiles((prev) => [...prev, ...newStagedFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((f) => f.id !== id);
    });

    // Remove progress tracking for this file
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromises = stagedFiles.map(async (stagedFile) => {
      try {
        // Simulate progress tracking (since uploadFile doesn't provide progress callback)
        setUploadProgress((prev) => ({ ...prev, [stagedFile.id]: 0 }));

        // Start upload
        await uploadFile(stagedFile.file);

        // Mark as complete
        setUploadProgress((prev) => ({ ...prev, [stagedFile.id]: 100 }));
      } catch (error) {
        console.error(`Failed to upload ${stagedFile.file.name}:`, error);
        // Remove failed file from progress
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[stagedFile.id];
          return newProgress;
        });
      }
    });

    // Upload all files in parallel (max 3 concurrent)
    const batchSize = 3;
    for (let i = 0; i < uploadPromises.length; i += batchSize) {
      const batch = uploadPromises.slice(i, i + batchSize);
      await Promise.all(batch);
    }

    // Clear staged files and refresh uploaded files list
    setStagedFiles([]);
    setUploadProgress({});
    setIsUploading(false);

    // Refresh the file list
    await fetchFiles();
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await getDownloadUrl(key);
      window.open(response.url, '_blank');
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleDelete = async (key: string) => {
    const fileName = key.split('/').pop() || key;
    const confirmed = window.confirm(`Are you sure you want to delete "${fileName}"?`);

    if (!confirmed) return;

    try {
      await deleteFile(key);
      await fetchFiles();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Cloud className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 font-heading">
            Cloud Storage
          </h1>
        </div>
        <p className="text-slate-600">
          Upload and manage your files securely in the cloud
        </p>
      </div>

      <FileStagingArea
        stagedFiles={stagedFiles}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onUploadAll={handleUploadAll}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      <div className="border-t border-slate-200 pt-8">
        <FileBrowser
          files={uploadedFiles}
          onDownload={handleDownload}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
