import Article from "./components/article"
import Flex from "./components/ui/flex"
import { getAllArticles } from "./lib/articles"

export default async function Home() {
  const articles = getAllArticles()

  // TODO: Sort by date
  const byNewest = articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  return (
    <Flex col p={4} align="center">
      <Flex wrap gap={4} width="full" className="max-w-720px">
        {byNewest.map(article => (
          <Article article={article} key={article.slug} />
        ))}
      </Flex>
    </Flex>
  )
}
