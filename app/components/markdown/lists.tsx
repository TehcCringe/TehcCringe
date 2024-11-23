"use client";

import { styled } from "react-tailwind-variants"
import BlockBase from "./block"

export const UL = styled(BlockBase("ul"), {
  base: "list-disc list-inside",
})

export const OL = styled(BlockBase("ol"), {
  base: "list-decimal list-inside",
})

export const LI = styled("li", {
  base: "ml-4",
})
