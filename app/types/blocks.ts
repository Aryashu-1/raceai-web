export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: number; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language?: string; code: string }
  | { type: "latex"; latex: string; display?: boolean }
  | { type: "image"; alt: string; url: string }
  | { type: "video"; url: string; format?: string }
  | { type: "audio"; url: string; format?: string }
  | { type: "file"; url: string; name: string; size?: string }
  | { type: "link"; text: string; url: string };
