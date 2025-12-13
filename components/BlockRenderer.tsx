"use client";

import { Block } from "@/app/types/blocks";

import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism";

// KaTeX
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-relaxed text-sm whitespace-pre-wrap">
          {block.text}
        </p>
      );

    case "heading":
      const levels: any = {
        1: "text-2xl font-bold",
        2: "text-xl font-semibold",
        3: "text-lg font-semibold",
        4: "text-base font-medium",
      };
      return (
        <h1 className={`${levels[block.level]} mt-3 mb-2`}>
          {block.text}
        </h1>
      );

    case "list":
      return block.ordered ? (
        <ol className="list-decimal ml-6 space-y-1 text-sm">
          {block.items.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc ml-6 space-y-1 text-sm">
          {block.items.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "latex":
      return block.display ? (
        <BlockMath math={block.latex} />
      ) : (
        <InlineMath math={block.latex} />
      );

    case "code":
      return (
        <div className="relative my-4">
          <button
            onClick={() => navigator.clipboard.writeText(block.code)}
            className="absolute top-2 right-2 bg-muted/40 px-2 py-1 text-xs rounded-md"
          >
            Copy
          </button>

          <SyntaxHighlighter
            language={block.language || "text"}
            style={nord}
            customStyle={{
              borderRadius: "12px",
              padding: "16px",
              fontSize: "13px",
            }}
          >
            {block.code}
          </SyntaxHighlighter>
        </div>
      );

    case "image":
      return (
        <img
          src={block.url}
          alt={block.alt}
          className="rounded-xl my-3 max-w-full"
        />
      );

    case "link":
      return (
        <a
          href={block.url}
          target="_blank"
          className="text-primary underline text-sm"
        >
          {block.text}
        </a>
      );

    default:
      return null;
  }
}
