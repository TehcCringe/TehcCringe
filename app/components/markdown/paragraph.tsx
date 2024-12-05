"use client"

import { styled } from "react-tailwind-variants"

export const P = styled("p", {
  base: "leading-relaxed",
})

export const A = styled("a", {
  base: "text-sapphire underline",
})

export const Blockquote = styled("blockquote", {
  base: "border-l-4 border-surface1 bg-surface0 pl-4 pr-2 py-2 text-sm",
})

export const HR = styled("hr", {
  base: "border-b border-surface1 my-16 mx-auto max-w-[360px] w-full",
})
