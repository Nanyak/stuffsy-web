import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface UrlShortenerResponse {
    short_url: string;
}
export function urlShortenerService(longUrl: string){
    const apiUrl = `${API_URL}/url`;
    return axios.post<UrlShortenerResponse>(apiUrl, { long_url : longUrl })
}
