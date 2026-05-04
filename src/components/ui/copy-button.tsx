import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function CopyButton({ text, size = "sm", variant = "outline", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={`cursor-pointer transition-all duration-200 ${className}`}
      style={{
        background: copied ? '#00AC5C' : undefined,
        color: copied ? '#FFFFFF' : undefined,
        borderColor: copied ? '#00AC5C' : undefined,
      }}
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          Copy
        </>
      )}
    </Button>
  );
}
