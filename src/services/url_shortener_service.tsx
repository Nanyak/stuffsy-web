import axios from "axios";

interface UrlShortenerResponse {
  short_url: string;
}

export interface LinkRecord {
  short_code: string;
  original_url: string;
  title: string;
  created_at: string;
}

interface GetUserLinksResponse {
  links: LinkRecord[];
}

export function urlShortenerService(longUrl: string) {
  return axios.post<UrlShortenerResponse>("/v1/api/url", { long_url: longUrl });
}

export function getUserLinks() {
  return axios.get<GetUserLinksResponse>("/v1/api/url");
}
