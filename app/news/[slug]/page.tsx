import { ArticleProvider } from "@/app/components/article-provider";
import MarkdownRenderer from "@/app/components/markdown";
import Flex from "@/app/components/ui/flex";
import { getAllArticles, getArticle } from "@/app/lib/articles";
import { cpSync } from "fs";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { join } from "path";
import "./highlight.css";

export async function generateStaticParams() {
  const articles = getAllArticles();

  // Copy articles to public/assets at build time to ensure assets are available
  articles.forEach((article) => {
    const assetDir = join(process.cwd(), "public", "assets", article.slug);
    const articleDir = join(process.cwd(), "articles", article.slug);

    cpSync(articleDir, assetDir, { recursive: true });
  });

  return articles.map((article) => ({ slug: article.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = getArticle(slug);
  const image = await import(`@/articles/${slug}/cover.png`);

  return (
    <Flex col className="w-screen min-h-screen" p={4} align="center">
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
        <Image
          src={image.default}
          alt={article.data.title}
          width={1000}
          height={500}
          className="border border-surface0"
        />
        <ArticleProvider article={article}>
          <MarkdownRenderer>
            {`# ${article.data.title}\n\n` + article.content}
          </MarkdownRenderer>
        </ArticleProvider>
      </Flex>
    </Flex>
  );
}

export const dynamicParams = false;
export const dynamic = "force-static";
