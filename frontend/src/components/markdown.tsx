// Lightweight Markdown renderer — no extra deps. Handles ##, **bold**, *italic*, lists, paragraphs.
import { Fragment, type ReactNode } from "react";

function inline(text: string) {
  const parts: ReactNode[] = [];
  let i = 0;
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > i) parts.push(text.slice(i, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3])
      parts.push(
        <em key={key++} className="text-muted-foreground">
          {m[3]}
        </em>,
      );
    else if (m[4])
      parts.push(
        <code key={key++} className="rounded bg-muted px-1 py-0.5 text-sm">
          {m[4]}
        </code>,
      );
    i = m.index + m[0].length;
  }
  if (i < text.length) parts.push(text.slice(i));
  return parts;
}

export function Markdown({ children }: { children: string }) {
  const lines = children.split("\n");
  const blocks: ReactNode[] = [];
  let listBuf: string[] = [];
  let key = 0;
  const flushList = () => {
    if (listBuf.length) {
      blocks.push(
        <ul
          key={key++}
          className="my-3 space-y-1.5 pl-5 list-disc marker:text-primary"
        >
          {listBuf.map((l, i) => (
            <li key={i}>{inline(l)}</li>
          ))}
        </ul>,
      );
      listBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^##\s+/.test(line)) {
      flushList();
      blocks.push(
        <h3
          key={key++}
          className="mt-5 mb-2 font-display text-xl text-foreground"
        >
          {inline(line.replace(/^##\s+/, ""))}
        </h3>,
      );
    } else if (/^#\s+/.test(line)) {
      flushList();
      blocks.push(
        <h2 key={key++} className="mt-6 mb-2 font-display text-2xl">
          {inline(line.replace(/^#\s+/, ""))}
        </h2>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^[-*]\s+/, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="my-2 leading-relaxed">
          {inline(line)}
        </p>,
      );
    }
  }
  flushList();
  return <Fragment>{blocks}</Fragment>;
}
