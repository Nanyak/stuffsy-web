import axios from "axios";

export interface FileInfo {
  key: string;
  size: number;
  content_type: string;
  last_modified: string;
}

export interface UploadResponse {
  key: string;
  url?: string;
}

export interface ListResponse {
  files: FileInfo[];
}

export interface PresignedURLResponse {
  url: string;
  expires_at: string;
}

export async function uploadFile(file: File, path?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (path) {
    formData.append("path", path);
  }
  const response = await axios.post<UploadResponse>("/v1/api/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function listFiles(): Promise<ListResponse> {
  const response = await axios.get<ListResponse>("/v1/api/files");
  return response.data;
}

export async function deleteFile(key: string): Promise<void> {
  await axios.delete("/v1/api/files", { params: { key } });
}

export async function getDownloadUrl(key: string): Promise<PresignedURLResponse> {
  const response = await axios.get<PresignedURLResponse>("/v1/api/files/url", {
    params: { key },
  });
  return response.data;
}
