import { ArticleType, getAllArticles } from "./lib/articles"
import Flex from "./components/ui/flex"
import { paginationChunkSize } from "./lib/constants"
import Content from "./home/content"
import { getSponsorsForPage } from "./lib/sponsors"
import { LayoutType, layouts } from "./components/layouts"

export default async function Home() {
  const articles = getAllArticles()
  const byNewest = articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  const articleChunks: ArticleType[][] = []

  for (let i = 0; i < byNewest.length; i += paginationChunkSize) {
    articleChunks.push(byNewest.slice(i, i + paginationChunkSize))
  }

  // Get 2 sponsors for the homepage
  const sponsors = getSponsorsForPage(2)

  // Determine sponsor insertion points (roughly divide layoutChunks into thirds)
  const insertionPoints =
    articleChunks.length > 2
      ? [
          Math.floor(articleChunks.length / 3),
          Math.floor((articleChunks.length * 2) / 3),
        ]
      : [0]

  return (
    <Flex col align="center" className="bg-mantle">
      <Content
        chunks={articleChunks.map(createLayoutChunks)}
        sponsors={sponsors}
        sponsorInsertionPoints={insertionPoints}
      />
    </Flex>
  )
}

function createLayoutChunks(chunk: Array<ArticleType>) {
  let itemsUsed = 0
  const layoutChunks: Array<{ layout: LayoutType; items: ArticleType[] }> = []

  while (itemsUsed < chunk.length) {
    const remaining = chunk.length - itemsUsed

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

    const items = [...chunk]
      .slice(Math.max(0, itemsUsed))
      .slice(0, layout.itemCount)

    layoutChunks.push({ layout, items })
    itemsUsed += layout.itemCount
  }

  return layoutChunks
}
