import Flex from "@/app/components/ui/flex";
import { getAllArticles, getArticle } from "@/app/lib/articles";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
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
        />
        <h1 className="text-4xl font-bold">{article.data.title}</h1>
        <p>{article.content}</p>
      </Flex>
    </Flex>
  );
}
