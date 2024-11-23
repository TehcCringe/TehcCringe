"use client";

import { styled } from "react-tailwind-variants";
import BlockBase from "./block";
import {
  ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import hljs from "highlight.js";

export const Pre = styled(BlockBase("pre"), {
  base: "text-sm bg-surface0 p-2",
});

export const Code = forwardRef<HTMLElement, ComponentProps<"code">>(
  ({ className, children, ...props }, ref) => {
    const codeRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => codeRef.current as HTMLElement, [codeRef]);

    useEffect(() => {
      if (codeRef.current && className?.includes("lang-")) {
        hljs.highlightElement(codeRef.current);

        // hljs won't reprocess the element unless this attribute is removed
        codeRef.current.removeAttribute("data-highlighted");
      }
    }, [className, children, ref]);

    return (
      <code
        ref={codeRef}
        className={twMerge("text-sm bg-surface0 px-1 py-0.5", className)}
        {...props}
      >
        {children}
      </code>
    );
  }
);

Code.displayName = "Code";
