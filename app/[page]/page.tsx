import { styled } from "react-tailwind-variants"
import ColumnLayout from "../components/layouts/column"
import Flex from "../components/ui/flex"
import { ArticleType, getAllArticles } from "../lib/articles"
import { layoutComponents, layouts, LayoutType } from "../components/layouts"
import Link from "next/link"
import SponsorBanner from "../components/sponsor-banner"
import { getSponsorsForPage } from "../lib/utils"

const paginationChunkAmount = 10

export default async function Home({ params }: { params: { page: string } }) {
  const articles = getAllArticles()
  const availableChunks = Math.floor(articles.length / paginationChunkAmount)
  const pageNumber = Number(params.page)

  const byNewest = articles
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(
      pageNumber * paginationChunkAmount,
      pageNumber * paginationChunkAmount + paginationChunkAmount,
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

  // Get 2 sponsors for the homepage
  const pageKey = `page-${params.page}`
  const sponsors = getSponsorsForPage(pageKey, 2)

  // Determine sponsor insertion points (roughly divide layoutChunks into thirds)
  const insertionPoints =
    layoutChunks.length > 2
      ? [
          Math.floor(layoutChunks.length / 3),
          Math.floor((layoutChunks.length * 2) / 3),
        ]
      : [0]

  return (
    <Flex col align="center" className="bg-mantle">
      <ArticleContainer mode="desktop">
        {layoutChunks.map(({ layout, items }, i) => {
          const Component = layoutComponents[layout.Layout]
          const shouldInsertSponsor =
            sponsors.length > 0 && insertionPoints.includes(i)
          const sponsorIndex = insertionPoints.indexOf(i)

          return (
            <Flex key={i} col width="full">
              <Component items={items} />
              {shouldInsertSponsor && sponsors[sponsorIndex] && (
                <SponsorBanner
                  sponsor={sponsors[sponsorIndex]}
                  position="homePage"
                />
              )}
            </Flex>
          )
        })}
      </ArticleContainer>
      <ArticleContainer mode="mobile">
        <ColumnLayout items={byNewest} />
        {sponsors.length > 0 && (
          <SponsorBanner sponsor={sponsors[0]} position="homePage" />
        )}
      </ArticleContainer>
      <Flex width="full" p={2} justify="center">
        <Flex width="full" gap={2} className="max-w-[480px]">
          <Flex grow noBasis asChild={pageNumber > 0 ? true : undefined} p={2}>
            {pageNumber > 0 && (
              <Link
                href={pageNumber === 1 ? `/` : `/${pageNumber - 1}`}
                className="text-left border border-surface0"
              >
                <Flex col gap={1} align="start">
                  <span className="text-sky">&lt; Previous</span>
                </Flex>
              </Link>
            )}
          </Flex>
          <Flex
            grow
            noBasis
            asChild={pageNumber < availableChunks - 1 ? true : undefined}
            p={2}
            justify="end"
          >
            {pageNumber < availableChunks - 1 && (
              <Link
                href={`/${pageNumber + 1}`}
                className="text-right border border-surface0"
              >
                <Flex col gap={1} align="end">
                  <span className="text-sky">Next &gt;</span>
                </Flex>
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export async function generateStaticParams() {
  const articles = getAllArticles()

  const chunks: Array<{ page: string }> = []
  const availableChunks = Math.floor(articles.length / paginationChunkAmount)

  for (let i = 1; i < availableChunks; i++) {
    chunks.push({ page: i.toString() })
  }

  return chunks
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
