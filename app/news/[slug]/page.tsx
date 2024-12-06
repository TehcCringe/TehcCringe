import { ArticleProvider } from "@/app/components/article-provider"
import MarkdownRenderer from "@/app/components/markdown"
import Flex from "@/app/components/ui/flex"
import { getAllArticles, getArticle } from "@/app/lib/articles"
import { cpSync } from "fs"
import { ArrowLeftIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { join } from "path"
import "./highlight.css"
import { H1 } from "@/app/components/markdown/headers"
import { A } from "@/app/components/markdown/paragraph"
import { Code } from "@/app/components/markdown/code"
import { Metadata } from "next"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = getArticle(slug)
  const allArticles = getAllArticles()

  const index = allArticles.findIndex(article => article.slug === slug)
  const prevArticle = allArticles[index - 1]
  const nextArticle = allArticles[index + 1]

  const image = await import(`@/articles/${slug}/cover.png`)

  return (
    <Flex col p={4} align="center">
      <Flex col gap={4} align="center" className="max-w-[720px]">
        <Flex row justify="between" width="full">
          <Link
            href="/"
            className="text-subtext0 flex gap-1 border-b border-subtext0 items-center"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </Flex>
        <H1>{article.data.title}</H1>

        <Flex col gap={2} width="full">
          {article.data.author && (
            <p>
              By{" "}
              <A href={article.data.author} target="_blank">
                {article.data.displayName ??
                  article.data.author.split("/").at(-1)}
              </A>
            </p>
          )}
          <p>
            Published{" "}
            <span className="text-peach">
              {article.data.date.toLocaleDateString()}
            </span>
          </p>
          {article.data.category && (
            <p>
              <span className="text-sm text-overlay2">
                @deprecated - use <Code>tags</Code> instead of{" "}
                <Code>category</Code>
              </span>
              <br />
              <span className="underline decoration-wavy decoration-red">
                Category
              </span>
              :{" "}
              <span className="text-maroon bg-surface0">
                [{article.data.category}]
              </span>
            </p>
          )}
          {article.data.tags && (
            <p>
              Tags:{" "}
              {article.data.tags.map((tag, i) => (
                <>
                  <span className="text-green bg-surface0" key={i}>
                    [#{tag}]
                  </span>
                  {i < article.data.tags!.length - 1 && " "}
                </>
              ))}
            </p>
          )}
        </Flex>

        <Image
          src={image.default}
          alt={article.data.title}
          width={1000}
          height={500}
          className="border border-surface0"
        />
        <ArticleProvider article={article}>
          <MarkdownRenderer>{article.content}</MarkdownRenderer>
        </ArticleProvider>

        <Flex width="full" gap={2}>
          <Flex grow noBasis asChild={prevArticle ? true : undefined} p={2}>
            {prevArticle && (
              <Link
                href={`/news/${prevArticle?.slug}`}
                className="text-left border border-surface0"
              >
                <Flex col gap={1} align="start">
                  <span className="text-sky">Previous</span>
                  <p className="text-lg font-semibold">
                    {prevArticle.data.title}
                  </p>
                </Flex>
              </Link>
            )}
          </Flex>
          <Flex grow noBasis asChild={nextArticle ? true : undefined} p={2}>
            {nextArticle && (
              <Link
                href={`/news/${nextArticle?.slug}`}
                className="text-right border border-surface0"
              >
                <Flex col gap={1} align="end">
                  <span className="text-sky">Next</span>
                  <p className="text-lg font-semibold">
                    {nextArticle.data.title}
                  </p>
                </Flex>
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const article = getArticle(slug)

  return {
    title: article.data.title,
    description: null,
    openGraph: {
      images: [`https://tehccringe.com/assets/${slug}/cover.png`],
    },
    twitter: {
      images: [`https://tehccringe.com/assets/${slug}/cover.png`],
    },
  }
}

export async function generateStaticParams() {
  const articles = getAllArticles()

  // Copy articles to public/assets at build time to ensure assets are available
  articles.forEach(article => {
    const assetDir = join(process.cwd(), "public", "assets", article.slug)
    const articleDir = join(process.cwd(), "articles", article.slug)

    cpSync(articleDir, assetDir, { recursive: true })
  })

  return articles.map(article => ({ slug: article.slug }))
}

export const dynamicParams = false
export const dynamic = "force-static"
