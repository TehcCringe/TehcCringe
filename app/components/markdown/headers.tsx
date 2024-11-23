"use client";

import { styled } from "react-tailwind-variants";
import BlockBase from "./block";

export const H1 = styled(BlockBase("h1", (children) => <># {children}</>), {
  base: "text-4xl font-bold text-red",
});

export const H2 = styled(BlockBase("h2", (children) => <>## {children}</>), {
  base: "text-3xl font-bold text-peach",
});

export const H3 = styled(BlockBase("h3", (children) => <>### {children}</>), {
  base: "text-2xl font-bold text-yellow",
});

export const H4 = styled(BlockBase("h4", (children) => <>#### {children}</>), {
  base: "text-xl font-bold text-green",
});

export const H5 = styled(BlockBase("h5", (children) => <>##### {children}</>), {
  base: "text-lg font-bold text-blue",
});

export const H6 = styled(BlockBase("h6", (children) => <>###### {children}</>), {
  base: "font-bold text-lavender",
});

export const HR = styled("hr", {
  base: "border-b border-surface1 my-16 mx-auto max-w-[360px] w-full",
});
