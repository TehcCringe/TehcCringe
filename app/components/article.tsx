import Link from "next/link"
import { Article as ArticleType } from "../lib/articles"
import Flex from "./ui/flex"
import Image from "next/image"

export default async function Article({ article }: { article: ArticleType }) {
  const image = await import(`@/articles/${article.slug}/cover.png`)

  return (
    <Link href={`/news/${article.slug}`}>
      <Flex
        col
        className="overflow-hidden border border-surface1 max-w-[400px]"
      >
        <Flex p={4}>
          <Image
            src={image.default}
            alt={article.data.title}
            className="border border-surface1"
          />
        </Flex>
        <Flex col p={2} gap={1} className="bg-surface0">
          <p>
            <span className="text-green">
              {(article.data.tags?.[0] ?? "NEWS").toUpperCase()}
            </span>{" "}
            <span className="text-subtext0">{"•"}</span>{" "}
            <span className="text-subtext1">
              {article.data.date.toLocaleDateString()}
            </span>
          </p>
          <h2 className="text-xl font-semibold">{article.data.title}</h2>
        </Flex>
      </Flex>
    </Link>
  )
}
