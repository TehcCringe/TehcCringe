"use client";

import { styled } from "react-tailwind-variants";
import BlockBase from "./block";

export const P = styled(BlockBase("p"), {
  base: "leading-relaxed",
})

export const A = styled("a", {
  base: "text-sapphire underline",
})
