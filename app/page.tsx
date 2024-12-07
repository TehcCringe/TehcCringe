import { styled } from "react-tailwind-variants"
import ColumnLayout from "./components/layouts/column"
import Flex from "./components/ui/flex"
import { ArticleType, getAllArticles } from "./lib/articles"
import { layoutComponents, layouts, LayoutType } from "./components/layouts"

export default async function Home() {
  const articles = getAllArticles()

  const byNewest = articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  let itemsUsed = 0
  const layoutChunks: Array<{ layout: LayoutType; items: ArticleType[] }> = []

  while (itemsUsed < byNewest.length) {
    const remaining = byNewest.length - itemsUsed

    let availableLayouts = layouts.filter(layout => {
      if (layout.itemCount > remaining) {
        return false
      }

      if (
        layouts.indexOf(layout) ===
        layouts.indexOf(layoutChunks.at(-1)?.layout as LayoutType)
      ) {
        return false
      }

      return true
    })

    // Prefer layouts with more than one item, if possible
    if (
      remaining > 1 &&
      !availableLayouts.every(layout => layout.itemCount === 1)
    ) {
      availableLayouts = availableLayouts.filter(layout => layout.itemCount > 1)
    }

    // Choose an available layout at random
    const layout =
      availableLayouts[Math.floor(Math.random() * availableLayouts.length)]

    const items = [...byNewest]
      .slice(Math.max(0, itemsUsed))
      .slice(0, layout.itemCount)

    layoutChunks.push({ layout, items })
    itemsUsed += layout.itemCount
  }

  return (
    <Flex col align="center" className="bg-mantle">
      <ArticleContainer mode="desktop">
        {layoutChunks.map(({ layout, items }, i) => {
          const Component = layoutComponents[layout.Layout]

          return <Component key={i} items={items} />
        })}
      </ArticleContainer>
      <ArticleContainer mode="mobile">
        <ColumnLayout items={byNewest} />
      </ArticleContainer>
    </Flex>
  )
}

const ArticleContainer = styled("div", {
  base: "flex flex-col max-w-[1000px] bg-base divide-y-2 divide-crust",
  variants: {
    mode: {
      desktop: "max-md:hidden",
      mobile: "hidden max-md:flex",
    },
  },
})
