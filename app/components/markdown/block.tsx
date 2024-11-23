"use client";

import { useVimNavigable } from "@/app/hooks/use-vim-navigable";
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export default function BlockBase<T extends keyof HTMLElementTagNameMap>(
  Comp: T,
  renderChildren?: (children: React.ReactNode) => React.ReactNode
) {
  const component = forwardRef<HTMLElementTagNameMap[T], ComponentProps<T>>(
    ({ className, children, ...props }, ref) => {
      const { elementRef, handleKeyDown, handleFocus, isVisualMode } = useVimNavigable({
        ref,
      });

      return (
        // @ts-expect-error Shut up typescript
        <Comp
          // @ts-expect-error I know what I'm doing
          ref={elementRef}
          className={twMerge(
            "focus:outline outline-2 outline-surface2 outline-offset-8",
            isVisualMode ? "vim-visual" : "vim-normal",
            className,
          )}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          tabIndex={0}
          {...props}
        >
          {renderChildren ? renderChildren(children) : children}
        </Comp>
      );
    }
  );

  component.displayName = Comp;

  return component;
}
