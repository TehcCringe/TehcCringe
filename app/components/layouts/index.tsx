import { ArticleType as ArticleType } from "@/app/lib/articles"
import {
  ContainerCol,
  ContainerRow,
  LayoutCol,
  LayoutItem,
  LayoutRow,
} from "./components"

/**
 * The Neovim Layout
 *
 * AAA|BB
 * AAA|--
 * AAA|CC
 */
function NeovimLayout({ items }: { items: Array<ArticleType> }) {
  const [left, tr, br] = items

  return (
    <ContainerRow>
      <LayoutItem grow="two" size="lg" article={left} preview />
      <LayoutCol>
        <LayoutItem article={tr} />
        <LayoutItem article={br} />
      </LayoutCol>
    </ContainerRow>
  )
}

/**
 * Reverse Neovim Layout
 *
 * AAA|BB
 * AAA|--
 * AAA|CC
 */
function ReverseNeovimLayout({ items }: { items: Array<ArticleType> }) {
  const [tl, bl, right] = items

  return (
    <ContainerRow>
      <LayoutCol>
        <LayoutItem article={tl} />
        <LayoutItem article={bl} />
      </LayoutCol>
      <LayoutItem grow="two" size="lg" article={right} preview />
    </ContainerRow>
  )
}

/**
 * Quad Layout
 *
 * AA|BB
 * -----
 * CC|DD
 */
function QuadLayout({ items }: { items: Array<ArticleType> }) {
  const [tl, bl, tr, br] = items

  return (
    <ContainerCol>
      <LayoutRow>
        <LayoutItem article={tl} />
        <LayoutItem article={tr} />
      </LayoutRow>
      <LayoutRow>
        <LayoutItem article={bl} />
        <LayoutItem article={br} />
      </LayoutRow>
    </ContainerCol>
  )
}

/**
 * Side-by-side layout
 *
 * AAA|BBB
 */
function SideBySideLayout({ items }: { items: Array<ArticleType> }) {
  const [left, right] = items

  return (
    <ContainerRow>
      <LayoutItem article={left} size="md" preview />
      <LayoutItem article={right} size="md" preview />
    </ContainerRow>
  )
}

/**
 * Single article layout
 */
function SingleLayout({ items }: { items: Array<ArticleType> }) {
  const [left] = items

  return (
    <ContainerCol className="items-center">
      <LayoutItem article={left} />
    </ContainerCol>
  )
}

export const layoutComponents = {
  NeovimLayout,
  ReverseNeovimLayout,
  QuadLayout,
  SideBySideLayout,
  SingleLayout,
}

export type LayoutType = {
  Layout: keyof typeof layoutComponents
  itemCount: number
}

export const layouts: Array<LayoutType> = [
  {
    Layout: "NeovimLayout",
    itemCount: 3,
  },
  {
    Layout: "ReverseNeovimLayout",
    itemCount: 3,
  },
  {
    Layout: "QuadLayout",
    itemCount: 4,
  },
  {
    Layout: "SideBySideLayout",
    itemCount: 2,
  },
  {
    Layout: "SingleLayout",
    itemCount: 1,
  },
  // Added an additional SingleLayout to prevent an infinite loop
  {
    Layout: "SingleLayout",
    itemCount: 1,
  },
]
