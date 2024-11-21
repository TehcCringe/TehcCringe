import { readdirSync } from "fs";
import { join } from "path";
import { z } from "zod";
import matter from "gray-matter";
import { formatError } from "./errors";

export const articleDataSchema = z.object({
  title: z.string(),
  date: z.date(),
  author: z.string().nullish(),
  displayName: z.string().nullish(),
  category: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
});

export const articleSchema = z.object({
  content: z.string(),
  slug: z.string(),
  cover: z.string(),
  data: articleDataSchema,
});

export type Article = z.infer<typeof articleSchema>;

export type ArticleData = z.infer<typeof articleDataSchema>;

export const articlesDir = join(process.cwd(), "articles");

export function getAllArticles(): Array<Article> {
  const articleDirs = readdirSync(articlesDir);

  return articleDirs
    .map((slug) => {
      try {
        return getArticle(slug);
      } catch (e) {
        const errorContent = `(${slug}) - ${formatError(e, false)}`

        throw new Error(errorContent)
      }
    })
    .filter(Boolean) as Array<Article>;
}

export function getArticle(slug: string): Article {
  const articleDirPath = join(articlesDir, slug);

  const parsedArticle = matter.read(join(articleDirPath, "index.md"));

  const articleData = articleDataSchema.parse(parsedArticle.data);

  return articleSchema.parse({
    content: parsedArticle.content.trim(),
    slug,
    cover: `@/articles/${slug}/cover.png`,
    data: articleData,
  });
}
