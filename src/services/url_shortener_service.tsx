import axios from "axios";

interface UrlShortenerResponse {
    short_url: string;
}
export function urlShortenerService(longUrl: string){
    const apiUrl = `/url`;
    return axios.post<UrlShortenerResponse>(apiUrl, { long_url : longUrl })
}
