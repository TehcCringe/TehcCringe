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
        className="rounded-lg overflow-hidden bg-surface0 max-w-[400px]"
      >
        <Image src={image.default} alt={article.data.title} />

        <Flex p={2}>
          <h2 className="text-xl font-semibold">{article.data.title}</h2>
        </Flex>
      </Flex>
    </Link>
  )
}
