import axios from "axios";


export interface FileInfo {
  key: string;
  size: number;
  content_type: string;
  last_modified: string;
}

export interface UploadResponse {
  key: string;
}

export interface ListResponse {
  files: FileInfo[];
}

export interface PresignedURLResponse {
  url: string;
  expires_at: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = `/files`;
  const response = await axios.post<UploadResponse>(apiUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function listFiles(prefix?: string): Promise<ListResponse> {
  const apiUrl = `/files`;
  const response = await axios.get<ListResponse>(apiUrl, {
    params: prefix ? { prefix } : "",
  });
  return response.data;
}

export async function deleteFile(key: string): Promise<void> {
  const apiUrl = `/files/${encodeURIComponent(key)}`;
  await axios.delete(apiUrl);
}

export async function getDownloadUrl(key: string): Promise<PresignedURLResponse> {
  const apiUrl = `/files/${encodeURIComponent(key)}/url`;
  const response = await axios.get<PresignedURLResponse>(apiUrl);
  return response.data;
}
