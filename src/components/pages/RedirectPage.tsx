import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function RedirectPage() {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      window.location.replace(`${API_URL}/r/${code}`);
    }
  }, [code]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-slate-600">Redirecting...</p>
    </div>
  );
}
