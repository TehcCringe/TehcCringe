"use client"

import { styled } from "react-tailwind-variants"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { ArticleFlatChunk, ArticleGroupChunk } from "./article-chunk"
import { SponsorType } from "../lib/sponsors"
import SponsorBanner from "../components/sponsor-banner"
import { LayoutGrouping } from "../components/layouts"

export default function Content({
  chunks,
  sponsors,
  sponsorInsertionPoints,
}: {
  chunks: LayoutGrouping[][]
  sponsors: Array<SponsorType>
  sponsorInsertionPoints: Array<number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [chunksLoaded, setChunksLoaded] = useState<LayoutGrouping[][]>([
    chunks[0],
  ])
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const resizeHandler = () => {
      setIsDesktop(window.innerWidth > 768)
    }

    resizeHandler()

    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, [])

  const tryLoadNextChunk = useCallback(() => {
    if (!canLoadMore || chunksLoaded.length === chunks.length) return

    setChunksLoaded(prev => [...prev, chunks[prev.length]])
    setCanLoadMore(false)
    setTimeout(() => {
      setCanLoadMore(true)
    }, 1000)
  }, [canLoadMore, chunks, chunksLoaded.length])

  useEffect(() => {
    const { current } = ref
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryLoadNextChunk()
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [tryLoadNextChunk])

  return (
    <Container>
      {chunksLoaded.map((chunk, i) => {
        const sponsorIndex = sponsorInsertionPoints.indexOf(i)
        const shouldInsertSponsor =
          sponsors.length > 0 && sponsorInsertionPoints.includes(i)
        const sponsor = sponsors.at(sponsorIndex)

        return (
          <Fragment key={`article-chunk-${i}`}>
            {isDesktop ? (
              <ArticleGroupChunk chunk={chunk} />
            ) : (
              <ArticleFlatChunk chunk={chunk} />
            )}
            {shouldInsertSponsor && sponsor && (
              <SponsorBanner sponsor={sponsor} position="homePage" />
            )}
          </Fragment>
        )
      })}
      <div ref={ref}></div>
    </Container>
  )
}

const Container = styled("div", {
  base: "flex flex-col max-w-[1000px] bg-base divide-y-2 divide-crust",
})
