"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Flex from "../components/ui/flex"
import { ArticleType } from "../lib/articles"
import { H1 } from "../components/markdown/headers"
import { styled } from "react-tailwind-variants"
import { useCallback, useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"

enum SortOrder {
  // Index of search term in article
  Relevance = "rel",
  // Date
  Oldest = "old",
  Newest = "new",
  // Alphabetical order based on title
  Alphabetical = "alpha",
  AlphabeticalDesc = "alphad",
}

export default function SearchContent({
  articles,
}: {
  articles: Array<ArticleType>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tagsInput, setTagsInput] = useState(
    decodeURIComponent(searchParams.get("tags") ?? ""),
  )

  const search = Object.fromEntries(searchParams.entries())

  const set = useCallback(
    (arg: Partial<{ q: string; tags: string; order: SortOrder }>) => {
      const url = new URL(window.location.href)

      for (const [key, value] of Object.entries(arg)) {
        if (String(value).length > 0) url.searchParams.set(key, String(value))
        else url.searchParams.delete(key)
      }

      router.push(url.pathname + url.search, { scroll: false })
    },
    [router],
  )

  const results = useMemo(() => {
    const tags = search.tags?.split(",") ?? []
    const sort = search.order ?? SortOrder.Relevance

    const fuse = new Fuse(articles, {
      keys: ["data.title", "data.tags"],
      shouldSort: sort === SortOrder.Relevance,
    })

    let allArticles = [...articles]

    if (search.q) {
      allArticles = fuse.search(search.q ?? "").map(r => r.item)
    }

    if (tags.length > 0) {
      allArticles = allArticles.filter(a =>
        tags.some(t => a.data.tags?.some(at => at.includes(t))),
      )
    }

    if (sort !== SortOrder.Relevance) {
      allArticles = allArticles.sort((a, b) => {
        if (sort === SortOrder.Oldest) {
          return (
            new Date(a.data.date).getTime() - new Date(b.data.date).getTime()
          )
        } else if (sort === SortOrder.Newest) {
          return (
            new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
          )
        } else if (sort === SortOrder.Alphabetical) {
          return a.data.title.localeCompare(b.data.title)
        } else {
          return b.data.title.localeCompare(a.data.title)
        }
      })
    }

    return allArticles
  }, [articles, search])

  useEffect(() => {
    const trimmed = tagsInput.trim()

    if (trimmed.length === 0) {
      set({ tags: "" })
      return
    }

    const split = trimmed
      .split(",")
      .map(s => s.trim())
      .filter(t => t.length > 0)

    if (split.length > 0) {
      set({ tags: split.join(",") })
    }
  }, [tagsInput, set])

  return (
    <Flex grow justify="center">
      <Flex col width="full" gap={4} className="max-w-[720px] p-4">
        <Flex col gap={4}>
          <Flex gap={2} align="center" justify="between">
            <H1>Search</H1>
            <Flex col gap={1}>
              <label className="text-sm" htmlFor="sort">
                Sort By
              </label>
              <Select
                value={search.order ?? SortOrder.Relevance}
                onChange={e => {
                  set({ order: e.target.value as SortOrder })
                }}
                name="sort"
              >
                <option value={SortOrder.Relevance}>Relevance</option>
                <option value={SortOrder.Oldest}>Oldest</option>
                <option value={SortOrder.Newest}>Newest</option>
                <option value={SortOrder.Alphabetical}>
                  Alphabetical (A-Z)
                </option>
                <option value={SortOrder.AlphabeticalDesc}>
                  Alphabetical (Z-A)
                </option>
              </Select>
            </Flex>
          </Flex>
          <Input
            placeholder="Search articles"
            value={search.q ?? ""}
            onChange={e => {
              set({ q: e.target.value ?? "" })
            }}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
          />
        </Flex>

        {results.map((article, i) => (
          <SearchedArticle key={i} article={article} />
        ))}
      </Flex>
    </Flex>
  )
}

function SearchedArticle({ article }: { article: ArticleType }) {
  return (
    <Flex gap={2}>
      <Flex col className="min-w-[160px] max-w-[160px]">
        <img
          src={`/assets/${article.slug}/cover.png`}
          alt={article.data.title}
          className="w-[160px] border border-surface0"
        />
      </Flex>
      <Flex col gap={1}>
        <SearchedArticleTitle>{article.data.title}</SearchedArticleTitle>
        {article.data.tags && (
          <p className="text-subtext0">
            Tags:{" "}
            {article.data.tags.map((tag, i) => (
              <>
                <span className="text-green" key={i}>
                  #{tag}
                </span>
                {i < article.data.tags!.length - 1 && " "}
              </>
            ))}
          </p>
        )}
      </Flex>
    </Flex>
  )
}

const SearchedArticleTitle = styled("h2", {
  base: "text-text font-bold text-lg",
})

const Input = styled("input", {
  base: "bg-surface0 text-text placeholder:text-subtext0 px-4 py-2 focus:outline-none focus:placeholder:text-sapphire",
})

const Select = styled("select", {
  base: "bg-surface0 text-text placeholder:text-subtext0 py-2 focus:outline-none focus:placeholder:text-sapphire",
})
