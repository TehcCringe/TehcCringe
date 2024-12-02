import Article from "./components/article";
import Flex from "./components/ui/flex";
import { getAllArticles } from "./lib/articles";

export default async function Home() {
  const articles = getAllArticles();

  return (
    <Flex col p={4} align="center">
      <Flex wrap gap={4} width="full" className="max-w-720px">
        {articles.map((article) => (
          <Article article={article} key={article.slug} />
        ))}
      </Flex>
    </Flex>
  );
}

export const dynamicParams = false;
export const dynamic = "force-static";
