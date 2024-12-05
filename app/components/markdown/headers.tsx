"use client"

import { forwardRef } from "react"
import { styled } from "react-tailwind-variants"

const HeaderBase = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const hLevel: `h${1 | 2 | 3 | 4 | 5 | 6}` = `h${level}`

  const header = forwardRef<HTMLHeadingElement, React.ComponentProps<"h1">>(
    ({ className, children, ...props }, ref) => {
      return (
        <h1 ref={ref} className={className} {...props}>
          {"#".repeat(level)} {children}
        </h1>
      )
    },
  )
  header.displayName = hLevel

  return header
}

export const H1 = styled(HeaderBase(1), {
  base: "text-4xl font-bold text-red",
})

export const H2 = styled(HeaderBase(2), {
  base: "text-3xl font-bold text-peach",
})

export const H3 = styled(HeaderBase(3), {
  base: "text-2xl font-bold text-yellow",
})

export const H4 = styled(HeaderBase(4), {
  base: "text-xl font-bold text-green",
})

export const H5 = styled(HeaderBase(5), {
  base: "text-lg font-bold text-blue",
})

export const H6 = styled(HeaderBase(6), {
  base: "font-bold text-lavender",
})
