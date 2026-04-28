import { File as LucideFile, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FileInfo } from "@/types/storage";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function generateFileId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getFileIcon(mimeType: string): LucideIcon {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.startsWith('audio/')) return FileAudio;
  if (mimeType.startsWith('text/')) return FileText;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('tar') || mimeType.includes('gz')) return FileArchive;
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('html') || mimeType.includes('css')) return FileCode;
  return LucideFile;
}

export function createImagePreview(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) { resolve(null); return; }
    if (file.size > 5 * 1024 * 1024) { resolve(null); return; }
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export interface FolderContents {
  folders: string[];
  files: FileInfo[];
}

// KEEP_FILE is used to persist empty folders in S3
export const KEEP_FILE = '.stuffsy_keep';

export function getFolderContents(files: FileInfo[], currentPath: string[]): FolderContents {
  const prefix = currentPath.length > 0 ? currentPath.join('/') + '/' : '';
  const folderSet = new Set<string>();
  const currentFiles: FileInfo[] = [];

  for (const file of files) {
    if (prefix && !file.key.startsWith(prefix)) continue;
    const relativePath = file.key.slice(prefix.length);
    if (!relativePath) continue;
    const parts = relativePath.split('/');
    if (parts.length === 1) {
      if (parts[0] !== KEEP_FILE) currentFiles.push(file);
    } else {
      folderSet.add(parts[0]);
    }
  }

  return { folders: Array.from(folderSet).sort(), files: currentFiles };
}
