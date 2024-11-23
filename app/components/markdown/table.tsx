"use client";

import { styled } from "react-tailwind-variants"
import BlockBase from "./block"

export const Table = styled("table", {
  base: "w-full text-left text-sm border border-surface0",
})

export const THead = styled("thead", {
  base: "text-left text-xs",
})

export const TBody = styled("tbody", {
  base: "divide-y divide-surface0",
})

export const TR = styled(BlockBase("tr"), {
  base: "divide-x divide-surface0",
})

export const TH = styled("th", {
  base: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
})

export const TD = styled("td", {
  base: "px-4 py-2 whitespace-nowrap",
})
