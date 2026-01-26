import { useState, useEffect, useRef } from 'react'
import { Upload, Download, Trash2, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadFile, listFiles, deleteFile, getDownloadUrl, type FileInfo } from '@/services/storage_service'

export function FileStorage() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      const response = await listFiles()
      setFiles(response.files || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const file = fileList[0]
    setUploadingFiles(prev => [...prev, file.name])

    try {
      await uploadFile(file)
      await fetchFiles()
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploadingFiles(prev => prev.filter(name => name !== file.name))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDownload = async (key: string) => {
    try {
      const response = await getDownloadUrl(key)
      window.open(response.url, '_blank')
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const handleDelete = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return
    }

    try {
      await deleteFile(key)
      await fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardContent className="p-8">
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 hover:border-primary hover:bg-slate-50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-slate-600">
              Upload any file to cloud storage
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadingFiles.map((fileName) => (
                <div key={fileName} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Uploading {fileName}...</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 font-heading">Your Files</h3>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-600">Loading files...</p>
            </CardContent>
          </Card>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <File className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">No files uploaded yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Upload your first file to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.key} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{file.key}</p>
                        <p className="text-sm text-slate-500">
                          {formatFileSize(file.size)} · {formatDate(file.last_modified)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file.key)}
                        className="cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.key)}
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
