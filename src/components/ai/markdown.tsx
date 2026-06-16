import React from "react";

// Renderer Markdown ringan untuk balasan chat (tanpa dependency eksternal).
// Mendukung: **tebal**, *miring*, `kode`, bullet (- / *), list bernomor, dan paragraf.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Pecah berdasarkan **tebal**, *miring*, dan `kode`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);

  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={key} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          style={{
            background: "#f1f5f9",
            borderRadius: 4,
            padding: "1px 5px",
            fontSize: "0.85em",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(
        <em key={key} style={{ fontStyle: "italic" }}>
          {part.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
    }
  });
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((it, i) => (
      <li key={i} style={{ marginBottom: 2 }}>
        {renderInline(it, `li-${key}-${i}`)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol
          key={key++}
          style={{ margin: "4px 0", paddingLeft: 20, listStyle: "decimal" }}
        >
          {items}
        </ol>
      ) : (
        <ul
          key={key++}
          style={{ margin: "4px 0", paddingLeft: 20, listStyle: "disc" }}
        >
          {items}
        </ul>
      )
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else if (ordered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={key++} style={{ margin: "0 0 4px" }}>
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flushList();

  return <>{blocks}</>;
}
