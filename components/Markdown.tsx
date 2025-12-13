"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock"

const markdownComponents = {
  code({ inline, children }: any) {
    if (inline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded-md text-primary">
          {children}
        </code>
      );
    }
    return <CodeBlock>{children}</CodeBlock>;
  }
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div
      className="
        chat-markdown 
        prose 
        prose-sm 
        dark:prose-invert 
        max-w-none

        prose-p:leading-relaxed
        prose-p:my-2
        prose-ul:my-2
        prose-li:my-0.5

        prose-strong:text-foreground
        prose-headings:text-foreground

        prose-pre:bg-muted 
        prose-pre:text-sm 
        prose-pre:p-4 
        prose-pre:rounded-xl
        prose-pre:border 
        prose-pre:border-border

        prose-code:text-primary
        prose-code:bg-muted/40
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:rounded-md
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
