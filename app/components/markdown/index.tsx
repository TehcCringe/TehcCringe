import Markdown from "markdown-to-jsx";
import { H1, H2, H3, H4, H5, H6, HR } from "./headers";
import { Image } from "./image";
import { Code, Pre } from "./code";
import { LI, OL, UL } from "./lists";
import { P } from "./paragraph";
import { Table, TBody, TD, TH, THead, TR } from "./table";
import { A } from "./link";
import { Blockquote } from "./blockquote";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H4,
          h5: H5,
          h6: H6,
          hr: HR,
          img: Image,
          code: Code,
          pre: Pre,
          ul: UL,
          ol: OL,
          li: LI,
          p: P,
          table: Table,
          thead: THead,
          tbody: TBody,
          tr: TR,
          th: TH,
          td: TD,
          a: A,
          blockquote: Blockquote,
        },
      }}
      className="flex flex-col gap-4"
    >
      {children}
    </Markdown>
  );
}
