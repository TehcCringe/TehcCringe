"use client";

import Markdown, { MarkdownToJSX } from "markdown-to-jsx";
import { H1, H2, H3, H4, H5, H6 } from "./headers";
import { Image } from "./image";
import { Code, Pre } from "./code";
import { LI, OL, UL } from "./lists";
import { P, A, Blockquote, HR } from "./paragraph";
import { Table, TBody, TD, TH, THead, TR } from "./table";

export default function MarkdownRenderer({
  children,
  overrides = {},
}: {
  children: string;
  overrides?: Partial<MarkdownToJSX.Overrides>;
}) {
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
          ...overrides,
        },
      }}
      className="flex flex-col gap-4"
    >
      {children}
    </Markdown>
  );
}
