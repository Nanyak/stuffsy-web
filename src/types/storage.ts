// From existing storage_service.ts (re-exported for consistency)
export interface FileInfo {
  key: string
  size: number
  content_type: string
  last_modified: string
}

// New interfaces for staging workflow
export interface StagedFile {
  file: File
  id: string                    // Unique identifier for React keys
  preview?: string              // Data URL for image thumbnails
}

export interface FileAction {
  type: 'download' | 'delete'
  fileKey: string
}

export type ViewMode = 'grid' | 'list'

// Upload progress tracking
export interface UploadProgress {
  [fileId: string]: number      // 0-100 percentage
}
