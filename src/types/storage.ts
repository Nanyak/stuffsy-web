export interface FileInfo {
  key: string
  size: number
  content_type: string
  last_modified: string
}

export interface FolderInfo {
  name: string
  path: string  // full path relative to user root, e.g. "documents/2024"
}

export interface StagedFile {
  file: File
  id: string
  preview?: string
  path?: string          // folder path to upload to (e.g. "documents/2024")
  relativePath?: string  // display path for folder uploads
}

export interface FileAction {
  type: 'download' | 'delete'
  fileKey: string
}

export type ViewMode = 'grid' | 'list'

export interface UploadProgress {
  [fileId: string]: number
}
