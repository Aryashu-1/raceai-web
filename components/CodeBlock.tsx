"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export default function CodeBlock({ children }: any) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="
          absolute right-3 top-3 
          text-xs px-2 py-1 rounded-md 
          bg-muted hover:bg-accent 
          flex items-center gap-1
        "
      >
        <Copy size={12} />
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="overflow-auto">{children}</pre>
    </div>
  );
}
